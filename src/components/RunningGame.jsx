import React, { useState, useEffect } from "react";

const lanes = [60, 140, 220];
const playerSize = 40;
const canvasWidth = 400;
const canvasHeight = 600;

const RunningGame = () => {
  const [playerLane, setPlayerLane] = useState(1);
  const [obstacles, setObstacles] = useState([]);
  const [coins, setCoins] = useState([]);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(5);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && playerLane > 0) {
        setPlayerLane(playerLane - 1);
      }
      if (e.key === "ArrowRight" && playerLane < 2) {
        setPlayerLane(playerLane + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playerLane]);

  useEffect(() => {
    const gameInterval = setInterval(() => {
      setObstacles((prev) => {
        const newObstacles = prev.map((obs) => ({ ...obs, y: obs.y + speed }));
        if (Math.random() < 0.03) {
          newObstacles.push({ x: lanes[Math.floor(Math.random() * 3)], y: -40 });
        }
        return newObstacles.filter((obs) => obs.y < canvasHeight);
      });

      setCoins((prev) => {
        const newCoins = prev.map((coin) => ({ ...coin, y: coin.y + speed }));
        if (Math.random() < 0.02) {
          newCoins.push({ x: lanes[Math.floor(Math.random() * 3)], y: -40 });
        }
        return newCoins.filter((coin) => coin.y < canvasHeight);
      });
      
      setScore((prev) => prev + 1);
      if (score % 100 === 0) setSpeed((prev) => prev + 0.5);
    }, 50);
    return () => clearInterval(gameInterval);
  }, [score]);

  useEffect(() => {
    obstacles.forEach((obs) => {
      if (
        obs.x === lanes[playerLane] &&
        obs.y + playerSize > canvasHeight - 100 &&
        obs.y < canvasHeight - 60
      ) {
        alert(`Game Over! Score: ${score}`);
        window.location.reload();
      }
    });

    setCoins((prevCoins) =>
      prevCoins.filter((coin) => {
        if (
          coin.x === lanes[playerLane] &&
          coin.y + playerSize > canvasHeight - 100 &&
          coin.y < canvasHeight - 60
        ) {
          setScore((prev) => prev + 10);
          return false;
        }
        return true;
      })
    );
  }, [obstacles, coins, playerLane, score]);

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h2>Temple Run Game</h2>
      <p>Score: {score}</p>
      <canvas
        width={canvasWidth}
        height={canvasHeight}
        style={{ border: "1px solid black" }}
        ref={(canvas) => {
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          ctx.fillStyle = "blue";
          ctx.fillRect(lanes[playerLane], canvasHeight - 100, playerSize, playerSize);
          ctx.fillStyle = "red";
          obstacles.forEach((obs) => ctx.fillRect(obs.x, obs.y, playerSize, playerSize));
          ctx.fillStyle = "gold";
          coins.forEach((coin) => ctx.fillRect(coin.x + 10, coin.y + 10, 20, 20));
        }}
      />
    </div>
  );
};

export default RunningGame;