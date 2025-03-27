import React from 'react';
import { motion } from 'framer-motion';

const ScoreBoard = ({ score, streak }) => {
    return (
        <div className="score-board">
            <motion.div 
                className="score-display"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                Score: {score}
            </motion.div>
            <motion.div 
                className={`streak-display ${streak >= 3 ? 'streak-bonus' : ''}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                Streak: {streak} {streak >= 3 ? '🔥' : ''}
            </motion.div>
        </div>
    );
};

export default ScoreBoard; 