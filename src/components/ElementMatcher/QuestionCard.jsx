import React from 'react';
import { motion } from 'framer-motion';
import { FaMedal } from 'react-icons/fa';

const QuestionCard = ({ element, questionType, options, onSelectAnswer }) => {
    // Get chemical symbol from element name (first 1-2 letters)
    const getElementSymbol = (name) => {
        if (!name) return '';
        return name.substring(0, 1).toUpperCase() + 
               (name.length > 1 ? name.substring(1, 2).toLowerCase() : '');
    };
    
    return (
        <motion.div 
            className="question-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="element-container">
                <h2 className="element-name">{element}</h2>
                <span className="element-symbol">{getElementSymbol(element)}</span>
            </div>
            
            <p className="question-prompt">
                <FaMedal style={{ marginRight: '8px', color: '#f72585' }} />
                Select the correct {questionType} for this element:
            </p>
            
            <div className="options-grid">
                {options.map((option, index) => (
                    <motion.button
                        key={index}
                        className="option-button"
                        onClick={() => onSelectAnswer(option)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                            opacity: 1, 
                            y: 0,
                            transition: { delay: index * 0.1 }
                        }}
                    >
                        {option}
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
};

export default QuestionCard; 