import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameAPI, type Game } from '../services/api';
import './History.css';

const History = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [filteredGames, setFilteredGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        if (!user) {
            navigate('/user/select');
            return;
        }
        const userData = JSON.parse(user);
        setCurrentUser(userData);
        loadGames(userData.id);
    }, [navigate]);

    useEffect(() => {
        filterGames();
    }, [games, statusFilter, difficultyFilter]);

    const loadGames = async (userId: number) => {
        try {
            setLoading(true);
            const userGames = await gameAPI.getUserGames(userId);
            setGames(userGames.sort((a, b) => {
                const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
                const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
                return dateB - dateA;
            }));
        } catch (error) {
            console.error('Failed to load games:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterGames = () => {
        let filtered = [...games];

        if (statusFilter !== 'all') {
            filtered = filtered.filter(game => {
                const gameStatus = game.status || (game.score === 0 ? 'abandoned' : 'won');
                if (statusFilter === 'completed') return gameStatus === 'won';
                if (statusFilter === 'abandoned') return gameStatus === 'abandoned';
                if (statusFilter === 'playing') return gameStatus === 'playing';
                return true;
            });
        }

        if (difficultyFilter !== 'all') {
            filtered = filtered.filter(game => game.difficulty === difficultyFilter);
        }

        setFilteredGames(filtered);
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
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Calculate statistics
    const completedGames = games.filter(g => {
        const gameStatus = g.status || (g.score > 0 ? 'won' : 'abandoned');
        return gameStatus === 'won';
    });
    const stats = {
        totalGames: games.length,
        completedGames: completedGames.length,
        bestScore: games.length > 0 ? Math.max(...games.map(g => g.score)) : 0,
        avgScore: completedGames.length > 0
            ? Math.round(completedGames.reduce((sum, g) => sum + g.score, 0) / completedGames.length)
            : 0,
        totalTime: completedGames.reduce((sum, g) => sum + (g.timeElapsed || 0), 0)
    };

    if (loading) {
        return (
            <div className="history-page">
                <div className="loading">Loading game history...</div>
            </div>
        );
    }

    return (
        <div className="history-page">
            {/* Header */}
            <div className="history-header">
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    <span className="back-icon">←</span>
                    Back to Dashboard
                </button>
                <div className="header-content">
                    <h1 className="history-title">Game History</h1>
                    <p className="history-subtitle">
                        {currentUser ? `${currentUser.name}'s game history` : 'View your game history'}
                    </p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="stats-cards">
                <div className="stat-card stat-blue">
                    <div className="stat-number">{stats.totalGames}</div>
                    <div className="stat-label">Total Games</div>
                </div>
                <div className="stat-card stat-green">
                    <div className="stat-number">{stats.completedGames}</div>
                    <div className="stat-label">Completed</div>
                </div>
                <div className="stat-card stat-purple">
                    <div className="stat-number">{stats.bestScore}</div>
                    <div className="stat-label">Best Score</div>
                </div>
                <div className="stat-card stat-yellow">
                    <div className="stat-number">{stats.avgScore}</div>
                    <div className="stat-label">Avg Score</div>
                </div>
                <div className="stat-card stat-orange">
                    <div className="stat-number">{formatTime(stats.totalTime)}</div>
                    <div className="stat-label">Total Time</div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="filters-content">
                    <span className="filters-label">Filter by:</span>

                    <div className="filter-group">
                        <span className="filter-label">Status:</span>
                        <select
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="completed">Completed</option>
                            <option value="playing">In Progress</option>
                            <option value="abandoned">Abandoned</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <span className="filter-label">Difficulty:</span>
                        <select
                            className="filter-select"
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    <span className="games-count">Showing {filteredGames.length} games</span>
                </div>
            </div>

            {/* Games List */}
            {filteredGames.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🏆</div>
                    <h2>No games yet!</h2>
                    <p>Complete some memory games to see your history here.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/game')}
                    >
                        Start Playing
                    </button>
                </div>
            ) : (
                <div className="games-list">
                    {filteredGames.map((game, index) => {
                        const gameStatus = game.status || (game.score === 0 ? 'abandoned' : 'won');
                        const difficulty = game.difficulty || 'easy';

                        const statusLabels = {
                            'won': 'Won',
                            'abandoned': 'Abandoned',
                            'playing': 'In Progress'
                        };

                        return (
                            <div key={game.id} className="game-item">
                                <div className="game-item-header">
                                    <div className="game-item-title">
                                        <span>Player1 - Game #{games.length - index}</span>
                                        <span className={`badge badge-${difficulty}`}>
                                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                        </span>
                                        <span className={`badge badge-${gameStatus}`}>
                                            {statusLabels[gameStatus as keyof typeof statusLabels]}
                                        </span>
                                    </div>
                                    <div className="game-item-date">
                                        {game.completedAt ? formatDate(game.completedAt) : 'N/A'}
                                    </div>
                                </div>
                                <div className="game-item-stats">
                                    <div className="game-stat">
                                        <span className="stat-icon">⭐</span>
                                        <div className="stat-details">
                                            <div className="stat-title">Score</div>
                                            <div className="stat-value">{game.score}</div>
                                        </div>
                                    </div>
                                    <div className="game-stat">
                                        <span className="stat-icon">⏱️</span>
                                        <div className="stat-details">
                                            <div className="stat-title">Time</div>
                                            <div className="stat-value">{formatTime(game.timeElapsed || 0)}</div>
                                        </div>
                                    </div>
                                    <div className="game-stat">
                                        <span className="stat-icon">🎯</span>
                                        <div className="stat-details">
                                            <div className="stat-title">Moves</div>
                                            <div className="stat-value">{game.moves || 0}</div>
                                        </div>
                                    </div>
                                    <div className="game-stat">
                                        <span className="stat-icon">🐾</span>
                                        <div className="stat-details">
                                            <div className="stat-title">Facts</div>
                                            <div className="stat-value">{game.factsCollected || 0}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default History;
