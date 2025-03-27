import React, { useState, useEffect } from 'react';
import './ChemistryLab.css'; // We'll create this file for animations

const ChemistryLab = () => {
    const [selectedChemicals, setSelectedChemicals] = useState([]);
    const [reactionResult, setReactionResult] = useState(null);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [completedExperiments, setCompletedExperiments] = useState([]);
    const [experimentInstructions, setExperimentInstructions] = useState('');
    
    // Define available chemicals
    const chemicals = [
        { id: 'h2o', name: 'Water (H₂O)', color: '#c2e6ff' },
        { id: 'nacl', name: 'Sodium Chloride (NaCl)', color: '#ffffff' },
        { id: 'hcl', name: 'Hydrochloric Acid (HCl)', color: '#ffeb99' },
        { id: 'naoh', name: 'Sodium Hydroxide (NaOH)', color: '#e6ffe6' },
        { id: 'cuso4', name: 'Copper Sulfate (CuSO₄)', color: '#4d94ff' },
        { id: 'h2o2', name: 'Hydrogen Peroxide (H₂O₂)', color: '#e6f7ff' },
        { id: 'c6h12o6', name: 'Glucose (C₆H₁₂O₆)', color: '#ffffcc' },
        { id: 'phenol', name: 'Phenolphthalein', color: '#ffe6ff' },
    ];
    
    // Define possible reactions
    const reactions = {
        'hcl-naoh': {
            result: 'NaCl and H₂O (Neutralization)',
            description: 'HCl + NaOH → NaCl + H₂O. The acid and base neutralize each other, forming salt and water.',
            color: '#f2f2f2',
            animation: 'bubble',
            score: 10
        },
        'cuso4-naoh': {
            result: 'Copper Hydroxide Precipitate',
            description: 'CuSO₄ + 2NaOH → Cu(OH)₂ + Na₂SO₄. A blue precipitate forms.',
            color: '#33ccff',
            animation: 'precipitate',
            score: 15
        },
        'h2o2-catalyst': {
            result: 'Oxygen Gas',
            description: 'H₂O₂ → H₂O + O₂. Hydrogen peroxide decomposes into water and oxygen gas.',
            color: '#ffffff',
            animation: 'bubble-intense',
            score: 20
        },
        'naoh-phenol': {
            result: 'pH Indicator Change',
            description: 'The colorless phenolphthalein turns pink in basic solution.',
            color: '#ff99cc',
            animation: 'color-change',
            score: 10
        },
        'hcl-phenol': {
            result: 'No Color Change',
            description: 'Phenolphthalein remains colorless in acidic solution.',
            color: '#ffe6ff',
            animation: 'none',
            score: 5
        }
    };
    
    // Predefined experiments for players to complete
    const experiments = [
        {
            id: 'exp1',
            name: 'Acid-Base Neutralization',
            chemicals: ['hcl', 'naoh'],
            instructions: 'Mix hydrochloric acid with sodium hydroxide to observe neutralization.',
            reactionKey: 'hcl-naoh'
        },
        {
            id: 'exp2',
            name: 'Precipitation Reaction',
            chemicals: ['cuso4', 'naoh'],
            instructions: 'Mix copper sulfate with sodium hydroxide to create a blue precipitate.',
            reactionKey: 'cuso4-naoh'
        },
        {
            id: 'exp3',
            name: 'pH Indicator Test',
            chemicals: ['naoh', 'phenol'],
            instructions: 'Add phenolphthalein to sodium hydroxide to see the indicator change color.',
            reactionKey: 'naoh-phenol'
        }
    ];

    // Select a random experiment to suggest
    useEffect(() => {
        const incompletedExperiments = experiments.filter(
            exp => !completedExperiments.includes(exp.id)
        );
        
        if (incompletedExperiments.length > 0) {
            const randomExp = incompletedExperiments[Math.floor(Math.random() * incompletedExperiments.length)];
            setExperimentInstructions(randomExp.instructions);
        } else {
            setExperimentInstructions('Congratulations! You have completed all experiments. Feel free to mix any chemicals.');
        }
    }, [completedExperiments]);

    const selectChemical = (chemical) => {
        if (selectedChemicals.find(c => c.id === chemical.id)) {
            setMessage('Chemical already selected.');
            return;
        }
        
        if (selectedChemicals.length >= 2) {
            setMessage('Only two chemicals can be mixed at once. Clear the beaker first.');
            return;
        }
        
        setSelectedChemicals([...selectedChemicals, chemical]);
    };

    const clearBeaker = () => {
        setSelectedChemicals([]);
        setReactionResult(null);
        setIsAnimating(false);
        setMessage('');
    };

    const mixChemicals = () => {
        if (selectedChemicals.length < 2) {
            setMessage('Select at least two chemicals to mix.');
            return;
        }
        
        // Sort chemical IDs to ensure consistent reaction keys
        const sortedChemicals = [...selectedChemicals].sort((a, b) => a.id.localeCompare(b.id));
        const reactionKey = `${sortedChemicals[0].id}-${sortedChemicals[1].id}`;
        
        // Check for special case: hydrogen peroxide decomposition
        const specialCaseH2O2 = selectedChemicals.some(c => c.id === 'h2o2');
        
        if (reactions[reactionKey]) {
            setReactionResult(reactions[reactionKey]);
            setIsAnimating(true);
            setMessage(`Reaction occurred: ${reactions[reactionKey].description}`);
            
            // Check if this completes an experiment
            experiments.forEach(exp => {
                const expChemicals = [...exp.chemicals].sort();
                const selectedIds = sortedChemicals.map(c => c.id);
                
                if (expChemicals.every(chem => selectedIds.includes(chem)) && 
                    !completedExperiments.includes(exp.id) &&
                    exp.reactionKey === reactionKey) {
                    setCompletedExperiments([...completedExperiments, exp.id]);
                    setScore(score + reactions[reactionKey].score + 25); // Bonus for completing experiment
                    setMessage(`Experiment completed: ${exp.name}! +${reactions[reactionKey].score + 25} points`);
                } else {
                    // Still award points for correct reaction even if not part of current experiment
                    setScore(score + reactions[reactionKey].score);
                }
            });
            
        } else if (specialCaseH2O2) {
            // Special case for hydrogen peroxide
            setReactionResult(reactions['h2o2-catalyst']);
            setIsAnimating(true);
            setMessage(reactions['h2o2-catalyst'].description);
            setScore(score + reactions['h2o2-catalyst'].score);
        } else {
            setReactionResult({
                result: 'No Visible Reaction',
                description: 'These chemicals don\'t produce a visible reaction together.',
                color: 'mix',
                animation: 'none',
                score: 2
            });
            setMessage('These chemicals don\'t produce a notable reaction together.');
            setScore(score + 2); // Small score for experimenting
        }
    };

    return (
        <div className="chemistry-lab">
            <h1 className="lab-title">Virtual Chemistry Lab</h1>
            
            <div className="lab-container">
                <div className="lab-controls">
                    <div className="score-display">
                        <h2>Score: {score}</h2>
                        <p className="experiment-instruction">{experimentInstructions}</p>
                    </div>
                    
                    <div className="chemicals-container">
                        <h2>Available Chemicals</h2>
                        <div className="chemicals-grid">
                            {chemicals.map(chemical => (
                                <button 
                                    key={chemical.id}
                                    className="chemical-btn"
                                    style={{ backgroundColor: `${chemical.color}88` }}
                                    onClick={() => selectChemical(chemical)}
                                >
                                    {chemical.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="action-buttons">
                        <button className="mix-btn" onClick={mixChemicals}>Mix Chemicals</button>
                        <button className="clear-btn" onClick={clearBeaker}>Clear Beaker</button>
                    </div>
                </div>
                
                <div className="lab-workspace">
                    <div className="beaker-container">
                        <div 
                            className={`beaker ${isAnimating ? reactionResult?.animation : ''}`}
                            style={{ 
                                backgroundColor: reactionResult ? reactionResult.color : 
                                    selectedChemicals.length > 0 ? selectedChemicals[selectedChemicals.length - 1].color : 'transparent',
                                boxShadow: reactionResult ? '0 0 15px rgba(255,255,255,0.7)' : 'none'
                            }}
                        >
                            {selectedChemicals.length === 0 && (
                                <p className="beaker-empty">Empty Beaker</p>
                            )}
                            
                            {!reactionResult && selectedChemicals.map((chemical, index) => (
                                <div 
                                    key={index}
                                    className="chemical-layer"
                                    style={{ 
                                        backgroundColor: chemical.color,
                                        height: `${100 / selectedChemicals.length}%`,
                                        top: `${(index / selectedChemicals.length) * 100}%`
                                    }}
                                >
                                    {chemical.name}
                                </div>
                            ))}
                            
                            {reactionResult && (
                                <div className="reaction-result">
                                    <h3>{reactionResult.result}</h3>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="message-box">
                        {message && <p>{message}</p>}
                    </div>
                    
                    <div className="completed-experiments">
                        <h3>Completed Experiments: {completedExperiments.length}/{experiments.length}</h3>
                        <ul>
                            {completedExperiments.map(expId => {
                                const exp = experiments.find(e => e.id === expId);
                                return <li key={expId}>{exp?.name}</li>;
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChemistryLab;