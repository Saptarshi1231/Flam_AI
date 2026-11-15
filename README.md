# StudyFlow AI — Turn Your Notes Into Smarter Learning

> A premium, frontend-heavy MERN stack AI Study Assistant web application designed for students and educators to transform raw notes, lectures, and topics into interactive 3D flashcards, adaptive practice quizzes, and structured study guides.

---

## 🌟 Project Overview

**StudyFlow AI** is a fully functional SaaS-grade learning platform built using the **STRICT MERN Stack** (MongoDB, Express.js, React.js, Node.js) with 100% JavaScript (ES6+).

The central philosophy is:
$$\text{User Input} \longrightarrow \text{AI Processing} \longrightarrow \text{Structured JSON} \longrightarrow \text{Strict Validation} \longrightarrow \text{Interactive React Components}$$

> **Important:** This is **NOT a raw chatbot**. AI outputs are strictly structured and transformed into interactive 3D flipcards, timed assessments with answer palettes, interactive visual Recharts graphs, and distraction-free study guides.

---

## ✨ Key Features

### 1. Interactive 3D Flashcards (`/flashcards` & `/flashcards/:id`)
- 3D CSS perspective card flip animations (`perspective-1000`, `transform-style: preserve-3d`).
- Keyboard controls:
  - <kbd>Space</kbd> or <kbd>Enter</kbd> to flip card
  - <kbd>←</kbd> / <kbd>→</kbd> arrow keys to navigate cards
  - <kbd>1</kbd> to mark as "Still Learning"
  - <kbd>2</kbd> to mark as "Mastered"
- Card counter, animated progress bar, and deck shuffle.
- Session completion modal with mastery breakdown and celebration confetti.
- Automatic retention progress persistence.

### 2. Timed Practice Quizzes (`/quiz`, `/quiz/:id` & `/results/:id`)
- Real-time countdown timer with urgent visual alert under 60 seconds.
- Question navigation palette with color-coded states (Answered, Flagged, Unanswered, Current).
- Question flagging for later review.
- Submission confirmation dialog showing answered vs blank tallies.
- Secure frontend calculation: correct answers are never revealed to the user until submission.
- **Detailed Results Analysis**:
  - Animated circular SVG score indicator.
  - Accuracy metrics, time taken, and performance badge.
  - Question-by-question breakdown with green/red pill badges, user selection, correct answer, and explanation.

### 3. AI Content Creation Engine (`/create`)
- Large input area for lecture transcripts or concepts with live character counter.
- One-click sample prompt chips (Photosynthesis, JavaScript Event Loop, Neural Networks, WWII).
- Multi-dimensional controls: Subject, Difficulty (Beginner, Intermediate, Advanced), Quantity (3, 5, 10).
- Multiple generation formats: Flashcards, Quizzes, Study Guides, Summaries, Mixed Packs.
- Dual-mode AI execution: Gemini 1.5 Flash API with instant automatic fallback to high-fidelity Demo Mode.
- Live interactive preview with direct "Save to Library" button.

### 4. Comprehensive Study Library (`/library`)
- Full search across titles, subjects, and source notes.
- Filtering by type (All, Flashcards, Quiz, Guide, Summary) and difficulty.
- Sorting by Newest, Oldest, Title (A-Z), and Progress.
- Grid View and List View toggles.
- Favorite toggle and permanent deletion with confirmation dialog.

### 5. Learning Analytics Dashboard (`/analytics` & `/dashboard`)
- Recharts visualizations:
  - Daily Study Minutes bar chart.
  - Quiz Accuracy trends area chart.
  - Subject distribution donut chart.
- Key metrics: Total study hours, sessions completed, cards mastered, average accuracy, streak counter.
- Cognitive strengths and weak topics flagged for active recall.

### 6. Study Guide Reader (`/study-guide/:id`)
- Sticky Table of Contents sidebar with active section tracking.
- Dynamic font size adjustment (A-, A, A+).
- Reading progress tracker with section checkoffs and bookmarking.
- Highlighted key concept callout pills and illustrative code/quote boxes.

