'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function useAuth() {
  const router = useRouter();

  const getToken = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('token');
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      return null;
    }
    return token;
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== 'undefined') localStorage.removeItem('token');
    router.push('/login');
  }, [router]);

  const checkAuth = useCallback(() => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return false;
    }
    return true;
  }, [getToken, router]);

  const fetchWithAuth = useCallback(async (url, options = {}) => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      throw new Error('Unauthorized');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 401 || response.status === 403) {
      logout();
      throw new Error('Session expired');
    }

    return response;
  }, [getToken, router, logout]);

  return { getToken, logout, checkAuth, fetchWithAuth };
}
