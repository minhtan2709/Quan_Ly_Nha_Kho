import { useState } from 'react';

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const isLoggedIn = !!token;

  function login(newToken: string) {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  }

  function logout() {
    setToken('');
    localStorage.removeItem('token');
  }

  return { token, isLoggedIn, login, logout };
}