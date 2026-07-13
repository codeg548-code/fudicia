// const API_URL = import.meta.env.VITE_API_URL || '/api';
const API_URL = import.meta.env.VITE_API_URL || 'https://fudicia-backend.onrender.com/api';

class APIClient {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Token ${this.token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    });

    let data = null;
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { detail: text };
      }
    }

    if (!response.ok) {
      const message =
        data?.detail ||
        data?.non_field_errors?.[0] ||
        Object.values(data || {})[0]?.[0] ||
        'Erreur API';
      throw new Error(typeof message === 'string' ? message : 'Erreur API');
    }

    return data;
  }

  async login(numero, mdp) {
    const data = await this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ numero, mdp }),
    });
    this.setToken(data.token);
    return data;
  }

  async signup(payload, ref = null) {
    const path = ref ? `/auth/signup/${ref}/` : '/auth/signup/';
    const data = await this.request(path, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    this.setToken(data.token);
    return data;
  }

  async logout() {
    try {
      await this.request('/auth/logout/', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  async getProfile() {
    return this.request('/auth/me/');
  }

  async updateProfile(data) {
    return this.request('/auth/me/', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getDashboard() {
    return this.request('/clients/dashboard/');
  }

  async getPacksEnriched() {
    return this.request('/packs/enriched/');
  }

  async getBuyPreview(packId) {
    return this.request(`/packs/${packId}/buy_preview/`);
  }

  async buyPack(packId) {
    return this.request(`/packs/${packId}/buy/`, { method: 'POST' });
  }

  async getMesPacks() {
    return this.request('/achats/mes_packs/');
  }

  async getDepots() {
    return this.request('/depots/');
  }

  async createDepot(montant, idtransaction = null) {
    return this.request('/depots/', {
      method: 'POST',
      body: JSON.stringify({ montant, idtransaction }),
    });
  }

  async getRetraits() {
    return this.request('/retraits/');
  }

  async createRetrait(montant) {
    return this.request('/retraits/', {
      method: 'POST',
      body: JSON.stringify({ montant }),
    });
  }

  async getParrainageSummary() {
    return this.request('/parrainages/summary/');
  }

  async getDepotConfigs() {
    return this.request('/depots/configurations-actives/');
  }

  async createDepot(payload) {
    return this.request('/depots/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
}

export const api = new APIClient();
