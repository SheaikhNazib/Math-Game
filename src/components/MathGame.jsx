import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Lottie from "lottie-react";
import emoji from "../assets/gif/emoji.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faStar, faCircleXmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import clock from "../assets/gif/clock.json";
import music1 from "../assets/music/music1.mp3"; // Import audio file properly

const MathGame = () => {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [operator, setOperator] = useState("+");
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [audio] = useState(() => {
        const audioInstance = new Audio(music1);
        audioInstance.preload = "none"; // Prevent preloading of the audio file
        return audioInstance;
    });

    const buttonColors = ["bg-green-500", "bg-blue-500", "bg-red-500", "bg-yellow-500"];

    const startGame = () => {
        setGameStarted(true);
        setScore(0);
        setCorrectCount(0);
        setWrongCount(0);
        setTimeLeft(30);
        setGameOver(false);

        // Play audio after user interaction
        audio.loop = true;
        audio.play().catch((error) => {
            console.error("Audio playback failed:", error);
        });
    };

    useEffect(() => {
        if (gameStarted) {
            generateQuestion();

            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev === 1) {
                        setGameOver(true);
                        clearInterval(timer);
                    }
                    return prev > 0 ? prev - 1 : 0;
                });
            }, 1000);

            return () => {
                clearInterval(timer);
                audio.pause();
            };
        }
    }, [gameStarted]);

    const generateQuestion = () => {
        const operators = ["+", "-", "×", "÷"];
        const randomOperator = operators[Math.floor(Math.random() * operators.length)];
        let range = 10; // Default range for questions
        let n1 = Math.floor(Math.random() * range) + 1;
        let n2 = Math.floor(Math.random() * range) + 1;

        if (randomOperator === "÷") {
            n1 = n1 * n2;
        }
        setNum1(n1);
        setNum2(n2);
        setOperator(randomOperator);

        let correctAnswer;
        switch (randomOperator) {
            case "+": correctAnswer = n1 + n2; break;
            case "-": correctAnswer = n1 - n2; break;
            case "×": correctAnswer = n1 * n2; break;
            case "÷": correctAnswer = n1 / n2; break;
            default: return;
        }

        const answers = [correctAnswer, correctAnswer + 2, correctAnswer - 1, correctAnswer + 3].sort(() => Math.random() - 0.5);
        setOptions(answers);
    };

    const checkAnswer = (selectedAnswer) => {
        let correctAnswer;
        switch (operator) {
            case "+": correctAnswer = num1 + num2; break;
            case "-": correctAnswer = num1 - num2; break;
            case "×": correctAnswer = num1 * num2; break;
            case "÷": correctAnswer = num1 / num2; break;
            default: return;
        }
        if (selectedAnswer === correctAnswer) {
            setScore(score + 1);
            setCorrectCount(correctCount + 1);
        } else {
            setWrongCount(wrongCount + 1);
        }
        generateQuestion();
    };

    const restartGame = () => {
        setGameStarted(false); // Reset to show the Start Game button
    };

    return (
        <>
            <Navbar></Navbar>
            <div className="pt-6 flex flex-col items-center justify-center bg-blue-100">
                <div className="wave-container">
                    <h1 className="text-5xl text-center font-bold mb-4 wave-text">
                        <span className="text-green-500">M</span><span className="text-red-500">a</span><span className="text-blue-500">t</span><span className="text-yellow-500">h</span> Challenge!
                    </h1>
                    <Lottie animationData={emoji} loop={true} style={{ height: '300px' }} />
                </div>
                {!gameStarted ? (
                    <button
                        onClick={startGame}
                        className="mt-4 mb-96 px-6 py-3 bg-green-500 text-black rounded text-xl hover:text-white hover:scale-110"
                    >
                        <FontAwesomeIcon className="me-2" icon={faGamepad} />Start Game
                    </button>
                ) : gameOver ? (
                    <div className="text-2xl font-bold flex flex-col mb-32 justify-center">
                        <p className="mt-4 p-5 rounded-lg text-center bg-green-400 text-5xl"> <FontAwesomeIcon className="me-2" icon={faStar} />Your score is: {score * 10}</p>
                        <p className="mt-4 p-5 rounded-lg text-center bg-red-400 text-5xl"> <FontAwesomeIcon className="me-2" icon={faCircleCheck} />Correct Answers: {correctCount}</p>
                        <p className="mt-4 p-5 rounded-lg text-center bg-yellow-400 text-5xl"> <FontAwesomeIcon className="me-2" icon={faCircleXmark} />Wrong Answers: {wrongCount}</p>
                        <button
                            onClick={restartGame}
                            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded text-xl hover:text-black hover:scale-105 hover:transition-transform"
                        >
                            Play Again
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-3xl font-bold mb-2">Solve the math problem before time runs out!</p>
                        <p className="mt-4 mb-12 p-5 rounded-lg w-2/6 text-center bg-purple-400 text-5xl flex justify-center items-center"> <Lottie className="h-24" animationData={clock} loop={true} /> Time Left:  <span className="font-bold ms-2"> {timeLeft}</span> s</p>

                        <h2 className="text-6xl font-bold mb-3">{num1} {operator} {num2} = ?</h2>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`px-12 py-6 text-white rounded text-7xl hover:scale-110 hover:transition-transform hover:delay-200 ${buttonColors[index % buttonColors.length]}`}
                                    onClick={() => checkAnswer(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <p className="mt-4 p-5 rounded-lg w-2/6 text-center bg-green-400 text-5xl "> <FontAwesomeIcon className="me-2" icon={faStar} />Score: {score * 10}</p>
                        <p className="mt-4 mb-8 p-5 rounded-lg w-2/6 text-center bg-red-400 text-5xl"> <FontAwesomeIcon className="me-2" icon={faCircleXmark} />Wrong Answers: {wrongCount}</p>
                    </>
                )}
            </div>
        </>
    );
};

export default MathGame;