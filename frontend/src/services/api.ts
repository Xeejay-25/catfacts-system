// API service connected to Express backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface User {
    id: number;
    username: string;
    avatar: string;
    created_at?: string;
    createdAt?: string;
}

export interface Game {
    id: number;
    user_id?: number;
    userId?: number;
    score: number;
    total_questions?: number;
    totalQuestions?: number;
    completed_at?: string;
    completedAt?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    time_elapsed?: number;
    timeElapsed?: number;
    moves?: number;
    facts_collected?: number;
    factsCollected?: number;
}

export interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
    fact: string;
}

export interface LeaderboardEntry {
    username: string;
    avatar: string;
    total_games?: number;
    totalGames?: number;
    total_score?: number;
    totalScore?: number;
    average_score?: number;
    averageScore?: number;
    rank?: number;
}

export interface CatFact {
    fact: string;
    length: number;
}

// User API
export const userAPI = {
    getAllUsers: async (): Promise<User[]> => {
        try {
            console.log('Fetching users from:', `${API_BASE_URL}/users`);
            const response = await fetch(`${API_BASE_URL}/users`);
            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Failed to fetch users:', errorText);
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            console.log('Users fetched:', data);

            // Normalize field names (created_at -> createdAt)
            return data.map((user: any) => ({
                ...user,
                createdAt: user.created_at || user.createdAt
            }));
        } catch (error) {
            console.error('Error in getAllUsers:', error);
            throw error;
        }
    },

    getUserById: async (id: number): Promise<User | null> => {
        const response = await fetch(`${API_BASE_URL}/users/${id}`);
        if (response.status === 404) {
            return null;
        }
        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }
        const user = await response.json();
        return {
            ...user,
            createdAt: user.created_at || user.createdAt
        };
    },

    createUser: async (username: string): Promise<User> => {
        try {
            console.log('Creating user:', username);
            const response = await fetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }),
            });

            console.log('Create user response status:', response.status);

            if (!response.ok) {
                const error = await response.json().catch(() => ({ error: 'Failed to create user' }));
                console.error('Create user error:', error);
                throw new Error(error.error || 'Failed to create user');
            }

            const user = await response.json();
            console.log('User created:', user);

            return {
                ...user,
                createdAt: user.created_at || user.createdAt
            };
        } catch (error) {
            console.error('Error in createUser:', error);
            throw error;
        }
    },

    deleteUser: async (id: number): Promise<boolean> => {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE',
        });

        if (response.status === 404) {
            return false;
        }

        if (!response.ok) {
            throw new Error('Failed to delete user');
        }

        return true;
    },
};

// Game API
export const gameAPI = {
    getQuestions: async (): Promise<Question[]> => {
        // This is not used in the actual game - the Game component has its own logic
        // But keeping for backward compatibility
        return [];
    },

    submitGame: async (
        userId: number,
        score: number,
        totalQuestions: number,
        difficulty: 'easy' | 'medium' | 'hard' = 'easy',
        timeElapsed: number = 0,
        moves: number = 0,
        factsCollected: number = 0
    ): Promise<Game> => {
        const response = await fetch(`${API_BASE_URL}/games`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                score,
                totalQuestions,
                difficulty,
                timeElapsed,
                moves,
                factsCollected
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to submit game');
        }

        const game = await response.json();
        return {
            ...game,
            userId: game.user_id || game.userId,
            totalQuestions: game.total_questions || game.totalQuestions,
            completedAt: game.completed_at || game.completedAt,
            timeElapsed: game.time_elapsed || game.timeElapsed,
            factsCollected: game.facts_collected || game.factsCollected
        };
    },

    getUserGames: async (userId: number): Promise<Game[]> => {
        const response = await fetch(`${API_BASE_URL}/games/user/${userId}`);

        if (!response.ok) {
            throw new Error('Failed to fetch user games');
        }

        const data = await response.json();
        // Normalize field names
        return data.map((game: any) => ({
            ...game,
            userId: game.user_id || game.userId,
            totalQuestions: game.total_questions || game.totalQuestions,
            completedAt: game.completed_at || game.completedAt,
            timeElapsed: game.time_elapsed || game.timeElapsed,
            factsCollected: game.facts_collected || game.factsCollected
        }));
    },

    getUserStats: async (userId: number) => {
        const response = await fetch(`${API_BASE_URL}/games/user/${userId}/stats`);

        if (!response.ok) {
            throw new Error('Failed to fetch user stats');
        }

        const data = await response.json();
        return {
            ...data,
            totalGames: data.total_games || data.totalGames,
            totalScore: data.total_score || data.totalScore,
            averageScore: data.average_score || data.averageScore,
            bestScore: data.best_score || data.bestScore,
            totalTimePlayed: data.total_time_played || data.totalTimePlayed,
            totalMoves: data.total_moves || data.totalMoves,
            totalFactsCollected: data.total_facts_collected || data.totalFactsCollected
        };
    },
};

// Leaderboard API
export const leaderboardAPI = {
    // Get top individual game scores by difficulty
    getTopGames: async (difficulty: 'easy' | 'medium' | 'hard' = 'easy'): Promise<any[]> => {
        const response = await fetch(`${API_BASE_URL}/games/top?difficulty=${difficulty}`);

        if (!response.ok) {
            throw new Error('Failed to fetch top games');
        }

        const data = await response.json();
        return data.map((game: any) => ({
            ...game,
            timeElapsed: game.time_elapsed || game.timeElapsed,
            completedAt: game.completed_at || game.completedAt
        }));
    },

    // Get top players by overall statistics
    getTopPlayers: async (): Promise<any[]> => {
        const response = await fetch(`${API_BASE_URL}/games/players/top`);

        if (!response.ok) {
            throw new Error('Failed to fetch top players');
        }

        const data = await response.json();
        return data.map((player: any) => ({
            ...player,
            userId: player.user_id || player.userId,
            gamesCompleted: player.games_completed || player.gamesCompleted,
            bestScore: player.best_score || player.bestScore,
            averageScore: player.average_score || player.averageScore,
            averageTime: player.average_time || player.averageTime
        }));
    },

    // Legacy method - kept for backward compatibility
    getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
        const response = await fetch(`${API_BASE_URL}/games/leaderboard`);

        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard');
        }

        const data = await response.json();
        // Normalize field names
        return data.map((entry: any) => ({
            ...entry,
            totalGames: entry.total_games || entry.totalGames,
            totalScore: entry.total_score || entry.totalScore,
            averageScore: entry.average_score || entry.averageScore
        }));
    },
};

// Cat Facts API
export const catFactsAPI = {
    getGameFacts: async (pairs: number = 6): Promise<string[]> => {
        const response = await fetch(`${API_BASE_URL}/catfacts/game?pairs=${pairs}`);

        if (!response.ok) {
            throw new Error('Failed to fetch cat facts for game');
        }

        const data = await response.json();
        return data.facts;
    },

    getRandomFact: async (): Promise<CatFact> => {
        const response = await fetch(`${API_BASE_URL}/catfacts/random`);

        if (!response.ok) {
            throw new Error('Failed to fetch random cat fact');
        }

        return await response.json();
    },
};
