import React from 'react';
import { motion } from 'framer-motion';

const GameOver = ({ score, onPlayAgain }) => {
  let feedback = "Nice effort!";
  
  if (score > 200) {
    feedback = "Grammar Grandmaster! 🏆";
  } else if (score > 100) {
    feedback = "Grammar Ninja! ⚔️";
  } else if (score > 50) {
    feedback = "Grammar Apprentice! 🥋";
  }
  
  return (
    <motion.div 
      className="game-over"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'rgba(0, 0, 0, 0.8)',
        padding: '2rem',
        borderRadius: '1rem',
        textAlign: 'center',
        maxWidth: '600px'
      }}
    >
      <motion.h2
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        style={{ fontSize: '3rem', marginBottom: '1rem' }}
      >
        Game Over!
      </motion.h2>
      
      <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Your Score: 
        <motion.span 
          initial={{ color: '#fff' }}
          animate={{ color: '#fdbb2d' }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          style={{ fontWeight: 'bold', marginLeft: '0.5rem', fontSize: '1.5rem' }}
        >
          {score}
        </motion.span>
      </p>
      
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>{feedback}</p>
      
      <motion.button
        onClick={onPlayAgain}
        whileHover={{ scale: 1.05, backgroundColor: '#fdbb2d' }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: '#b21f1f',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Play Again
      </motion.button>
    </motion.div>
  );
};

export default GameOver; 