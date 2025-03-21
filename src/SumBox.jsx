import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faGamepad } from '@fortawesome/free-solid-svg-icons'; // Import the gamepad icon
import apple from '../src/assets/image/apple.png';
import ball from '../src/assets/image/ball.png';
import cat from '../src/assets/image/cat.png';
import Lottie from "lottie-react";
import math from "../src/assets/gif/math.json";
import clock from "../src/assets/gif/clock.json";
import right from "../src/assets/gif/right.json";
import wrong from "../src/assets/gif/wrong.json";
import logo_score from "../src/assets/gif/score.json";
import Navbar from './components/Navbar';


const images = [apple, ball, cat];

const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

const generateNewPuzzle = () => {
    return {
        apple: Math.floor(Math.random() * 9) + 1,
        ball: Math.floor(Math.random() * 9) + 1,
        cat: Math.floor(Math.random() * 9) + 1,
        shuffledImages: shuffleArray([...images]),
    };
};

const SumBox = () => {
    const [values, setValues] = useState(generateNewPuzzle());
    const [userInputs, setUserInputs] = useState({ apple: '', ball: '', cat: '' });
    const [message, setMessage] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30); // Timer state
    const [score, setScore] = useState(0); // Score state
    const [correctCount, setCorrectCount] = useState(0); // Correct answers count
    const [wrongCount, setWrongCount] = useState(0); // Wrong answers count
    const [gameStarted, setGameStarted] = useState(false); // New state to track if the game has started

    // Timer logic
    useEffect(() => {
        if (gameStarted && timeLeft > 0 && !gameOver) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setMessage('⏰ Time is up! Game over!');
            setGameOver(true);
        }
    }, [timeLeft, gameOver, gameStarted]);

    const handleInputChange = (e, key) => {
        setUserInputs({ ...userInputs, [key]: e.target.value });
    };

    const submitAnswer = () => {
        if (
            parseInt(userInputs.apple) === values.apple &&
            parseInt(userInputs.ball) === values.ball &&
            parseInt(userInputs.cat) === values.cat
        ) {
            setMessage('✅ Correct! Well done! Solve the next one.');
            setScore(score + 10); // Increase score
            setCorrectCount(correctCount + 1); // Increment correct count
        } else {
            setMessage('❌ Incorrect! Try the next one.');
            setWrongCount(wrongCount + 1); // Increment wrong count
        }

        // Generate a new puzzle if time is still remaining
        if (timeLeft > 0) {
            setValues(generateNewPuzzle());
            setUserInputs({ apple: '', ball: '', cat: '' });
        }
    };

    const playAgain = () => {
        setValues(generateNewPuzzle());
        setUserInputs({ apple: '', ball: '', cat: '' });
        setMessage('');
        setGameOver(false);
        setTimeLeft(30); // Reset timer
        setScore(0); // Reset score
        setCorrectCount(0); // Reset correct count
        setWrongCount(0); // Reset wrong count
        setGameStarted(false); // Reset game started state
    };

    const startGame = () => {
        setGameStarted(true); // Start the game
        setMessage('');
        setGameOver(false);
        setTimeLeft(30); // Reset timer
        setScore(0); // Reset score
        setCorrectCount(0); // Reset correct count
        setWrongCount(0); // Reset wrong count
    };

    return (
        <>
            <Navbar></Navbar>
            <div className='py-20 text-center' style={{ background: '#90be6d' }}>
                <Lottie className="h-24" animationData={math} loop={true} style={{ height: '400px' }} />
                {!gameStarted ? (
                    <button
                        onClick={startGame}
                        className="mt-4 mb-96 px-6 py-3 bg-green-500 text-black rounded text-xl hover:text-white hover:scale-110"
                    >
                        <FontAwesomeIcon className="me-2" icon={faGamepad} />
                        Start Game
                    </button>
                ) : !gameOver ? (
                    <>
                        <p className="text-3xl font-bold mb-2">Solve the math problem before time runs out!</p>
                        <div className='flex justify-center items-center'>
                            <div className="mt-4 mb-12 p-5 rounded-lg w-2/6 text-center bg-purple-400 text-5xl flex justify-center items-center">
                                <Lottie className="h-24" animationData={clock} loop={true} />
                                Time Left: <span className="font-bold ms-2"> {timeLeft}</span> s
                            </div>
                        </div>
                        <motion.table
                            className='max-w-3xl mx-auto border border-gray-300 rounded-lg shadow-lg'
                            style={{ borderCollapse: 'collapse', width: '100%' }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <tbody>
                                {values.shuffledImages.length >= 3 ? (
                                    [
                                        [0, 1, 1, values.apple + values.ball + values.ball],
                                        [0, 2, 0, values.apple + values.cat + values.apple],
                                        [1, 1, 1, values.ball + values.ball + values.ball]
                                    ].map((row, rowIndex) => (
                                        <tr key={rowIndex} className='flex items-center justify-center'>
                                            {row.slice(0, 3).map((imgIndex, colIndex) => (
                                                <td key={colIndex} className='p-4 border hover:bg-gray-100 transition-all'>
                                                    <motion.img
                                                        className='h-24 cursor-pointer'
                                                        src={values.shuffledImages[imgIndex]}
                                                        alt='item'
                                                        animate={{
                                                            scale: [1, 1.1, 1], // Scale up and down continuously
                                                        }}
                                                        transition={{
                                                            duration: 1.5, // Duration of one animation cycle
                                                            repeat: Infinity, // Repeat the animation infinitely
                                                            ease: 'easeInOut', // Smooth easing for the animation
                                                        }}
                                                    />
                                                </td>
                                            ))}
                                            <td className='p-4 text-3xl font-bold text-blue-600'>= {row[3]}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan='4' className='text-center text-xl'>Loading...</td>
                                    </tr>
                                )}
                            </tbody>
                        </motion.table>

                        {/* Input Fields */}
                        <div className='flex justify-center mt-8 gap-4'>
                            {Object.keys(values).map((key, index) =>
                                key !== 'shuffledImages' ? (
                                    <div key={key} className='flex items-center'>
                                        <motion.img
                                            className='h-24'
                                            src={values.shuffledImages[index] || ''}
                                            alt={key}
                                            whileHover={{ scale: 1.1 }}
                                        />
                                        <p className='text-3xl mx-2 font-semibold'>=?</p>
                                        <motion.input
                                            type='number'
                                            value={userInputs[key]}
                                            onChange={(e) => handleInputChange(e, key)}
                                            className='input input-bordered text-center w-20 text-2xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all'
                                            whileFocus={{ scale: 1.05 }}
                                            required
                                        />
                                    </div>
                                ) : null
                            )}
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            onClick={submitAnswer}
                            className='my-6 px-6 py-3 bg-blue-500 text-white text-xl rounded-lg hover:bg-blue-600 transition-all'
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            Submit
                        </motion.button>
                    </>
                ) : (
                    <>
                        {/* Scoreboard */}
                        <div className="mt-8">
                            <p className="p-5 rounded-lg w-2/6 text-center bg-green-300 text-5xl mx-auto flex items-center justify-center"> <Lottie animationData={logo_score} loop={true} style={{ height: '150px' }} />Score: {score}</p>

                            <p className="my-5 p-5 rounded-lg w-2/6 text-center flex items-center justify-center bg-blue-300 text-5xl mx-auto"> <Lottie animationData={right} loop={true} style={{ height: '150px' }} /> Correct Answers: {correctCount}</p>

                            <p className="p-5 rounded-lg w-2/6 text-center flex items-center justify-center bg-red-300 text-5xl mx-auto"> <Lottie animationData={wrong} loop={true} style={{ height: '150px' }} />Wrong Answers: {wrongCount}</p>
                        </div>
                        <motion.button
                            onClick={playAgain}
                            className='mt-6 px-6 py-3 bg-green-500 text-white text-xl rounded-lg  hover:bg-green-600 transition-all'
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            Play Again
                        </motion.button>
                    </>
                )}
                {message && <motion.p className={`mt-4 text-2xl font-bold ${gameOver ? 'text-green-600' : 'text-red-600'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {message}
                </motion.p>}
            </div>
        </>
    );
};

export default SumBox;