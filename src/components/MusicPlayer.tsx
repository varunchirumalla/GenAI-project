import React, { useState, useRef, useEffect } from 'react';

const TRACKS = [
  {
    id: 1,
    title: 'DATA_STREAM_01',
    artist: 'AI_SYNTH.WAV',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12'
  },
  {
    id: 2,
    title: 'NEURAL_NET_V2',
    artist: 'CORE_DUMP.MP3',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05'
  },
  {
    id: 3,
    title: 'VOID_ALGORITHM',
    artist: 'NULL_PTR.FLAC',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback failed:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const playNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const playPrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    playNext();
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const percentage = x / bounds.width;
      audioRef.current.currentTime = percentage * audioRef.current.duration;
      setProgress(percentage * 100);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-black border-4 border-[#00ffff] p-4 relative" style={{ boxShadow: '8px 8px 0px #ff00ff' }}>
      <div className="absolute -top-4 left-4 bg-[#ff00ff] text-black px-2 text-xl font-bold">
        AUDIO.SUBSYSTEM
      </div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mt-4">
        {/* Track Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0 w-full border-r-4 border-[#ff00ff] pr-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-[#ff00ff] text-2xl md:text-3xl uppercase truncate font-bold">
              &gt; {currentTrack.title}
            </h3>
            <p className="text-[#00ffff] text-lg md:text-xl uppercase truncate">
              SRC: {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center w-full md:w-auto gap-2">
          <div className="flex items-center gap-4 text-2xl">
            <button 
              onClick={playPrev}
              className="text-[#00ffff] hover:bg-[#00ffff] hover:text-black px-2 transition-none"
            >
              [PREV]
            </button>
            
            <button 
              onClick={togglePlay}
              className="text-[#ff00ff] border-2 border-[#ff00ff] hover:bg-[#ff00ff] hover:text-black px-4 py-1 transition-none"
            >
              {isPlaying ? 'PAUSE' : 'EXEC'}
            </button>
            
            <button 
              onClick={playNext}
              className="text-[#00ffff] hover:bg-[#00ffff] hover:text-black px-2 transition-none"
            >
              [NEXT]
            </button>
          </div>
          
          {/* Progress Bar */}
          <div 
            className="w-full md:w-64 h-6 border-2 border-[#00ffff] cursor-pointer relative bg-black"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-[#ff00ff] transition-none"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Volume */}
        <div className="hidden md:flex flex-col items-center gap-1 w-32 shrink-0">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-[#00ffff] hover:bg-[#00ffff] hover:text-black px-2 text-xl transition-none"
          >
            {isMuted || volume === 0 ? '[MUTE]' : '[VOL]'}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-full h-2 bg-black border-2 border-[#00ffff] appearance-none cursor-pointer accent-[#ff00ff]"
          />
        </div>
      </div>
    </div>
  );
}
