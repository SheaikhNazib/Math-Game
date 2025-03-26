import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FractionChallenge = ({ challenge, onCorrect, onIncorrect }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    
    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };
    
    const handleSubmit = () => {
        if (!selectedOption) return;
        
        const correct = selectedOption === challenge.fraction;
        setIsCorrect(correct);
        setShowFeedback(true);
        
        setTimeout(() => {
            setShowFeedback(false);
            setSelectedOption(null);
            
            if (correct) {
                onCorrect();
            } else {
                onIncorrect();
            }
        }, 1500);
    };
    
    // Helper function to render fraction visualization
    const renderFractionVisual = (fraction) => {
        const [numerator, denominator] = fraction.split('/').map(Number);
        const percentage = (numerator / denominator) * 100;
        
        return (
            <div className="fraction-visual">
                <div className="fraction-container">
                    <div 
                        className="fraction-filled" 
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <div className="fraction-label">{fraction}</div>
            </div>
        );
    };
    
    return (
        <div className="fraction-challenge">
            <h2>Match the Fraction</h2>
            
            <div className="challenge-content">
                <div className="target-fraction">
                    {renderFractionVisual(challenge.fraction)}
                </div>
                
                <div className="fraction-options">
                    {challenge.options.map((option, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`fraction-option ${selectedOption === option ? 'selected' : ''}`}
                            onClick={() => handleOptionSelect(option)}
                        >
                            {option}
                        </motion.div>
                    ))}
                </div>
                
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={!selectedOption || showFeedback}
                >
                    Submit Answer
                </motion.button>
                
                {showFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}
                    >
                        {isCorrect ? 'Correct! Great job!' : 'Try again!'}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default FractionChallenge; 