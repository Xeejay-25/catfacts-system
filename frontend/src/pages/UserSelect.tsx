import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI, type User } from '../services/api';
import './UserSelect.css';

const UserSelect = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const allUsers = await userAPI.getAllUsers();
            setUsers(allUsers);
        } catch (err) {
            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectUser = (user: User) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        navigate('/dashboard');
    };

    const handleDeleteUser = async (userId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            await userAPI.deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            setError('Failed to delete user. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="user-select-page">
                <div className="container">
                    <div className="loading">Loading users...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="user-select-page">
            <div className="container">
                <h1 className="page-title">Select User</h1>
                <p className="page-subtitle">
                    Choose your account to continue playing
                </p>

                {error && (
                    <div className="error-banner">
                        {error}
                        <button onClick={() => setError('')} className="error-close">×</button>
                    </div>
                )}

                {users.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">👤</div>
                        <h2>No Users Found</h2>
                        <p>Create a new account to get started!</p>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => navigate('/user/create')}
                        >
                            Create Account
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="users-grid">
                            {users.map(user => (
                                <div
                                    key={user.id}
                                    className="user-card"
                                    onClick={() => handleSelectUser(user)}
                                >
                                    <button
                                        className="delete-btn"
                                        onClick={(e) => handleDeleteUser(user.id, e)}
                                        title="Delete user"
                                    >
                                        ×
                                    </button>
                                    <img
                                        src={user.avatar}
                                        alt={user.username}
                                        className="user-avatar"
                                    />
                                    <h3 className="user-name">{user.username}</h3>
                                    <p className="user-info">
                                        Joined {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="create-new">
                            <p>Don't see your account?</p>
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate('/user/create')}
                            >
                                Create New Account
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserSelect;
