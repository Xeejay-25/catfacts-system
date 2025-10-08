# CatFacts System - Full Stack React + Express Application

A complete cat facts memory game application with React + TypeScript frontend and Express.js + MySQL backend.

## 🎯 Project Structure

```
catfacts-system/
 ├── backend/      ← Express.js + MySQL server (COMPLETED ✅)
 │   ├── src/
 │   │   ├── config/        # Database configuration
 │   │   ├── controllers/   # Request handlers
 │   │   ├── routes/        # API routes
 │   │   ├── services/      # Business logic
 │   │   └── types/         # TypeScript types
 │   └── package.json
 └── frontend/     ← React + TypeScript app (COMPLETED ✅)
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
     │   │   └── api.ts        # Backend API client
     │   └── App.tsx
     └── package.json
```

## 🚀 Features

### Full Stack Implementation

- ✅ **Welcome Page** - Hero section with features and call-to-action
- ✅ **User Management** - Create account, select user, user avatars (Saved to MySQL)
- ✅ **Play Game** - Memory matching game with cat emojis
- ✅ **Game Recording** - Results saved to database with score, time, moves
- ✅ **Leaderboards** - Real-time rankings from database
- ✅ **History** - User-specific game history from database
- ✅ **Dashboard** - User profile with statistics
- ✅ **Responsive Design** - Works on mobile, tablet, and desktop
- ✅ **REST API** - Complete backend with MySQL integration
- ✅ **Cat Facts API** - Integration with CatFacts Ninja API

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

### Backend
- **Express.js** - Node.js framework
- **TypeScript** - Type safety
- **MySQL** - Database (with mysql2)
- **CatFacts Ninja API** - External cat facts data
- **CORS** - Cross-origin support
- **dotenv** - Environment configuration

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL Server
- Database named `catfacts` created in MySQL

### Backend Setup

1. Navigate to the backend directory:
   ```powershell
   cd catfacts-system/backend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=catfacts
   DB_USERNAME=root
   DB_PASSWORD=2532
   PORT=3001
   NODE_ENV=development
   ```

4. Start development server:
   ```powershell
   npm run dev
   ```
   
   The backend will:
   - Connect to MySQL database
   - Auto-create tables if they don't exist
   - Start server on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
   ```powershell
   cd catfacts-system/frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

4. Start development server:
   ```powershell
   npm run dev
   ```

5. Open browser to: `http://localhost:5173`

## 🗄️ Database Schema

### User Table
Stores player profiles.
```sql
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    avatar VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Game Table
Records all game sessions.
```sql
CREATE TABLE game (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
    time_elapsed INT DEFAULT 0,
    moves INT DEFAULT 0,
    facts_collected INT DEFAULT 0,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
```

## 🔌 API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `DELETE /api/users/:id` - Delete user

### Games
- `POST /api/games` - Submit game result
- `GET /api/games/user/:userId` - Get user's game history
- `GET /api/games/user/:userId/stats` - Get user statistics
- `GET /api/games/leaderboard` - Get leaderboard rankings

### Cat Facts
- `GET /api/catfacts/game?pairs=6` - Get facts for game
- `GET /api/catfacts/random` - Get random cat fact

### Health
- `GET /api/health` - Server health check

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
