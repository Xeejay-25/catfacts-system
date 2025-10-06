# CatFacts System - Standalone React + TypeScript Project

A complete cat facts trivia game application built with React + TypeScript (frontend) and Express.js (backend - to be added).

## 🎯 Project Structure

```
catfacts-system/
 ├── backend/      ← Express.js server (to be added later)
 └── frontend/     ← React + TypeScript app (COMPLETED)
     ├── src/
     │   ├── components/
     │   │   └── layout/
     │   │       ├── Header.tsx
     │   │       ├── Footer.tsx
     │   │       └── Layout.tsx
     │   ├── pages/
     │   │   ├── Welcome.tsx
     │   │   ├── Play.tsx
     │   │   ├── Game.tsx
     │   │   ├── Leaderboards.tsx
     │   │   ├── UserCreate.tsx
     │   │   ├── UserSelect.tsx
     │   │   ├── History.tsx
     │   │   └── Dashboard.tsx
     │   ├── services/
     │   │   └── api.ts
     │   └── App.tsx
     └── package.json
```

## 🚀 Features

### Completed Frontend Features

- ✅ **Welcome Page** - Hero section with features and call-to-action
- ✅ **User Management** - Create account, select user, user avatars
- ✅ **Play Game** - Choose difficulty levels (Easy, Medium, Hard)
- ✅ **Game Interface** - Question/answer interface with real-time feedback
- ✅ **Leaderboards** - View top players and rankings
- ✅ **History** - Track your game history and statistics
- ✅ **Dashboard** - User profile with stats and quick actions
- ✅ **Responsive Design** - Works on mobile, tablet, and desktop
- ✅ **Mock API** - Placeholder API service ready for backend integration

## 🎨 Design System

### Color Palette
- **Primary**: `#4a90e2` (Blue)
- **Secondary**: `#f5a623` (Orange)
- **Success**: `#7ed321` (Green)
- **Danger**: `#d0021b` (Red)
- **Background**: `#f9f9f9` (Light Gray)

### Typography
- **Font Family**: System fonts (Apple, Segoe UI, Roboto)
- **Page Title**: 32px, Bold
- **Subtitle**: 18px, Regular
- **Body**: 16px, Regular

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **CSS3** - Styling with CSS variables

### Backend (To Be Added)
- **Express.js** - Node.js framework
- **TypeScript** - Type safety
- **CatFacts API** - External cat facts data

## 📦 Installation & Setup

### Frontend Setup

1. Navigate to the frontend directory:
   ```powershell
   cd catfacts-system/frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start development server:
   ```powershell
   npm run dev
   ```

4. Open browser to: `http://localhost:5173`

## 📱 Pages Overview

### 1. Welcome (`/`)
Landing page with hero section, features, and call-to-action buttons.

### 2. User Create (`/user/create`)
Create a new user account with username and auto-generated avatar.

### 3. User Select (`/user/select`)
Select existing user account to log in and continue playing.

### 4. Play (`/play`)
Choose game difficulty level:
- **Easy**: 10 questions, 30 seconds each
- **Medium**: 15 questions, 25 seconds each
- **Hard**: 20 questions, 20 seconds each

### 5. Game (`/game`)
Interactive trivia game with:
- Multiple-choice questions
- Real-time feedback
- Cat facts after each answer
- Score tracking

### 6. Leaderboards (`/leaderboards`)
View top players ranked by:
- Total games played
- Total score
- Average score

### 7. History (`/history`)
User's game history with:
- Past game scores
- Performance statistics
- Score breakdown

### 8. Dashboard (`/dashboard`)
User profile dashboard with:
- User statistics
- Recent games
- Quick actions

## 🔌 API Integration

The frontend currently uses a **mock API service** (`src/services/api.ts`) with placeholder data. This can be easily connected to the Express.js backend once it's created.

### API Endpoints (To Be Implemented in Backend)

```typescript
// User endpoints
GET    /api/users           - Get all users
GET    /api/users/:id       - Get user by ID
POST   /api/users           - Create new user
DELETE /api/users/:id       - Delete user

// Game endpoints
GET    /api/questions       - Get random questions
POST   /api/games           - Submit game result
GET    /api/games/:userId   - Get user's games

// Leaderboard endpoints
GET    /api/leaderboard     - Get leaderboard data
```

## 🎮 How to Play

1. **Create Account** - Choose a username and get an avatar
2. **Select Difficulty** - Choose Easy, Medium, or Hard
3. **Answer Questions** - Select the correct answer for each question
4. **Learn Facts** - Read interesting cat facts after each answer
5. **View Results** - See your score and compete on leaderboards
6. **Track Progress** - View history and statistics in your dashboard

## 🚧 Next Steps (Backend Integration)

1. **Create Express.js Backend**
   - Set up Express server
   - Create REST API endpoints
   - Connect to database (MongoDB/PostgreSQL)
   - Integrate CatFacts external API

2. **Connect Frontend to Backend**
   - Replace mock API with real API calls
   - Add authentication/session management
   - Implement data persistence

3. **Add Advanced Features**
   - Timer for questions
   - Multiplayer mode
   - Achievements and badges
   - Social sharing

## 📄 License

This project is open source and available under the MIT License.

## 🐱 Acknowledgments

- CatFacts API for providing cat trivia data
- DiceBear Avatars for user avatars
- React and Vite communities

---

**Status**: Frontend Complete ✅ | Backend Pending ⏳

Built with ❤️ and 🐱
