import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EquationSolver = ({ challenge, onCorrect, onIncorrect }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    
    const handleInputChange = (e) => {
        // Only allow valid fraction input: digits, slash, and backspace
        const input = e.target.value;
        const validInput = /^[0-9/]*$/;
        
        if (validInput.test(input) || input === '') {
            setUserAnswer(input);
        }
    };
    
    const handleSubmit = () => {
        if (!userAnswer) return;
        
        // Normalize fractions for comparison (remove spaces, trim)
        const normalizedUserAnswer = userAnswer.trim().replace(/\s+/g, '');
        const normalizedCorrectAnswer = challenge.answer.trim().replace(/\s+/g, '');
        
        // Check if numerically equivalent (alternative approach)
        let correct = normalizedUserAnswer === normalizedCorrectAnswer;
        
        // If not an exact match, check if numerically equivalent
        if (!correct) {
            const userFractionValue = calculateFractionValue(normalizedUserAnswer);
            const correctFractionValue = calculateFractionValue(normalizedCorrectAnswer);
            
            // Compare with small epsilon to handle floating point errors
            correct = Math.abs(userFractionValue - correctFractionValue) < 0.0001;
        }
        
        setIsCorrect(correct);
        setShowFeedback(true);
        
        setTimeout(() => {
            setShowFeedback(false);
            
            if (correct) {
                onCorrect();
                // Reset for next challenge
                setUserAnswer('');
            } else {
                onIncorrect();
            }
        }, 1500);
    };
    
    // Helper to calculate fraction value
    const calculateFractionValue = (fractionStr) => {
        if (!fractionStr.includes('/')) {
            return parseFloat(fractionStr) || 0;
        }
        
        const [numerator, denominator] = fractionStr.split('/').map(Number);
        if (denominator === 0) return 0; // Avoid division by zero
        return numerator / denominator;
    };
    
    // Extract operands and operator from equation
    const parseEquation = () => {
        if (!challenge?.equation) return { leftOperand: '', rightOperand: '', operator: '' };
        
        // Remove the equals sign and question mark
        const equationParts = challenge.equation.split('=')[0].trim();
        
        // Find the operator
        let operator = '';
        let operatorIndex = -1;
        
        if (equationParts.includes('+')) {
            operator = '+';
            operatorIndex = equationParts.indexOf('+');
        } else if (equationParts.includes('-')) {
            operator = '-';
            operatorIndex = equationParts.indexOf('-');
        } else if (equationParts.includes('×') || equationParts.includes('*')) {
            operator = '×';
            operatorIndex = equationParts.includes('×') 
                ? equationParts.indexOf('×') 
                : equationParts.indexOf('*');
        } else if (equationParts.includes('÷') || equationParts.includes('/')) {
            operator = '÷';
            operatorIndex = equationParts.includes('÷') 
                ? equationParts.indexOf('÷') 
                : equationParts.indexOf('/');
        }
        
        if (operatorIndex === -1) {
            return { leftOperand: equationParts, rightOperand: '', operator: '' };
        }
        
        const leftOperand = equationParts.substring(0, operatorIndex).trim();
        const rightOperand = equationParts.substring(operatorIndex + 1).trim();
        
        return { leftOperand, rightOperand, operator };
    };
    
    const { leftOperand, rightOperand, operator } = parseEquation();
    
    // Render fraction visual
    const renderFractionVisual = (fraction) => {
        if (!fraction) return null;
        
        let percentage = 0;
        
        if (fraction.includes('/')) {
            const [numerator, denominator] = fraction.split('/').map(Number);
            percentage = (numerator / denominator) * 100;
        } else {
            percentage = parseFloat(fraction) * 100;
        }
        
        // Cap at 100% for visualization
        percentage = Math.min(percentage, 100);
        
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
        <div className="equation-solver">
            <h2>Solve the Equation</h2>
            
            <div className="equation-container">
                <div className="equation-display">
                    <div className="equation-part">
                        <span className="equation-text">{leftOperand}</span>
                        {renderFractionVisual(leftOperand)}
                    </div>
                    
                    <div className="equation-operator">
                        {operator}
                    </div>
                    
                    <div className="equation-part">
                        <span className="equation-text">{rightOperand}</span>
                        {renderFractionVisual(rightOperand)}
                    </div>
                    
                    <div className="equation-equals">
                        =
                    </div>
                    
                    <div className="equation-answer">
                        <div className="answer-input-container">
                            <input
                                type="text"
                                className="answer-input"
                                value={userAnswer}
                                onChange={handleInputChange}
                                placeholder="???"
                            />
                            <div className="input-hint">
                                (e.g., 3/4)
                            </div>
                        </div>
                        
                        {userAnswer && renderFractionVisual(userAnswer)}
                    </div>
                </div>
                
                <div className="equation-visual-explanation">
                    <div className="visual-explanation-title">Visual Guide:</div>
                    <p>For example, in the equation "1/2 + 1/4 = ?", we can:</p>
                    <ul>
                        <li>Find a common denominator (4)</li>
                        <li>Convert 1/2 to 2/4</li>
                        <li>Add: 2/4 + 1/4 = 3/4</li>
                    </ul>
                </div>
                
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={!userAnswer || showFeedback}
                >
                    Submit Answer
                </motion.button>
                
                {showFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}
                    >
                        {isCorrect 
                            ? 'Correct! You solved the equation!' 
                            : 'Not quite right. Try again!'}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default EquationSolver; 