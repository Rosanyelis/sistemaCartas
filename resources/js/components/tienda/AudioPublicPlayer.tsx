import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Volume2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface AudioPublicPlayerProps {
    streamUrl: string;
    title: string;
}

function formatTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return '0:00';
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function AudioPublicPlayer({
    streamUrl,
    title,
}: AudioPublicPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const togglePlay = useCallback(() => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        if (audio.paused) {
            void audio.play();
        } else {
            audio.pause();
        }
    }, []);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) {
            return;
        }

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onTimeUpdate = () => {
            if (!isSeeking) {
                setCurrentTime(audio.currentTime);
            }
        };
        const onLoadedMetadata = () => setDuration(audio.duration);
        const onEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);

        return () => {
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
        };
    }, [isSeeking, streamUrl]);

    const handleSeek = (value: number) => {
        const audio = audioRef.current;

        if (!audio || duration <= 0) {
            return;
        }

        const nextTime = (value / 100) * duration;
        audio.currentTime = nextTime;
        setCurrentTime(nextTime);
    };

    return (
        <div className="rounded-[2px] border border-[#E8E8E8] bg-[#FAFAFA] p-5 select-none md:p-6">
            <audio
                ref={audioRef}
                src={streamUrl}
                preload="metadata"
                playsInline
                controlsList="nodownload noplaybackrate"
                className="hidden"
            >
                Tu navegador no soporta la reproducción de audio.
            </audio>

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1B3D6D] text-white transition hover:bg-[#1B3D6D]/90"
                >
                    <FontAwesomeIcon
                        icon={isPlaying ? faPause : faPlay}
                        className="text-sm"
                    />
                </button>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-['Inter',sans-serif] text-[14px] font-medium text-[#1B3D6D]">
                            {title}
                        </span>
                        <Volume2
                            className="h-4 w-4 shrink-0 text-[#7B7B7B]"
                            aria-hidden
                        />
                    </div>

                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={0.1}
                        value={progress}
                        onChange={(e) => handleSeek(Number(e.target.value))}
                        onMouseDown={() => setIsSeeking(true)}
                        onMouseUp={() => setIsSeeking(false)}
                        onTouchStart={() => setIsSeeking(true)}
                        onTouchEnd={() => setIsSeeking(false)}
                        aria-label="Progreso de reproducción"
                        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#E5E7EB] accent-[#1B3D6D]"
                    />

                    <div className="flex justify-between font-['Inter',sans-serif] text-[12px] text-[#7B7B7B] tabular-nums">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>
            </div>

            <p className="mt-4 text-center font-['Inter',sans-serif] text-[12px] text-[#9CA3AF]">
                Solo reproducción en línea — no disponible para descarga
            </p>
        </div>
    );
}
