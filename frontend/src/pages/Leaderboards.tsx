import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaderboardAPI } from '../services/api';
import './Leaderboards.css';

interface TopGameEntry {
    id: number;
    username: string;
    avatar: string;
    score: number;
    moves: number;
    time_elapsed: number;
    difficulty: string;
    completed_at: string;
}

interface TopPlayerEntry {
    userId: number;
    username: string;
    avatar: string;
    gamesCompleted: number;
    bestScore: number;
    averageScore: number;
    averageTime: number;
}

const Leaderboards = () => {
    const [topGames, setTopGames] = useState<TopGameEntry[]>([]);
    const [topPlayers, setTopPlayers] = useState<TopPlayerEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const navigate = useNavigate();

    useEffect(() => {
        loadLeaderboards();
    }, [selectedDifficulty]);

    const loadLeaderboards = async () => {
        try {
            setLoading(true);
            
            // Load top games by difficulty
            const gamesData = await leaderboardAPI.getTopGames(selectedDifficulty);
            setTopGames(gamesData);

            // Load top players
            const playersData = await leaderboardAPI.getTopPlayers();
            setTopPlayers(playersData);
        } catch (error) {
            console.error('Failed to load leaderboards:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRankIcon = (index: number) => {
        if (index === 0) return '👑';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `#${index + 1}`;
    };

    const difficultyColors: { [key: string]: string } = {
        easy: 'badge-easy',
        medium: 'badge-medium',
        hard: 'badge-hard'
    };

    if (loading) {
        return (
            <div className="leaderboards-page">
                <div className="loading">Loading leaderboards...</div>
            </div>
        );
    }

    return (
        <div className="leaderboards-page">
            {/* Header */}
            <div className="leaderboards-header">
                <button className="back-button" onClick={() => navigate('/game')}>
                    <span className="back-icon">←</span>
                    Back to Game
                </button>
                <div className="header-content">
                    <h1 className="leaderboards-title">🏆 Leaderboard</h1>
                    <p className="leaderboards-subtitle">Top scores and player rankings</p>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="leaderboards-grid">
                {/* Left Column - Top Game Scores */}
                <div className="leaderboard-section">
                    <div className="section-header">
                        <div className="section-icon">🏆</div>
                        <div className="section-title">
                            <h2>Top Game Scores</h2>
                            <p>Best individual game performances</p>
                        </div>
                    </div>

                    {/* Difficulty Filter */}
                    <div className="difficulty-filters">
                        <button
                            className={`filter-btn ${selectedDifficulty === 'easy' ? 'active' : ''}`}
                            onClick={() => setSelectedDifficulty('easy')}
                        >
                            Easy
                        </button>
                        <button
                            className={`filter-btn ${selectedDifficulty === 'medium' ? 'active' : ''}`}
                            onClick={() => setSelectedDifficulty('medium')}
                        >
                            Medium
                        </button>
                        <button
                            className={`filter-btn ${selectedDifficulty === 'hard' ? 'active' : ''}`}
                            onClick={() => setSelectedDifficulty('hard')}
                        >
                            Hard
                        </button>
                    </div>

                    {/* Games List */}
                    <div className="leaderboard-content">
                        {topGames.length === 0 ? (
                            <div className="empty-message">
                                <p>No completed games yet!</p>
                            </div>
                        ) : (
                            <div className="games-list">
                                {topGames.map((game, index) => (
                                    <div
                                        key={game.username + index}
                                        className={`game-entry ${index < 3 ? 'top-rank' : ''}`}
                                    >
                                        <div className="entry-left">
                                            <span className="rank-icon">{getRankIcon(index)}</span>
                                            <div className="player-details">
                                                <div className="player-name">{game.username}</div>
                                                <div className="game-date">
                                                    {formatDate(new Date().toISOString())}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="entry-right">
                                            <span className={`difficulty-badge ${difficultyColors[selectedDifficulty]}`}>
                                                {selectedDifficulty}
                                            </span>
                                            <div className="score-info">
                                                <div className="score-value">{game.score.toLocaleString()}</div>
                                                <div className="score-details">
                                                    {formatTime(game.time_elapsed || 0)} • {game.moves} moves
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Top Players */}
                <div className="leaderboard-section">
                    <div className="section-header">
                        <div className="section-icon">⭐</div>
                        <div className="section-title">
                            <h2>Top Players</h2>
                            <p>Best overall player statistics</p>
                        </div>
                    </div>

                    {/* Players List */}
                    <div className="leaderboard-content">
                        {topPlayers.length === 0 ? (
                            <div className="empty-message">
                                <p>No players yet!</p>
                            </div>
                        ) : (
                            <div className="players-list">
                                {topPlayers.map((player, index) => (
                                    <div
                                        key={player.userId}
                                        className={`player-entry ${index < 3 ? 'top-rank' : ''}`}
                                    >
                                        <div className="player-header">
                                            <div className="player-left">
                                                <span className="rank-icon">{getRankIcon(index)}</span>
                                                <div className="player-name-large">{player.username}</div>
                                            </div>
                                            <div className="player-right">
                                                <div className="best-score">{player.bestScore.toLocaleString()}</div>
                                                <div className="best-score-label">Best Score</div>
                                            </div>
                                        </div>
                                        <div className="player-stats">
                                            <div className="stat-item">
                                                <div className="stat-icon-small">🎯</div>
                                                <div className="stat-value-small">{player.gamesCompleted}</div>
                                                <div className="stat-label-small">Completed</div>
                                            </div>
                                            <div className="stat-item">
                                                <div className="stat-icon-small">⭐</div>
                                                <div className="stat-value-small">
                                                    {Math.round(player.averageScore).toLocaleString()}
                                                </div>
                                                <div className="stat-label-small">Avg Score</div>
                                            </div>
                                            <div className="stat-item">
                                                <div className="stat-icon-small">⏱️</div>
                                                <div className="stat-value-small">{formatTime(Math.round(player.averageTime || 0))}</div>
                                                <div className="stat-label-small">Avg Time</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboards;
