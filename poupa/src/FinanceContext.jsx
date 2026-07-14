import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { account } from './appwrite';
import { colors } from './theme';

const FinanceContext = createContext(null);

const categoryMeta = {
  Casa: { icon: 'home-outline', color: colors.primary },
  Transportes: { icon: 'car-outline', color: colors.accent },
  Lazer: { icon: 'heart-outline', color: colors.danger },
  Supermercado: { icon: 'cart-outline', color: colors.warning },
  Alimentacao: { icon: 'restaurant-outline', color: colors.accent },
  Entretenimento: { icon: 'play-outline', color: colors.primary },
  Outros: { icon: 'receipt-outline', color: colors.muted },
};

const normalizeCategory = (category) => {
  const clean = category?.trim();
  if (!clean) return 'Outros';
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

const parseMoney = (value) => {
  const normalized = String(value).replace(',', '.').replace(/[^\d.]/g, '');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const todayPt = () => new Date().toLocaleDateString('pt-PT');

const formatMoney = (value) => `${value.toFixed(2).replace('.', ',')}€`;

//Carregar dados da Conta 
export function FinanceProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [readyToSave, setReadyToSave] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [accountPrefs, setAccountPrefs] = useState({});
  const [userId, setUserId] = useState(null);

  const resetFinanceState = useCallback(() => {
    setHasAccount(false);
    setReadyToSave(false);
    setUserId(null);
    setExpenses([]);
    setBudgets([]);
    setAccountPrefs({});
  }, []);

  const refreshFinanceData = useCallback(async () => {
    setReadyToSave(false);

    try {
      const currentUser = await account.get();
      const prefs = await account.getPrefs();
      const savedData = prefs?.financeData;

      setUserId(currentUser.$id);
      setAccountPrefs(prefs || {});
      setExpenses(savedData?.expenses ?? []);
      setBudgets(savedData?.budgets ?? []);
      setHasAccount(true);
    } catch (error) {
      resetFinanceState();
    } finally {
      setReadyToSave(true);
    }
  }, [resetFinanceState]);

  useEffect(() => {
    refreshFinanceData();
  }, [refreshFinanceData]);
//Carregar dados da Conta (fim)


  useEffect(() => {
    if (!readyToSave || !hasAccount || !userId) return;

    let cancelled = false;

    account.get().then((currentUser) => {
      if (cancelled || currentUser.$id !== userId) return;

      return account.updatePrefs({
        ...accountPrefs,
        financeData: {
          expenses,
          budgets,
        },
      });
    }).then(() => {
      if (!cancelled) setHasAccount(true);
    }).catch((error) => {
      if (!cancelled) {
        setHasAccount(false);
        console.log('Erro ao guardar dados financeiros:', error);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [accountPrefs, budgets, expenses, hasAccount, readyToSave, userId]);


//Adcioonar Despesa
  const addExpense = ({ title, category, value }) => {
    const normalizedCategory = normalizeCategory(category);
    const amount = parseMoney(value);

    if (!title?.trim() || amount <= 0) {
      return false;
    }

    const matchingBudget = budgets.find((budget) => budget.title === normalizedCategory);

    if (!matchingBudget) {
      return {
        error: 'missingBudget',
        category: normalizedCategory,
      };
    }
    
//Adcioonar Despesa (fim)

    const meta = categoryMeta[normalizedCategory] || categoryMeta.Outros;
    const previousSpent = expenses
      .filter((expense) => expense.cat === normalizedCategory)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const newSpent = previousSpent + amount;
    const alertPercent = matchingBudget?.alertPercent || 80;
    const alertAmount = matchingBudget ? (matchingBudget.total * alertPercent) / 100 : 0;
    const crossedAlert = matchingBudget && previousSpent < alertAmount && newSpent >= alertAmount;

    setExpenses((current) => [
      {
        id: `${Date.now()}`,
        title: title.trim(),
        cat: normalizedCategory,
        date: todayPt(),
        amount,
        icon: meta.icon,
        color: meta.color,
      },
      ...current,
    ]);

    return {
      alert: crossedAlert
        ? {
            category: normalizedCategory,
            alertPercent,
            spent: newSpent,
            total: matchingBudget.total,
          }
        : null,
    };
  };

//Adcioonar Orçamento
  const addBudget = ({ title, total, alertPercent = 80 }) => {
    const normalizedTitle = normalizeCategory(title);
    const amount = parseMoney(total);
    const normalizedAlert = Math.min(Math.max(Number(alertPercent) || 80, 0), 100);

    if (!normalizedTitle || amount <= 0) {
      return false;
    }

    const meta = categoryMeta[normalizedTitle] || categoryMeta.Outros;
    setBudgets((current) => [
      {
        id: `${Date.now()}`,
        title: normalizedTitle,
        total: amount,
        alertPercent: normalizedAlert,
        icon: meta.icon,
        color: meta.color,
      },
      ...current.filter((budget) => budget.title !== normalizedTitle),
    ]);

    return true;
  };
  
//Adcioonar Orçamento (fim)

  const clearFinanceData = useCallback(async () => {
    const prefs = await account.getPrefs();
    const updatedPrefs = {
      ...(prefs || {}),
      financeData: {
        expenses: [],
        budgets: [],
      },
    };

    await account.updatePrefs(updatedPrefs);
    setAccountPrefs(updatedPrefs);
    setExpenses([]);
    setBudgets([]);
    setHasAccount(true);
    setReadyToSave(true);
  }, []);

  const totals = useMemo(() => {
    const monthlySpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.total, 0);
    const biggestExpense = expenses.reduce((max, expense) => Math.max(max, expense.amount), 0);
    const dailyAverage = monthlySpent / Math.max(new Date().getDate(), 1);

    return {
      monthlySpent,
      totalBudget,
      biggestExpense,
      dailyAverage,
      expenseCount: expenses.length,
      budgetCount: budgets.length,
      remainingBudget: totalBudget - monthlySpent,
      usedPercent: totalBudget > 0 ? Math.min((monthlySpent / totalBudget) * 100, 100) : 0,
    };
  }, [budgets, expenses]);

  const budgetsWithSpent = useMemo(
    () =>
      budgets.map((budget) => ({
        ...budget,
        gast: expenses
          .filter((expense) => expense.cat === budget.title)
          .reduce((sum, expense) => sum + expense.amount, 0),
      })),
    [budgets, expenses]
  );

  const value = {
    expenses,
    budgets: budgetsWithSpent,
    totals,
    addExpense,
    addBudget,
    clearFinanceData,
    refreshFinanceData,
    resetFinanceState,
    formatMoney,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used inside FinanceProvider');
  }
  return context;
}
