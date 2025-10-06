import { useNavigate } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div className="welcome-page">
            <div className="welcome-container">
                {/* Title Section */}
                <div className="title-section">
                    <div className="cat-icon-wrapper">
                        <div className="cat-icon">🐱</div>
                    </div>
                    <div className="title-text">
                        <h1 className="main-title">Cat Facts</h1>
                        <h2 className="subtitle">Memory Game</h2>
                    </div>
                </div>

                {/* Description */}
                <p className="description">
                    Match cards, score points, and discover fascinating cat facts! Test your
                    memory skills while learning amazing things about our feline friends.
                </p>

                {/* Main Buttons */}
                <div className="main-buttons">
                    <button
                        className="btn btn-play"
                        onClick={() => navigate('/play')}
                    >
                        <span className="btn-icon">🎮</span>
                        <span className="btn-text">Play</span>
                    </button>
                    <button
                        className="btn btn-leaderboard"
                        onClick={() => navigate('/leaderboards')}
                    >
                        <span className="btn-icon">🏆</span>
                        <span className="btn-text">View Leaderboard</span>
                    </button>
                </div>

                {/* Fun Animation Elements */}
                <div className="emoji-row">
                    <div className="emoji-item" style={{ animationDelay: '0s' }}>🃏</div>
                    <div className="emoji-item" style={{ animationDelay: '0.2s' }}>🎯</div>
                    <div className="emoji-item" style={{ animationDelay: '0.4s' }}>⭐</div>
                    <div className="emoji-item" style={{ animationDelay: '0.6s' }}>🧠</div>
                    <div className="emoji-item" style={{ animationDelay: '0.8s' }}>💫</div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
