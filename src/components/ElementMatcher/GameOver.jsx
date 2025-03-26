import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRedo, FaTrophy, FaMedal, FaFire } from 'react-icons/fa';
import confetti from 'canvas-confetti';

const GameOver = ({ score, startNewGame, difficulty, playSound }) => {
    useEffect(() => {
        // Trigger confetti if score is good
        if (score > 50) {
            const duration = 2000;
            const end = Date.now() + duration;
            
            const colors = ['#4cc9f0', '#4361ee', '#3a0ca3', '#7209b7', '#f72585'];
            
            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });
                
                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }
    }, [score]);
    
    // Message based on score
    const getScoreMessage = () => {
        if (score < 50) {
            return "Keep practicing! You'll get better with each attempt.";
        } else if (score < 100) {
            return "Good job! You're making great progress on your chemistry knowledge.";
        } else if (score < 200) {
            return "Excellent work! You're showing real mastery of the periodic table!";
        } else {
            return "Outstanding! You're a true chemistry genius! Albert Einstein would be proud!";
        }
    };
    
    // Icon based on score
    const getScoreIcon = () => {
        if (score < 50) return <FaMedal style={{ color: '#6c757d' }} />;
        if (score < 100) return <FaMedal style={{ color: '#cd7f32' }} />;
        if (score < 200) return <FaMedal style={{ color: '#c0c0c0' }} />;
        return <FaTrophy style={{ color: '#ffd700' }} />;
    };
    
    return (
        <motion.div 
            className="game-over"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h2>Game Over!</h2>
            <p className="game-over-difficulty">
                Difficulty: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </p>
            
            <motion.div 
                className="final-score-container"
                animate={{ scale: [0.9, 1.1, 1] }}
                transition={{ duration: 0.8 }}
            >
                <div className="score-circle"></div>
                <div className="final-score">{score}</div>
            </motion.div>
            
            <div className="score-icon">
                {getScoreIcon()}
            </div>
            
            <p className="score-message">
                {getScoreMessage()}
            </p>
            
            <motion.button 
                className="play-again-button"
                onClick={() => {
                    if (playSound) playSound('buttonClick');
                    startNewGame();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <FaRedo />
                Play Again
            </motion.button>
        </motion.div>
    );
};

export default GameOver;