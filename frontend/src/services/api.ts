// Placeholder API service
// This will be connected to the Express backend later

export interface User {
    id: number;
    username: string;
    avatar: string;
    createdAt: string;
}

export interface Game {
    id: number;
    userId: number;
    score: number;
    totalQuestions: number;
    completedAt: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    timeElapsed?: number;
    moves?: number;
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
    totalGames: number;
    totalScore: number;
    averageScore: number;
    rank: number;
}

// Mock data for development
const mockUsers: User[] = [
    {
        id: 1,
        username: 'CatLover42',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CatLover42',
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        username: 'Whiskers',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Whiskers',
        createdAt: new Date().toISOString(),
    },
];

const mockQuestions: Question[] = [
    {
        id: 1,
        question: 'How many hours do cats sleep on average per day?',
        options: ['8-10 hours', '12-16 hours', '18-20 hours', '4-6 hours'],
        correctAnswer: '12-16 hours',
        fact: 'Cats sleep 12-16 hours a day to conserve energy for hunting.',
    },
    {
        id: 2,
        question: 'What is a group of cats called?',
        options: ['A pride', 'A clowder', 'A pack', 'A herd'],
        correctAnswer: 'A clowder',
        fact: 'A group of cats is called a clowder or glaring.',
    },
    {
        id: 3,
        question: 'How many whiskers does a typical cat have?',
        options: ['12', '24', '36', '48'],
        correctAnswer: '24',
        fact: 'Most cats have 24 whiskers, arranged in 4 rows on each side.',
    },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// User API
export const userAPI = {
    getAllUsers: async (): Promise<User[]> => {
        await delay(500);
        return mockUsers;
    },

    getUserById: async (id: number): Promise<User | null> => {
        await delay(300);
        return mockUsers.find(user => user.id === id) || null;
    },

    createUser: async (username: string): Promise<User> => {
        await delay(500);
        const newUser: User = {
            id: mockUsers.length + 1,
            username,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            createdAt: new Date().toISOString(),
        };
        mockUsers.push(newUser);
        return newUser;
    },

    deleteUser: async (id: number): Promise<boolean> => {
        await delay(500);
        const index = mockUsers.findIndex(user => user.id === id);
        if (index > -1) {
            mockUsers.splice(index, 1);
            return true;
        }
        return false;
    },
};

// Game API
export const gameAPI = {
    getQuestions: async (count: number = 10): Promise<Question[]> => {
        await delay(500);
        // Return random questions
        const shuffled = [...mockQuestions].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, mockQuestions.length));
    },

    submitGame: async (userId: number, score: number, totalQuestions: number): Promise<Game> => {
        await delay(500);
        const newGame: Game = {
            id: Date.now(),
            userId,
            score,
            totalQuestions,
            completedAt: new Date().toISOString(),
        };
        return newGame;
    },

    getUserGames: async (userId: number): Promise<Game[]> => {
        await delay(500);
        // Return mock games for the user
        return [
            {
                id: 1,
                userId,
                score: 8,
                totalQuestions: 10,
                completedAt: new Date(Date.now() - 86400000).toISOString(),
            },
            {
                id: 2,
                userId,
                score: 6,
                totalQuestions: 10,
                completedAt: new Date(Date.now() - 172800000).toISOString(),
            },
        ];
    },
};

// Leaderboard API
export const leaderboardAPI = {
    getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
        await delay(500);
        return [
            {
                username: 'CatLover42',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CatLover42',
                totalGames: 15,
                totalScore: 120,
                averageScore: 8.0,
                rank: 1,
            },
            {
                username: 'Whiskers',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Whiskers',
                totalGames: 12,
                totalScore: 90,
                averageScore: 7.5,
                rank: 2,
            },
            {
                username: 'MeowMaster',
                avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MeowMaster',
                totalGames: 20,
                totalScore: 140,
                averageScore: 7.0,
                rank: 3,
            },
        ];
    },
};
