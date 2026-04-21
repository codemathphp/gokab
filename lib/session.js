import Cookies from 'js-cookie';

const SESSION_KEY = 'gokab_session';
const USER_KEY = 'gokab_user';

export const setSession = (sessionData) => {
  Cookies.set(SESSION_KEY, JSON.stringify(sessionData), { 
    expires: 30,
    secure: true,
    sameSite: 'strict'
  });
  localStorage.setItem(USER_KEY, JSON.stringify(sessionData));
};

export const getSession = () => {
  try {
    const cookie = Cookies.get(SESSION_KEY);
    if (cookie) return JSON.parse(cookie);
    
    const local = localStorage.getItem(USER_KEY);
    if (local) return JSON.parse(local);
    
    return null;
  } catch (error) {
    console.error('Failed to get session:', error);
    return null;
  }
};

export const clearSession = () => {
  Cookies.remove(SESSION_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isSessionValid = () => {
  const session = getSession();
  return session && session.phone && (session.isVerified || session.role);
};
