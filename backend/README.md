# CatFacts Backend API

Express.js backend server for the CatFacts memory game system.

## Features

- **User Management**: Create, retrieve, and delete users
- **Game Recording**: Store game results with detailed statistics
- **Leaderboards**: Track top players by score and performance
- **History**: View individual user game history
- **Cat Facts Integration**: Fetch cat facts from CatFacts Ninja API

## Tech Stack

- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MySQL** database
- **mysql2** for database connectivity
- **axios** for external API calls
- **CORS** enabled for frontend communication

## Prerequisites

- Node.js (v16 or higher)
- MySQL database server
- Database named `catfacts` created in MySQL

## Database Structure

### `user` table
```sql
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    avatar VARCHAR(500) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `game` table
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

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
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

4. Start the development server:
```bash
npm run dev
```

The server will automatically create the database tables if they don't exist.

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
  - Body: `{ username: string }`
- `DELETE /api/users/:id` - Delete a user

### Games
- `POST /api/games` - Submit a completed game
  - Body: `{ userId, score, totalQuestions, difficulty?, timeElapsed?, moves?, factsCollected? }`
- `GET /api/games/user/:userId` - Get user's game history
- `GET /api/games/user/:userId/stats` - Get user statistics
- `GET /api/games/leaderboard` - Get leaderboard rankings
- `GET /api/games` - Get all games (optional)

### Cat Facts
- `GET /api/catfacts/game?pairs=6` - Get cat facts for memory game
- `GET /api/catfacts/random` - Get a single random cat fact

### Health Check
- `GET /api/health` - Check server status

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

## Development

The backend uses:
- **nodemon** for auto-reload during development
- **ts-node** for running TypeScript directly
- **TypeScript** for type checking

## Database Connection

The server automatically:
1. Tests database connectivity on startup
2. Creates tables if they don't exist
3. Uses connection pooling for better performance

## Error Handling

All endpoints include comprehensive error handling with appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict (duplicate username)
- `500` - Internal Server Error

## CORS Configuration

CORS is enabled for all origins during development. Adjust in production as needed.

## External API

The backend integrates with [CatFacts Ninja API](https://catfact.ninja) to fetch random cat facts for the memory game.
