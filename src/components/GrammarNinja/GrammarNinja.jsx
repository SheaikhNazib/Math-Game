import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './GrammarNinja.css';
import { sentences } from './sentences';
import NinjaCharacter from './NinjaCharacter';
import GameOver from './GameOver';
import DifficultySelector from './DifficultySelector';
import ScoreBoard from './ScoreBoard';
import Timer from './Timer';

const GrammarNinja = () => {
    const [gameState, setGameState] = useState('start'); // start, playing, gameOver
    const [difficulty, setDifficulty] = useState('easy');
    const [currentSentence, setCurrentSentence] = useState(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [streak, setStreak] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [selectedError, setSelectedError] = useState(null);
    const [showCorrection, setShowCorrection] = useState(false);
    const [sliceAnimation, setSliceAnimation] = useState(false);
    
    // Start game with selected difficulty
    const startGame = (selectedDifficulty) => {
        setDifficulty(selectedDifficulty);
        setGameState('playing');
        setScore(0);
        setLives(3);
        setStreak(0);
        setTimeLeft(difficulty === 'easy' ? 60 : difficulty === 'medium' ? 45 : 30);
        getNextSentence(selectedDifficulty);
    };
    
    // Get a random sentence based on difficulty
    const getNextSentence = (diff) => {
        const filteredSentences = sentences.filter(s => s.difficulty === diff);
        const randomIndex = Math.floor(Math.random() * filteredSentences.length);
        setCurrentSentence(filteredSentences[randomIndex]);
        setSelectedError(null);
        setShowCorrection(false);
    };
    
    // Handle word click (selecting an error)
    const handleWordClick = (word, index) => {
        if (gameState !== 'playing') return;
        
        setSelectedError({ word, index });
        
        // Check if word contains an error
        const isError = currentSentence.errors.some(err => err.index === index);
        
        if (isError) {
            setSliceAnimation(true);
            setTimeout(() => setSliceAnimation(false), 800);
            setShowCorrection(true);
        } else {
            // Penalty for incorrect selection
            setLives(prev => prev - 1);
            setStreak(0);
            if (lives <= 1) {
                setGameState('gameOver');
            }
        }
    };
    
    // Submit correction
    const submitCorrection = (correction) => {
        const error = currentSentence.errors.find(err => err.index === selectedError.index);
        
        if (correction.toLowerCase() === error.correction.toLowerCase()) {
            // Correct answer
            const pointsEarned = 10 * (difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 3);
            const streakBonus = streak >= 3 ? Math.floor(streak / 3) * 5 : 0;
            
            setScore(prev => prev + pointsEarned + streakBonus);
            setStreak(prev => prev + 1);
            
            // Get next sentence after a brief delay
            setTimeout(() => {
                getNextSentence(difficulty);
            }, 1000);
        } else {
            // Incorrect correction
            setLives(prev => prev - 1);
            setStreak(0);
            if (lives <= 1) {
                setGameState('gameOver');
            }
        }
        
        setShowCorrection(false);
    };
    
    // Timer effect
    useEffect(() => {
        if (gameState !== 'playing') return;
        
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setGameState('gameOver');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        
        return () => clearInterval(timer);
    }, [gameState]);
    
    return (
        <div className="grammar-ninja-container">
            {gameState === 'start' && (
                <div className="start-screen">
                    <motion.h1 
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="game-title"
                    >
                        Grammar Ninja
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Slice through grammar mistakes like a true ninja!
                    </motion.p>
                    <NinjaCharacter animate={true} />
                    <DifficultySelector onSelectDifficulty={startGame} />
                </div>
            )}
            
            {gameState === 'playing' && (
                <div className="game-screen">
                    <div className="game-header">
                        <ScoreBoard score={score} lives={lives} streak={streak} />
                        <Timer timeLeft={timeLeft} />
                    </div>
                    
                    <div className="sentence-container">
                        {currentSentence && (
                            <div className="sentence">
                                {currentSentence.text.split(' ').map((word, index) => (
                                    <motion.span
                                        key={index}
                                        className={`word ${selectedError?.index === index ? 'selected' : ''}`}
                                        onClick={() => handleWordClick(word, index)}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {word}{' '}
                                        {sliceAnimation && selectedError?.index === index && (
                                            <motion.div 
                                                className="slice-effect"
                                                initial={{ width: 0, height: '2px', rotate: 45 }}
                                                animate={{ width: '120%', height: '2px' }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}
                                    </motion.span>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {showCorrection && selectedError && (
                        <div className="correction-form">
                            <p>What's the correct form?</p>
                            <div className="options">
                                {currentSentence.errors
                                    .find(err => err.index === selectedError.index)?.options
                                    .map((option, idx) => (
                                        <motion.button
                                            key={idx}
                                            onClick={() => submitCorrection(option)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {option}
                                        </motion.button>
                                    ))}
                            </div>
                        </div>
                    )}
                    
                    <NinjaCharacter animate={sliceAnimation} />
                </div>
            )}
            
            {gameState === 'gameOver' && (
                <GameOver 
                    score={score} 
                    onPlayAgain={() => setGameState('start')} 
                />
            )}
        </div>
    );
};

export default GrammarNinja;