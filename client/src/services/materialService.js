import api from './api.js';
import { initialMockMaterials } from '../data/mockData.js';
import { storage } from './storageService.js';

export const materialService = {
  async getAll(params = {}) {
    try {
      const res = await api.get('/materials', { params });
      if (res.data) {
        storage.setLocalMaterials(res.data);
        return res.data;
      }
      return initialMockMaterials;
    } catch (err) {
      console.warn('[MaterialService] API fetch failed, using cached/mock materials:', err.message);
      const cached = storage.getLocalMaterials();
      return cached || initialMockMaterials;
    }
  },

  async getById(id) {
    try {
      const res = await api.get(`/materials/${id}`);
      return res.data;
    } catch (err) {
      console.warn(`[MaterialService] API fetch for ${id} failed, searching local cache:`, err.message);
      const cached = storage.getLocalMaterials() || initialMockMaterials;
      const found = cached.find((m) => m._id === id);
      if (found) return found;
      throw new Error('Study material not found');
    }
  },

  async create(materialData) {
    try {
      const res = await api.post('/materials', materialData);
      return res.data;
    } catch (err) {
      console.warn('[MaterialService] API create failed, saving to local state:', err.message);
      const newMaterial = {
        _id: `local-${Date.now()}`,
        ...materialData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const existing = storage.getLocalMaterials() || initialMockMaterials;
      storage.setLocalMaterials([newMaterial, ...existing]);
      return newMaterial;
    }
  },

  async update(id, updates) {
    try {
      const res = await api.put(`/materials/${id}`, updates);
      return res.data;
    } catch (err) {
      const existing = storage.getLocalMaterials() || initialMockMaterials;
      const updated = existing.map((m) => (m._id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m));
      storage.setLocalMaterials(updated);
      return updated.find((m) => m._id === id);
    }
  },

  async delete(id) {
    try {
      await api.delete(`/materials/${id}`);
    } catch (err) {
      console.warn('[MaterialService] API delete failed, deleting locally:', err.message);
    }
    const existing = storage.getLocalMaterials() || initialMockMaterials;
    storage.setLocalMaterials(existing.filter((m) => m._id !== id));
    return true;
  },

  async toggleFavorite(id) {
    try {
      const res = await api.patch(`/materials/${id}/favorite`);
      return res.data;
    } catch (err) {
      const existing = storage.getLocalMaterials() || initialMockMaterials;
      const item = existing.find((m) => m._id === id);
      if (item) {
        item.favorite = !item.favorite;
        storage.setLocalMaterials([...existing]);
        return item;
      }
      throw err;
    }
  },
};
