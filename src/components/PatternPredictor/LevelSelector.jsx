import React from 'react';

const LevelSelector = ({ level, setLevel }) => {
    return (
        <div className="level-selector">
            <label htmlFor="level-select">Difficulty:</label>
            <select 
                id="level-select"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="level-select"
            >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
            </select>
        </div>
    );
};

export default LevelSelector; 