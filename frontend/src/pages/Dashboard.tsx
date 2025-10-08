import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [games, setGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        if (!user) {
            navigate('/user/select');
            return;
        }
        const userData = JSON.parse(user);
        setCurrentUser(userData);
        loadUserData(userData.id);
    }, [navigate]);

    const loadUserData = async (userId: number) => {
        try {
            setLoading(true);
            const userGames = await gameAPI.getUserGames(userId);
            setGames(userGames);
        } catch (error) {
            console.error('Failed to load user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTotalScore = () => games.reduce((sum, g) => sum + g.score, 0);
    const getAverageScore = () => games.length > 0 ? (getTotalScore() / games.length).toFixed(1) : '0.0';
    const getBestScore = () => games.length > 0 ? Math.max(...games.map(g => g.score)) : 0;

    if (loading || !currentUser) {
        return (
            <div className="dashboard-page">
                <div className="container">
                    <div className="loading">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                <button
                    className="btn btn-secondary back-button"
                    onClick={() => navigate('/')}
                    style={{ marginBottom: '1.5rem' }}
                >
                    ← Back to Home
                </button>
                <div className="dashboard-header">
                    <div className="user-profile">
                        <img src={currentUser.avatar} alt={currentUser.username} className="profile-avatar" />
                        <div className="profile-info">
                            <h1 className="profile-name">{currentUser.username}</h1>
                            <p className="profile-joined">
                                Member since {new Date(currentUser.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button className="action-card" onClick={() => navigate('/game')}>
                            <div className="action-icon">🎮</div>
                            <div className="action-label">Play Game</div>
                        </button>
                        <button className="action-card" onClick={() => navigate('/history')}>
                            <div className="action-icon">📜</div>
                            <div className="action-label">View History</div>
                        </button>
                        <button className="action-card" onClick={() => navigate('/leaderboards')}>
                            <div className="action-icon">🏆</div>
                            <div className="action-label">Leaderboards</div>
                        </button>
                        <button className="action-card" onClick={() => navigate('/user/select')}>
                            <div className="action-icon">🔄</div>
                            <div className="action-label">Switch User</div>
                        </button>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">🎮</div>
                        <div className="stat-value">{games.length}</div>
                        <div className="stat-label">Games Played</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-value">{getTotalScore()}</div>
                        <div className="stat-label">Total Score</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-value">{getAverageScore()}</div>
                        <div className="stat-label">Average Score</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🏆</div>
                        <div className="stat-value">{getBestScore()}</div>
                        <div className="stat-label">Best Score</div>
                    </div>
                </div>

                <div className="recent-games">
                    <h2 className="section-title">Recent Games</h2>
                    {games.length === 0 ? (
                        <div className="empty-message">
                            <p>No games played yet. Start playing to see your stats!</p>
                            <button className="btn btn-primary" onClick={() => navigate('/play')}>
                                Play Now
                            </button>
                        </div>
                    ) : (
                        <div className="games-mini-list">
                            {games.slice(0, 5).map((game) => (
                                <div key={game.id} className="game-mini-card">
                                    <div className="game-mini-score">
                                        {game.score}/{game.totalQuestions}
                                    </div>
                                    <div className="game-mini-info">
                                        <span className="game-mini-date">
                                            {new Date(game.completedAt).toLocaleDateString()}
                                        </span>
                                        <span className="game-mini-percentage">
                                            {Math.round((game.score / game.totalQuestions) * 100)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
