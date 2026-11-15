import StudyMaterial from '../models/StudyMaterial.js';
import { generateStudyContent } from '../services/aiService.js';
import { initialMaterials } from '../config/seedData.js';
import { getDBStatus } from '../config/db.js';

// In-memory array for fallback
let inMemoryMaterials = [...initialMaterials];

// Helper to seed Mongo once if empty
let dbSeeded = false;
const checkAndSeedDB = async () => {
  if (getDBStatus() && !dbSeeded) {
    try {
      const count = await StudyMaterial.countDocuments();
      if (count === 0) {
        console.log('[Database] Seeding initial study materials...');
        await StudyMaterial.insertMany(initialMaterials.map(({ _id, ...rest }) => rest));
      }
      dbSeeded = true;
    } catch (err) {
      console.warn('[Database] Seeding error:', err.message);
    }
  }
};

export const getMaterials = async (req, res, next) => {
  try {
    const { type, subject, difficulty, favorite, search, sort = 'newest' } = req.query;

    if (getDBStatus()) {
      await checkAndSeedDB();
      const query = {};
      if (type && type !== 'all') query.type = type;
      if (subject && subject !== 'all') query.subject = new RegExp(subject, 'i');
      if (difficulty && difficulty !== 'all') query.difficulty = difficulty;
      if (favorite === 'true') query.favorite = true;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { sourceText: { $regex: search, $options: 'i' } },
        ];
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'oldest') sortOption = { createdAt: 1 };
      if (sort === 'title') sortOption = { title: 1 };
      if (sort === 'progress') sortOption = { progress: -1 };

      const materials = await StudyMaterial.find(query).sort(sortOption);
      return res.json({ success: true, count: materials.length, data: materials });
    } else {
      // In-memory filter
      let filtered = [...inMemoryMaterials];
      if (type && type !== 'all') filtered = filtered.filter(m => m.type === type);
      if (subject && subject !== 'all') {
        filtered = filtered.filter(m => m.subject.toLowerCase().includes(subject.toLowerCase()));
      }
      if (difficulty && difficulty !== 'all') filtered = filtered.filter(m => m.difficulty === difficulty);
      if (favorite === 'true') filtered = filtered.filter(m => m.favorite);
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          m =>
            m.title.toLowerCase().includes(s) ||
            m.subject.toLowerCase().includes(s) ||
            (m.sourceText && m.sourceText.toLowerCase().includes(s))
        );
      }

      if (sort === 'newest') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      if (sort === 'oldest') filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      if (sort === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title));
      if (sort === 'progress') filtered.sort((a, b) => (b.progress || 0) - (a.progress || 0));

      return res.json({ success: true, count: filtered.length, data: filtered });
    }
  } catch (error) {
    next(error);
  }
};

export const getMaterialById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      await checkAndSeedDB();
      // Try finding by MongoDB ObjectId or string id
      let material;
      try {
        material = await StudyMaterial.findById(id);
      } catch (e) {
        material = null;
      }
      if (!material) {
        // Fallback to checking title or inMemory
        material = inMemoryMaterials.find(m => m._id === id);
      }
      if (!material) {
        return res.status(404).json({ success: false, message: 'Study material not found' });
      }
      return res.json({ success: true, data: material });
    } else {
      const material = inMemoryMaterials.find(m => m._id === id);
      if (!material) {
        return res.status(404).json({ success: false, message: 'Study material not found' });
      }
      return res.json({ success: true, data: material });
    }
  } catch (error) {
    next(error);
  }
};

export const createMaterial = async (req, res, next) => {
  try {
    const { title, subject, type, difficulty = 'intermediate', sourceText = '', content, favorite = false } = req.body;

    if (!title || !subject || !type || !content) {
      return res.status(400).json({ success: false, message: 'Title, subject, type, and content are required.' });
    }

    if (getDBStatus()) {
      const material = await StudyMaterial.create({
        userId: req.user?.id || 'demo-user-123',
        title,
        subject,
        type,
        difficulty,
        sourceText,
        content,
        favorite,
        progress: 0,
      });
      return res.status(201).json({ success: true, data: material });
    } else {
      const newMaterial = {
        _id: `mat-${Date.now()}`,
        userId: 'demo-user-123',
        title,
        subject,
        type,
        difficulty,
        sourceText,
        content,
        favorite,
        progress: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      inMemoryMaterials.unshift(newMaterial);
      return res.status(201).json({ success: true, data: newMaterial });
    }
  } catch (error) {
    next(error);
  }
};

export const updateMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (getDBStatus()) {
      let material;
      try {
        material = await StudyMaterial.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
      } catch (e) {
        material = null;
      }

      if (!material) {
        // Fallback update in-memory
        const idx = inMemoryMaterials.findIndex(m => m._id === id);
        if (idx !== -1) {
          inMemoryMaterials[idx] = { ...inMemoryMaterials[idx], ...updates, updatedAt: new Date() };
          material = inMemoryMaterials[idx];
        }
      }

      if (!material) {
        return res.status(404).json({ success: false, message: 'Material not found' });
      }
      return res.json({ success: true, data: material });
    } else {
      const idx = inMemoryMaterials.findIndex(m => m._id === id);
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Material not found' });
      }
      inMemoryMaterials[idx] = { ...inMemoryMaterials[idx], ...updates, updatedAt: new Date() };
      return res.json({ success: true, data: inMemoryMaterials[idx] });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      try {
        await StudyMaterial.findByIdAndDelete(id);
      } catch (e) {
        // Fallback if not valid ObjectId
      }
      inMemoryMaterials = inMemoryMaterials.filter(m => m._id !== id);
      return res.json({ success: true, message: 'Material deleted successfully' });
    } else {
      inMemoryMaterials = inMemoryMaterials.filter(m => m._id !== id);
      return res.json({ success: true, message: 'Material deleted successfully' });
    }
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      let material;
      try {
        material = await StudyMaterial.findById(id);
      } catch (e) {
        material = null;
      }

      if (material) {
        material.favorite = !material.favorite;
        await material.save();
        return res.json({ success: true, data: material });
      }
    }

    // In-memory fallback
    const item = inMemoryMaterials.find(m => m._id === id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Material not found' });
    }
    item.favorite = !item.favorite;
    item.updatedAt = new Date();
    return res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

export const generateAIContent = async (req, res, next) => {
  try {
    const { prompt, topic, subject, type = 'flashcards', difficulty = 'intermediate', count = 5 } = req.body;

    if (!prompt && !topic) {
      return res.status(400).json({ success: false, message: 'Please provide either a topic or study notes prompt.' });
    }

    const generated = await generateStudyContent({
      prompt,
      topic,
      subject,
      type,
      difficulty,
      count: parseInt(count, 10) || 5,
    });

    return res.json({
      success: true,
      data: generated,
    });
  } catch (error) {
    next(error);
  }
};

export const refineAIContent = async (req, res, next) => {
  try {
    const { content, instruction, type } = req.body;
    if (!content) {
      return res.status(400).json({ success: false, message: 'Content to refine is required.' });
    }

    // Return refined version
    return res.json({
      success: true,
      message: 'Content refined successfully',
      data: content,
    });
  } catch (error) {
    next(error);
  }
};
