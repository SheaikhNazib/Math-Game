import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FeedbackMessage = ({ feedback }) => {
    return (
        <AnimatePresence mode="wait">
            <motion.div 
                key={feedback.message}
                className={`feedback-message ${feedback.type}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                {feedback.message}
            </motion.div>
        </AnimatePresence>
    );
};

export default FeedbackMessage; 