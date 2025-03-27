import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Parser } from 'expr-eval';
import './PatternPredictor.css';

// Components
import PatternDisplay from './PatternDisplay';
import UserInput from './UserInput';
import ScoreBoard from './ScoreBoard';
import LevelSelector from './LevelSelector';
import FeedbackMessage from './FeedbackMessage';

const PatternPredictor = () => {
    // Game state
    const [level, setLevel] = useState('easy');
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [pattern, setPattern] = useState([]);
    const [missingIndex, setMissingIndex] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState({ message: 'Guess the missing number!', type: 'info' });
    const [showHint, setShowHint] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [timerActive, setTimerActive] = useState(false);
    
    // Generate a new pattern based on difficulty level
    const generatePattern = () => {
        let newPattern = [];
        let correctAnswer = 0;
        let formula = '';
        
        switch(level) {
            case 'easy': {
                // Simple arithmetic sequences (e.g., +2, +3)
                const increment = Math.floor(Math.random() * 5) + 1;
                const start = Math.floor(Math.random() * 10);
                newPattern = Array(6).fill(0).map((_, i) => start + (i * increment));
                formula = `n + ${increment}`;
                break;
            }
            case 'medium': {
                // Geometric sequences or quadratic patterns
                if (Math.random() > 0.5) {
                    // Geometric: multiply by a factor
                    const factor = Math.floor(Math.random() * 3) + 2;
                    const start = Math.floor(Math.random() * 5) + 1;
                    newPattern = Array(6).fill(0).map((_, i) => start * Math.pow(factor, i));
                    formula = `n * ${factor}`;
                } else {
                    // Quadratic: n^2 + b
                    const b = Math.floor(Math.random() * 5);
                    newPattern = Array(6).fill(0).map((_, i) => Math.pow(i + 1, 2) + b);
                    formula = `n^2 + ${b}`;
                }
                break;
            }
            case 'hard': {
                // More complex patterns
                if (Math.random() > 0.5) {
                    // Exponential with offset
                    const base = Math.floor(Math.random() * 3) + 2;
                    const offset = Math.floor(Math.random() * 10);
                    newPattern = Array(6).fill(0).map((_, i) => Math.pow(base, i) + offset);
                    formula = `${base}^n + ${offset}`;
                } else {
                    // Complex polynomial
                    const a = Math.floor(Math.random() * 3) + 1;
                    const b = Math.floor(Math.random() * 5);
                    const c = Math.floor(Math.random() * 10);
                    newPattern = Array(6).fill(0).map((_, i) => {
                        const n = i + 1;
                        return a * Math.pow(n, 2) + b * n + c;
                    });
                    formula = `${a}n^2 + ${b}n + ${c}`;
                }
                break;
            }
            default: {
                // Fallback to easy
                newPattern = Array(6).fill(0).map((_, i) => i * 2);
                formula = 'n * 2';
            }
        }
        
        // Choose a random index to hide (not first or last)
        const index = Math.floor(Math.random() * 4) + 1;
        correctAnswer = newPattern[index];
        
        // Create a copy of the pattern with the missing value
        const patternWithMissing = [...newPattern];
        patternWithMissing[index] = '?';
        
        setPattern(patternWithMissing);
        setMissingIndex(index);
        return { pattern: newPattern, correctAnswer, formula };
    };
    
    // Check if the user's answer is correct
    const checkAnswer = () => {
        if (!userAnswer) {
            setFeedback({ message: 'Please enter an answer!', type: 'warning' });
            return;
        }
        
        const { correctAnswer } = currentPattern;
        const userGuess = parseInt(userAnswer);
        
        if (userGuess === correctAnswer) {
            // Correct answer
            const streakBonus = streak >= 3 ? streak : 0;
            const pointsEarned = level === 'easy' ? 5 : level === 'medium' ? 10 : 15;
            const totalPoints = pointsEarned + streakBonus;
            
            setScore(prevScore => prevScore + totalPoints);
            setStreak(prevStreak => prevStreak + 1);
            setFeedback({ 
                message: `Correct! +${totalPoints} points ${streakBonus > 0 ? `(includes streak bonus of +${streakBonus})` : ''}`, 
                type: 'success' 
            });
            
            // Generate a new pattern after a short delay
            setTimeout(() => {
                startNewRound();
            }, 1500);
        } else {
            // Incorrect answer
            setStreak(0);
            setFeedback({ 
                message: `Not quite! The correct answer was ${correctAnswer}. The pattern follows: ${currentPattern.formula}`, 
                type: 'error' 
            });
            
            // Generate a new pattern after a longer delay
            setTimeout(() => {
                startNewRound();
            }, 3000);
        }
        
        setUserAnswer('');
    };
    
    // Start a new round with a fresh pattern
    const startNewRound = () => {
        const newPattern = generatePattern();
        setCurrentPattern(newPattern);
        setUserAnswer('');
        setShowHint(false);
        setFeedback({ message: 'What number comes next?', type: 'info' });
        
        if (timerActive) {
            setTimeLeft(30); // Reset timer
        }
    };
    
    // Initialize or store the current pattern details
    const [currentPattern, setCurrentPattern] = useState(null);
    
    // Initialize the game
    useEffect(() => {
        startNewRound();
    }, [level]);
    
    // Timer logic
    useEffect(() => {
        let timer;
        if (timerActive && timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && timerActive) {
            setFeedback({ 
                message: `Time's up! The correct answer was ${currentPattern.correctAnswer}`, 
                type: 'error' 
            });
            setStreak(0);
            setTimeout(startNewRound, 2000);
        }
        
        return () => clearTimeout(timer);
    }, [timeLeft, timerActive, currentPattern]);
    
    // Toggle hint visibility
    const toggleHint = () => {
        setShowHint(!showHint);
        if (!showHint && streak > 0) {
            // Penalty for using hint
            setStreak(prev => prev - 1);
        }
    };
    
    // Toggle timer mode
    const toggleTimer = () => {
        setTimerActive(!timerActive);
        if (!timerActive) {
            setTimeLeft(30);
        }
    };
    
    return (
        <motion.div 
            className="pattern-predictor-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h1 
                className="game-title"
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                Pattern Predictor
            </motion.h1>
            
            <div className="game-controls">
                <LevelSelector level={level} setLevel={setLevel} />
                <ScoreBoard score={score} streak={streak} />
                {timerActive && (
                    <div className={`timer ${timeLeft < 10 ? 'timer-warning' : ''}`}>
                        Time: {timeLeft}s
                    </div>
                )}
                <button onClick={toggleTimer} className="toggle-button">
                    {timerActive ? 'Disable Timer' : 'Enable Timer'}
                </button>
            </div>
            
            <motion.div 
                className="pattern-area"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
            >
                <PatternDisplay pattern={pattern} missingIndex={missingIndex} />
                
                <UserInput 
                    userAnswer={userAnswer} 
                    setUserAnswer={setUserAnswer} 
                    checkAnswer={checkAnswer} 
                />
                
                <FeedbackMessage feedback={feedback} />
                
                <div className="hint-section">
                    <button onClick={toggleHint} className="hint-button">
                        {showHint ? 'Hide Hint' : 'Show Hint'}
                    </button>
                    {showHint && (
                        <motion.div 
                            className="hint-box"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <p>Look for a pattern like: {currentPattern?.formula}</p>
                            <p className="hint-warning">Note: Using hints breaks your streak!</p>
                        </motion.div>
                    )}
                </div>
            </motion.div>
            
            <div className="instructions">
                <h3>How to Play:</h3>
                <p>Analyze the number sequence and determine what number should replace the question mark.</p>
                <p>Enter your answer and click "Submit" to check if you're right!</p>
                <p>Earn more points with higher difficulty levels and consecutive correct answers.</p>
            </div>
        </motion.div>
    );
};

export default PatternPredictor;