import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { account } from './appwrite';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const isPermissionGranted = (permissions) => {
  if (Platform.OS === 'ios' && permissions.ios?.status) {
    return [
      Notifications.IosAuthorizationStatus.AUTHORIZED,
      Notifications.IosAuthorizationStatus.PROVISIONAL,
      Notifications.IosAuthorizationStatus.EPHEMERAL,
    ].includes(permissions.ios.status);
  }

  return permissions.status === 'granted';
};

const ensureNotificationPermissions = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Notificações',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4f46e5',
    });
  }

  const currentPermissions = await Notifications.getPermissionsAsync();

  if (isPermissionGranted(currentPermissions)) {
    return true;
  }

  const requestedPermissions = await Notifications.requestPermissionsAsync();
  return isPermissionGranted(requestedPermissions);
};

export const getNotificationStatus = async () => {
  const permissions = await Notifications.getPermissionsAsync();
  return {
    granted: isPermissionGranted(permissions),
    status: permissions.status,
  };
};

export const requestNotificationPermissions = ensureNotificationPermissions;

export const getNotificationPreference = async () => {
  try {
    const prefs = await account.getPrefs();
    return prefs?.notificationsEnabled !== false;
  } catch (error) {
    return true;
  }
};

export const setNotificationPreference = async (enabled) => {
  const prefs = await account.getPrefs();
  await account.updatePrefs({
    ...(prefs || {}),
    notificationsEnabled: enabled,
  });
};

export const showPhoneNotification = async ({ title, body }) => {
  const wantsNotifications = await getNotificationPreference();

  if (!wantsNotifications) {
    return false;
  }

  const hasPermission = await ensureNotificationPermissions();

  if (!hasPermission) {
    return false;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: null,
  });

  return true;
};
