import React from 'react';
import { motion } from 'framer-motion';

const Timer = ({ timeLeft }) => {
  // Calculate color based on time left
  const getTimerColor = () => {
    if (timeLeft > 30) return '#4CAF50';
    if (timeLeft > 10) return '#FF9800';
    return '#F44336';
  };
  
  return (
    <div className="timer" style={{ textAlign: 'center' }}>
      <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>TIME</span>
      <motion.div
        animate={{ 
          scale: timeLeft <= 5 ? [1, 1.1, 1] : 1,
        }}
        transition={{ 
          duration: 0.5, 
          repeat: timeLeft <= 5 ? Infinity : 0,
          repeatType: 'loop'
        }}
        style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          color: getTimerColor()
        }}
      >
        {timeLeft}
      </motion.div>
      
      <motion.div 
        className="timer-bar"
        initial={{ width: '100%' }}
        animate={{ width: `${(timeLeft / 60) * 100}%` }}
        style={{
          height: '4px',
          backgroundColor: getTimerColor(),
          borderRadius: '2px',
          marginTop: '5px'
        }}
      />
    </div>
  );
};

export default Timer; 