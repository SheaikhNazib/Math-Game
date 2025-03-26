import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import gamepad from "../../assets/gif/gamepad.json";
import old_timer from "../../assets/gif/old_timer.json";
import sad from "../../assets/gif/sad.json";
import Navbar from "../Navbar";

const words = ["APPLE", "BANANA", "ORANGE", "GRAPE", "MANGO"];

export default function WordGame() {
  const [originalWord, setOriginalWord] = useState("");
  const [shuffledWord, setShuffledWord] = useState([]);
  const [selectedLetters, setSelectedLetters] = useState([]);
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [paused, setPaused] = useState(false);

  const shuffleWord = (word) => {
    let shuffled = word.split("");
    do {
      shuffled = shuffled.sort(() => Math.random() - 0.5);
    } while (shuffled.join("") === word);
    return shuffled;
  };

  const startNewGame = () => {
    const word = words[Math.floor(Math.random() * words.length)];
    setOriginalWord(word);
    setShuffledWord(shuffleWord(word));
    setSelectedLetters([]);
    setTimer(30);
    setGameOver(false);
    setGameStarted(true);
    setPaused(false);
    speak("Rearrange the word");
  };

  useEffect(() => {
    if (timer > 0 && gameStarted && !gameOver && !paused) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setGameOver(true);
    }
  }, [timer, gameOver, gameStarted, paused]);

  const selectLetter = (letter, index) => {
    setSelectedLetters([...selectedLetters, letter]);
    setShuffledWord(shuffledWord.filter((_, i) => i !== index));
  };

  const undoLetter = () => {
    if (selectedLetters.length > 0) {
      setShuffledWord([...shuffledWord, selectedLetters[selectedLetters.length - 1]]);
      setSelectedLetters(selectedLetters.slice(0, -1));
    }
  };

  const checkWord = () => {
    if (selectedLetters.join("") === originalWord) {
      setScore(score + 10);
      startNewGame();
    }
  };

  const togglePause = () => {
    setPaused(!paused);
  };

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  return (
    <>
      <Navbar />
      <div className="relative flex flex-col items-center gap-4 p-6 min-h-screen">
        {paused && (
          <div className="absolute inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50">
            <button
              onClick={togglePause}
              className="bg-green-500 text-white px-6 py-3 rounded-xl text-3xl shadow-lg hover:bg-green-600"
            >
              ▶ Resume
            </button>
          </div>
        )}
        <h1 className="text-5xl font-bold text-pink-600">🎉 Word Scramble Fun! 🎈</h1>

        {!gameStarted ? (
          <button onClick={startNewGame} className="bg-yellow-500 text-white px-6 py-3 rounded-xl text-xl shadow-lg flex items-center gap-2 hover:bg-yellow-600">
            <Lottie animationData={gamepad} loop={true} style={{ height: "50px" }} /> Play Now
          </button>
        ) : gameOver ? (
          <div className="text-center bg-red-300 p-6 rounded-lg shadow-lg border-4 border-red-500 w-80">
            <h2 className="text-3xl font-bold text-red-700">
              Game Over!
              <Lottie animationData={sad} loop={true} style={{ height: "50px" }} />
            </h2>
            <p className="text-xl font-bold text-gray-800 my-6">Your Final Score: {score} 🎯</p>
            <button onClick={() => setGameStarted(false)} className="bg-purple-500 text-white px-6 py-3 rounded-xl text-xl shadow-lg hover:bg-purple-600">
              Play Again 🔄
            </button>
          </div>
        ) : (
          <>
            <div className="p-4 text-center bg-yellow-200 rounded-lg shadow-lg border-4 border-yellow-400">
              <h2 className="text-lg font-bold mb-3">Arrange the word:</h2>
              <div className="flex justify-center gap-2">
                {shuffledWord.map((letter, index) => (
                  <motion.button
                    key={index}
                    className="text-white px-4 py-2 font-bold rounded-lg text-4xl shadow-md hover:scale-110 bg-blue-500"
                    whileTap={{ scale: 0.9, rotate: 10 }}
                    onClick={() => selectLetter(letter, index)}
                  >
                    {letter}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="p-4 w-80 bg-green-200 rounded-lg shadow-lg border-4 border-green-400">
              <h2 className="text-lg font-bold">Your Selection:</h2>
              <div className="flex justify-center gap-2">
                {selectedLetters.map((letter, index) => (
                  <span key={index} className="text-2xl font-bold text-purple-700">{letter}</span>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={undoLetter} className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md text-lg hover:bg-red-600">
                ↩ Undo
              </button>
              <button onClick={checkWord} className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md text-lg hover:bg-green-600">
                ✅ Submit
              </button>
              <button onClick={togglePause} className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md text-lg hover:bg-gray-600">
                {paused ? "▶ Resume" : "⏸ Pause"}
              </button>
            </div>

            <p className="text-lg font-bold text-blue-700">
              <Lottie animationData={old_timer} loop={true} style={{ height: "100px" }} /> Time Left: {timer}s
            </p>
            <p className="text-lg font-bold text-orange-600">🌟 Score: {score}</p>
          </>
        )}
      </div>
    </>
  );
}
