import React from 'react';
import { motion } from 'framer-motion';

const UserInput = ({ userAnswer, setUserAnswer, checkAnswer }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        checkAnswer();
    };

    return (
        <motion.form 
            className="user-input-form"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit}
        >
            <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer"
                className="answer-input"
                autoFocus
            />
            <motion.button 
                type="submit"
                className="submit-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Submit
            </motion.button>
        </motion.form>
    );
};

export default UserInput; 