import React, { useState, useEffect } from "react";
import Navbar from "../Navbar.jsx";
import apple from '../../assets/image/apple.png';
import ball from '../../assets/image/ball.png';
import cat from '../../assets/image/cat.png';
import rat from '../../assets/image/rat.png';
import Lottie from "lottie-react";
import study from "../../assets/gif/study.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGamepad } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import clock from "../../assets/gif/clock.json";
// import background from "../assets/image/background.png"
// import '../styles.css'; // Import the CSS file

const images = [apple, ball, cat, rat];

const buttonColors = ["bg-green-500", "bg-blue-500", "bg-red-500", "bg-yellow-500"];

const ImageGame = () => {
    const [num1, setNum1] = useState(0);
    const [num2, setNum2] = useState(0);
    const [operator, setOperator] = useState("+");
    const [options, setOptions] = useState([]);
    const [score, setScore] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [wrongCount, setWrongCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);

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
            return () => clearInterval(timer);
        }
    }, [gameStarted]);

    const generateQuestion = () => {
        const randomImageIndex = Math.floor(Math.random() * images.length);
        let n1 = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
        let n2 = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
        const randomOperator = Math.random() > 0.5 ? "+" : "-";

        if (randomOperator === "-" && n1 < n2) {
            [n1, n2] = [n2, n1]; // Swap to ensure n1 is greater than or equal to n2
        }

        setNum1(n1);
        setNum2(n2);
        setOperator(randomOperator);
        setImageIndex(randomImageIndex);

        const correctAnswer = randomOperator === "+" ? n1 + n2 : n1 - n2;
        const answers = [correctAnswer, correctAnswer + 2, correctAnswer - 1, correctAnswer + 3].sort(() => Math.random() - 0.5);
        setOptions(answers);
    };

    const checkAnswer = (selectedAnswer) => {
        const correctAnswer = operator === "+" ? num1 + num2 : num1 - num2;
        if (selectedAnswer === correctAnswer) {
            setScore(score + 1);
            setCorrectCount(correctCount + 1);
        } else {
            setWrongCount(wrongCount + 1);
        }
        generateQuestion();
    };

    const renderImages = (count) => {
        return Array.from({ length: count }).map((_, index) => (
            <img key={index} src={images[imageIndex]} alt="num" className="w-16 h-16 wavy" />
        ));
    };

    const startGame = () => {
        setScore(0);
        setCorrectCount(0);
        setWrongCount(0);
        setTimeLeft(30);
        setGameOver(false);
        setGameStarted(true);
    };

    return (
        <>
            <div
                className="flex flex-col items-center justify-center pt-5 bg-cyan-200 min-h-screen"

            >
                <div className="wave-container">
                    <h1 className="text-5xl text-center font-bold mb-4 wave-text">
                        <span className="text-green-500">M</span><span className="text-red-500">a</span><span className="text-blue-500">t</span><span className="text-yellow-500">h</span> Challenge!
                    </h1>
                </div>
                <Lottie animationData={study} loop={true} style={{ height: '300px' }} />
                {!gameStarted ? (
                    <button
                        onClick={startGame}
                        className="mt-4 mb-96 px-6 py-3 bg-green-500 text-black rounded text-xl hover:text-white hover:scale-110"
                    >
                        <FontAwesomeIcon className="me-2" icon={faGamepad} />Start Game
                    </button>
                ) : gameOver ? (
                    <div className="text-2xl font-bold text-center mb-24">
                        <p className="mt-4 p-5 rounded-lg text-center bg-green-400 text-5xl"> <FontAwesomeIcon className="me-2" icon={faStar} />Your score is: {score * 10}</p>
                        <p className="mt-4 p-5 rounded-lg text-center bg-red-400 text-5xl"> <FontAwesomeIcon className="me-2" icon={faCircleCheck} />Correct Answers: {correctCount}</p>
                        <p className="mt-4 mb-8 p-5 rounded-lg text-center bg-blue-400 text-5xl"> <FontAwesomeIcon className="me-2" icon={faCircleXmark} />Wrong Answers: {wrongCount}</p>
                        <button
                            className="mt-4 px-6 py-3 bg-blue-500 text-white rounded text-xl hover:text-black hover:scale-105 hover:transition-transform"
                            onClick={startGame}
                        >
                            Play Again
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-3xl font-bold mb-2">Solve the math problem before time runs out!</p>
                        {/* <p className="mt-4 mb-8 p-5 rounded-lg w-2/6 text-center bg-purple-400 text-5xl ">Time Left: {timeLeft}</p> */}
                        <div className="mt-4 mb-12 p-5 rounded-lg w-2/6 text-center bg-purple-400 text-5xl flex justify-center items-center">
                            <Lottie className="h-24" animationData={clock} loop={true} />
                            Time Left: <span className="font-bold ms-2"> {timeLeft}</span> s
                        </div>

                        <div className="flex flex-col items-center justify-center bg-blue-400 px-28 py-6 rounded">
                            <div className="flex">
                                {renderImages(num1)}
                            </div>
                            <span className="text-6xl font-bold mx-2">{operator}</span>
                            <div className="flex">
                                {renderImages(num2)}
                            </div>
                            <span className="text-6xl font-bold mx-2">= ?</span>
                        </div>
                        <div className="grid grid-cols-2 gap-8 mt-4">
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
                        <p className="mt-4 mb-8 p-5 rounded-lg w-2/6 text-center bg-red-400 text-5xl "> <FontAwesomeIcon className="me-2" icon={faCircleXmark} />Wrong Answers: {wrongCount}</p>

                    </>
                )}
            </div>
        </>
    );
}

export default ImageGame;