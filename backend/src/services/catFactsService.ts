import axios from 'axios';
import { CatFact } from '../types';

const CATFACTS_API_URL = process.env.CATFACTS_API_URL || 'https://catfact.ninja';

/**
 * Fetch a single random cat fact
 */
export const getRandomCatFact = async (): Promise<CatFact> => {
    try {
        const response = await axios.get(`${CATFACTS_API_URL}/fact`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cat fact:', error);
        throw new Error('Failed to fetch cat fact');
    }
};

/**
 * Fetch multiple random cat facts
 */
export const getMultipleCatFacts = async (count: number): Promise<CatFact[]> => {
    try {
        const promises = Array(count).fill(null).map(() => getRandomCatFact());
        const facts = await Promise.all(promises);
        return facts;
    } catch (error) {
        console.error('Error fetching multiple cat facts:', error);
        throw new Error('Failed to fetch cat facts');
    }
};

/**
 * Fetch cat facts for a memory game (paired facts)
 * Returns facts in pairs for matching game
 */
export const getCatFactsForGame = async (pairs: number = 6): Promise<string[]> => {
    try {
        const facts = await getMultipleCatFacts(pairs);
        // Each fact will be duplicated for the memory matching game
        const pairedFacts = facts.map(f => f.fact);
        return pairedFacts;
    } catch (error) {
        console.error('Error fetching cat facts for game:', error);
        throw new Error('Failed to fetch cat facts for game');
    }
};
