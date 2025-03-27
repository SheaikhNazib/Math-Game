import React, { useState, useEffect } from 'react';
import { wordsList } from './words';

const SpellingBee = () => {
  const [currentWord, setCurrentWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState('easy');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize speech synthesis
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; // Slightly slower for clarity
    speechSynthesis.speak(utterance);
  };

  const getRandomWord = () => {
    const words = wordsList[level];
    return words[Math.floor(Math.random() * words.length)];
  };

  const startNewRound = () => {
    const newWord = getRandomWord();
    setCurrentWord(newWord);
    setUserInput('');
    setFeedback('');
    setIsCorrect(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (userInput.toLowerCase() === currentWord.toLowerCase()) {
      setIsCorrect(true);
      setScore(score + (level === 'easy' ? 1 : level === 'medium' ? 2 : 3));
      setStreak(streak + 1);
      setFeedback('Correct! 🎉');
      
      // Increase difficulty after certain streaks
      if (streak === 4 && level === 'easy') {
        setLevel('medium');
        setFeedback('Level Up! Moving to Medium difficulty! 🚀');
      } else if (streak === 8 && level === 'medium') {
        setLevel('hard');
        setFeedback('Level Up! Moving to Hard difficulty! 🌟');
      }
      
      setTimeout(startNewRound, 1500);
    } else {
      setIsCorrect(false);
      setStreak(0);
      setFeedback(`Incorrect! The word was: ${currentWord}`);
    }
  };

  useEffect(() => {
    if (gameStarted && currentWord) {
      speak(currentWord);
    }
  }, [currentWord, gameStarted]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🐝 Spelling Bee Simulator
        </h1>

        {!gameStarted ? (
          <div className="text-center">
            <button
              onClick={() => {
                setGameStarted(true);
                startNewRound();
              }}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105"
            >
              Start Game 🎮
            </button>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-6">
              <div className="text-lg font-semibold">Score: {score}</div>
              <div className="text-lg font-semibold">Streak: {streak} 🔥</div>
              <div className="text-lg font-semibold capitalize">Level: {level}</div>
            </div>

            <div className="mb-6 text-center">
              <button
                onClick={() => speak(currentWord)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-all transform hover:scale-105"
              >
                🔊 Hear Word Again
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                placeholder="Type the word here..."
                autoFocus
              />
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105"
              >
                Submit
              </button>
            </form>

            {feedback && (
              <div
                className={`mt-4 p-3 rounded-lg text-center font-semibold ${
                  isCorrect
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {feedback}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SpellingBee;