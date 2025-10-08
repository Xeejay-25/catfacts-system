import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Game } from '../types';
import { randomUUID } from 'crypto';

/**
 * Start a new game (status: 'playing')
 */
export const startGame = async (req: Request, res: Response) => {
    try {
        const {
            userId,
            difficulty = 'easy',
            totalPairs = 6
        } = req.body;

        console.log('🎮 Starting new game for user:', userId);

        // Validate required fields
        if (!userId) {
            console.log('❌ Validation failed - userId required');
            return res.status(400).json({
                error: 'userId is required'
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

        // Generate unique session_id
        const sessionId = randomUUID();

        // Insert game record with 'playing' status
        console.log('💾 Creating new game in database with session_id:', sessionId);
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO games 
            (user_id, session_id, difficulty, score, moves, time_elapsed, matched_pairs, total_pairs, collected_facts, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, sessionId, difficulty, 0, 0, 0, 0, totalPairs, '[]', 'playing']
        );

        // Fetch the created game
        const [newGame] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM games WHERE id = ?',
            [result.insertId]
        );

        console.log('✅ Game created successfully with ID:', result.insertId);
        res.status(201).json(newGame[0]);
    } catch (error) {
        console.error('❌ Error starting game:', error);
        res.status(500).json({ error: 'Failed to start game', details: error instanceof Error ? error.message : 'Unknown error' });
    }
};

/**
 * Update an existing game (status: 'playing' or 'won' or 'abandoned')
 */
export const updateGame = async (req: Request, res: Response) => {
    try {
        const { gameId } = req.params;
        const {
            score,
            moves,
            timeElapsed,
            matchedPairs,
            factsCollected,
            status
        } = req.body;

        console.log('🎮 Updating game:', gameId);

        // Validate status
        const validStatuses = ['playing', 'won', 'abandoned'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                error: 'Invalid status. Must be one of: playing, won, abandoned'
            });
        }

        // Build update query dynamically
        const updates: string[] = [];
        const values: any[] = [];

        if (score !== undefined) {
            updates.push('score = ?');
            values.push(score);
        }
        if (moves !== undefined) {
            updates.push('moves = ?');
            values.push(moves);
        }
        if (timeElapsed !== undefined) {
            updates.push('time_elapsed = ?');
            values.push(timeElapsed);
        }
        if (matchedPairs !== undefined) {
            updates.push('matched_pairs = ?');
            values.push(matchedPairs);
        }
        if (factsCollected !== undefined) {
            updates.push('collected_facts = ?');
            // Convert to JSON string if it's a number or array
            const factsValue = typeof factsCollected === 'number'
                ? JSON.stringify([])
                : (typeof factsCollected === 'string' ? factsCollected : JSON.stringify(factsCollected));
            values.push(factsValue);
        }
        if (status) {
            updates.push('status = ?');
            values.push(status);

            // Set completed_at timestamp if status is 'won' or 'abandoned'
            if (status === 'won' || status === 'abandoned') {
                updates.push('completed_at = NOW()');
            }
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(gameId);

        await pool.execute(
            `UPDATE games SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        // Fetch the updated game
        const [updatedGame] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM games WHERE id = ?',
            [gameId]
        );

        if (updatedGame.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }

        console.log('✅ Game updated successfully');
        res.json(updatedGame[0]);
    } catch (error) {
        console.error('❌ Error updating game:', error);
        res.status(500).json({ error: 'Failed to update game', details: error instanceof Error ? error.message : 'Unknown error' });
    }
};

/**
 * Submit a completed game (status: 'won') - kept for backward compatibility
 * @deprecated Use startGame + updateGame instead
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
            factsCollected = 0,
            status = 'won'  // Default to 'won' for completed games
        } = req.body;

        console.log('🎮 Submitting game for user:', userId);
        console.log('📊 Game data:', { userId, score, totalQuestions, difficulty, timeElapsed, moves, factsCollected, status });

        // Validate required fields
        if (!userId || score === undefined || !totalQuestions) {
            console.log('❌ Validation failed - missing required fields');
            return res.status(400).json({
                error: 'userId, score, and totalQuestions are required'
            });
        }

        // Validate status
        const validStatuses = ['playing', 'won', 'abandoned'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                error: 'Invalid status. Must be one of: playing, won, abandoned'
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

        // Generate unique session_id
        const sessionId = randomUUID();

        // Convert factsCollected to JSON string for TEXT field
        const factsJson = typeof factsCollected === 'number' ? '[]' : JSON.stringify(factsCollected);

        // Insert game record with proper status
        console.log('💾 Inserting game into database with session_id:', sessionId);
        const [result] = await pool.execute<ResultSetHeader>(
            `INSERT INTO games 
            (user_id, session_id, difficulty, score, moves, time_elapsed, matched_pairs, total_pairs, collected_facts, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [userId, sessionId, difficulty, score, moves, timeElapsed, totalQuestions, totalQuestions, factsJson, status]
        );

        // Fetch the created game
        const [newGame] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM games WHERE id = ?',
            [result.insertId]
        );

        console.log('✅ Game saved successfully with ID:', result.insertId);
        res.status(201).json(newGame[0]);
    } catch (error) {
        console.error('❌ Error submitting game:', error);
        res.status(500).json({ error: 'Failed to submit game', details: error instanceof Error ? error.message : 'Unknown error' });
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
            `SELECT g.*, u.name as username, COALESCE(u.avatar, CONCAT("https://api.dicebear.com/7.x/avataaars/svg?seed=", u.name)) as avatar 
             FROM games g
             JOIN users u ON g.user_id = u.id
             WHERE g.user_id = ?
             ORDER BY g.created_at DESC`,
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
            `SELECT g.*, u.name as username, COALESCE(u.avatar, CONCAT("https://api.dicebear.com/7.x/avataaars/svg?seed=", u.name)) as avatar 
             FROM games g
             JOIN users u ON g.user_id = u.id
             ORDER BY g.created_at DESC
             LIMIT 100`
        );

        res.json(rows);
    } catch (error) {
        console.error('Error fetching all games:', error);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
};

