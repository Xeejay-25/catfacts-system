import express from 'express';
import {
    getAllUsers,
    getUserById,
    createUser,
    deleteUser
} from '../controllers/userController';

const router = express.Router();

// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// POST /api/users - Create a new user
router.post('/', createUser);

// DELETE /api/users/:id - Delete a user
router.delete('/:id', deleteUser);

export default router;
