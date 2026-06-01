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

export function FinanceProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [readyToSave, setReadyToSave] = useState(false);
  const [hasAccount, setHasAccount] = useState(false);
  const [accountPrefs, setAccountPrefs] = useState({});

  const refreshFinanceData = useCallback(async () => {
    try {
      const prefs = await account.getPrefs();
      const savedData = prefs?.financeData;

      setAccountPrefs(prefs || {});
      if (savedData?.expenses) setExpenses(savedData.expenses);
      if (savedData?.budgets) setBudgets(savedData.budgets);
      setHasAccount(true);
    } catch (error) {
      setHasAccount(false);
    } finally {
      setReadyToSave(true);
    }
  }, []);

  useEffect(() => {
    refreshFinanceData();
  }, [refreshFinanceData]);

  useEffect(() => {
    if (!readyToSave || !hasAccount) return;

    account.updatePrefs({
      ...accountPrefs,
      financeData: {
        expenses,
        budgets,
      },
    }).then(() => {
      setHasAccount(true);
    }).catch((error) => {
      setHasAccount(false);
      console.log('Erro ao guardar dados financeiros:', error);
    });
  }, [accountPrefs, budgets, expenses, hasAccount, readyToSave]);

  const addExpense = ({ title, category, value }) => {
    const normalizedCategory = normalizeCategory(category);
    const amount = parseMoney(value);

    if (!title?.trim() || amount <= 0) {
      return false;
    }

    const meta = categoryMeta[normalizedCategory] || categoryMeta.Outros;
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

    return true;
  };

  const addBudget = ({ title, total }) => {
    const normalizedTitle = normalizeCategory(title);
    const amount = parseMoney(total);

    if (!normalizedTitle || amount <= 0) {
      return false;
    }

    const meta = categoryMeta[normalizedTitle] || categoryMeta.Outros;
    setBudgets((current) => [
      {
        id: `${Date.now()}`,
        title: normalizedTitle,
        total: amount,
        icon: meta.icon,
        color: meta.color,
      },
      ...current.filter((budget) => budget.title !== normalizedTitle),
    ]);

    return true;
  };

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
    refreshFinanceData,
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