/**
 * Get top individual game scores by difficulty
 */
export const getTopGames = async (req: Request, res: Response) => {
    try {
        const { difficulty = 'easy' } = req.query;
        console.log('🏆 Fetching top games for difficulty:', difficulty);

        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT 
                g.id,
                g.score,
                g.moves,
                g.time_elapsed,
                g.difficulty,
                g.completed_at,
                u.name as username,
                COALESCE(u.avatar, CONCAT("https://api.dicebear.com/7.x/avataaars/svg?seed=", u.name)) as avatar
             FROM games g
             JOIN users u ON g.user_id = u.id
             WHERE g.difficulty = ? AND g.status = 'won'
             ORDER BY g.score DESC, g.moves ASC, g.time_elapsed ASC
             LIMIT 10`
            ,
            [difficulty]
        );

        console.log(`✅ Found ${rows.length} top games for ${difficulty}`);
        res.json(rows);
    } catch (error) {
        console.error('❌ Error fetching top games:', error);
        res.status(500).json({ error: 'Failed to fetch top games' });
    }
};

/**
 * Get top players by overall statistics
 */
export const getTopPlayers = async (req: Request, res: Response) => {
    try {
        console.log('⭐ Fetching top players...');
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT 
                u.id as user_id,
                u.name as username,
                COALESCE(u.avatar, CONCAT("https://api.dicebear.com/7.x/avataaars/svg?seed=", u.name)) as avatar,
                COUNT(g.id) as games_completed,
                MAX(g.score) as best_score,
                AVG(g.score) as average_score,
                AVG(g.time_elapsed) as average_time
             FROM users u
             LEFT JOIN games g ON u.id = g.user_id AND g.status = 'won'
             GROUP BY u.id, u.name
             HAVING games_completed > 0
             ORDER BY best_score DESC, average_score DESC, games_completed DESC
             LIMIT 20`
        );

        console.log(`✅ Top players generated with ${rows.length} players`);
        res.json(rows);
    } catch (error) {
        console.error('❌ Error fetching top players:', error);
        res.status(500).json({ error: 'Failed to fetch top players' });
    }
};

/**
 * Get leaderboard (legacy - keeping for backward compatibility)
 * @deprecated Use getTopPlayers instead
 */
export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        console.log('🏆 Fetching leaderboard...');
        const [rows] = await pool.execute<RowDataPacket[]>(
            `SELECT 
                u.name as username,
                COALESCE(u.avatar, CONCAT("https://api.dicebear.com/7.x/avataaars/svg?seed=", u.name)) as avatar,
                COUNT(g.id) as total_games,
                SUM(g.score) as total_score,
                AVG(g.score) as average_score
             FROM users u
             LEFT JOIN games g ON u.id = g.user_id AND g.status = 'won'
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
                SUM(CASE WHEN g.status = 'won' THEN g.score ELSE 0 END) as total_score,
                AVG(CASE WHEN g.status = 'won' THEN g.score ELSE NULL END) as average_score,
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
