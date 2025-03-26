import React from 'react';
import { motion } from 'framer-motion';

const ScoreBoard = ({ score, level, streak }) => {
    // Function to determine rank based on score
    const getRank = () => {
        if (score < 50) return 'Fraction Novice';
        if (score < 100) return 'Fraction Apprentice';
        if (score < 200) return 'Fraction Explorer';
        if (score < 350) return 'Fraction Expert';
        if (score < 500) return 'Fraction Master';
        return 'Fraction Genius';
    };
    
    // Function to calculate progress to next level
    const getProgressToNextLevel = () => {
        // For this simple implementation, every 5 streak points = 100% progress
        return Math.min(100, (streak % 5) * 20);
    };
    
    return (
        <motion.div 
            className="score-board"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="score-section">
                <h3>Score</h3>
                <motion.div 
                    className="score-value"
                    key={score} // This causes animation to replay when score changes
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    {score}
                </motion.div>
                <div className="rank">{getRank()}</div>
            </div>
            
            <div className="level-section">
                <h3>Level {level}</h3>
                <div className="level-progress-container">
                    <div 
                        className="level-progress-bar"
                        style={{ width: `${getProgressToNextLevel()}%` }}
                    ></div>
                </div>
                <div className="level-progress-text">
                    {5 - (streak % 5)} more to next level
                </div>
            </div>
            
            <div className="streak-section">
                <h3>Streak</h3>
                <div className="streak-flames">
                    {[...Array(Math.min(5, streak))].map((_, i) => (
                        <motion.div 
                            key={i}
                            className="flame"
                            animate={{ 
                                y: [0, -5, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                                repeat: Infinity, 
                                duration: 0.8 + (i * 0.2),
                                repeatType: 'reverse'
                            }}
                        >
                            🔥
                        </motion.div>
                    ))}
                </div>
                <div className="streak-value">{streak}</div>
            </div>
            
            {/* Additional messages for milestones */}
            {score > 0 && score % 100 === 0 && (
                <motion.div 
                    className="milestone-badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="milestone-title">Achievement Unlocked!</div>
                    <div className="milestone-text">Score {score} points</div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default ScoreBoard; 