import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef<Direction>('RIGHT');

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setFood(generateFood([{ x: 10, y: 10 }]));
    setGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameOver) resetGame();
        else setIsPaused(p => !p);
        return;
      }

      if (isPaused || gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current !== 'DOWN') directionRef.current = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current !== 'UP') directionRef.current = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current !== 'RIGHT') directionRef.current = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current !== 'LEFT') directionRef.current = 'RIGHT';
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  useEffect(() => {
    if (isPaused || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = { ...head };

        setDirection(directionRef.current);

        switch (directionRef.current) {
          case 'UP': newHead.y -= 1; break;
          case 'DOWN': newHead.y += 1; break;
          case 'LEFT': newHead.x -= 1; break;
          case 'RIGHT': newHead.x += 1; break;
        }

        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        if (newSnake.length === GRID_SIZE * GRID_SIZE) {
          setGameOver(true);
          return newSnake;
        }

        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          onScoreChange(newScore);
          if (newSnake.length < GRID_SIZE * GRID_SIZE) {
            setFood(generateFood(newSnake));
          }
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, speed);

    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, score, generateFood, onScoreChange]);

  return (
    <div className="relative border-4 border-[#ff00ff] bg-black" 
         style={{ width: 'min(90vw, 400px)', height: 'min(90vw, 400px)', boxShadow: '8px 8px 0px #00ffff' }}>
      
      <div 
        className="w-full h-full grid" 
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.some((s, idx) => idx !== 0 && s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div 
              key={i} 
              className={`
                ${isSnakeHead ? 'bg-[#00ffff] z-10' : ''}
                ${isSnakeBody ? 'bg-[#00ffff] opacity-70' : ''}
                ${isFood ? 'bg-[#ff00ff] animate-pulse' : ''}
                ${!isSnakeHead && !isSnakeBody && !isFood ? 'border-[1px] border-[#00ffff]/20' : ''}
              `}
            />
          );
        })}
      </div>

      {gameOver && (
        <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-6 border-4 border-[#ff00ff] m-2">
          <div className="glitch-wrapper">
            <h2 className="glitch-text text-5xl md:text-6xl" data-text="FATAL_ERR">FATAL_ERR</h2>
          </div>
          <div className="text-[#00ffff] text-2xl md:text-3xl bg-[#ff00ff] text-black px-4 py-1">
            SECTORS_CORRUPTED: {score}
          </div>
          <button 
            onClick={resetGame}
            className="px-6 py-2 border-4 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-none uppercase text-2xl md:text-3xl mt-4"
          >
            &gt; REBOOT_SYS
          </button>
        </div>
      )}

      {isPaused && !gameOver && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center border-4 border-[#00ffff] m-2">
          <div className="glitch-wrapper">
            <h2 className="glitch-text text-5xl md:text-6xl" data-text="SYS_PAUSED">SYS_PAUSED</h2>
          </div>
        </div>
      )}
    </div>
  );
}
