import { useNavigate } from 'react-router-dom';
import './Play.css';

const Play = () => {
    const navigate = useNavigate();

    return (
        <div className="play-page">
            <div className="container">
                <button
                    className="btn btn-secondary back-button"
                    onClick={() => navigate('/')}
                    style={{ marginBottom: '1.5rem' }}
                >
                    ← Back to Home
                </button>
                <h1 className="page-title">Ready to Play?</h1>
                <p className="page-subtitle">
                    Choose how you want to start your memory game adventure!
                </p>

                <div className="play-options-grid">
                    <div className="play-option-card">
                        <div className="play-icon">👤</div>
                        <h2 className="play-option-title">Select Player</h2>
                        <p className="play-option-description">
                            Choose from existing players
                        </p>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={() => navigate('/user/select')}
                        >
                            Select Player
                        </button>
                    </div>

                    <div className="play-option-card">
                        <div className="play-icon">✨</div>
                        <h2 className="play-option-title">Create Player</h2>
                        <p className="play-option-description">
                            Start fresh with a new profile
                        </p>
                        <button
                            className="btn btn-success btn-lg"
                            onClick={() => navigate('/user/create')}
                        >
                            Create Player
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Play;
