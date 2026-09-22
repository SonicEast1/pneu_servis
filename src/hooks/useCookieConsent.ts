'use client';

import { useCallback, useSyncExternalStore } from 'react';

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  window.addEventListener('storage', onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

function getShowBanner() {
  return !localStorage.getItem('cookieConsent');
}

export function useCookieConsent() {
  const showBanner = useSyncExternalStore(subscribe, getShowBanner, () => false);

  const acceptCookies = useCallback(() => {
    localStorage.setItem('cookieConsent', 'accepted');
    emit();
  }, []);

  const declineCookies = useCallback(() => {
    localStorage.setItem('cookieConsent', 'declined');
    emit();
  }, []);

  return { showBanner, acceptCookies, declineCookies };
}
