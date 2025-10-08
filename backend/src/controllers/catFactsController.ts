import { Request, Response } from 'express';
import { getCatFactsForGame, getRandomCatFact } from '../services/catFactsService';

/**
 * Get cat facts for a memory game
 */
export const getGameFacts = async (req: Request, res: Response) => {
    try {
        const pairs = parseInt(req.query.pairs as string) || 6;

        if (pairs < 3 || pairs > 20) {
            return res.status(400).json({
                error: 'Pairs must be between 3 and 20'
            });
        }

        const facts = await getCatFactsForGame(pairs);
        res.json({ facts });
    } catch (error) {
        console.error('Error fetching game facts:', error);
        res.status(500).json({ error: 'Failed to fetch cat facts for game' });
    }
};

/**
 * Get a single random cat fact
 */
export const getSingleFact = async (req: Request, res: Response) => {
    try {
        const fact = await getRandomCatFact();
        res.json(fact);
    } catch (error) {
        console.error('Error fetching random fact:', error);
        res.status(500).json({ error: 'Failed to fetch random cat fact' });
    }
};
