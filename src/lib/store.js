import { writable, derived } from 'svelte/store';
import { api } from './api.js';

export const user = writable(null);
export const toasts = writable([]);

export const isAuthenticated = derived(user, ($user) => Boolean($user));

let toastId = 0;

export function showToast(message, type = 'success') {
  const id = ++toastId;
  toasts.update((items) => [...items, { id, message, type }]);
  setTimeout(() => dismissToast(id), 6000);
}

export function dismissToast(id) {
  toasts.update((items) => items.filter((t) => t.id !== id));
}

export async function loadUser() {
  if (!api.token) {
    user.set(null);
    return null;
  }
  try {
    const profile = await api.getProfile();
    user.set(profile);
    return profile;
  } catch {
    api.setToken(null);
    user.set(null);
    return null;
  }
}

export async function login(numero, mdp) {
  const data = await api.login(numero, mdp);
  user.set(data.user);
  return data;
}

export async function signup(payload, ref = null) {
  const data = await api.signup(payload, ref);
  user.set(data.user);
  return data;
}

export async function logout() {
  await api.logout();
  user.set(null);
}

export function paymentConfigured(profile) {
  return Boolean(
    profile?.moyen_paiement &&
      profile?.numero_portefeuille &&
      profile?.nom_beneficiaire
  );
}

export function paymentRows(profile) {
  const labels = {
    MTN: 'MTN Mobile Money',
    ORANGE: 'Orange Money',
    BANK: 'Virement bancaire',
  };
  return [
    {
      label: 'Moyen de paiement',
      value: labels[profile?.moyen_paiement] || profile?.moyen_paiement || '—',
    },
    { label: 'Nom du bénéficiaire', value: profile?.nom_beneficiaire || '—' },
    { label: 'Numéro de portefeuille', value: profile?.numero_portefeuille || '—' },
  ];
}

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('fr-FR');
}
