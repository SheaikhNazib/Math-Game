import React, { useState, useEffect, useRef } from 'react';
import './VocabularyVolcano.css';
import wrong_sound from '../../assets/music/wrong_sound.mp3';
import correct_sound from '../../assets/music/click_sound.mp3';
import bg_music from '../../assets/music/music1.mp3';
import Navbar from '../Navbar';

const VocabularyVolcano = () => {
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [eruptionLevel, setEruptionLevel] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const [currentWord, setCurrentWord] = useState(null);
    const [definitions, setDefinitions] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [audioLoaded, setAudioLoaded] = useState(false);

    // Audio refs - but don't instantiate the Audio objects immediately
    const correctSoundRef = useRef(null);
    const wrongSoundRef = useRef(null);
    const bgMusicRef = useRef(null);

    // Load audio only when needed
    const loadAudio = () => {
        if (!audioLoaded) {
            correctSoundRef.current = new Audio(correct_sound);
            wrongSoundRef.current = new Audio(wrong_sound);
            bgMusicRef.current = new Audio(bg_music);

            // Configure background music
            if (bgMusicRef.current) {
                bgMusicRef.current.loop = true;
                bgMusicRef.current.volume = 0.3;
            }

            setAudioLoaded(true);
        }
    };

    // Start/stop background music when game starts/ends
    useEffect(() => {
        if (!audioLoaded) return;

        const bgMusic = bgMusicRef.current;
        if (!bgMusic) return;

        if (gameStarted && !gameOver) {
            bgMusic.play().catch(e => console.log("Audio play failed:", e));
        } else {
            bgMusic.pause();
            bgMusic.currentTime = 0;
        }

        return () => {
            if (bgMusic) {
                bgMusic.pause();
                bgMusic.currentTime = 0;
            }
        };
    }, [gameStarted, gameOver, audioLoaded]);

    // Sample word list (you can move this to a separate file later)
    const wordList = [
        {
            id: 1,
            word: "Ubiquitous",
            definition: "Present, appearing, or found everywhere"
        },
        {
            id: 2,
            word: "Ephemeral",
            definition: "Lasting for a very short time"
        },
        {
            id: 3,
            word: "Verbose",
            definition: "Using or containing more words than needed"
        },
        {
            id: 4,
            word: "Ambiguous",
            definition: "Open to more than one interpretation"
        },
        {
            id: 5,
            word: "Benevolent",
            definition: "Well-meaning and kindly"
        },
        {
            id: 6,
            word: "Cacophony",
            definition: "A harsh, discordant mixture of sounds"
        },
        {
            id: 7,
            word: "Diligent",
            definition: "Having or showing care and conscientiousness"
        },
        {
            id: 8,
            word: "Enigma",
            definition: "A person or thing that is mysterious or difficult to understand"
        },
        {
            id: 9,
            word: "Fortuitous",
            definition: "Happening by chance rather than intention"
        },
        {
            id: 10,
            word: "Gregarious",
            definition: "Fond of company; sociable"
        }
    ];

    // Initialize or reset the game
    const startGame = () => {
        // Load audio when game starts
        loadAudio();

        setScore(0);
        setLevel(1);
        setEruptionLevel(0);
        setTimeLeft(30);
        setGameOver(false);
        setGameStarted(true);
        setSelectedOption(null);
        setIsCorrect(null);
        loadNewWord();
    };

    // Load a new word and definitions
    const loadNewWord = () => {
        // Reset selected option and correctness states
        setSelectedOption(null);
        setIsCorrect(null);

        // Get random word from our word list
        const randomIndex = Math.floor(Math.random() * wordList.length);
        const selectedWord = wordList[randomIndex];

        // Get 3 incorrect definitions as options
        const incorrectDefinitions = getRandomDefinitions(selectedWord.id, 3);

        // Combine correct and incorrect definitions and shuffle
        const allDefinitions = [
            { id: selectedWord.id, text: selectedWord.definition, correct: true },
            ...incorrectDefinitions
        ].sort(() => Math.random() - 0.5);

        setCurrentWord(selectedWord);
        setDefinitions(allDefinitions);
    };

    // Get random incorrect definitions
    const getRandomDefinitions = (currentWordId, count) => {
        const availableWords = wordList.filter(word => word.id !== currentWordId);
        const selectedDefinitions = [];

        for (let i = 0; i < count && i < availableWords.length; i++) {
            const randomIndex = Math.floor(Math.random() * availableWords.length);
            selectedDefinitions.push({
                id: availableWords[randomIndex].id,
                text: availableWords[randomIndex].definition,
                correct: false
            });
            availableWords.splice(randomIndex, 1);
        }

        return selectedDefinitions;
    };

    // Handle definition selection
    const handleDefinitionSelect = (definitionId) => {
        const isAnswerCorrect = definitionId === currentWord.id;
        setSelectedOption(definitionId);
        setIsCorrect(isAnswerCorrect);

        // Play appropriate sound only if audio is loaded
        if (audioLoaded) {
            if (isAnswerCorrect && correctSoundRef.current) {
                correctSoundRef.current.play().catch(e => console.log("Audio play failed:", e));
            } else if (!isAnswerCorrect && wrongSoundRef.current) {
                wrongSoundRef.current.play().catch(e => console.log("Audio play failed:", e));
            }
        }

        // Wait for animation to complete before proceeding
        setTimeout(() => {
            if (isAnswerCorrect) {
                // Correct answer
                setScore(prevScore => prevScore + (level * 10));
                setLevel(prevLevel => prevLevel + 1);

                // Decrease eruption level if possible
                if (eruptionLevel > 0) {
                    setEruptionLevel(prevLevel => prevLevel - 1);
                }

                // Add some time as reward
                setTimeLeft(prevTime => Math.min(prevTime + 5, 30));

                // Load next word
                loadNewWord();
            } else {
                // Incorrect answer
                setEruptionLevel(prevLevel => prevLevel + 1);

                // Check if volcano erupts
                if (eruptionLevel >= 4) {
                    setGameOver(true);
                }

                // Clear the selection after animation completes
                setTimeout(() => {
                    setSelectedOption(null);
                    setIsCorrect(null);
                }, 500);
            }
        }, 1000);
    };

    // Timer effect
    useEffect(() => {
        if (!gameStarted || gameOver) return;

        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setEruptionLevel(prevLevel => prevLevel + 1);

                    if (eruptionLevel >= 4) {
                        setGameOver(true);
                    } else {
                        loadNewWord();
                        return 30; // Reset timer
                    }
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [gameStarted, gameOver, eruptionLevel]);

    // Drawing the volcano with canvas
    const VolcanoCanvas = ({ eruptionLevel }) => {
        const canvasRef = React.useRef(null);

        React.useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;

            // Clear canvas
            ctx.clearRect(0, 0, width, height);

            // Draw volcano mountain
            ctx.fillStyle = '#8B4513'; // Brown
            ctx.beginPath();
            ctx.moveTo(width * 0.1, height * 0.8);
            ctx.lineTo(width * 0.45, height * 0.2);
            ctx.lineTo(width * 0.55, height * 0.2);
            ctx.lineTo(width * 0.9, height * 0.8);
            ctx.closePath();
            ctx.fill();

            // Draw crater
            ctx.fillStyle = '#4B2010'; // Dark brown
            ctx.beginPath();
            ctx.ellipse(width * 0.5, height * 0.2, width * 0.08, height * 0.05, 0, 0, Math.PI * 2);
            ctx.fill();

            // Draw lava based on eruption level
            if (eruptionLevel > 0) {
                // Lava colors
                const lavaGradient = ctx.createLinearGradient(
                    width * 0.5, height * 0.2,
                    width * 0.5, height * 0.8
                );
                lavaGradient.addColorStop(0, '#FF4500'); // Orange-red
                lavaGradient.addColorStop(0.7, '#FF0000'); // Red

                // Draw lava in crater
                ctx.fillStyle = lavaGradient;
                ctx.beginPath();
                ctx.ellipse(
                    width * 0.5,
                    height * 0.2,
                    width * 0.06,
                    height * 0.03,
                    0, 0, Math.PI * 2
                );
                ctx.fill();

                // Draw lava flows based on eruption level
                if (eruptionLevel >= 2) {
                    // Left lava flow
                    ctx.beginPath();
                    ctx.moveTo(width * 0.45, height * 0.2);
                    ctx.quadraticCurveTo(
                        width * 0.3, height * 0.5,
                        width * 0.25, height * 0.8
                    );
                    ctx.lineTo(width * 0.35, height * 0.8);
                    ctx.quadraticCurveTo(
                        width * 0.4, height * 0.5,
                        width * 0.47, height * 0.22
                    );
                    ctx.closePath();
                    ctx.fill();
                }

                if (eruptionLevel >= 3) {
                    // Right lava flow
                    ctx.beginPath();
                    ctx.moveTo(width * 0.55, height * 0.2);
                    ctx.quadraticCurveTo(
                        width * 0.7, height * 0.5,
                        width * 0.75, height * 0.8
                    );
                    ctx.lineTo(width * 0.65, height * 0.8);
                    ctx.quadraticCurveTo(
                        width * 0.6, height * 0.5,
                        width * 0.53, height * 0.22
                    );
                    ctx.closePath();
                    ctx.fill();
                }

                if (eruptionLevel >= 4) {
                    // Eruption lava and smoke
                    ctx.fillStyle = '#FF4500';
                    for (let i = 0; i < 20; i++) {
                        const x = width * 0.5 + (Math.random() - 0.5) * width * 0.2;
                        const y = height * 0.15 - Math.random() * height * 0.2;
                        const radius = Math.random() * width * 0.03 + width * 0.01;

                        ctx.beginPath();
                        ctx.arc(x, y, radius, 0, Math.PI * 2);
                        ctx.fill();
                    }

                    // Smoke
                    ctx.fillStyle = 'rgba(80, 80, 80, 0.6)';
                    for (let i = 0; i < 15; i++) {
                        const x = width * 0.5 + (Math.random() - 0.5) * width * 0.3;
                        const y = height * 0.1 - Math.random() * height * 0.3;
                        const radius = Math.random() * width * 0.05 + width * 0.02;

                        ctx.beginPath();
                        ctx.arc(x, y, radius, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        }, [eruptionLevel]);

        return (
            <canvas
                ref={canvasRef}
                width={300}
                height={400}
                className="volcano-canvas"
            />
        );
    };

    // Helper function to determine button class
    const getButtonClass = (definitionId) => {
        if (selectedOption !== definitionId) return "definition-option";

        if (isCorrect) return "definition-option correct";
        return "definition-option incorrect shake";
    };

    return (
        <>
        <Navbar></Navbar>
            <div className="vocabulary-volcano-game">
                {!gameStarted ? (
                    <div className="start-screen">
                        <h1>Vocabulary Volcano</h1>
                        <p>Match words with their definitions before the volcano erupts!</p>
                        <button onClick={startGame} className="play-now-button">Play Now</button>
                    </div>
                ) : (
                    <>
                        <div className="game-header">
                            <div className="header-item">
                                <span className="label">Score:</span>
                                <span className="value">{score}</span>
                            </div>
                            <div className="header-item">
                                <span className="label">Level:</span>
                                <span className="value">{level}</span>
                            </div>
                            <div className="header-item">
                                <span className="label">Time:</span>
                                <span className="value">{timeLeft}s</span>
                            </div>
                        </div>

                        <div className="game-content">
                            <div className="volcano-container">
                                <VolcanoCanvas eruptionLevel={eruptionLevel} />
                            </div>

                            <div className="game-play-area">
                                {currentWord && (
                                    <div className="word-display">
                                        <h2>{currentWord.word}</h2>
                                    </div>
                                )}

                                <div className="definition-options">
                                    {definitions.map((definition) => (
                                        <button
                                            key={definition.id}
                                            className={getButtonClass(definition.id)}
                                            onClick={() => {
                                                if (selectedOption === null) {
                                                    handleDefinitionSelect(definition.id);
                                                }
                                            }}
                                            disabled={selectedOption !== null}
                                        >
                                            {definition.text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {gameOver && (
                            <div className="modal-overlay">
                                <div className="modal-content">
                                    <h2>Game Over!</h2>
                                    <p>The volcano erupted!</p>

                                    <div className="results">
                                        <div className="result-item">
                                            <span className="result-label">Final Score:</span>
                                            <span className="result-value">{score}</span>
                                        </div>
                                        <div className="result-item">
                                            <span className="result-label">Level Reached:</span>
                                            <span className="result-value">{level}</span>
                                        </div>
                                    </div>

                                    <button onClick={startGame} className="restart-button">Play Again</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>

    );
};

export default VocabularyVolcano;