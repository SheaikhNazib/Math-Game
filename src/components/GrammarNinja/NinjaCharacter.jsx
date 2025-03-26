import React from 'react';
import { motion } from 'framer-motion';

const NinjaCharacter = ({ animate }) => {
  return (
    <motion.div 
      className="ninja-character"
      initial={{ scale: 0.8 }}
      animate={{ 
        scale: animate ? [1, 1.2, 1] : 1,
        rotate: animate ? [0, 15, -15, 0] : 0
      }}
      transition={{ duration: 0.5 }}
      style={{
        width: '150px',
        height: '150px',
        position: 'relative',
        marginTop: '2rem'
      }}
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        {/* Ninja body */}
        <circle cx="50" cy="50" r="30" fill="#333" />
        
        {/* Ninja mask */}
        <rect x="30" y="40" width="40" height="10" fill="#222" />
        
        {/* Ninja eyes */}
        <circle cx="40" cy="45" r="3" fill="white" />
        <circle cx="60" cy="45" r="3" fill="white" />
        
        {/* Sword */}
        <motion.g
          animate={animate ? { 
            rotate: [0, 45, 90, 0],
            x: [0, 10, 0, -10, 0],
            y: [0, -10, 0, 10, 0]
          } : {}}
          transition={{ duration: 0.8 }}
          style={{ transformOrigin: '70px 50px' }}
        >
          <line x1="65" y1="50" x2="90" y2="35" stroke="#ccc" strokeWidth="2" />
          <line x1="70" y1="50" x2="90" y2="50" stroke="#666" strokeWidth="4" />
        </motion.g>
      </svg>
      
      {animate && (
        <motion.div
          className="slash-effect"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], rotate: 45 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            width: '100px',
            height: '10px',
            background: 'linear-gradient(90deg, transparent, yellow, transparent)',
            borderRadius: '5px',
            transformOrigin: 'center'
          }}
        />
      )}
    </motion.div>
  );
};

export default NinjaCharacter; 