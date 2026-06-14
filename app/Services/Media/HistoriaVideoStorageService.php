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
        $inputPath = $file->getRealPath();
        if ($inputPath === false) {
            throw new MediaCompressionException('No se pudo leer el archivo de video.');
        }

        $maxBytes = (int) config('media.video.max_output_bytes', 10 * 1024 * 1024);
        $mimeType = (string) $file->getMimeType();

        if ($this->isMp4Upload($file, $mimeType) && $file->getSize() <= $maxBytes) {
            return $this->storeWithoutTranscode($file, $directory);
        }

        $ffmpeg = $this->resolveFfmpegBinary();

        $filename = Str::uuid().'.mp4';
        $relativePath = trim($directory, '/').'/'.$filename;
        $outputAbsolute = Storage::disk('public')->path($relativePath);

        Storage::disk('public')->makeDirectory($directory);

        $maxWidth = (int) config('media.video.max_width', 1280);
        $baseCrf = (int) config('media.video.crf', 28);
        $audioKbps = (int) config('media.video.audio_bitrate_kbps', 128);

        for ($attempt = 0; $attempt < 4; $attempt++) {
            $this->transcode(
                $ffmpeg,
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

    private function isMp4Upload(UploadedFile $file, string $mimeType): bool
    {
        if ($mimeType === 'video/mp4') {
            return true;
        }

        return strtolower($file->getClientOriginalExtension()) === 'mp4';
    }

    /**
     * @throws MediaCompressionException
     */
    private function storeWithoutTranscode(UploadedFile $file, string $directory): string
    {
        $filename = Str::uuid().'.mp4';
        $relativeDirectory = trim($directory, '/');

        Storage::disk('public')->makeDirectory($relativeDirectory);

        $storedPath = $file->storeAs($relativeDirectory, $filename, 'public');

        if ($storedPath === false) {
            throw new MediaCompressionException('No se pudo guardar el video.');
        }

        return '/storage/'.$storedPath;
    }

    /**
     * @throws MediaCompressionException
     */
    private function resolveFfmpegBinary(): string
    {
        $configured = (string) config('media.video.ffmpeg_binaries', 'ffmpeg');

        if ($this->binaryIsAvailable($configured)) {
            return $configured;
        }

        if (PHP_OS_FAMILY === 'Windows') {
            foreach ($this->windowsFfmpegCandidates() as $candidate) {
                if ($this->binaryIsAvailable($candidate)) {
                    return $candidate;
                }
            }
        }

        throw new MediaCompressionException(
            'FFmpeg no está instalado o no está en el PATH. En Laragon: Menú → FFmpeg → Instalar, o define FFMPEG_BINARIES en .env con la ruta completa a ffmpeg.exe.',
        );
    }

    /**
     * @return list<string>
     */
    private function windowsFfmpegCandidates(): array
    {
        $candidates = [
            'C:\\laragon\\bin\\ffmpeg\\ffmpeg.exe',
            'C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe',
        ];

        foreach (glob('C:\\laragon\\bin\\ffmpeg\\*\\bin\\ffmpeg.exe') ?: [] as $path) {
            $candidates[] = $path;
        }

        return $candidates;
    }

    private function binaryIsAvailable(string $binary): bool
    {
        $process = new Process([$binary, '-version']);
        $process->run();

        return $process->isSuccessful();
    }

    /**
     * @throws MediaCompressionException
     */
    private function transcode(
        string $ffmpeg,
        string $inputPath,
        string $outputPath,
        int $maxWidth,
        int $crf,
        int $audioKbps,
    ): void {
        $process = new Process([
            $ffmpeg,
            '-y',
            '-i',
            $inputPath,
            '-vf',
            "scale='min({$maxWidth},iw)':-2",
            '-map',
            '0:v:0',
            '-map',
            '0:a:0?',
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

        if ($process->isSuccessful()) {
            return;
        }

        $process = new Process([
            $ffmpeg,
            '-y',
            '-i',
            $inputPath,
            '-vf',
            "scale='min({$maxWidth},iw)':-2",
            '-map',
            '0:v:0',
            '-c:v',
            'libx264',
            '-preset',
            'medium',
            '-crf',
            (string) $crf,
            '-an',
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
