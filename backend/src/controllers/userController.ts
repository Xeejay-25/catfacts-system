import { Request, Response } from 'express';
import { pool } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { User } from '../types';

/**
 * Get all users
 */
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        console.log('📋 Fetching all users from database (users table)...');
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, name as username, COALESCE(avatar, CONCAT("https://api.dicebear.com/7.x/avataaars/svg?seed=", name)) as avatar, created_at FROM users ORDER BY created_at DESC'
        );
        console.log(`✅ Found ${rows.length} users:`, rows);
        res.json(rows);
    } catch (error) {
        console.error('❌ Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

/**
 * Get user by ID
 */
export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.execute<RowDataPacket[]>(
            'SELECT id, name as username, COALESCE(avatar, CONCAT("https://api.dicebear.com/7.x/avataaars/svg?seed=", name)) as avatar, created_at FROM users WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

/**
 * Create a new user
 */
export const createUser = async (req: Request, res: Response) => {
    try {
        const { username } = req.body;
        console.log('📝 Creating user:', username);

        if (!username || username.trim().length === 0) {
            console.log('❌ Username is empty');
            return res.status(400).json({ error: 'Username is required' });
        }

        if (username.length < 3) {
            console.log('❌ Username too short');
            return res.status(400).json({ error: 'Username must be at least 3 characters' });
        }

        if (username.length > 20) {
            console.log('❌ Username too long');
            return res.status(400).json({ error: 'Username must be less than 20 characters' });
        }

        // Generate avatar URL using DiceBear API
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        // Check if username already exists
        const [existingUsers] = await pool.execute<RowDataPacket[]>(
            'SELECT id FROM users WHERE name = ?',
            [username]
        );

        if (existingUsers.length > 0) {
            console.log('❌ Username already exists');
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Insert new user into users table with avatar
        console.log('💾 Inserting user into database...');
        const [result] = await pool.execute<ResultSetHeader>(
            'INSERT INTO users (name, email, avatar) VALUES (?, ?, ?)',
            [username, `${username.toLowerCase()}@example.com`, avatar]
        );

        // Fetch the created user
        const [newUser] = await pool.execute<RowDataPacket[]>(
            'SELECT id, name as username, avatar, created_at FROM users WHERE id = ?',
            [result.insertId]
        );

        console.log('✅ User created successfully:', newUser[0]);
        res.status(201).json(newUser[0]);
    } catch (error) {
        console.error('❌ Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
};

/**
 * Delete a user
 */
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [result] = await pool.execute<ResultSetHeader>(
            'DELETE FROM users WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
