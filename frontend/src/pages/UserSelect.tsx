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
                <h1 className="page-title">Select Player</h1>
                <p className="page-subtitle">
                    Choose a player to continue your gaming journey
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
                                    <img
                                        src={user.avatar}
                                        alt={user.username}
                                        className="user-avatar"
                                    />
                                    <h3 className="user-name">{user.username}</h3>
                                    <div className="user-details">
                                        <div className="user-detail-row">
                                            <span>Joined:</span>
                                            <span className="detail-value">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="click-hint">Click to select</div>
                                </div>
                            ))}
                        </div>

                        <div className="create-new-section">
                            <p className="create-new-text">Don't see your account?</p>
                            <button
                                className="btn btn-secondary btn-sm"
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
