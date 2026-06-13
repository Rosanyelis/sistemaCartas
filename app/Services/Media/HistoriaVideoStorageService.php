<?php

namespace App\Services\Media;

use App\Exceptions\MediaCompressionException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\Process\Process;

final class HistoriaVideoStorageService
{
    /**
     * Transcodifica a MP4 H.264 + AAC, escala y asegura tamaño ≤ 10 MB.
     *
     * @throws MediaCompressionException
     */
    public function store(UploadedFile $file, string $directory = 'historias/videos'): string
    {
        $this->ensureFfmpegAvailable();

        $inputPath = $file->getRealPath();
        if ($inputPath === false) {
            throw new MediaCompressionException('No se pudo leer el archivo de video.');
        }

        $filename = Str::uuid().'.mp4';
        $relativePath = trim($directory, '/').'/'.$filename;
        $outputAbsolute = Storage::disk('public')->path($relativePath);

        Storage::disk('public')->makeDirectory($directory);

        $maxWidth = (int) config('media.video.max_width', 1280);
        $baseCrf = (int) config('media.video.crf', 28);
        $audioKbps = (int) config('media.video.audio_bitrate_kbps', 128);
        $maxBytes = (int) config('media.video.max_output_bytes', 10 * 1024 * 1024);

        for ($attempt = 0; $attempt < 4; $attempt++) {
            $this->transcode(
                $inputPath,
                $outputAbsolute,
                $maxWidth,
                $baseCrf + ($attempt * 4),
                $audioKbps,
            );

            if (! is_file($outputAbsolute)) {
                throw new MediaCompressionException('No se generó el video procesado.');
            }

            if (filesize($outputAbsolute) <= $maxBytes) {
                return '/storage/'.$relativePath;
            }
        }

        Storage::disk('public')->delete($relativePath);

        throw new MediaCompressionException('El video no pudo comprimirse por debajo de 10 MB.');
    }

    /**
     * @throws MediaCompressionException
     */
    private function ensureFfmpegAvailable(): void
    {
        $ffmpeg = (string) config('media.video.ffmpeg_binaries', 'ffmpeg');
        $process = new Process([$ffmpeg, '-version']);
        $process->run();

        if (! $process->isSuccessful()) {
            throw new MediaCompressionException(
                'FFmpeg no está instalado o no está en el PATH. Instálalo en Laragon o define FFMPEG_BINARIES en .env.',
            );
        }
    }

    /**
     * @throws MediaCompressionException
     */
    private function transcode(
        string $inputPath,
        string $outputPath,
        int $maxWidth,
        int $crf,
        int $audioKbps,
    ): void {
        $ffmpeg = (string) config('media.video.ffmpeg_binaries', 'ffmpeg');

        $process = new Process([
            $ffmpeg,
            '-y',
            '-i',
            $inputPath,
            '-vf',
            "scale='min({$maxWidth},iw)':-2",
            '-c:v',
            'libx264',
            '-preset',
            'medium',
            '-crf',
            (string) $crf,
            '-c:a',
            'aac',
            '-b:a',
            "{$audioKbps}k",
            '-movflags',
            '+faststart',
            $outputPath,
        ]);

        $process->setTimeout(600);
        $process->run();

        if (! $process->isSuccessful()) {
            throw new MediaCompressionException(
                'No se pudo transcodificar el video. Usa MP4 o MOV válido (máx. 10 MB).',
            );
        }
    }
}
