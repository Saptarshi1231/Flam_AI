const KEYS = {
  THEME: 'studyflow_theme',
  MATERIALS: 'studyflow_local_materials',
  USER: 'studyflow_user',
  TOKEN: 'studyflow_token',
  SETTINGS: 'studyflow_settings',
  HISTORY: 'studyflow_history',
};

export const storage = {
  getTheme: () => localStorage.getItem(KEYS.THEME) || 'system',
  setTheme: (theme) => localStorage.setItem(KEYS.THEME, theme),

  getUser: () => {
    try {
      const data = localStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(KEYS.USER, JSON.stringify(user)),

  getToken: () => localStorage.getItem(KEYS.TOKEN),
  setToken: (token) => localStorage.setItem(KEYS.TOKEN, token),
  clearAuth: () => {
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.TOKEN);
  },

  getLocalMaterials: () => {
    try {
      const data = localStorage.getItem(KEYS.MATERIALS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },
  setLocalMaterials: (materials) => {
    localStorage.setItem(KEYS.MATERIALS, JSON.stringify(materials));
  },

  getHistory: () => {
    try {
      const data = localStorage.getItem(KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  addHistoryItem: (item) => {
    const history = storage.getHistory();
    const updated = [
      {
        id: `hist-${Date.now()}`,
        date: new Date().toISOString(),
        ...item,
      },
      ...history,
    ].slice(0, 50); // keep recent 50
    localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
  },
};
