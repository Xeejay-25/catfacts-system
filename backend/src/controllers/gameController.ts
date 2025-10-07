import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Game } from '../types';

/**
 * Submit a completed game
 */
export const submitGame = async (req: Request, res: Response) => {
    try {
        const {
            userId,
            score,
            totalQuestions,
            difficulty = 'easy',
            timeElapsed = 0,
            moves = 0,
            factsCollected = 0
        } = req.body;

        console.log('🎮 Submitting game for user:', userId);

        // Validate required fields
        if (!userId || score === undefined || !totalQuestions) {
            return res.status(400).json({
                error: 'userId, score, and totalQuestions are required'
            });
        }

        // Verify user exists
        const [users] = await pool.execute<RowDataPacket[]>(
            'SELECT id FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            console.log('❌ User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        // Insert game record
        console.log('💾 Inserting game into database...');
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO games 
            (user_id, score, total_questions, difficulty, time_elapsed, moves, matched_pairs, total_pairs, collected_facts) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, score, totalQuestions, difficulty, timeElapsed, moves, totalQuestions, totalQuestions, factsCollected]
        );

        // Fetch the created game
        const [newGame] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM games WHERE id = ?',
            [result.insertId]
        );

        console.log('✅ Game saved successfully');
        res.status(201).json(newGame[0]);
    } catch (error) {
        console.error('❌ Error submitting game:', error);
        res.status(500).json({ error: 'Failed to submit game' });
    }
};

/**
 * Get games for a specific user (History)
 */
export const getUserGames = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        console.log('📊 Fetching games for user:', userId);

        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT g.*, u.name as username, CONCAT("https://api.dicebear.com/7.x/avataaars/svg?seed=", u.name) as avatar 
             FROM games g
             JOIN users u ON g.user_id = u.id
             WHERE g.user_id = ?
             ORDER BY g.id DESC`,
            [userId]
        );

        console.log(`✅ Found ${rows.length} games for user`);
        res.json(rows);
    } catch (error) {
        console.error('❌ Error fetching user games:', error);
        res.status(500).json({ error: 'Failed to fetch user games' });
    }
};

/**
 * Get all games (optional - for admin purposes)
 */
export const getAllGames = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT g.*, u.name as username, CONCAT("https://api.dicebear.com/7.x/avataaars/svg?seed=", u.name) as avatar 
             FROM games g
             JOIN users u ON g.user_id = u.id
             ORDER BY g.id DESC
             LIMIT 100`
        );

        res.json(rows);
    } catch (error) {
        console.error('Error fetching all games:', error);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
};

/**
 * Get leaderboard (top players by total score and average score)
 */
export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        console.log('🏆 Fetching leaderboard...');
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT 
                u.name as username,
                CONCAT("https://api.dicebear.com/7.x/avataaars/svg?seed=", u.name) as avatar,
                COUNT(g.id) as total_games,
                SUM(g.score) as total_score,
                AVG(g.score) as average_score
             FROM users u
             LEFT JOIN games g ON u.id = g.user_id
             GROUP BY u.id, u.name
             HAVING total_games > 0
             ORDER BY total_score DESC, average_score DESC
             LIMIT 50`
        );

        // Add rank to each entry
        const leaderboard = rows.map((row: any, index: number) => ({
            ...row,
            rank: index + 1
        }));

        console.log(`✅ Leaderboard generated with ${leaderboard.length} players`);
        res.json(leaderboard);
    } catch (error) {
        console.error('❌ Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard' });
    }
};

/**
 * Get user statistics
 */
export const getUserStats = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        console.log('📈 Fetching stats for user:', userId);

        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT 
                COUNT(g.id) as total_games,
                SUM(g.score) as total_score,
                AVG(g.score) as average_score,
                MAX(g.score) as best_score,
                SUM(g.time_elapsed) as total_time_played,
                SUM(g.moves) as total_moves,
                SUM(g.collected_facts) as total_facts_collected
             FROM games g
             WHERE g.user_id = ?`,
            [userId]
        );

        if (rows.length === 0 || rows[0].total_games === 0) {
            return res.json({
                total_games: 0,
                total_score: 0,
                average_score: 0,
                best_score: 0,
                total_time_played: 0,
                total_moves: 0,
                total_facts_collected: 0
            });
        }

        console.log('✅ User stats retrieved');
        res.json(rows[0]);
    } catch (error) {
        console.error('❌ Error fetching user stats:', error);
        res.status(500).json({ error: 'Failed to fetch user statistics' });
    }
};
