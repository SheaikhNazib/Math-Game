import React, { useState, useEffect } from "react";
import flagsData from "../Json/flags.json";
import Navbar from "./Navbar";

const FlagGames = () => {
  const [currentFlag, setCurrentFlag] = useState(null);
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [allFlags, setAllFlags] = useState([]);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(10);
  const [highScore, setHighScore] = useState(() => localStorage.getItem("highScore") || 0);
  const [hintUsed, setHintUsed] = useState(false);
  const [gameStatus, setGameStatus] = useState("notStarted"); // "notStarted", "playing", "finished"
  const [correctAnswers, setCorrectAnswers] = useState(0); // New state for correct answers
  const [wrongAnswers, setWrongAnswers] = useState(0); // New state for wrong answers

  useEffect(() => {
    const countries = flagsData.countries;
    setAllFlags(countries);
  }, []);

  useEffect(() => {
    if (gameStatus === "playing" && timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setMessage("Time's up! The correct answer was " + currentFlag.name);
      setWrongAnswers((prev) => prev + 1); // Increment wrong answers
      setTimeout(() => setGameStatus("finished"), 2000);
    }
  }, [timer, gameStatus]);

  const loadNewFlag = () => {
    const countries = flagsData.countries;
    const randomIndex = Math.floor(Math.random() * countries.length);
    const flag = countries[randomIndex];
    setCurrentFlag(flag);

    let choices = new Set();
    choices.add(flag.name);
    while (choices.size < 4) {
      const randomChoice = countries[Math.floor(Math.random() * countries.length)].name;
      choices.add(randomChoice);
    }
    setOptions([...choices].sort(() => Math.random() - 0.5));
    setMessage("");
    setTimer(10);
    setHintUsed(false);
  };

  const startGame = () => {
    setScore(0);
    setStreak(0);
    setCorrectAnswers(0); // Reset correct answers
    setWrongAnswers(0); // Reset wrong answers
    setGameStatus("playing");
    loadNewFlag();
  };

  const playAgain = () => {
    setGameStatus("notStarted");
    setMessage("");
  };

  const checkAnswer = (selected) => {
    if (selected === currentFlag.name) {
      setMessage("Correct!");
      setScore(score + 10);
      setStreak(streak + 1);
      setCorrectAnswers((prev) => prev + 1); // Increment correct answers
    } else {
      setMessage("Wrong! The correct answer was " + currentFlag.name);
      setStreak(0);
      setWrongAnswers((prev) => prev + 1); // Increment wrong answers
    }

    if (score + 10 > highScore) {
      setHighScore(score + 10);
      localStorage.setItem("highScore", score + 10);
    }

    // Trigger spinning animation before loading the next flag
    setIsSpinning(true);
    let spinInterval = setInterval(() => {
      const randomFlag = allFlags[Math.floor(Math.random() * allFlags.length)];
      setCurrentFlag(randomFlag);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      setIsSpinning(false);
      if (gameStatus === "playing") loadNewFlag();
    }, 2000); // Adjust timing to match the spin duration
  };

  const handleHint = () => {
    if (!hintUsed) {
      const filteredOptions = options.filter((opt) => opt === currentFlag.name || Math.random() > 0.5);
      setOptions(filteredOptions);
      setHintUsed(true);
    }
  };

  const handleSpin = () => {
    setIsSpinning(true);
    let spinInterval = setInterval(() => {
      const randomFlag = allFlags[Math.floor(Math.random() * allFlags.length)];
      setCurrentFlag(randomFlag);
    }, 100);

    setTimeout(() => {
      clearInterval(spinInterval);
      loadNewFlag();
      setIsSpinning(false);
    }, 3000);
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="flex flex-col items-center p-6 bg-gradient-to-b from-blue-500 to-purple-600 min-h-screen text-white transition-all">
          {gameStatus === "notStarted" && (
            <button
              className="btn btn-primary text-3xl font-bold rounded-lg animate-bounce my-auto p-7"
              onClick={startGame}
            >
              Start Game
            </button>
          )}


        {gameStatus === "playing" && (
          <>
            <h1 className="text-3xl font-bold mb-4 animate-bounce">Guess the Flag</h1>
            <p className="text-lg font-semibold">Score: {score} | Streak: {streak} 🔥 | High Score: {highScore}</p>
            <p className="text-red-300 font-bold animate-pulse">Time Left: {timer}s</p>
            {currentFlag && (
              <div className="mb-4 border h-96 w-96 flex justify-center items-center bg-white shadow-lg rounded-lg p-4 animate-fade-in">
                <img
                  src={currentFlag.flag}
                  alt="Flag"
                  className={`w-64 h-auto border-4 border-gray-300 rounded-lg shadow-md transition-transform duration-500 ease-in-out transform ${isSpinning ? "spin-animation" : "hover:scale-110"}`}
                />
              </div>
            )}

            <button className="btn btn-secondary my-2 animate-wiggle" onClick={handleSpin} disabled={isSpinning}>
              {isSpinning ? "Spinning..." : "Spin"}
            </button>
            <button className="btn btn-warning my-2 animate-flash" onClick={handleHint} disabled={hintUsed}>
              {hintUsed ? "Hint Used" : "Use Hint"}
            </button>

            <div className="grid grid-cols-2 gap-4">
              {options.map((option, index) => (
                <button
                  className="btn btn-primary hover:bg-green-400 hover:text-black transform transition-all duration-300"
                  key={index}
                  onClick={() => checkAnswer(option)}
                >
                  {option}
                </button>
              ))}
            </div>
            {message && <p className="mt-4 text-lg font-semibold text-yellow-300 animate-pop-in">{message}</p>}
          </>
        )}

        {gameStatus === "finished" && (
          <>
            <h1 className="text-3xl font-bold mb-4">Game Over</h1>
            <p className="text-lg font-semibold">Final Score: {score}</p>
            <p className="text-lg font-semibold">Correct Answers: {correctAnswers}</p>
            <p className="text-lg font-semibold">Wrong Answers: {wrongAnswers}</p>
            <button
              className="btn mt-10 btn-primary text-xl font-bold p-4 rounded-lg animate-bounce"
              onClick={playAgain}
            >
              Play Again
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default FlagGames;