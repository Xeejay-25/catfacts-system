import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gameAPI, type Question } from '../services/api';
import './Game.css';

const Game = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [score, setScore] = useState(0);
    const [showFact, setShowFact] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [gameComplete, setGameComplete] = useState(false);
    const [loading, setLoading] = useState(true);

    const difficulty = searchParams.get('difficulty') || 'medium';

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        if (!user) {
            navigate('/user/select');
            return;
        }
        setCurrentUser(JSON.parse(user));
        loadQuestions();
    }, [navigate]);

    const loadQuestions = async () => {
        try {
            setLoading(true);
            const count = difficulty === 'easy' ? 10 : difficulty === 'hard' ? 20 : 15;
            const questionsData = await gameAPI.getQuestions(count);
            setQuestions(questionsData);
        } catch (error) {
            console.error('Failed to load questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerSelect = (answer: string) => {
        if (showFact) return;
        setSelectedAnswer(answer);
    };

    const handleSubmitAnswer = () => {
        if (!selectedAnswer) return;

        const currentQuestion = questions[currentQuestionIndex];
        const correct = selectedAnswer === currentQuestion.correctAnswer;
        setIsCorrect(correct);
        if (correct) {
            setScore(score + 1);
        }
        setShowFact(true);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer('');
            setShowFact(false);
            setIsCorrect(false);
        } else {
            finishGame();
        }
    };

    const finishGame = async () => {
        if (currentUser) {
            try {
                await gameAPI.submitGame(currentUser.id, score, questions.length);
            } catch (error) {
                console.error('Failed to submit game:', error);
            }
        }
        setGameComplete(true);
    };

    if (loading) {
        return (
            <div className="game-page">
                <div className="container">
                    <div className="loading">Loading questions...</div>
                </div>
            </div>
        );
    }

    if (gameComplete) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="game-page">
                <div className="container">
                    <div className="game-complete">
                        <div className="complete-icon">
                            {percentage >= 80 ? '🌟' : percentage >= 60 ? '👍' : percentage >= 40 ? '📚' : '💪'}
                        </div>
                        <h1 className="complete-title">Game Complete!</h1>
                        <div className="complete-score">
                            <div className="score-big">{score}</div>
                            <div className="score-total">/ {questions.length}</div>
                        </div>
                        <div className="complete-percentage">{percentage}% Correct</div>
                        <p className="complete-message">
                            {percentage >= 80 && 'Excellent work! You\'re a cat facts expert! 🎉'}
                            {percentage >= 60 && percentage < 80 && 'Great job! Keep learning more about cats! 👏'}
                            {percentage >= 40 && percentage < 60 && 'Good effort! Practice makes perfect! 📖'}
                            {percentage < 40 && 'Keep trying! You\'ll improve with practice! 💪'}
                        </p>
                        <div className="complete-actions">
                            <button className="btn btn-primary btn-lg" onClick={() => window.location.reload()}>
                                Play Again
                            </button>
                            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/history')}>
                                View History
                            </button>
                            <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>
                                Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;

    return (
        <div className="game-page">
            <div className="container">
                <div className="game-header">
                    <div className="game-progress">
                        <div className="progress-text">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                            />
                        </div>
                    </div>
                    <div className="game-score-display">
                        Score: {score}/{questions.length}
                    </div>
                </div>

                <div className="question-card">
                    <h2 className="question-text">{currentQuestion.question}</h2>

                    <div className="answers-grid">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                className={`answer-option ${selectedAnswer === option ? 'selected' : ''
                                    } ${showFact && option === currentQuestion.correctAnswer ? 'correct' : ''
                                    } ${showFact && selectedAnswer === option && option !== currentQuestion.correctAnswer ? 'incorrect' : ''
                                    }`}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={showFact}
                            >
                                {option}
                            </button>
                        ))}
                    </div>

                    {!showFact ? (
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={handleSubmitAnswer}
                            disabled={!selectedAnswer}
                        >
                            Submit Answer
                        </button>
                    ) : (
                        <div className="fact-section">
                            <div className={`result-banner ${isCorrect ? 'correct' : 'incorrect'}`}>
                                {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                            </div>
                            <div className="fact-box">
                                <h3 className="fact-title">🐱 Cat Fact</h3>
                                <p className="fact-text">{currentQuestion.fact}</p>
                            </div>
                            <button className="btn btn-primary btn-lg" onClick={handleNextQuestion}>
                                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Game'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Game;
