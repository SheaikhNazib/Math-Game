import React, { useState, useEffect } from "react";
import flagsData from "../Flags/flags.json";
// import { Button } from "@/components/ui/button";

const FlagGames = () => {
  const [currentFlag, setCurrentFlag] = useState(null);
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadNewFlag();
  }, []);

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
  };

  const checkAnswer = (selected) => {
    if (selected === currentFlag.name) {
      setMessage("Correct!");
    } else {
      setMessage("Wrong! Try again.");
    }
    setTimeout(loadNewFlag, 2000);
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Guess the Flag</h1>
      {currentFlag && (
        <div className="mb-4">
          <img src={currentFlag.flag} alt="Flag" className="w-64 h-auto border-2 border-gray-300" />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <button key={index} onClick={() => checkAnswer(option)}>
            {option}
          </button>
        ))}
      </div>
      {message && <p className="mt-4 text-lg font-semibold">{message}</p>}
    </div>
  );
};

export default FlagGames;
