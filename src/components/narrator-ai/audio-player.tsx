'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface AudioPlayerProps {
  src: string;
}

export function AudioPlayer({ src }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    // When the component mounts, create a new Audio object
    const audio = new Audio(src);
    audioRef.current = audio;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    // Auto-play when ready
    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(e => {
      console.error("Autoplay was prevented.", e);
      setIsPlaying(false);
    });

    return () => {
      // Cleanup on component unmount
      audio.pause();
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
      audioRef.current = null;
    };
  }, [src]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSliderChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const formatTime = (timeInSeconds: number) => {
    const time = Math.round(timeInSeconds);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex w-full items-center gap-4 rounded-lg border bg-card p-4 shadow-sm">
      <Button onClick={togglePlayPause} size="icon" variant="ghost" className="flex-shrink-0 rounded-full h-12 w-12 bg-primary/10 hover:bg-primary/20 text-primary">
        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
      </Button>
      <div className="flex w-full items-center gap-3">
        <span className="text-sm font-mono text-muted-foreground w-12 text-center">
          {formatTime(currentTime)}
        </span>
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          onValueChange={handleSliderChange}
          className="w-full"
          aria-label="Audio progress"
        />
        <span className="text-sm font-mono text-muted-foreground w-12 text-center">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
