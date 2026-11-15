import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { connectDB, getDBStatus } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
const clientUrl = process.env.CLIENT_URL;
app.use(cors({
  origin: clientUrl ? [clientUrl, 'http://localhost:5173', 'http://localhost:3000'] : true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'StudyFlow AI Server',
    database: getDBStatus() ? 'MongoDB Connected' : 'Fallback In-Memory Store Active',
    aiProvider: process.env.GEMINI_API_KEY ? 'Gemini 3.5 Flash Live' : 'Interactive Demo AI Provider',
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  const clientDist = path.join(__dirname, '../client/dist');
  const indexPath = path.join(clientDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  return res.json({
    message: 'StudyFlow AI Backend API is live!',
    status: 'online',
    health: '/api/health',
    database: getDBStatus() ? 'MongoDB Connected' : 'In-Memory Fallback',
  });
});

// Serve frontend in production if built client exists
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../client/dist');
  const indexPath = path.join(clientDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    app.use(express.static(clientDist));
    app.get('*', (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      res.sendFile(indexPath);
    });
  }
}

// Centralized error handling
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`[StudyFlow AI] Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n[StudyFlow AI] Port ${PORT} is already in use by an existing process.`);
    console.error(`To free port ${PORT} in PowerShell, run:`);
    console.error(`  Stop-Process -Id (Get-NetTCPConnection -LocalPort ${PORT}).OwningProcess -Force\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

export default app;