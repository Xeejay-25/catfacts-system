// User type based on database schema
export interface User {
    id: number;
    username: string;
    avatar: string;
    created_at?: string;
}

// Game type based on database schema
export interface Game {
    id: number;
    user_id: number;
    score: number;
    total_questions: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    time_elapsed?: number;
    moves?: number;
    facts_collected?: number;
    completed_at?: string;
}

// Leaderboard entry
export interface LeaderboardEntry {
    username: string;
    avatar: string;
    total_games: number;
    total_score: number;
    average_score: number;
    rank?: number;
}

// CatFacts API response
export interface CatFact {
    fact: string;
    length: number;
}
