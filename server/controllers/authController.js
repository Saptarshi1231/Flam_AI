import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getDBStatus } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'studyflow_jwt_secret_dev_key';

// In-memory demo user store for offline/fallback mode
const fallbackUsers = [
  {
    _id: 'demo-user-123',
    name: 'Alex Rivera',
    email: 'demo@studyflow.ai',
    passwordHash: bcrypt.hashSync('password123', 8),
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    preferences: {
      theme: 'system',
      defaultDifficulty: 'intermediate',
      dailyGoalMinutes: 30,
      notificationsEnabled: true,
      soundEnabled: true,
    },
    createdAt: new Date(),
  },
];

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    if (getDBStatus()) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
      });

      return res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          preferences: user.preferences,
        },
        token: generateToken(user._id),
      });
    } else {
      // In-memory fallback
      const exists = fallbackUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const newUser = {
        _id: `user-${Date.now()}`,
        name,
        email: email.toLowerCase(),
        passwordHash: await bcrypt.hash(password, 10),
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        preferences: { theme: 'system', defaultDifficulty: 'intermediate', dailyGoalMinutes: 30 },
        createdAt: new Date(),
      };
      fallbackUsers.push(newUser);

      return res.status(201).json({
        success: true,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          avatar: newUser.avatar,
          preferences: newUser.preferences,
        },
        token: generateToken(newUser._id),
      });
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    if (getDBStatus()) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && (await bcrypt.compare(password, user.passwordHash))) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            preferences: user.preferences,
          },
          token: generateToken(user._id),
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    } else {
      // In-memory fallback
      const user = fallbackUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (user && (await bcrypt.compare(password, user.passwordHash))) {
        return res.json({
          success: true,
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            preferences: user.preferences,
          },
          token: generateToken(user._id),
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    // Provide demo user by default
    const user = {
      _id: 'demo-user-123',
      name: 'Alex Rivera',
      email: 'demo@studyflow.ai',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      preferences: {
        theme: 'system',
        defaultDifficulty: 'intermediate',
        dailyGoalMinutes: 30,
        notificationsEnabled: true,
        soundEnabled: true,
      },
    };
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
