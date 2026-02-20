const STAFF_USERNAME_KEY = "staffUsername";

export function setLoggedInStaffUsername(username: string) {
  const value = username.trim();
  if (!value) return;
  localStorage.setItem(STAFF_USERNAME_KEY, value);
}

export function getLoggedInStaffUsername() {
  const value = localStorage.getItem(STAFF_USERNAME_KEY);
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export function clearLoggedInStaffSession() {
  localStorage.removeItem(STAFF_USERNAME_KEY);
}
