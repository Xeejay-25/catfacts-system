import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameAPI, type Game } from '../services/api';
import './History.css';

const History = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        if (!user) {
            navigate('/user/select');
            return;
        }
        loadGames(JSON.parse(user).id);
    }, [navigate]);

    const loadGames = async (userId: number) => {
        try {
            setLoading(true);
            const userGames = await gameAPI.getUserGames(userId);
            setGames(userGames.sort((a, b) =>
                new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
            ));
        } catch (error) {
            console.error('Failed to load games:', error);
        } finally {
            setLoading(false);
        }
    };

    const getScorePercentage = (score: number, total: number) => {
        return Math.round((score / total) * 100);
    };

    const getScoreClass = (percentage: number) => {
        if (percentage >= 80) return 'excellent';
        if (percentage >= 60) return 'good';
        if (percentage >= 40) return 'fair';
        return 'poor';
    };

    if (loading) {
        return (
            <div className="history-page">
                <div className="container">
                    <div className="loading">Loading game history...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="history-page">
            <div className="container">
                <h1 className="page-title">Game History</h1>
                <p className="page-subtitle">
                    View your past games and track your progress
                </p>

                {games.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">🎮</div>
                        <h2>No Games Played Yet</h2>
                        <p>Start playing to see your game history here!</p>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => navigate('/play')}
                        >
                            Play Now
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="stats-summary">
                            <div className="summary-card">
                                <div className="summary-value">{games.length}</div>
                                <div className="summary-label">Total Games</div>
                            </div>
                            <div className="summary-card">
                                <div className="summary-value">
                                    {games.reduce((sum, g) => sum + g.score, 0)}
                                </div>
                                <div className="summary-label">Total Score</div>
                            </div>
                            <div className="summary-card">
                                <div className="summary-value">
                                    {(games.reduce((sum, g) => sum + g.score, 0) / games.length).toFixed(1)}
                                </div>
                                <div className="summary-label">Average Score</div>
                            </div>
                            <div className="summary-card">
                                <div className="summary-value">
                                    {Math.max(...games.map(g => g.score))}
                                </div>
                                <div className="summary-label">Best Score</div>
                            </div>
                        </div>

                        <div className="games-list">
                            {games.map((game) => {
                                const percentage = getScorePercentage(game.score, game.totalQuestions);
                                const scoreClass = getScoreClass(percentage);

                                return (
                                    <div key={game.id} className={`game-card ${scoreClass}`}>
                                        <div className="game-score">
                                            <div className="score-circle">
                                                <div className="score-value">{game.score}</div>
                                                <div className="score-total">/ {game.totalQuestions}</div>
                                            </div>
                                            <div className="score-percentage">{percentage}%</div>
                                        </div>
                                        <div className="game-details">
                                            <div className="game-info">
                                                <span className="game-label">Date:</span>
                                                <span className="game-value">
                                                    {new Date(game.completedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="game-info">
                                                <span className="game-label">Time:</span>
                                                <span className="game-value">
                                                    {new Date(game.completedAt).toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <div className="game-info">
                                                <span className="game-label">Questions:</span>
                                                <span className="game-value">{game.totalQuestions}</span>
                                            </div>
                                        </div>
                                        <div className="game-badge">
                                            {percentage >= 80 && '🌟 Excellent'}
                                            {percentage >= 60 && percentage < 80 && '👍 Good Job'}
                                            {percentage >= 40 && percentage < 60 && '📚 Keep Learning'}
                                            {percentage < 40 && '💪 Try Again'}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default History;
