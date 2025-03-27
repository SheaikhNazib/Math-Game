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
                // Original 5
                { id: 1, level: 1, targetFraction: '3/4', pieces: ['1/4', '1/4', '1/4', '2/4', '1/2'] },
                { id: 2, level: 1, targetFraction: '1/2', pieces: ['1/4', '1/8', '1/3', '1/6', '1/4'] },
                { id: 3, level: 1, targetFraction: '2/3', pieces: ['1/3', '1/2', '1/6', '1/3', '1/6'] },
                { id: 4, level: 2, targetFraction: '5/6', pieces: ['1/2', '1/3', '1/6', '1/4', '1/12'] },
                { id: 5, level: 2, targetFraction: '7/8', pieces: ['1/2', '1/4', '1/8', '1/8', '1/4'] },

                // New entries (20 total)
                { id: 6, level: 1, targetFraction: '5/8', pieces: ['1/8', '1/4', '1/2', '1/8', '1/8'] },
                { id: 7, level: 2, targetFraction: '4/5', pieces: ['1/5', '1/5', '2/5', '1/10', '3/10'] },
                { id: 8, level: 1, targetFraction: '1/3', pieces: ['1/6', '1/6', '1/12', '1/12', '1/4'] },
                { id: 9, level: 2, targetFraction: '7/10', pieces: ['1/5', '1/2', '1/10', '1/10', '1/5'] },
                { id: 10, level: 2, targetFraction: '9/10', pieces: ['1/2', '2/5', '1/10', '1/5', '1/5'] },
                { id: 11, level: 1, targetFraction: '3/8', pieces: ['1/8', '1/8', '1/4', '1/16', '1/16'] },
                { id: 12, level: 2, targetFraction: '11/12', pieces: ['1/3', '1/4', '1/2', '1/12', '1/6'] },
                { id: 13, level: 1, targetFraction: '5/12', pieces: ['1/12', '1/6', '1/4', '1/3', '1/12'] },
                { id: 14, level: 2, targetFraction: '8/9', pieces: ['1/3', '1/3', '2/9', '1/9', '1/9'] },
                { id: 15, level: 1, targetFraction: '2/5', pieces: ['1/5', '1/10', '1/10', '1/5', '1/4'] },
                // Add 15 more build challenges following similar patterns...
            ],
            compare: [
                // Original 5
                { id: 1, level: 1, fractions: ['2/3', '3/4'], answer: '3/4' },
                { id: 2, level: 1, fractions: ['1/2', '1/3'], answer: '1/2' },
                { id: 3, level: 1, fractions: ['3/5', '2/3'], answer: '2/3' },
                { id: 4, level: 2, fractions: ['4/7', '5/8'], answer: '5/8' },
                { id: 5, level: 2, fractions: ['5/6', '7/8'], answer: '7/8' },

                // New entries (20 total)
                { id: 6, level: 2, fractions: ['3/8', '5/12'], answer: '5/12' },
                { id: 7, level: 1, fractions: ['4/9', '1/2'], answer: '1/2' },
                { id: 8, level: 2, fractions: ['7/10', '3/4'], answer: '3/4' },
                { id: 9, level: 1, fractions: ['2/5', '3/7'], answer: '3/7' },
                { id: 10, level: 2, fractions: ['5/9', '7/12'], answer: '7/12' },
                { id: 11, level: 1, fractions: ['3/8', '2/5'], answer: '2/5' },
                { id: 12, level: 2, fractions: ['4/5', '5/6'], answer: '5/6' },
                { id: 13, level: 1, fractions: ['5/8', '2/3'], answer: '2/3' },
                { id: 14, level: 2, fractions: ['9/10', '11/12'], answer: '11/12' },
                { id: 15, level: 1, fractions: ['1/4', '3/10'], answer: '3/10' },
                // Add 15 more compare challenges...
            ],
            solve: [
                // Original 5
                { id: 1, level: 1, equation: '1/2 + 1/4 = ?', answer: '3/4' },
                { id: 2, level: 1, equation: '2/3 - 1/3 = ?', answer: '1/3' },
                { id: 3, level: 1, equation: '1/2 + 1/3 = ?', answer: '5/6' },
                { id: 4, level: 2, equation: '3/4 - 1/4 = ?', answer: '1/2' },
                { id: 5, level: 2, equation: '2/5 + 1/5 = ?', answer: '3/5' },

                // New entries (20 total)
                { id: 6, level: 2, equation: '5/8 - 1/4 = ?', answer: '3/8' },
                { id: 7, level: 1, equation: '3/7 + 2/7 = ?', answer: '5/7' },
                { id: 8, level: 2, equation: '7/10 - 3/10 = ?', answer: '2/5' },
                { id: 9, level: 1, equation: '1/6 + 1/3 = ?', answer: '1/2' },
                { id: 10, level: 2, equation: '4/5 - 2/5 = ?', answer: '2/5' },
                { id: 11, level: 1, equation: '2/9 + 5/9 = ?', answer: '7/9' },
                { id: 12, level: 2, equation: '5/6 - 1/3 = ?', answer: '1/2' },
                { id: 13, level: 1, equation: '3/8 + 1/8 = ?', answer: '1/2' },
                { id: 14, level: 2, equation: '9/10 - 3/5 = ?', answer: '3/10' },
                { id: 15, level: 1, equation: '4/5 - 1/10 = ?', answer: '7/10' },
                // Add 15 more solve challenges...
            ],
            daily: [
                // Original 3
                { id: 1, level: 1, type: 'build', targetFraction: '2/3', pieces: ['1/3', '1/3', '1/6', '1/6', '1/2'] },
                { id: 2, level: 1, type: 'compare', fractions: ['3/5', '7/10'], answer: '7/10' },
                { id: 3, level: 1, type: 'solve', equation: '1/3 + 1/6 = ?', answer: '1/2' },

                // New entries (22 total)
                { id: 4, level: 2, type: 'build', targetFraction: '7/9', pieces: ['1/3', '1/3', '1/9', '1/9', '1/9'] },
                { id: 5, level: 2, type: 'compare', fractions: ['4/7', '3/5'], answer: '3/5' },
                { id: 6, level: 1, type: 'solve', equation: '5/8 - 1/8 = ?', answer: '1/2' },
                { id: 7, level: 2, type: 'build', targetFraction: '11/12', pieces: ['1/6', '1/4', '1/3', '1/12', '1/12'] },
                { id: 8, level: 1, type: 'compare', fractions: ['2/5', '3/8'], answer: '2/5' },
                { id: 9, level: 2, type: 'solve', equation: '3/4 + 1/12 = ?', answer: '5/6' },
                // Continue adding daily challenges mixing types...
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