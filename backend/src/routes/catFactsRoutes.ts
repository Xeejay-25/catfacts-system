import express from 'express';
import {
    getGameFacts,
    getSingleFact
} from '../controllers/catFactsController';

const router = express.Router();

// GET /api/catfacts/game - Get cat facts for memory game
router.get('/game', getGameFacts);

// GET /api/catfacts/random - Get a single random cat fact
router.get('/random', getSingleFact);

export default router;
