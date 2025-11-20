// Central API configuration for Waylo Password Reset micro-app
// Adjust APP_BASE if deployment changes
export const APP_BASE = 'https://wayloapi.onrender.com';
export const AUTH_BASE = APP_BASE + '/api/waylo/auth';

export async function resetPasswordRequest({ token, newPassword }) {
  const res = await fetch(AUTH_BASE + '/password/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, contrasena: newPassword })
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, ...data };
}

// Optional future use to request a reset link
export async function forgotPasswordRequest(email) {
  const res = await fetch(AUTH_BASE + '/password/forgot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, ...data };
}