### 7. Dual Theme & Customization (`/settings` & `/profile`)
- Global dark mode and light mode with persistent localStorage synchronization.
- Customizable daily study goals (minutes, cards).
- Configurable quiz timers and notifications.
- Data export (JSON backup) and one-click demo data restoration.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, JavaScript (ES6+), Vite, React Router DOM v6, Tailwind CSS, Framer Motion, Lucide React, Recharts, Axios, Canvas Confetti |
| **Backend** | Node.js, Express.js, REST API architecture, Mongoose, Morgan, CORS, Dotenv, Bcryptjs, JWT |
| **Database** | MongoDB (Local MongoDB Server or MongoDB Atlas) with graceful in-memory fallback |
| **AI Integration** | Google Gemini API (`@google/generative-ai`) + Built-in Realistic Mock/Demo AI Provider |

### Strict Technology Compliance
- ✅ **100% JavaScript**: No TypeScript, no `.ts`, and no `.tsx` files.
- ✅ **React Router DOM v6**: Multi-page architecture with 18 functional routes.
- ✅ **Pure MERN Stack**: Native Express MVC + MongoDB Mongoose.

---

## 🗺️ Application Routing Architecture

Every page is directly accessible through browser URLs and supports clean refresh:

| Route | Description | Layout |
| :--- | :--- | :--- |
| `/` | Landing page with interactive preview teasers and testimonials | `PublicLayout` |
| `/login` | Authentication page with demo credentials button | `PublicLayout` |
| `/signup` | User registration with live password strength meter | `PublicLayout` |
| `/dashboard` | Main command center, metrics, quick actions & charts | `AppLayout` |
| `/create` | AI content generator with live interactive preview | `AppLayout` |
| `/library` | Material manager with search, filter, sort & grid/list views | `AppLayout` |
| `/flashcards` | Flashcard collection overview & metrics | `AppLayout` |
| `/flashcards/:id` | Interactive 3D flipcard study session | `AppLayout` |
| `/quiz` | Quiz catalog, subjects & previous score badges | `AppLayout` |
| `/quiz/:id` | Full timed quiz session with question palette & flagging | `AppLayout` |
| `/results/:id` | Animated quiz results and question-by-question analysis | `AppLayout` |
| `/study-guide/:id` | Structured reader with table of contents & text sizing | `AppLayout` |
| `/analytics` | Recharts learning charts, streaks & subject breakdown | `AppLayout` |
| `/history` | Activity timeline with filters and search | `AppLayout` |
| `/favorites` | Bookmarked study sets categorized by type | `AppLayout` |
| `/settings` | Theme, difficulty, notifications & data export | `AppLayout` |
| `/profile` | User avatar, learning goals & scholar achievement badges | `AppLayout` |
| `*` | Custom 404 page with navigation fallbacks | Standalone |

---

## 📁 Project Structure

```
studyflow-ai/
├── client/                      # React Vite Frontend (JavaScript)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/          # Reusable UI primitives
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Dropdown.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── ProgressBar.jsx
│   │   │   │   ├── Skeleton.jsx
│   │   │   │   ├── EmptyState.jsx
│   │   │   │   ├── ErrorState.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   └── ConfirmDialog.jsx
│   │   │   └── layout/          # Layout wrappers
│   │   │       ├── AppLayout.jsx
│   │   │       ├── PublicLayout.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       ├── TopNavbar.jsx
│   │   │       └── Breadcrumbs.jsx
│   │   ├── pages/               # 18 Page Components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── CreateMaterialPage.jsx
│   │   │   ├── LibraryPage.jsx
│   │   │   ├── FlashcardsPage.jsx
│   │   │   ├── FlashcardSessionPage.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── QuizSessionPage.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   ├── StudyGuidePage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   ├── HistoryPage.jsx
│   │   │   ├── FavoritesPage.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── routes/
│   │   │   ├── AppRouter.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/             # Global React Contexts
│   │   │   ├── ThemeContext.jsx
│   │   │   ├── AuthContext.jsx
│   │   │   └── StudyContext.jsx
│   │   ├── services/            # Axios API & Storage clients
│   │   │   ├── api.js
│   │   │   ├── aiService.js
│   │   │   ├── authService.js
│   │   │   ├── materialService.js
│   │   │   └── storageService.js
│   │   ├── data/
│   │   │   └── mockData.js
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                      # Express REST API Backend (JavaScript)
│   ├── config/
│   │   ├── db.js                # MongoDB Mongoose connection & status
│   │   └── seedData.js          # Initial study materials seed
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── materialController.js
│   │   ├── quizController.js
│   │   ├── analyticsController.js
│   │   └── userController.js
│   ├── models/                  # Mongoose Schemas
│   │   ├── User.js
│   │   ├── StudyMaterial.js
│   │   ├── QuizAttempt.js
│   │   └── StudySession.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── materialRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── quizRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   └── aiService.js         # Gemini + Fallback Demo AI Engine
│   ├── middleware/
│   │   └── errorMiddleware.js   # Centralized error handler
│   ├── utils/
│   │   └── validateAIResponse.js# Strict JSON Schema Validator
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── README.md
└── .gitignore
```

