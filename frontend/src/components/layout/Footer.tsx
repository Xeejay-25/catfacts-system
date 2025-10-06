import './Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3 className="footer-title">🐱 CatFacts</h3>
                        <p className="footer-text">
                            Learn interesting facts about cats while having fun!
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul className="footer-links">
                            <li><a href="/">Home</a></li>
                            <li><a href="/play">Play Game</a></li>
                            <li><a href="/leaderboards">Leaderboards</a></li>
                            <li><a href="/user/create">Sign Up</a></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-heading">About</h4>
                        <p className="footer-text">
                            CatFacts is an educational trivia game that teaches you fascinating facts about our feline friends.
                        </p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {currentYear} CatFacts. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
