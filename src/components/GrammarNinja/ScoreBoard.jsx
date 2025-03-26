import React from 'react';
import { motion } from 'framer-motion';

const ScoreBoard = ({ score, lives, streak }) => {
  return (
    <div className="scoreboard" style={{ display: 'flex', gap: '1.5rem' }}>
      <motion.div 
        className="score"
        animate={{ scale: [1, score > 0 && score % 10 === 0 ? 1.2 : 1] }}
        transition={{ duration: 0.3 }}
      >
        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>SCORE</span>
        <span style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          color: '#fdbb2d'
        }}>{score}</span>
      </motion.div>
      
      <div className="lives">
        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>LIVES</span>
        <div style={{ display: 'flex', gap: '5px' }}>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: i >= lives ? 0.7 : 1,
                opacity: i >= lives ? 0.3 : 1
              }}
              style={{ color: '#F44336', fontSize: '1.2rem' }}
            >
              ❤️
            </motion.div>
          ))}
        </div>
      </div>
      
      <motion.div 
        className="streak"
        animate={{ 
          scale: streak >= 3 ? [1, 1.1, 1] : 1,
          color: streak >= 3 ? ['#fff', '#fdbb2d', '#fff'] : '#fff'
        }}
        transition={{ duration: 0.5, repeat: streak >= 3 ? Infinity : 0, repeatDelay: 1 }}
      >
        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>STREAK</span>
        <span style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '5px'
        }}>
          {streak}
          {streak >= 3 && <span style={{ fontSize: '1rem' }}>🔥</span>}
        </span>
      </motion.div>
    </div>
  );
};

export default ScoreBoard; 