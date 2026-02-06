import React, { useState, useRef } from 'react';
import { Volume2, Play, Pause } from 'lucide-react';

// --- Types ---
interface Animal {
  id: string;
  name: string;
  emoji: string;
  color: string;
  soundUrl: string;
}

// --- Constants ---
const INITIAL_ANIMALS: Animal[] = [
  { id: 'cow', name: 'Vaca', emoji: '🐮', color: 'bg-amber-200', soundUrl: 'vaca.mp3' },
  { id: 'horse', name: 'Caballo', emoji: '🐴', color: 'bg-orange-200', soundUrl: 'caballo.mp3' },
  { id: 'pig', name: 'Cerdo', emoji: '🐷', color: 'bg-pink-200', soundUrl: 'cerdo.mp3' },
  { id: 'dog', name: 'Perro', emoji: '🐶', color: 'bg-slate-300', soundUrl: 'perro.mp3' },
  { id: 'cat', name: 'Gato', emoji: '🐱', color: 'bg-yellow-100', soundUrl: 'gato.mp3' },
  { id: 'duck', name: 'Pato', emoji: '🦆', color: 'bg-green-200', soundUrl: 'pato.mp3' },
  { id: 'chicken', name: 'Gallina', emoji: '🐔', color: 'bg-red-200', soundUrl: 'gallina.mp3' },
  { id: 'bird', name: 'Pájaro', emoji: '🐦', color: 'bg-sky-200', soundUrl: 'pajaro.mp3' },
  { id: 'frog', name: 'Rana', emoji: '🐸', color: 'bg-lime-300', soundUrl: 'rana.mp3' },
  { id: 'elephant', name: 'Elefante', emoji: '🐘', color: 'bg-purple-200', soundUrl: 'elefante.mp3' },
];

// --- Components ---
interface AnimalButtonProps {
  animal: Animal;
  isPlaying: boolean;
  onClick: (animal: Animal) => void;
}

const AnimalButton: React.FC<AnimalButtonProps> = ({ animal, isPlaying, onClick }) => {
  return (
    <button
      onClick={() => onClick(animal)}
      className={`
        relative overflow-hidden rounded-2xl p-4 flex flex-col items-center justify-center gap-2
        transition-all duration-200 shadow-md active:scale-95
        ${animal.color}
        ${isPlaying ? 'ring-4 ring-offset-2 ring-blue-500 scale-95' : 'hover:shadow-lg hover:-translate-y-1'}
        cursor-pointer
        aspect-square sm:aspect-auto sm:h-40
        group
      `}
    >
      <div className="text-5xl sm:text-6xl select-none filter drop-shadow-sm transition-transform duration-200 group-hover:scale-110">
        {animal.emoji}
      </div>

      <div className="font-bold text-slate-800 text-lg sm:text-xl uppercase tracking-wide">
        {animal.name}
      </div>

      <div className="absolute top-2 right-2 text-slate-700/50">
        {isPlaying ? (
          <Pause className="w-6 h-6 animate-pulse text-blue-600" />
        ) : (
          <Play className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </button>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [animals] = useState<Animal[]>(INITIAL_ANIMALS);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = (animal: Animal) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (currentlyPlayingId === animal.id) {
      setCurrentlyPlayingId(null);
      return;
    }

    const audio = new Audio(animal.soundUrl);
    audioRef.current = audio;
    setCurrentlyPlayingId(animal.id);

    audio.onerror = (e) => {
      console.error(`Error loading sound: ${animal.soundUrl}`, e);
      setCurrentlyPlayingId(null);
    };

    audio.play().catch(e => {
      console.error("Error playing audio:", e);
      setCurrentlyPlayingId(null);
    });

    audio.onended = () => {
      setCurrentlyPlayingId(null);
      audioRef.current = null;
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex flex-col font-sans">
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              Sonidos de Animales
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 auto-rows-fr">
          {animals.map(animal => (
            <AnimalButton
              key={animal.id}
              animal={animal}
              isPlaying={currentlyPlayingId === animal.id}
              onClick={playSound}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default App;