---

## 🚀 Installation & Setup Instructions

### Prerequisites
- **Node.js**: v18.0.0 or higher (Tested on Node v24.1.0)
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB Server or MongoDB Atlas URI (Optional — app runs with in-memory fallback if MongoDB is not running)

---

### Step 1: Clone or Navigate to the Project

```bash
cd studyflow-ai
```

---

### Step 2: Backend Setup

1. Open a terminal and enter the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `server/.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/studyflow_ai
   JWT_SECRET=studyflow_super_secret_jwt_key_2026_modern_mern
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=development
   ```
   > **Note:** If `GEMINI_API_KEY` is left blank, StudyFlow AI seamlessly activates its high-fidelity Demo Mode generator, producing realistic, pedagogical flashcards and quizzes without failing.

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:5000`.*

---

### Step 3: Frontend Setup

1. Open a new terminal and enter the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The client opens on `http://localhost:5173`.*

---

## 🤖 AI Integration & JSON Validation Strategy

### Structured Prompting Architecture
When generating educational assets, prompts enforce strict JSON formatting with zero Markdown backticks or commentary:
```javascript
const systemPrompt = `You are an elite educational content generator for StudyFlow AI.
Generate strictly structured, valid JSON with NO Markdown fences.
Subject: ${subject}
Difficulty: ${difficulty}
Requested Type: ${type}
Topic / Notes: ${topic || prompt}
...
`;
```

### Response Sanitization & Validation (`server/utils/validateAIResponse.js`)
Before any AI output is returned to the client:
1. Strips any extraneous markdown formatting (```json, ```).
2. Parses into a native JavaScript object.
3. Validates required schema keys:
   - For **Flashcards**: Validates `cards` array, ensuring non-empty `question` and `answer` fields on every item.
   - For **Quizzes**: Validates `questions` array, verifying that `options` contains at least two items, and `correctAnswer` matches one of the options.
   - For **Study Guides**: Validates `summary` and `sections` with non-empty headings and explanations.
4. If missing fields or syntax errors occur, it safely falls back to a verified pedagogical generator rather than throwing unhandled client exceptions.

---

## 🛡️ Demo Mode Explanation

StudyFlow AI is engineered to be **100% resilient**. If:
1. `GEMINI_API_KEY` is missing or invalid.
2. The user is offline or experiencing network timeouts.
3. MongoDB is offline or inaccessible.

The application **never crashes or blocks the user**:
- **AI Demo Generator**: Returns topic-tailored flashcards, multiple-choice questions, and guides matching the exact JSON contract.
- **In-Memory Store**: Automatically activates if MongoDB is unreachable, preserving newly created decks and quiz scores during the session.
- **Visual Demo Indicators**: Amber badges inform the user that demo generation is active.

---

## 👥 Demo Authentication Credentials

For fast review, a pre-configured user profile is available:
- **Email**: `demo@studyflow.ai`
- **Password**: `password123`
- Or click the **"Fill Demo"** button on `/login` to auto-populate and sign in instantly.

---

## 🔒 Security & Reliability Measures

- **No Secret Leakage**: API keys and database strings are contained strictly in `server/.env`.
- **Password Protection**: Passwords hashed with `bcryptjs` (salt rounds: 10).
- **CORS Configured**: Restricted to authenticated client origins.
- **Client Route Protection**: Unauthenticated state cleanly directs to demo experience without unhandled promise rejections.

---

## 💡 Future Improvements
- Spaced repetition algorithm enhancements (SM-2 / SuperMemo intervals).
- PDF and audio transcript direct file drag-and-drop upload.
- Collaborative study rooms with peer quiz challenges.
- Export to Anki (.apkg) format.

---

## 📄 License
MIT © 2026 StudyFlow AI. Built with ❤️ for the Modern Web.
