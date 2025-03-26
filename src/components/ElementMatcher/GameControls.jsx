import React from 'react';

const GameControls = ({ onChangeDifficulty }) => {
    return (
        <div className="game-controls">
            <button 
                className="control-button"
                onClick={() => onChangeDifficulty('easy')}
            >
                Switch to Easy
            </button>
            
            <button 
                className="control-button"
                onClick={() => onChangeDifficulty('medium')}
            >
                Switch to Medium
            </button>
            
            <button 
                className="control-button"
                onClick={() => onChangeDifficulty('hard')}
            >
                Switch to Hard
            </button>
        </div>
    );
};

export default GameControls; 