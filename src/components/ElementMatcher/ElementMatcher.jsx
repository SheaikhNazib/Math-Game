import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ElementMatcher.css';
import { periodicTableData } from '../../data/periodicTableData';
import GameHeader from './GameHeader';
import QuestionCard from './QuestionCard';
import GameControls from './GameControls';
import GameOver from './GameOver';
import Navbar from '../Navbar';

import { FaAtom, FaFlask, FaVial, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const ElementMatcher = () => {
    // Game state
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [difficulty, setDifficulty] = useState('easy'); // 'easy', 'medium', 'hard'
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [timeLeft, setTimeLeft] = useState(30);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [options, setOptions] = useState([]);

    // Simple music state
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const backgroundMusicRef = useRef(null);
    
    // Initialize background music
    useEffect(() => {
        // Create audio element for background music
        backgroundMusicRef.current = new Audio('/sounds/background_music.mp3');
        backgroundMusicRef.current.loop = true;
        backgroundMusicRef.current.volume = 0.4; // Set initial volume
        
        // Cleanup on component unmount
        return () => {
            if (backgroundMusicRef.current) {
                backgroundMusicRef.current.pause();
                backgroundMusicRef.current = null;
            }
        };
    }, []);
    
    // Simple toggle for background music
    const toggleBackgroundMusic = () => {
        if (isMusicPlaying) {
            backgroundMusicRef.current.pause();
        } else {
            // Simple play attempt
            const playPromise = backgroundMusicRef.current.play();
            
            // Handle potential play() promise rejection
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log("Audio play failed:", error);
                });
            }
        }
        setIsMusicPlaying(!isMusicPlaying);
        playSound('buttonClick');
    };
    
    // Generate a new question based on difficulty
    const generateQuestion = () => {
        const randomIndex = Math.floor(Math.random() * periodicTableData.length);
        const element = periodicTableData[randomIndex];
        let questionType, correctAnswer, questionOptions;

        switch (difficulty) {
            case 'easy':
                questionType = 'symbol';
                correctAnswer = element.symbol;
                // Generate 3 incorrect options from other elements
                questionOptions = generateOptions(periodicTableData, 'symbol', correctAnswer);
                break;
            case 'medium':
                questionType = 'atomic number';
                correctAnswer = element.atomicNumber;
                questionOptions = generateOptions(periodicTableData, 'atomicNumber', correctAnswer);
                break;
            case 'hard':
                questionType = Math.random() > 0.5 ? 'atomic mass' : 'category';
                correctAnswer = questionType === 'atomic mass' ? element.atomicMass : element.category;
                questionOptions = generateOptions(periodicTableData,
                    questionType === 'atomic mass' ? 'atomicMass' : 'category',
                    correctAnswer);
                break;
            default:
                questionType = 'symbol';
                correctAnswer = element.symbol;
                questionOptions = generateOptions(periodicTableData, 'symbol', correctAnswer);
        }

        setCurrentQuestion({
            element: element.name,
            questionType,
            correctAnswer
        });

        // Shuffle options
        setOptions(shuffleArray([...questionOptions, correctAnswer]));
    };

    // Enhanced sound effects
    const playSound = (type) => {
        let soundPath;
        switch(type) {
            case 'correct':
                soundPath = '/sounds/correct_answer.mp3';
                break;
            case 'incorrect':
                soundPath = '/sounds/wrong_answer.mp3';
                break;
            case 'gameOver':
                soundPath = '/sounds/game_over.mp3';
                break;
            case 'levelUp':
                soundPath = '/sounds/level_up.mp3';
                break;
            case 'buttonClick':
                soundPath = '/sounds/button_click.mp3';
                break;
            default:
                soundPath = `/sounds/${type}.mp3`;
        }
        
        const sound = new Audio(soundPath);
        sound.volume = 0.7; // Adjust volume as needed
        sound.play().catch(err => console.log('Audio play error:', err));
    };

    // Enhanced start game with music
    const startGame = () => {
        playSound('buttonClick');
        
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setLives(3);
        setTimeLeft(getDifficultyTime());
        generateQuestion();
    };

    // Enhanced answer selection with visual feedback
    const handleAnswerSelect = (selectedAnswer) => {
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        
        if (isCorrect) {
            setScore(prevScore => {
                const newScore = prevScore + getDifficultyPoints();
                // Play level up sound on milestone scores
                if (newScore % 100 === 0) {
                    playSound('levelUp');
                } else {
                    playSound('correct');
                }
                return newScore;
            });
        } else {
            setLives(prevLives => prevLives - 1);
            playSound('incorrect');
        }
        
        // Generate next question or end game
        if (lives > 1 || isCorrect) {
            generateQuestion();
            setTimeLeft(getDifficultyTime());
        } else {
            setGameOver(true);
            playSound('gameOver');
        }
    };

    // Timer effect
    useEffect(() => {
        let timer;
        if (gameStarted && !gameOver && timeLeft > 0) {
            timer = setTimeout(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0 && !gameOver) {
            setLives(prevLives => prevLives - 1);
            if (lives > 1) {
                generateQuestion();
                setTimeLeft(getDifficultyTime());
            } else {
                setGameOver(true);
            }
        }

        return () => clearTimeout(timer);
    }, [gameStarted, gameOver, timeLeft, lives]);

    // Handle game over with music
    useEffect(() => {
        if (gameOver) {
            playSound('gameOver');
        }
    }, [gameOver]);

    // Helper functions
    const getDifficultyTime = () => {
        switch (difficulty) {
            case 'easy': return 30;
            case 'medium': return 20;
            case 'hard': return 15;
            default: return 30;
        }
    };

    const getDifficultyPoints = () => {
        switch (difficulty) {
            case 'easy': return 10;
            case 'medium': return 20;
            case 'hard': return 30;
            default: return 10;
        }
    };

    const generateOptions = (data, property, correctAnswer) => {
        let options = [];
        const filteredData = data.filter(item => item[property] !== correctAnswer);

        while (options.length < 3) {
            const randomIndex = Math.floor(Math.random() * filteredData.length);
            const option = filteredData[randomIndex][property];

            if (!options.includes(option)) {
                options.push(option);
            }
        }

        return options;
    };

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    return (
        <>
            <Navbar></Navbar>
            <div className="element-matcher-container">
                {/* Simple Music Control Button */}
                <button 
                    className="music-control-button"
                    onClick={toggleBackgroundMusic}
                >
                    {isMusicPlaying ? <FaVolumeUp /> : <FaVolumeMute />}
                </button>
                
                <AnimatePresence mode="wait">
                    {!gameStarted ? (
                        <motion.div
                            key="start-screen"
                            className="start-screen"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.div 
                                className="title-container"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 3 }}
                            >
                                <FaAtom className="title-icon" />
                                <h1>Element Matcher</h1>
                            </motion.div>
                            
                            <p className="game-description">Challenge yourself with the fascinating world of chemistry! Match elements, symbols, and properties to become a chemical maestro!</p>

                            <div className="difficulty-selector">
                                <h3>Select Difficulty:</h3>
                                <div className="difficulty-buttons">
                                    <motion.button
                                        className={`difficulty-btn easy ${difficulty === 'easy' ? 'selected' : ''}`}
                                        onClick={() => {
                                            setDifficulty('easy');
                                            playSound('buttonClick');
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FaFlask className="difficulty-icon" />
                                        Easy
                                    </motion.button>
                                    <motion.button
                                        className={`difficulty-btn medium ${difficulty === 'medium' ? 'selected' : ''}`}
                                        onClick={() => {
                                            setDifficulty('medium');
                                            playSound('buttonClick');
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FaFlask className="difficulty-icon" />
                                        Medium
                                    </motion.button>
                                    <motion.button
                                        className={`difficulty-btn hard ${difficulty === 'hard' ? 'selected' : ''}`}
                                        onClick={() => {
                                            setDifficulty('hard');
                                            playSound('buttonClick');
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <FaFlask className="difficulty-icon" />
                                        Hard
                                    </motion.button>
                                </div>
                            </div>

                            <motion.button 
                                className="start-button"
                                onClick={startGame}
                                whileHover={{ scale: 1.05, boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)" }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaVial className="button-icon" />
                                Start Game
                            </motion.button>
                            
                            <motion.div 
                                className="periodic-decoration"
                                animate={{
                                    opacity: [0.5, 1, 0.5],
                                    rotateZ: [0, 360]
                                }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            />
                        </motion.div>
                    ) : gameOver ? (
                        <GameOver
                            score={score}
                            startNewGame={startGame}
                            difficulty={difficulty}
                            playSound={playSound}
                        />
                    ) : (
                        <motion.div 
                            key="game-container"
                            className="game-container"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <GameHeader
                                score={score}
                                lives={lives}
                                timeLeft={timeLeft}
                                difficulty={difficulty}
                            />

                            {currentQuestion && (
                                <QuestionCard
                                    element={currentQuestion.element}
                                    questionType={currentQuestion.questionType}
                                    options={options}
                                    onSelectAnswer={handleAnswerSelect}
                                />
                            )}

                            <GameControls
                                onChangeDifficulty={(newDifficulty) => {
                                    playSound('buttonClick');
                                    setDifficulty(newDifficulty);
                                    startGame();
                                }}
                                playSound={playSound}
                            />
                            
                            <div className="game-background-elements">
                                <div className="bubble bubble-1"></div>
                                <div className="bubble bubble-2"></div>
                                <div className="bubble bubble-3"></div>
                                <div className="molecule molecule-1"></div>
                                <div className="molecule molecule-2"></div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default ElementMatcher;