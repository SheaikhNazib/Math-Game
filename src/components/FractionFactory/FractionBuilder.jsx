import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FractionBuilder = ({ challenge, onCorrect, onIncorrect }) => {
    const [selectedPieces, setSelectedPieces] = useState([]);
    const [availablePieces, setAvailablePieces] = useState([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    
    useEffect(() => {
        // Initialize the available pieces with IDs to make them unique and trackable
        if (challenge?.pieces) {
            setAvailablePieces(
                challenge.pieces.map((piece, index) => ({
                    id: `piece-${index}`,
                    value: piece,
                    isSelected: false
                }))
            );
            setSelectedPieces([]);
        }
    }, [challenge]);
    
    const handlePieceSelect = (piece) => {
        // If piece is already selected, ignore
        if (piece.isSelected) return;
        
        // Mark the piece as selected
        const updatedAvailablePieces = availablePieces.map(p => 
            p.id === piece.id ? { ...p, isSelected: true } : p
        );
        setAvailablePieces(updatedAvailablePieces);
        
        // Add to selected pieces
        setSelectedPieces([...selectedPieces, piece]);
    };
    
    const handlePieceRemove = (piece) => {
        // Remove from selected pieces
        const updatedSelectedPieces = selectedPieces.filter(p => p.id !== piece.id);
        setSelectedPieces(updatedSelectedPieces);
        
        // Mark as available again
        const updatedAvailablePieces = availablePieces.map(p => 
            p.id === piece.id ? { ...p, isSelected: false } : p
        );
        setAvailablePieces(updatedAvailablePieces);
    };
    
    const calculateCurrentFraction = () => {
        if (selectedPieces.length === 0) return "0";
        
        // Sum up all fraction values
        let total = 0;
        selectedPieces.forEach(piece => {
            const [numerator, denominator] = piece.value.split('/').map(Number);
            total += numerator / denominator;
        });
        
        // Convert to fraction (simplified form)
        // This is a simple implementation - might need more sophisticated fraction math
        if (total === Math.floor(total)) {
            return total.toString();
        }
        
        // Find a common denominator (simplified approach)
        // For a real app, you'd want a more robust fraction simplification function
        const [targetNum, targetDenom] = challenge.targetFraction.split('/').map(Number);
        return `${Math.round(total * targetDenom)}/${targetDenom}`;
    };
    
    const handleSubmit = () => {
        if (selectedPieces.length === 0) return;
        
        const builtFraction = calculateCurrentFraction();
        const correct = builtFraction === challenge.targetFraction;
        
        setIsCorrect(correct);
        setShowFeedback(true);
        
        setTimeout(() => {
            setShowFeedback(false);
            
            if (correct) {
                onCorrect();
                // Reset for next challenge
                setSelectedPieces([]);
            } else {
                onIncorrect();
            }
        }, 1500);
    };
    
    const renderFractionVisual = (fraction) => {
        if (!fraction || fraction === "0") return null;
        
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
        <div className="fraction-builder">
            <h2 className='text-2xl font-bold text-center mb-4'>Build the Fraction: {challenge?.targetFraction}</h2>
            
            <div className="builder-workspace">
                <div className="target-section">
                    <h3>Target Fraction:</h3>
                    {renderFractionVisual(challenge?.targetFraction)}
                </div>
                
                <div className="building-section">
                    <h3>Your Fraction: {calculateCurrentFraction()}</h3>
                    
                    <div className="selected-pieces">
                        {selectedPieces.length === 0 ? (
                            <p className="empty-message">Drag fraction pieces here</p>
                        ) : (
                            <div className="pieces-container">
                                {selectedPieces.map((piece) => (
                                    <motion.div
                                        key={piece.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="piece selected"
                                        onClick={() => handlePieceRemove(piece)}
                                    >
                                        {piece.value}
                                        {renderFractionVisual(piece.value)}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                        
                        {renderFractionVisual(calculateCurrentFraction())}
                    </div>
                </div>
                
                <div className="available-pieces">
                    <h3>Available Pieces</h3>
                    <div className="pieces-container">
                        {availablePieces.map((piece) => (
                            <motion.div
                                key={piece.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`piece ${piece.isSelected ? 'disabled' : ''}`}
                                onClick={() => !piece.isSelected && handlePieceSelect(piece)}
                            >
                                {piece.value}
                                {renderFractionVisual(piece.value)}
                            </motion.div>
                        ))}
                    </div>
                </div>
                
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="submit-button"
                    onClick={handleSubmit}
                    disabled={selectedPieces.length === 0 || showFeedback}
                >
                    Submit Answer
                </motion.button>
                
                {showFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}
                    >
                        {isCorrect ? 'Correct! You built the fraction perfectly!' : 'Not quite right. Try again!'}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default FractionBuilder; 