import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-[#00ffff] flex flex-col items-center justify-center p-4 font-digital relative overflow-hidden tear">
      <div className="bg-static" />
      <div className="scanlines" />

      <div className="w-full max-w-4xl flex flex-col gap-8 z-10 h-full max-h-screen py-8 relative">
        <header className="text-left shrink-0 border-b-4 border-[#ff00ff] pb-4">
          <h1 className="text-5xl md:text-7xl font-bold glitch-wrapper mb-2">
            <span className="glitch-text" data-text="SYS.SNAKE_PROTOCOL">SYS.SNAKE_PROTOCOL</span>
          </h1>
          <div className="mt-2 flex justify-between items-center px-2 bg-[#00ffff] text-black text-xl md:text-2xl font-bold">
            <span>&gt; STATUS: ACTIVE</span>
            <span className="animate-pulse">MEM_ALLOC: {score.toString().padStart(4, '0')} BYTES</span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center min-h-0">
          <SnakeGame onScoreChange={setScore} />
        </main>

        <footer className="w-full shrink-0 border-t-4 border-[#00ffff] pt-4">
          <MusicPlayer />
        </footer>
      </div>
    </div>
  );
}
