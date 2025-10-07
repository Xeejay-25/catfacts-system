import express from 'express';
import {
    submitGame,
    getUserGames,
    getAllGames,
    getLeaderboard,
    getUserStats,
    getTopGames,
    getTopPlayers
} from '../controllers/gameController';

const router = express.Router();

// POST /api/games - Submit a completed game
router.post('/', submitGame);

// GET /api/games/user/:userId - Get games for a specific user (History)
router.get('/user/:userId', getUserGames);

// GET /api/games/user/:userId/stats - Get user statistics
router.get('/user/:userId/stats', getUserStats);

// GET /api/games/top - Get top individual game scores by difficulty
router.get('/top', getTopGames);

// GET /api/games/players/top - Get top players by overall statistics
router.get('/players/top', getTopPlayers);

// GET /api/games/leaderboard - Get leaderboard (legacy)
router.get('/leaderboard', getLeaderboard);

// GET /api/games - Get all games (optional)
router.get('/', getAllGames);

export default router;
