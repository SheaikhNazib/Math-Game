import React from 'react';
import { motion } from 'framer-motion';

const DifficultySelector = ({ onSelectDifficulty }) => {
  const difficulties = [
    { 
      level: 'easy', 
      label: 'Easy', 
      description: 'Common grammar mistakes with hints',
      color: '#4CAF50'
    },
    { 
      level: 'medium', 
      label: 'Medium', 
      description: 'Sentences with multiple errors',
      color: '#FF9800'
    },
    { 
      level: 'hard', 
      label: 'Hard', 
      description: 'Complex grammatical errors',
      color: '#F44336'
    }
  ];

  return (
    <motion.div 
      className="difficulty-selector"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      style={{
        width: '100%',
        maxWidth: '600px',
        marginTop: '2rem'
      }}
    >
      <h2 className='text-black text-2xl font-bold' style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Select Difficulty</h2>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1rem'
      }}>
        {difficulties.map((difficulty, index) => (
          <motion.button
            key={difficulty.level}
            onClick={() => onSelectDifficulty(difficulty.level)}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 + index * 0.2 }}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: '0 5px 15px rgba(0,0,0,0.3)' 
            }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: `2px solid ${difficulty.color}`,
              borderRadius: '0.5rem',
              padding: '1rem',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              color: 'white',
              textAlign: 'left'
            }}
          >
            <span style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: difficulty.color,
              marginBottom: '0.5rem'
            }}>
              {difficulty.label}
            </span>
            <span className='text-black' style={{ opacity: 0.8 }}>{difficulty.description}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default DifficultySelector; 