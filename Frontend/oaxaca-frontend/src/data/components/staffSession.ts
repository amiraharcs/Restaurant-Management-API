const STAFF_USERNAME_KEY = "staffUsername";
const STAFF_ROLE_KEY = "staffRole"

export function setLoggedInStaffUsername(username: string) {
  const value = username.trim();
  if (!value) return;
  localStorage.setItem(STAFF_USERNAME_KEY, value);
}

export function setLoggedInStaffRole(role: string) {
  const value = role.trim()
  if (!value) return;
  localStorage.setItem(STAFF_ROLE_KEY, value)
}

export function getLoggedInStaffUsername() {
  const value = localStorage.getItem(STAFF_USERNAME_KEY);
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export function getLoggedInStaffRole() {
  const value = localStorage.getItem(STAFF_ROLE_KEY);
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export function clearLoggedInStaffSession() {
  localStorage.removeItem(STAFF_USERNAME_KEY);
  localStorage.removeItem(STAFF_ROLE_KEY);
}
