import mysql from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool
export const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'catfacts',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection
export const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
};

// Initialize database tables - verify they exist
export const initializeTables = async () => {
    try {
        // Check if tables exist
        const [userTables] = await pool.execute<RowDataPacket[]>(
            "SHOW TABLES LIKE 'users'"
        );
        const [gameTables] = await pool.execute<RowDataPacket[]>(
            "SHOW TABLES LIKE 'games'"
        );

        if (userTables.length > 0 && gameTables.length > 0) {
            console.log('✅ Database tables verified (users, games)');
            return true;
        } else {
            console.log('⚠️  Warning: Expected tables (users, games) may not exist');
            return false;
        }
    } catch (error) {
        console.error('❌ Failed to check tables:', error);
        return false;
    }
};
