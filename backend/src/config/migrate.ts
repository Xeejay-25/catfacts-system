import { pool } from './database';
import { RowDataPacket } from 'mysql2';

/**
 * Database migration script to fix schema issues
 */
export const runMigrations = async () => {
    try {
        console.log('🔄 Starting database migrations...');

        // 1. Check if duplicate 'game' table exists (needs to be dropped first due to FK)
        const [gameTable] = await pool.execute<RowDataPacket[]>(
            "SHOW TABLES LIKE 'game'"
        );
        if (gameTable.length > 0) {
            console.log('🗑️  Dropping duplicate "game" table...');
            // First disable foreign key checks
            await pool.execute('SET FOREIGN_KEY_CHECKS = 0');
            await pool.execute('DROP TABLE IF EXISTS `game`');
            await pool.execute('SET FOREIGN_KEY_CHECKS = 1');
            console.log('✅ Dropped "game" table');
        }

        // 2. Check and drop duplicate 'user' table if it exists
        const [userTable] = await pool.execute<RowDataPacket[]>(
            "SHOW TABLES LIKE 'user'"
        );
        if (userTable.length > 0) {
            console.log('🗑️  Dropping duplicate "user" table...');
            // Disable foreign key checks
            await pool.execute('SET FOREIGN_KEY_CHECKS = 0');
            await pool.execute('DROP TABLE IF EXISTS `user`');
            await pool.execute('SET FOREIGN_KEY_CHECKS = 1');
            console.log('✅ Dropped "user" table');
        }

        // 3. Check if 'avatar' column exists in 'users' table
        const [columns] = await pool.execute<RowDataPacket[]>(
            "SHOW COLUMNS FROM `users` LIKE 'avatar'"
        );

        if (columns.length === 0) {
            console.log('➕ Adding "avatar" column to "users" table...');
            await pool.execute(
                `ALTER TABLE users ADD COLUMN avatar VARCHAR(500) DEFAULT NULL AFTER email`
            );
            console.log('✅ Added "avatar" column to "users" table');
        } else {
            console.log('✅ "avatar" column already exists in "users" table');
        }

        // 4. Verify 'games' table structure
        const [gamesColumns] = await pool.execute<RowDataPacket[]>(
            "SHOW COLUMNS FROM `games`"
        );
        console.log('✅ Games table structure verified');
        console.log('   Columns:', gamesColumns.map((c: any) => c.Field).join(', '));

        console.log('✅ All migrations completed successfully!');
        return true;
    } catch (error) {
        console.error('❌ Migration failed:', error);
        return false;
    }
};
