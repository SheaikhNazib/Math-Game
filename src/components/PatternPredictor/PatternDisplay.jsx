import React from 'react';
import { motion } from 'framer-motion';

const PatternDisplay = ({ pattern, missingIndex }) => {
    return (
        <div className="pattern-display">
            {pattern.map((number, index) => (
                <motion.div 
                    key={index}
                    className={`pattern-item ${index === missingIndex ? 'missing' : ''}`}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                >
                    {number}
                </motion.div>
            ))}
        </div>
    );
};

export default PatternDisplay; 