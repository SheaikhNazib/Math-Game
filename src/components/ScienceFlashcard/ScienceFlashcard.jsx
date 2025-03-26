import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import flashcardsData from "../../Json/flashCard.json";
import music2 from "../../assets/music/music2.mp3";
import click_sound from "../../assets/music/click_sound.mp3";
import Navbar from "../Navbar";

const happyEmojis = ["🎉", "🚀", "🌈", "🌟", "🎈", "😄"];
const sadEmojis = ["🤔", "💡", "✨", "👀", "🔄"];

// Shuffle function - Fisher-Yates algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function FlashcardGame() {
  // Original flashcards from JSON
  const originalFlashcards = flashcardsData.flashcards || [];
  // State to hold shuffled flashcards
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds default
  const [timerActive, setTimerActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [musicLoaded, setMusicLoaded] = useState(false);
  const [musicError, setMusicError] = useState(false);
  
  // Initialize with shuffled cards
  useEffect(() => {
    if (originalFlashcards.length > 0) {
      setFlashcards(shuffleArray(originalFlashcards));
    }
  }, [originalFlashcards]);
  
  const bgMusicRef = useRef(null);
  const clickSoundRef = useRef(null);

  // Initialize click sound
  useEffect(() => {
    // Create click sound player
    clickSoundRef.current = new Audio(click_sound);
    clickSoundRef.current.volume = 0.5;
    
    return () => {
      if (clickSoundRef.current) {
        clickSoundRef.current = null;
      }
    };
  }, []);

  // Play click sound function
  const playClickSound = () => {
    if (soundEnabled && clickSoundRef.current) {
      // Clone the audio to allow multiple rapid clicks
      const clickSound = clickSoundRef.current.cloneNode();
      clickSound.volume = 0.5;
      clickSound.play().catch(e => console.error("Error playing click sound:", e));
    }
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (timerActive && timeLeft > 0 && !isPaused) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      setTimerActive(false);
      endGame();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft, isPaused]);
  
  // Setup music only when needed
  const setupMusic = () => {
    if (!musicLoaded && !bgMusicRef.current) {
      try {
        bgMusicRef.current = new Audio();
        bgMusicRef.current.src = music2;
        bgMusicRef.current.loop = true;
        bgMusicRef.current.volume = 0.3;
        
        bgMusicRef.current.addEventListener('canplaythrough', () => {
          setMusicLoaded(true);
          setMusicError(false);
          // Only play if the game is started and sound is enabled
          if (soundEnabled && gameStarted && !gameOver && !isPaused) {
            bgMusicRef.current.play().catch(e => console.error("Error playing background music:", e));
          }
        });
        
        bgMusicRef.current.addEventListener('error', () => {
          console.error("Error loading music file");
          setMusicError(true);
        });
        
        // Start loading but don't autoplay
        bgMusicRef.current.load();
      } catch (error) {
        console.error("Error setting up music:", error);
        setMusicError(true);
      }
    }
  };
  
  // Cleanup music on unmount
  useEffect(() => {
    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
        bgMusicRef.current.src = '';
        bgMusicRef.current = null;
      }
    };
  }, []);
  
  // Toggle sound
  const toggleSound = () => {
    playClickSound();
    setSoundEnabled(!soundEnabled);
    
    if (!soundEnabled) {
      // Turning sound back on
      if (gameStarted && !gameOver && !isPaused) {
        setupMusic();
        if (bgMusicRef.current && musicLoaded) {
          bgMusicRef.current.play().catch(e => console.error("Error playing background music:", e));
        }
      }
    } else {
      // Turning sound off
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    }
  };
  
  // Pause game
  const pauseGame = () => {
    playClickSound();
    setIsPaused(true);
    if (bgMusicRef.current && soundEnabled) {
      bgMusicRef.current.pause();
    }
  };
  
  // Resume game
  const resumeGame = () => {
    playClickSound();
    setIsPaused(false);
    if (bgMusicRef.current && soundEnabled && musicLoaded) {
      bgMusicRef.current.play().catch(e => console.error("Error playing background music:", e));
    }
  };
  
  // Start game - now with shuffling
  const startGame = () => {
    playClickSound();
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setStreak(0);
    setCurrentIndex(0);
    setTimeLeft(60); // Reset timer to 60 seconds
    setTimerActive(true);
    setIsPaused(false);
    
    // Shuffle cards at the start of each game
    setFlashcards(shuffleArray(originalFlashcards));
    
    // Setup and start background music only if sound is enabled
    if (soundEnabled) {
      setupMusic();
    }
  };
  
  // End game
  const endGame = () => {
    setGameOver(true);
    setTimerActive(false);
    setIsPaused(false);
    
    // Pause background music
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
    }
  };

  if (!flashcards.length) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600 mb-4">Error Loading Flashcards</h1>
            <p className="text-xl text-gray-600">Please check if the flashcards data is available.</p>
          </div>
        </div>
      </>
    );
  }

  const handleAnswer = (option) => {
    playClickSound();
    setSelectedAnswer(option);
    if (option === flashcards[currentIndex].answer) {
      setCelebrate(true);
      setScore(prev => prev + 10);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    playClickSound();
    setCelebrate(false);
    setSelectedAnswer(null);
    setIsFlipped(false);
    
    // Check if this was the last card
    if (currentIndex === flashcards.length - 1) {
      endGame();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const flipCard = () => {
    playClickSound();
    setIsFlipped(!isFlipped);
  };

  // Welcome Screen
  if (!gameStarted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center bg-white p-6 md:p-8 rounded-xl shadow-xl max-w-md w-full"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-4">Science Flashcard Game</h1>
    
            <div className="space-y-4">
              <div className="text-md md:text-xl font-bold text-gray-700 space-y-4">
                <p>⏱️ You'll have 60 seconds to answer as many questions as possible</p>
                <p>🔊 Background music will play during the game</p>
              </div>
              <button
                onClick={startGame}
                className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg md:text-xl font-bold hover:bg-blue-600 transition-colors w-full md:w-auto"
              >
                Play Now 🚀
              </button>
              <div className="mt-4 flex items-center justify-center gap-4">
                <button
                  onClick={toggleSound}
                  className="bg-gray-200 p-2 rounded-full"
                  title={soundEnabled ? "Mute sounds" : "Enable sounds"}
                >
                  {soundEnabled ? "🔊" : "🔇"}
                </button>
                {musicError && (
                  <span className="text-red-500 text-sm">
                    ⚠️ Music failed to load
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  // Game Over Screen
  if (gameOver) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center bg-white p-6 md:p-8 rounded-xl shadow-xl w-full max-w-md"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-purple-600 mb-4">Game Over!</h1>
            
            <div className="bg-blue-50 p-4 md:p-6 rounded-lg my-4 md:my-6">
              <h2 className="text-xl md:text-2xl font-bold text-blue-800 mb-4">Scoreboard</h2>
              <div className="flex justify-between text-lg md:text-xl mb-2">
                <span className="font-medium">Final Score:</span>
                <span className="font-bold text-blue-600">{score}</span>
              </div>
              <div className="flex justify-between text-lg md:text-xl mb-2">
                <span className="font-medium">Highest Streak:</span>
                <span className="font-bold text-purple-600">{streak}</span>
              </div>
              <div className="flex justify-between text-lg md:text-xl">
                <span className="font-medium">Cards Completed:</span>
                <span className="font-bold text-green-600">{currentIndex + 1}</span>
              </div>
            </div>
            
            <button
              onClick={startGame}
              className="bg-green-500 text-white px-6 py-3 rounded-full text-lg md:text-xl font-bold hover:bg-green-600 transition-colors w-full"
            >
              Play Again 🔄
            </button>
          </motion.div>
        </div>
      </>
    );
  }

  // Game Screen
  return (
    <>
      <Navbar />
      <div className={`min-h-screen p-4 md:p-8 flex flex-col items-center gap-4 md:gap-6 transition-colors duration-500 ${flashcards[currentIndex].theme}-theme`}>
        <style jsx global>{`
          .blue-theme { background: #e3f2fd; }
          .red-theme { background: #ffebee; }
          .rainbow-theme { background: linear-gradient(45deg, #ff6b6b, #4ecdc4); }
          .yellow-theme { background: #fff9c4; }
          .black-theme { background: #f5f5f5; }
          .brown-theme { background: #efebe9; }
          .green-theme { background: #e8f5e9; }
          .purple-theme { background: #f3e5f5; }
          .gray-theme { background: #f5f5f5; }
          .orange-theme { background: #fff3e0; }
          .darkblue-theme { background: #e3f2fd; }
          .navy-theme { background: #e8eaf6; }
          .btn-option { 
            padding: 0.75rem 1.5rem;
            border-radius: 2rem;
            font-size: 1rem;
            transition: all 0.3s;
            border: 3px solid transparent;
          }
          @media (min-width: 768px) {
            .btn-option {
              padding: 1rem 2rem;
              font-size: 1.2rem;
            }
          }
          .content-blur {
            filter: blur(5px);
            pointer-events: none;
          }
        `}</style>

        {/* Pause Screen Overlay */}
        {isPaused && (
          <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white p-6 md:p-8 rounded-xl shadow-xl text-center max-w-sm w-full mx-4"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-purple-600 mb-4 md:mb-6">Game Paused</h2>
              <p className="text-md md:text-lg text-gray-600 mb-6 md:mb-8">Take a moment to breathe!</p>
              <button 
                onClick={resumeGame}
                className="bg-green-500 text-white px-6 py-3 rounded-full text-lg md:text-xl font-bold hover:bg-green-600 transition-colors w-full"
              >
                Resume Game ▶️
              </button>
            </motion.div>
          </div>
        )}

        <div className={`w-full max-w-xl bg-white rounded-lg p-4 shadow-lg ${isPaused ? 'content-blur' : ''}`}>
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg md:text-xl font-bold text-blue-600">Score: {score}</div>
            
            <div className="flex items-center">
              <div className={`text-lg md:text-xl font-bold ${timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-orange-500'} mr-4`}>
                ⏱️ {timeLeft}s
              </div>
              
              <button 
                onClick={toggleSound} 
                className="bg-gray-200 p-2 rounded-full mr-2"
                title={soundEnabled ? "Mute sounds" : "Enable sounds"}
              >
                {soundEnabled ? "🔊" : "🔇"}
              </button>
              
              <button 
                onClick={isPaused ? resumeGame : pauseGame} 
                className="bg-gray-200 p-2 rounded-full"
                title={isPaused ? "Resume game" : "Pause game"}
              >
                {isPaused ? "▶️" : "⏸️"}
              </button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-2">
            <div className="text-md md:text-lg font-bold text-purple-600">Streak: {streak}</div>
            <div className="text-md md:text-lg font-medium text-gray-600">
              Card {currentIndex + 1}/{flashcards.length}
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div
              className="bg-blue-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <motion.div
          className={`${isPaused ? 'content-blur' : ''}`}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full md:w-80 h-48 relative bg-white border rounded-2xl shadow-xl flex items-center justify-center text-xl md:text-2xl p-4 md:p-6 backface-hidden">
            {!isFlipped ? (
              <span className="font-semibold text-blue-600">{flashcards[currentIndex].question}</span>
            ) : (
              <div className="rotate-y-180">
                <img
                  src={flashcards[currentIndex].image}
                  alt="Visual clue"
                  className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-2 md:mb-4 animate-bounce"
                />
                <p className="text-green-600 font-bold">{flashcards[currentIndex].answer}</p>
              </div>
            )}
          </div>
        </motion.div>

        <div className={`grid grid-cols-2 gap-3 md:gap-4 w-full max-w-xl ${isPaused ? 'content-blur' : ''}`}>
          {flashcards[currentIndex].options.map((option, index) => (
            <motion.button
              key={index}
              className={`btn-option ${selectedAnswer === option
                ? option === flashcards[currentIndex].answer
                  ? "bg-green-400 scale-110"
                  : "bg-red-400 scale-90"
                : "bg-blue-400 hover:scale-105"} text-white font-bold shadow-lg`}
              onClick={() => handleAnswer(option)}
              disabled={!!selectedAnswer}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {option}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {selectedAnswer && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className={`text-xl md:text-3xl font-bold flex flex-col md:flex-row items-center gap-3 md:gap-4 ${isPaused ? 'content-blur' : ''}`}
            >
              <span>
                {selectedAnswer === flashcards[currentIndex].answer
                  ? `${happyEmojis[Math.floor(Math.random() * happyEmojis.length)]} Correct! +10 points!`
                  : `${sadEmojis[Math.floor(Math.random() * sadEmojis.length)]} Try Again!`}
              </span>
              <button
                className="btn-option bg-purple-500 text-white animate-pulse"
                onClick={handleNext}
              >
                Next Question ➡
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {celebrate && (
          <div className={`celebration ${isPaused ? 'content-blur' : ''}`}>
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl md:text-3xl"
                initial={{ scale: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  y: [-100, 0],
                  x: Math.random() * 100 - 50
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {["🎉", "🎈", "🌟"][i % 3]}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}