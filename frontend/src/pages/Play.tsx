import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Play.css';

const Play = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    const handleStartGame = (difficulty: 'easy' | 'medium' | 'hard') => {
        if (!currentUser) {
            navigate('/user/select');
            return;
        }
        navigate(`/game?difficulty=${difficulty}`);
    };

    return (
        <div className="play-page">
            <div className="container">
                <h1 className="page-title">Play CatFacts Trivia</h1>
                <p className="page-subtitle">
                    Choose your difficulty level and test your cat knowledge!
                </p>

                {!currentUser && (
                    <div className="auth-notice">
                        <p>Please log in or create an account to play</p>
                        <div className="auth-buttons">
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/user/select')}
                            >
                                Login
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate('/user/create')}
                            >
                                Create Account
                            </button>
                        </div>
                    </div>
                )}

                <div className="difficulty-grid">
                    <div className="difficulty-card easy">
                        <div className="difficulty-icon">😺</div>
                        <h2 className="difficulty-title">Easy</h2>
                        <p className="difficulty-description">
                            Perfect for beginners! Basic cat facts and simple questions.
                        </p>
                        <ul className="difficulty-features">
                            <li>10 questions</li>
                            <li>30 seconds per question</li>
                            <li>Great for learning</li>
                        </ul>
                        <button
                            className="btn btn-success btn-lg"
                            onClick={() => handleStartGame('easy')}
                        >
                            Start Easy Game
                        </button>
                    </div>

                    <div className="difficulty-card medium">
                        <div className="difficulty-icon">😸</div>
                        <h2 className="difficulty-title">Medium</h2>
                        <p className="difficulty-description">
                            Challenge yourself! Moderate difficulty with interesting facts.
                        </p>
                        <ul className="difficulty-features">
                            <li>15 questions</li>
                            <li>25 seconds per question</li>
                            <li>Balanced challenge</li>
                        </ul>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => handleStartGame('medium')}
                        >
                            Start Medium Game
                        </button>
                    </div>

                    <div className="difficulty-card hard">
                        <div className="difficulty-icon">😼</div>
                        <h2 className="difficulty-title">Hard</h2>
                        <p className="difficulty-description">
                            For cat experts! Tough questions and obscure cat trivia.
                        </p>
                        <ul className="difficulty-features">
                            <li>20 questions</li>
                            <li>20 seconds per question</li>
                            <li>Expert level</li>
                        </ul>
                        <button
                            className="btn btn-danger btn-lg"
                            onClick={() => handleStartGame('hard')}
                        >
                            Start Hard Game
                        </button>
                    </div>
                </div>

                <div className="game-info">
                    <h2>How to Play</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <div className="info-number">1</div>
                            <div className="info-content">
                                <h3>Choose Difficulty</h3>
                                <p>Select Easy, Medium, or Hard based on your skill level</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-number">2</div>
                            <div className="info-content">
                                <h3>Answer Questions</h3>
                                <p>Read each question carefully and select the correct answer</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-number">3</div>
                            <div className="info-content">
                                <h3>Learn Facts</h3>
                                <p>Discover interesting cat facts after each question</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-number">4</div>
                            <div className="info-content">
                                <h3>Track Progress</h3>
                                <p>View your score and compete on the leaderboards</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Play;
