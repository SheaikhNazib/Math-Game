import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './FractionFactory.css';
import FractionChallenge from './FractionChallenge';
import FractionBuilder from './FractionBuilder';
import FractionComparison from './FractionCompare';
import EquationSolver from './EquationSolver';
import ScoreBoard from './ScoreBoard';

const FractionFactory = () => {
    const [gameMode, setGameMode] = useState('welcome'); // welcome, match, build, compare, solve
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [challenges, setChallenges] = useState([]);
    const [currentChallenge, setCurrentChallenge] = useState(null);

    // Load challenges from JSON file or API
    useEffect(() => {
        // Mock data for now - would be replaced with actual data fetch
        const mockChallenges = {
            build: [
                { id: 1, level: 1, targetFraction: '3/4', pieces: ['1/4', '1/4', '1/4', '1/4', '1/2'] },
                { id: 2, level: 1, targetFraction: '1/2', pieces: ['1/4', '1/4', '1/3', '1/6', '1/8'] },
                { id: 3, level: 1, targetFraction: '2/3', pieces: ['1/3', '1/3', '1/6', '1/6', '1/2'] },
                { id: 4, level: 2, targetFraction: '5/6', pieces: ['1/2', '1/3', '1/6', '1/4', '1/12'] },
                { id: 5, level: 2, targetFraction: '7/8', pieces: ['1/2', '1/4', '1/8', '1/8', '1/4'] }
            ],
            compare: [
                { id: 1, level: 1, fractions: ['2/3', '3/4'], answer: '3/4' },
                { id: 2, level: 1, fractions: ['1/2', '1/3'], answer: '1/2' },
                { id: 3, level: 1, fractions: ['3/5', '2/3'], answer: '2/3' },
                { id: 4, level: 2, fractions: ['4/7', '5/8'], answer: '5/8' },
                { id: 5, level: 2, fractions: ['5/6', '7/8'], answer: '7/8' }
            ],
            solve: [
                { id: 1, level: 1, equation: '1/2 + 1/4 = ?', answer: '3/4' },
                { id: 2, level: 1, equation: '2/3 - 1/3 = ?', answer: '1/3' },
                { id: 3, level: 1, equation: '1/2 + 1/3 = ?', answer: '5/6' },
                { id: 4, level: 2, equation: '3/4 - 1/4 = ?', answer: '1/2' },
                { id: 5, level: 2, equation: '2/5 + 1/5 = ?', answer: '3/5' }
            ],
            // Update daily challenges to not include 'match' type
            daily: [
                // Removed match challenge
                { id: 1, level: 1, type: 'build', targetFraction: '2/3', pieces: ['1/3', '1/3', '1/6', '1/6', '1/2'] },
                { id: 2, level: 1, type: 'compare', fractions: ['3/5', '7/10'], answer: '7/10' },
                { id: 3, level: 1, type: 'solve', equation: '1/3 + 1/6 = ?', answer: '1/2' }
            ]
        };
        
        setChallenges(mockChallenges);
    }, []);

    // Handle correct answer
    const handleCorrectAnswer = () => {
        setScore(score + (10 * level) + (streak * 2));
        setStreak(streak + 1);
        
        // Advance to next level after every 5 correct answers
        if (streak > 0 && streak % 5 === 0) {
            setLevel(prevLevel => prevLevel + 1);
        }
        
        // Get next challenge
        getNextChallenge();
    };

    // Handle incorrect answer
    const handleIncorrectAnswer = () => {
        setStreak(0);
        // Maybe decrease score slightly?
    };

    // Get next challenge based on current mode and level
    const getNextChallenge = () => {
        if (gameMode !== 'welcome' && challenges[gameMode]) {
            // For regular modes, filter challenges by level
            const levelChallenges = challenges[gameMode].filter(c => c.level <= level);
            
            if (levelChallenges.length > 0) {
                const randomIndex = Math.floor(Math.random() * levelChallenges.length);
                setCurrentChallenge(levelChallenges[randomIndex]);
            } else {
                console.log('No challenges found for the current level');
                // Fallback to any challenge in that mode if no level-appropriate ones are found
                if (challenges[gameMode].length > 0) {
                    const randomIndex = Math.floor(Math.random() * challenges[gameMode].length);
                    setCurrentChallenge(challenges[gameMode][randomIndex]);
                }
            }
        }
    };

    // Start game in specific mode
    const startGame = (mode) => {
        setGameMode(mode);
        setScore(0);
        setStreak(0);
        setLevel(1);
        setCurrentChallenge(null); // Reset current challenge first
        
        // Get first challenge after a short delay (to ensure state updates)
        setTimeout(() => {
            if (challenges[mode] && challenges[mode].length > 0) {
                const levelChallenges = challenges[mode].filter(c => c.level === 1);
                const randomIndex = Math.floor(Math.random() * 
                    (levelChallenges.length > 0 ? levelChallenges.length : challenges[mode].length));
                
                setCurrentChallenge(levelChallenges.length > 0 
                    ? levelChallenges[randomIndex] 
                    : challenges[mode][randomIndex]);
            } else {
                console.error('No challenges available for mode:', mode);
            }
        }, 100);
    };

    return (
        <div className="fraction-factory">
            <header className="factory-header">
                <motion.h1 
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="factory-title"
                >
                    Fraction Factory
                </motion.h1>
                
                {gameMode !== 'welcome' && (
                    <div className="game-stats">
                        <div className="level">Level: {level}</div>
                        <div className="score">Score: {score}</div>
                        <div className="streak">Streak: {streak}</div>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="home-button"
                            onClick={() => setGameMode('welcome')}
                        >
                            Home
                        </motion.button>
                    </div>
                )}
            </header>

            <main className="factory-main">
                {gameMode === 'welcome' ? (
                    <div className="welcome-screen">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="welcome-content"
                        >
                            <h2>Welcome to Fraction Factory!</h2>
                            <p>Choose a game mode to start learning about fractions:</p>
                            
                            <div className="game-modes">
                                <motion.div 
                                    whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="game-mode-card"
                                    onClick={() => startGame('build')}
                                >
                                    <h3>Fraction Builder</h3>
                                    <p>Build fractions using interactive pieces</p>
                                </motion.div>
                                
                                <motion.div 
                                    whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="game-mode-card"
                                    onClick={() => startGame('compare')}
                                >
                                    <h3>Fraction Comparison</h3>
                                    <p>Determine which fraction is larger or smaller</p>
                                </motion.div>
                                
                                <motion.div 
                                    whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0,0,0,0.1)" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="game-mode-card"
                                    onClick={() => startGame('solve')}
                                >
                                    <h3>Equation Solver</h3>
                                    <p>Solve interactive fraction equations</p>
                                </motion.div>
                            </div>
                            
                            <div className="daily-challenge">
                                <h3>Daily Challenge</h3>
                                <p>Complete today's special fraction puzzle!</p>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="daily-btn"
                                    onClick={() => startGame('daily')}
                                >
                                    Start Daily Challenge
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <div className="game-container">
                        {gameMode === 'build' && currentChallenge && (
                            <FractionBuilder 
                                challenge={currentChallenge}
                                onCorrect={handleCorrectAnswer}
                                onIncorrect={handleIncorrectAnswer}
                            />
                        )}
                        
                        {gameMode === 'compare' && currentChallenge && (
                            <FractionComparison 
                                challenge={currentChallenge}
                                onCorrect={handleCorrectAnswer}
                                onIncorrect={handleIncorrectAnswer}
                            />
                        )}
                        
                        {gameMode === 'solve' && currentChallenge && (
                            <EquationSolver 
                                challenge={currentChallenge}
                                onCorrect={handleCorrectAnswer}
                                onIncorrect={handleIncorrectAnswer}
                            />
                        )}
                        
                        {gameMode === 'daily' && currentChallenge && (
                            <>
                                {currentChallenge.type === 'build' && (
                                    <FractionBuilder 
                                        challenge={currentChallenge}
                                        onCorrect={handleCorrectAnswer}
                                        onIncorrect={handleIncorrectAnswer}
                                    />
                                )}
                                {currentChallenge.type === 'compare' && (
                                    <FractionComparison 
                                        challenge={currentChallenge}
                                        onCorrect={handleCorrectAnswer}
                                        onIncorrect={handleIncorrectAnswer}
                                    />
                                )}
                                {currentChallenge.type === 'solve' && (
                                    <EquationSolver 
                                        challenge={currentChallenge}
                                        onCorrect={handleCorrectAnswer}
                                        onIncorrect={handleIncorrectAnswer}
                                    />
                                )}
                            </>
                        )}
                        
                        {!currentChallenge && (
                            <div className="no-challenge-message">
                                <h3>No challenges available for this mode yet</h3>
                                <p>Please try another game mode or check back later!</p>
                                <p className="text-sm text-gray-500">
                                    (Debug info: Mode: {gameMode}, Available challenges: {challenges[gameMode]?.length || 0})
                                </p>
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="home-button mt-4"
                                    onClick={() => setGameMode('welcome')}
                                >
                                    Back to Home
                                </motion.button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {gameMode !== 'welcome' && (
                <ScoreBoard 
                    score={score}
                    level={level}
                    streak={streak}
                />
            )}

            <footer className="factory-footer">
                <p>© {new Date().getFullYear()} Tutors Plan - Learning Math Through Play</p>
            </footer>
        </div>
    );
};

export default FractionFactory;