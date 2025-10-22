import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameAPI } from '../services/api';
import confetti from 'canvas-confetti';
import './Game.css';

interface Card {
    id: number;
    pairId: number;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const CAT_EMOJIS = ['🐱', '🐈', '😺', '😸', '😻', '🙀', '😿', '😾'];

const CAT_FACTS = [
    "Cats spend 70% of their lives sleeping, which means a 9-year-old cat has been awake for only three years!",
    "A group of cats is called a 'clowder' and a group of kittens is called a 'kindle'.",
    "Cats have over 20 vocalizations, including the purr, meow, chirp, and hiss.",
    "A cat's nose print is unique, much like a human's fingerprint.",
    "Cats can rotate their ears 180 degrees and have 32 muscles in each ear.",
    "The oldest known pet cat existed 9,500 years ago in Cyprus.",
    "Cats can jump up to six times their length in one leap!",
    "A cat's purr vibrates at a frequency that promotes healing in bones and tissues."
];

const Game = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [currentGameId, setCurrentGameId] = useState<number | null>(null);
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matchedPairs, setMatchedPairs] = useState(0);
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(0);
    const [isGameActive, setIsGameActive] = useState(false);
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [unlockedFacts, setUnlockedFacts] = useState<string[]>([]);

    const difficultyConfigs = {
        easy: { pairs: 6, grid: '4x3' },
        medium: { pairs: 8, grid: '4x4' },
        hard: { pairs: 10, grid: '5x4' }
    };

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        if (!user) {
            navigate('/user/select');
            return;
        }
        setCurrentUser(JSON.parse(user));
    }, [navigate]);

    useEffect(() => {
        let interval: number;
        if (isGameActive) {
            interval = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isGameActive]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const triggerConfetti = () => {
        // Confetti burst from center
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Additional confetti bursts for extra celebration
        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });
        }, 250);

        // Final burst
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.6 }
            });
        }, 500);
    };

    const saveGameToBackend = async (finalScore: number, pairs: number, gameStatus: 'won' | 'abandoned') => {
        if (!currentUser || !currentUser.id) {
            console.log('❌ Cannot save game - no current user');
            return;
        }

        console.log('💾 Saving game to backend:', {
            gameId: currentGameId,
            status: gameStatus,
            score: finalScore,
            moves,
            time,
            pairs,
            factsCollected: unlockedFacts.length
        });

        try {
            // If we have an active game, update it; otherwise create a new one
            if (currentGameId) {
                const updatedGame = await gameAPI.updateGame(currentGameId, {
                    score: finalScore,
                    moves,
                    timeElapsed: time,
                    matchedPairs: pairs,
                    factsCollected: unlockedFacts.length,
                    status: gameStatus
                });
                console.log(`✅ Game ${currentGameId} updated with status: ${gameStatus}`, updatedGame);
            } else {
                // Fallback to legacy submit method
                const savedGame = await gameAPI.submitGame(
                    currentUser.id,
                    finalScore,
                    pairs,
                    difficulty,
                    time,
                    moves,
                    unlockedFacts.length,
                    gameStatus
                );
                console.log(`✅ Game saved with status: ${gameStatus}`, savedGame);
            }
        } catch (error) {
            console.error('❌ Failed to save game:', error);
            // Don't show error to user - game completion is more important
        }
    };

    const initializeGame = useCallback(async () => {
        const { pairs } = difficultyConfigs[difficulty];
        const selectedEmojis = CAT_EMOJIS.slice(0, pairs);
        const cardPairs = selectedEmojis.flatMap((emoji, index) => [
            { id: index * 2, pairId: index, emoji, isFlipped: false, isMatched: false },
            { id: index * 2 + 1, pairId: index, emoji, isFlipped: false, isMatched: false }
        ]);

        // Shuffle cards
        const shuffled = cardPairs.sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setFlippedCards([]);
        setMoves(0);
        setMatchedPairs(0);
        setScore(0);
        setTime(0);
        setUnlockedFacts([]);
        setIsGameActive(true);

        // Start game in backend - await this!
        if (currentUser?.id) {
            try {
                console.log('🎮 Starting new game in backend...', { userId: currentUser.id, difficulty, pairs });
                const game = await gameAPI.startGame(currentUser.id, difficulty, pairs);
                setCurrentGameId(game.id);
                console.log('✅ New game started with ID:', game.id, game);
            } catch (error) {
                console.error('❌ Failed to start game in backend:', error);
            }
        }
    }, [difficulty, currentUser]);

    const handleCardClick = (cardId: number) => {
        if (!isGameActive || flippedCards.length >= 2) return;

        const card = cards.find(c => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) return;

        const newFlipped = [...flippedCards, cardId];
        setFlippedCards(newFlipped);

        setCards(cards.map(c =>
            c.id === cardId ? { ...c, isFlipped: true } : c
        ));

        if (newFlipped.length === 2) {
            setMoves(moves + 1);
            const [first, second] = newFlipped;
            const firstCard = cards.find(c => c.id === first);
            const secondCard = cards.find(c => c.id === second);

            if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
                // Match found!
                setTimeout(() => {
                    setCards(cards.map(c =>
                        c.id === first || c.id === second
                            ? { ...c, isMatched: true }
                            : c
                    ));
                    const newMatchedPairs = matchedPairs + 1;
                    setMatchedPairs(newMatchedPairs);
                    setScore(score + 100);

                    // Unlock a new fact
                    const newFact = CAT_FACTS[matchedPairs % CAT_FACTS.length];
                    setUnlockedFacts(prev => [...prev, newFact]);

                    setFlippedCards([]);

                    // Check if game is complete
                    if (newMatchedPairs === difficultyConfigs[difficulty].pairs) {
                        setIsGameActive(false);
                        // Trigger confetti celebration!
                        triggerConfetti();
                        // Save game to backend with 'won' status
                        saveGameToBackend(score + 100, newMatchedPairs, 'won');
                    }
                }, 500);
            } else {
                // No match
                setTimeout(() => {
                    setCards(cards.map(c =>
                        c.id === first || c.id === second
                            ? { ...c, isFlipped: false }
                            : c
                    ));
                    setFlippedCards([]);
                }, 1000);
            }
        }
    };

    const handleStartGame = async () => {
        if (isGameActive) {
            // If game is active, reset it and save as abandoned
            if (currentGameId) {
                console.log('🔄 Resetting game - saving current game as abandoned...');
                await saveGameToBackend(score, matchedPairs, 'abandoned');
            }
            // Reset to initial state (button shows "Start Game")
            setIsGameActive(false);
            setCards([]);
            setFlippedCards([]);
            setMoves(0);
            setMatchedPairs(0);
            setScore(0);
            setTime(0);
            setUnlockedFacts([]);
            setCurrentGameId(null);
        } else {
            // Start a new game
            initializeGame();
        }
    };

    const handleExitGame = async () => {
        // Save game as abandoned if it was active
        if (isGameActive && currentGameId) {
            console.log('🚪 Exiting game - saving as abandoned...');
            console.log('Game data:', {
                gameId: currentGameId,
                score,
                matchedPairs,
                moves,
                time,
                factsCollected: unlockedFacts.length
            });
            await saveGameToBackend(score, matchedPairs, 'abandoned');
        }
        setIsGameActive(false);
        setCards([]);
        setCurrentGameId(null);
    };

    const handleDifficultyChange = async (newDifficulty: 'easy' | 'medium' | 'hard') => {
        // Save current game as abandoned if active
        if (isGameActive && currentGameId) {
            console.log('🔄 Changing difficulty - saving current game as abandoned...');
            await saveGameToBackend(score, matchedPairs, 'abandoned');
        }
        setDifficulty(newDifficulty);
        setIsGameActive(false);
        setCards([]);
        setCurrentGameId(null);
    };

    const totalPairs = difficultyConfigs[difficulty].pairs;

    return (
        <div className="game-page">
            {/* Top Right Navigation */}
            <div className="top-nav">
                <button className="nav-btn nav-btn-secondary" onClick={() => navigate('/dashboard')}>
                    ← Back
                </button>
                <button className="nav-btn nav-btn-gray" onClick={() => navigate('/user/select')}>
                    Switch
                </button>
                <button className="nav-btn nav-btn-blue" onClick={() => navigate('/history')}>
                    History
                </button>
            </div>


            {/* Game Title */}
            <div className="game-title">
                <span className="title-emoji">🐱</span>
                <span className="title-text">
                    <span className="title-cat">Cat Facts</span>
                    <span className="title-memory">Memory</span>
                </span>
                {currentUser && (
                    <span className="player-badge">{currentUser.name}</span>
                )}
            </div>

            <div className="game-layout">
                {/* Left Sidebar */}
                <div className="sidebar">
                    {/* Game Stats */}
                    <div className="card stats-card">
                        <h3 className="card-title">Game Stats</h3>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-label">Score</span>
                                <span className="stat-value">
                                    <span className="stat-icon">🏆</span>
                                    {score}
                                </span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Moves</span>
                                <span className="stat-value">
                                    <span className="stat-icon">🎯</span>
                                    {moves}
                                </span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Pairs</span>
                                <span className="stat-value">
                                    <span className="stat-icon">💕</span>
                                    {matchedPairs}/{totalPairs}
                                </span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-label">Time</span>
                                <span className="stat-value">
                                    <span className="stat-icon">⏱️</span>
                                    {formatTime(time)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="card controls-card">
                        <h3 className="card-title">Controls</h3>
                        <div className="controls-buttons">
                            <button className="control-btn btn-start" onClick={handleStartGame}>
                                {isGameActive ? 'Reset Game' : 'Start Game'}
                            </button>
                            <button className="control-btn btn-exit" onClick={handleExitGame}>
                                Exit Game
                            </button>
                            <select
                                className="difficulty-select"
                                value={difficulty}
                                onChange={(e) => handleDifficultyChange(e.target.value as any)}
                                disabled={isGameActive}
                            >
                                <option value="easy">⭐ Easy ({difficultyConfigs.easy.grid})</option>
                                <option value="medium">⭐⭐ Medium ({difficultyConfigs.medium.grid})</option>
                                <option value="hard">⭐⭐⭐ Hard ({difficultyConfigs.hard.grid})</option>
                            </select>
                        </div>
                    </div>

                    {/* Cat Facts */}
                    <div className="card facts-card">
                        <div className="facts-header">
                            <h3 className="card-title">Cat Facts</h3>
                            <span className="facts-count">{unlockedFacts.length}</span>
                        </div>
                        <div className="facts-content">
                            {unlockedFacts.length === 0 ? (
                                <div className="facts-empty">
                                    <div className="empty-icon">😺</div>
                                    <p>Match cards to unlock fascinating cat facts!</p>
                                </div>
                            ) : (
                                <div className="facts-list">
                                    {unlockedFacts.map((fact, index) => (
                                        <div key={index} className="fact-item">
                                            {fact}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Main Board */}
                <div className="game-board">
                    {cards.length === 0 ? (
                        <div className="board-empty">
                            <div className="empty-message">
                                <span className="empty-emoji">🎮</span>
                                <h2>Ready to Play?</h2>
                                <p>Click "Start Game" to begin matching cat cards!</p>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={`cards-grid cards-grid-${difficulty}`}
                        >
                            {cards.map(card => (
                                <div
                                    key={card.id}
                                    className={`memory-card ${card.isFlipped || card.isMatched ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
                                    onClick={() => handleCardClick(card.id)}
                                >
                                    <div className="card-inner">
                                        <div className="card-front">
                                            <span className="paw-icon">🐾</span>
                                        </div>
                                        <div className="card-back">
                                            <span className="card-emoji">{card.emoji}</span>
                                        </div>
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

export default Game;
