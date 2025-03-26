import React from 'react';

const GameHeader = ({ score, lives, timeLeft, difficulty }) => {
    // Determine timer styling based on time left
    const getTimerClass = () => {
        if (timeLeft <= 5) return 'timer danger';
        if (timeLeft <= 10) return 'timer warning';
        return 'timer';
    };
    
    return (
        <div className="game-header">
            <div className="game-stats">
                <div className="stat-item">
                    <span className="stat-value">{score}</span>
                    <span className="stat-label">Score</span>
                </div>
                
                <div className="stat-item">
                    <span className="stat-value">{lives}</span>
                    <span className="stat-label">Lives</span>
                </div>
                
                <div className="stat-item">
                    <span className="stat-value">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</span>
                    <span className="stat-label">Difficulty</span>
                </div>
            </div>
            
            <div className={getTimerClass()}>
                {timeLeft} seconds
            </div>
        </div>
    );
};

export default GameHeader; 