import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaderboardAPI, type LeaderboardEntry } from '../services/api';
import './Leaderboards.css';

const Leaderboards = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            const data = await leaderboardAPI.getLeaderboard();
            setLeaderboard(data);
        } catch (error) {
            console.error('Failed to load leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMedalEmoji = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return `#${rank}`;
    };

    if (loading) {
        return (
            <div className="leaderboards-page">
                <div className="container">
                    <div className="loading">Loading leaderboards...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="leaderboards-page">
            <div className="container">
                <button
                    className="btn btn-secondary back-button"
                    onClick={() => navigate('/')}
                    style={{ marginBottom: '1.5rem' }}
                >
                    ← Back to Home
                </button>
                <h1 className="page-title">🏆 Leaderboards</h1>
                <p className="page-subtitle">
                    Top cat facts experts from around the world
                </p>

                {leaderboard.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🏆</div>
                        <h2>No Rankings Yet</h2>
                        <p>Be the first to compete and claim the top spot!</p>
                    </div>
                ) : (
                    <div className="leaderboard-table">
                        <div className="table-header">
                            <div className="th rank-col">Rank</div>
                            <div className="th player-col">Player</div>
                            <div className="th games-col">Games</div>
                            <div className="th score-col">Total Score</div>
                            <div className="th avg-col">Avg Score</div>
                        </div>
                        <div className="table-body">
                            {leaderboard.map((entry) => (
                                <div
                                    key={entry.username}
                                    className={`table-row ${entry.rank <= 3 ? 'top-three' : ''}`}
                                >
                                    <div className="td rank-col">
                                        <span className="rank-badge">{getMedalEmoji(entry.rank)}</span>
                                    </div>
                                    <div className="td player-col">
                                        <div className="player-info">
                                            <img
                                                src={entry.avatar}
                                                alt={entry.username}
                                                className="player-avatar"
                                            />
                                            <span className="player-name">{entry.username}</span>
                                        </div>
                                    </div>
                                    <div className="td games-col">{entry.totalGames}</div>
                                    <div className="td score-col">{entry.totalScore}</div>
                                    <div className="td avg-col">{entry.averageScore.toFixed(1)}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="stats-cards">
                    <div className="stat-card">
                        <div className="stat-icon">🎮</div>
                        <div className="stat-value">{leaderboard.reduce((sum, e) => sum + e.totalGames, 0)}</div>
                        <div className="stat-label">Total Games Played</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-value">{leaderboard.length}</div>
                        <div className="stat-label">Active Players</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-value">
                            {leaderboard.length > 0
                                ? (leaderboard.reduce((sum, e) => sum + e.averageScore, 0) / leaderboard.length).toFixed(1)
                                : '0.0'}
                        </div>
                        <div className="stat-label">Average Score</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboards;
