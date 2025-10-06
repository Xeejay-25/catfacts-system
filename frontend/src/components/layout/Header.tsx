import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
    currentUser?: {
        id: number;
        username: string;
        avatar: string;
    } | null;
}

const Header = ({ currentUser }: HeaderProps) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear user from localStorage
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    return (
        <header className="header">
            <div className="container">
                <div className="header-content">
                    <Link to="/" className="logo">
                        <span className="logo-icon">🐱</span>
                        <span className="logo-text">CatFacts</span>
                    </Link>

                    <nav className="nav">
                        <Link to="/" className="nav-link">Home</Link>
                        <Link to="/play" className="nav-link">Play</Link>
                        <Link to="/leaderboards" className="nav-link">Leaderboards</Link>
                        {currentUser && (
                            <>
                                <Link to="/history" className="nav-link">History</Link>
                                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            </>
                        )}
                    </nav>

                    <div className="header-actions">
                        {currentUser ? (
                            <div className="user-info">
                                <Link to="/dashboard" className="user-avatar">
                                    <img src={currentUser.avatar} alt={currentUser.username} />
                                </Link>
                                <span className="username">{currentUser.username}</span>
                                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/user/select" className="btn btn-primary btn-sm">
                                    Login
                                </Link>
                                <Link to="/user/create" className="btn btn-secondary btn-sm">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
