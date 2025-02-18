import { getRandomNumString } from './crypto';

export const getTabId = () => {
  let currentTabId = sessionStorage.getItem('tabId');

  if (!currentTabId) {
    currentTabId = getRandomNumString(6);
    sessionStorage.setItem('tabId', currentTabId);
  }
  return currentTabId;
};

export const saveSessionItem = (key: string, item: unknown) => {
  const tabId = getTabId();
  sessionStorage.setItem(tabId + key, JSON.stringify(item));
};

export const deleteSessionItem = (key: string) => {
  const tabId = getTabId();
  sessionStorage.removeItem(tabId + key);
};

export const getSessionItem = (key: string) => {
  const tabId = getTabId();
  const item = sessionStorage.getItem(tabId + key);

  return item ? JSON.parse(item) : null;
};
