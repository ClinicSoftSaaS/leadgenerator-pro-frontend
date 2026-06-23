const BASE_URL = "http://127.0.0.1:8000";

export const api = {
  register: async (data) =>
    fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  login: async (data) =>
    fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  getLeads: async (token) =>
    fetch(`${BASE_URL}/leads?token=${token}`),

  addLead: async (token, data) =>
    fetch(`${BASE_URL}/leads?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  requestSubscription: async (token, data) =>
    fetch(`${BASE_URL}/subscription/request?token=${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),
};