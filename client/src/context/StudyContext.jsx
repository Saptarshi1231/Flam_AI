import React, { createContext, useContext, useEffect, useState } from 'react';
import { materialService } from '../services/materialService.js';
import { storage } from '../services/storageService.js';
import { initialMockMaterials } from '../data/mockData.js';

const StudyContext = createContext();

export const StudyProvider = ({ children }) => {
  const [materials, setMaterials] = useState(() => storage.getLocalMaterials() || initialMockMaterials);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);

  // Fetch from server on mount
  useEffect(() => {
    const fetchInitial = async () => {
      setLoading(true);
      try {
        const data = await materialService.getAll();
        if (data && data.length > 0) {
          setMaterials(data);
        }
      } catch (err) {
        console.warn('Using local fallback materials:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const addToast = (title, message = '', type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addMaterial = async (newMaterialData) => {
    try {
      const created = await materialService.create(newMaterialData);
      setMaterials((prev) => [created, ...prev]);
      addToast('Created successfully!', `"${created.title}" is now ready in your library.`, 'success');
      storage.addHistoryItem({
        title: `Created: ${created.title}`,
        category: created.subject,
        type: created.type,
        action: 'create',
      });
      return created;
    } catch (err) {
      addToast('Creation Failed', err.message, 'error');
      throw err;
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const updated = await materialService.toggleFavorite(id);
      setMaterials((prev) =>
        prev.map((m) => (m._id === id ? { ...m, favorite: !m.favorite } : m))
      );
      const isFav = updated.favorite ?? true;
      addToast(
        isFav ? 'Added to Favorites' : 'Removed from Favorites',
        `Material ${isFav ? 'saved to' : 'removed from'} your favorites.`,
        'info'
      );
    } catch (err) {
      // Local toggle
      setMaterials((prev) =>
        prev.map((m) => (m._id === id ? { ...m, favorite: !m.favorite } : m))
      );
    }
  };

  const deleteMaterial = async (id) => {
    try {
      await materialService.delete(id);
      setMaterials((prev) => prev.filter((m) => m._id !== id));
      addToast('Deleted', 'Study material removed from library.', 'info');
    } catch (err) {
      addToast('Delete Failed', err.message, 'error');
    }
  };

  const updateProgress = async (id, newProgress) => {
    try {
      await materialService.update(id, { progress: newProgress });
      setMaterials((prev) =>
        prev.map((m) => (m._id === id ? { ...m, progress: newProgress } : m))
      );
    } catch (err) {
      console.warn('Progress update error:', err.message);
    }
  };

  return (
    <StudyContext.Provider
      value={{
        materials,
        loading,
        searchQuery,
        setSearchQuery,
        toasts,
        addToast,
        removeToast,
        addMaterial,
        toggleFavorite,
        deleteMaterial,
        updateProgress,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudy must be used within a StudyProvider');
  return context;
};
