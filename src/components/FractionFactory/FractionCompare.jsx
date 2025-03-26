import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FractionComparison = ({ challenge, onCorrect, onIncorrect }) => {
    const [selectedFraction, setSelectedFraction] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [hintsUsed, setHintsUsed] = useState(0);
    
    // Determine the level of difficulty
    const difficultyLevel = challenge.level || 1;
    
    const handleFractionSelect = (fraction) => {
        setSelectedFraction(fraction);
    };
    
    const handleSubmit = () => {
        if (!selectedFraction) return;
        
        const correct = selectedFraction === challenge.answer;
        setIsCorrect(correct);
        setShowFeedback(true);
        
        setTimeout(() => {
            setShowFeedback(false);
            setSelectedFraction(null);
            setShowHint(false);
            
            if (correct) {
                // Award fewer points if hints were used
                const hintPenalty = hintsUsed > 0 ? 0.5 : 1;
                onCorrect(hintPenalty);
            } else {
                onIncorrect();
            }
            
            // Reset hint state for next question
            setHintsUsed(0);
        }, 1500);
    };
    
    const toggleHint = () => {
        if (!showHint && hintsUsed < 2) {
            setShowHint(true);
            setHintsUsed(hintsUsed + 1);
        } else {
            setShowHint(false);
        }
    };
    
    // Helper function to render fraction visual - only visible when hint is shown
    const renderFractionVisual = (fraction) => {
        if (!fraction) return null;
        
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
            </div>
        );
    };
    
    // Only show decimal values when hints are used
    const renderDecimalValue = (fraction) => {
        if (!showHint) return null;
        
        const [numerator, denominator] = fraction.split('/').map(Number);
        return (
            <div className="fraction-decimal">
                = {(numerator / denominator).toFixed(2)}
            </div>
        );
    };
    
    // Only display number line when hint is shown
    const renderNumberLine = () => {
        if (!showHint) return null;
        
        return (
            <div className="comparison-visualization">
                {challenge.fractions.map((fraction, index) => {
                    const [numerator, denominator] = fraction.split('/').map(Number);
                    const decimalValue = numerator / denominator;
                    
                    return (
                        <div key={index} className="number-line-container">
                            <div className="number-line">
                                <div className="number-line-marker" style={{ 
                                    left: `${Math.min(decimalValue * 100, 100)}%`
                                }}>
                                    <div className="marker-label">{fraction}</div>
                                </div>
                            </div>
                            <div className="number-line-labels">
                                <span>0</span>
                                <span>1</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };
    
    // Generate challenging/disguised fractions for higher difficulty levels
    const getDisplayFractions = () => {
        if (difficultyLevel === 1) {
            // Level 1: Just show the original fractions
            return challenge.fractions;
        } else {
            // For higher levels, disguise the fractions to make comparison harder
            return challenge.fractions.map(fraction => {
                const [numerator, denominator] = fraction.split('/').map(Number);
                
                if (difficultyLevel === 2) {
                    // Level 2: Show equivalent fractions (multiply both by a random number)
                    const multiplier = Math.floor(Math.random() * 3) + 2; // 2, 3, or 4
                    return `${numerator * multiplier}/${denominator * multiplier}`;
                } else {
                    // Level 3: More complex equivalent fractions
                    const multiplier = Math.floor(Math.random() * 4) + 2; // 2, 3, 4, or 5
                    return `${numerator * multiplier}/${denominator * multiplier}`;
                }
            });
        }
    };
    
    // Get display fractions based on difficulty
    const displayFractions = getDisplayFractions();
    
    // Count available hints
    const remainingHints = 2 - hintsUsed;
    
    // Generate a bit of mental math help text based on the challenge
    const getHelpText = () => {
        const [frac1, frac2] = challenge.fractions;
        const [num1, denom1] = frac1.split('/').map(Number);
        const [num2, denom2] = frac2.split('/').map(Number);
        
        if (denom1 === denom2) {
            return "When denominators are the same, compare the numerators.";
        } else {
            return "Try finding a common denominator to compare these fractions.";
        }
    };
    
    return (
        <div className="fraction-comparison">
            <h2 className='text-2xl font-bold text-center mb-4'>Which fraction is larger?</h2>
            <p className="comparison-help-text">{getHelpText()}</p>
            
            <div className="comparison-container">
                <div className="fractions-to-compare">
                    {displayFractions.map((fraction, index) => {
                        // Display the original fraction value for gameplay, while using challenge.fractions for logic
                        const actualFraction = challenge.fractions[index];
                        
                        return (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`fraction-card ${selectedFraction === actualFraction ? 'selected' : ''}`}
                                onClick={() => handleFractionSelect(actualFraction)}
                            >
                                <h3 className="fraction-value">{displayFractions[index]}</h3>
                                {showHint && renderFractionVisual(actualFraction)}
                                {renderDecimalValue(actualFraction)}
                            </motion.div>
                        );
                    })}
                </div>
                
                {renderNumberLine()}
                
                <div className="comparison-controls">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="hint-button"
                        onClick={toggleHint}
                        disabled={hintsUsed >= 2}
                    >
                        {showHint ? "Hide Hint" : `Use Hint (${remainingHints} left)`}
                    </motion.button>
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="submit-button"
                        onClick={handleSubmit}
                        disabled={!selectedFraction || showFeedback}
                    >
                        Submit Answer
                    </motion.button>
                </div>
                
                {showFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}
                    >
                        {isCorrect 
                            ? 'Correct! You identified the larger fraction!' 
                            : 'Not quite right. Try again!'}
                    </motion.div>
                )}
                
                {difficultyLevel > 1 && (
                    <div className="difficulty-indicator">
                        Level {difficultyLevel} Difficulty
                    </div>
                )}
            </div>
        </div>
    );
};

export default FractionComparison; 