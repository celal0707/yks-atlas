import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { Card, CardHeader, Button, Metric } from '@/components/Common';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

const PRESETS = [
  { name: '25 dk (Klasik)', duration: 25 },
  { name: '45 dk (Uzun)', duration: 45 },
  { name: '60 dk (Maraton)', duration: 60 },
];

export default function PomodoroPage() {
  const { user, stats } = useStore();
  const [duration, setDuration] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) {
          setIsRunning(false);
          // Session completed
          if (!isBreak) {
            setSessionCount(s => s + 1);
            setIsBreak(true);
            setRemaining(5 * 60); // 5 min break
            playSound();
          } else {
            setIsBreak(false);
            setRemaining(duration * 60);
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isBreak, duration]);

  const playSound = () => {
    // Simple beep
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    gain.gain.setValueAtTime(0.1, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemaining(duration * 60);
    setIsBreak(false);
  };

  const handleChangePreset = (newDuration: number) => {
    setDuration(newDuration);
    setRemaining(newDuration * 60);
    setIsRunning(false);
    setIsBreak(false);
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const percentage = ((duration * 60 - remaining) / (duration * 60)) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-text-primary">
          {isBreak ? '☕ Mola Zamanı' : '🍅 Pomodoro Timer'}
        </h1>
        <p className="text-text-secondary">
          {isBreak ? 'Biraz dinlen' : 'Odaklanmaya devam et'}
        </p>
      </div>

      {/* Main Timer */}
      <Card className="text-center">
        <CardHeader title={isBreak ? 'Mola Süresi' : 'Çalışma Süresi'} />

        {/* Timer Display */}
        <div className="py-12 space-y-6">
          <div className="relative w-48 h-48 mx-auto">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(46, 39, 64, 1)" strokeWidth="8" />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke={isBreak ? '#2ECC71' : '#A593D6'}
                strokeWidth="8"
                strokeDasharray={`${(percentage / 100) * 565.5} 565.5`}
                strokeLinecap="round"
              />
            </svg>

            {/* Timer Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-display font-bold text-primary-400">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-text-muted mt-2">{isBreak ? 'Mola' : 'Çalış'}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 justify-center">
            <Button
              size="lg"
              variant="primary"
              onClick={() => setIsRunning(!isRunning)}
              className="px-8"
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Duraklat
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Başla
                </>
              )}
            </Button>

            <Button
              size="lg"
              variant="secondary"
              onClick={handleReset}
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>

          {/* Session Count */}
          <div className="text-lg font-semibold text-accent-green">
            🎯 {sessionCount} seans tamamlandı
          </div>
        </div>
      </Card>

      {/* Presets */}
      <Card>
        <CardHeader title="Süreler" />
        <div className="grid grid-cols-3 gap-3">
          {PRESETS.map(preset => (
            <Button
              key={preset.duration}
              variant={duration === preset.duration && !isRunning ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => handleChangePreset(preset.duration)}
              fullWidth
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader title="Pomodoro Tekniği" />
        <div className="space-y-2 text-sm">
          <div className="flex gap-2">
            <span className="text-accent-orange">1.</span>
            <span className="text-text-secondary">25 dakika yoğun çalış</span>
          </div>
          <div className="flex gap-2">
            <span className="text-accent-green">2.</span>
            <span className="text-text-secondary">5 dakika mola ver</span>
          </div>
          <div className="flex gap-2">
            <span className="text-primary-400">3.</span>
            <span className="text-text-secondary">4 seans sonra uzun mola (15-30 dk)</span>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Metric
          label="Bugün Çalışılan"
          value={sessionCount}
          unit="seans"
          icon={<Zap className="w-5 h-5" />}
        />
        <Metric
          label="Toplam Seans"
          value={sessionCount}
          unit="tamamlandı"
        />
        <Metric
          label="Odaklanma Süresi"
          value={(sessionCount * duration) + Math.floor(remaining / 60)}
          unit="dakika"
        />
      </div>
    </div>
  );
}
