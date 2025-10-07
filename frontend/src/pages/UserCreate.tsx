import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userAPI } from '../services/api';
import './UserCreate.css';

const UserCreate = () => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewAvatar, setPreviewAvatar] = useState('');
    const navigate = useNavigate();

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUsername(value);
        if (value) {
            setPreviewAvatar(`https://api.dicebear.com/7.x/avataaars/svg?seed=${value}`);
        } else {
            setPreviewAvatar('');
        }
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim()) {
            setError('Username is required');
            return;
        }

        if (username.length < 3) {
            setError('Username must be at least 3 characters');
            return;
        }

        if (username.length > 20) {
            setError('Username must be less than 20 characters');
            return;
        }

        setLoading(true);
        try {
            const newUser = await userAPI.createUser(username.trim());
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            navigate('/dashboard');
        } catch (err) {
            setError('Failed to create user. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-create-page">
            <div className="container">
                <button
                    className="btn btn-secondary back-button"
                    onClick={() => navigate('/play')}
                    style={{ marginBottom: '1.5rem' }}
                >
                    ← Back
                </button>
                <div className="create-card">
                    <h1 className="page-title">Create Account</h1>
                    <p className="page-subtitle">
                        Choose a username to start your cat facts adventure!
                    </p>

                    {previewAvatar && (
                        <div className="avatar-preview">
                            <img src={previewAvatar} alt="Avatar preview" />
                            <p className="avatar-label">Your Avatar</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="create-form">
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                className={`form-input ${error ? 'input-error' : ''}`}
                                value={username}
                                onChange={handleUsernameChange}
                                placeholder="Enter your username"
                                disabled={loading}
                                autoFocus
                            />
                            {error && <p className="error-message">{error}</p>}
                            <p className="form-hint">
                                Choose a unique username (3-20 characters)
                            </p>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg"
                                disabled={loading || !username.trim()}
                            >
                                {loading ? 'Creating...' : 'Create Account'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate('/user/select')}
                                disabled={loading}
                            >
                                Already have an account?
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserCreate;
