/** @format */

const SESSION_KEY = "sikopet_session";
const USER_KEY = "sikopet_user";
const TOKEN_KEY = "sikopet_token";

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session?.accessToken || !session?.user) return null;
    return session;
  } catch {
    return null;
  }
}

export function setSession({ accessToken, refreshToken, user }) {
  const session = {
    accessToken,
    refreshToken,
    user,
    savedAt: Date.now(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (accessToken) {
    localStorage.setItem(TOKEN_KEY, accessToken);
  }
}

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

export function isSessionValid() {
  const session = getSession();
  if (!session) return false;
  if (!session.accessToken) return false;
  return true;
}
