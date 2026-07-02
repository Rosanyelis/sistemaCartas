<?php

namespace App\Services\Audio;

use App\Models\Audio;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AudioStorageService
{
    private const DISK = 'local';

    /**
     * @return array{path: string, mime_type: string, tamano_bytes: int}
     */
    public function store(UploadedFile $file, Audio $audio): array
    {
        $extension = $file->getClientOriginalExtension() ?: 'mp3';
        $filename = Str::uuid().'.'.$extension;
        $directory = "audios/{$audio->id}";
        $path = "{$directory}/{$filename}";

        Storage::disk(self::DISK)->putFileAs($directory, $file, $filename);

        return [
            'path' => $path,
            'mime_type' => (string) ($file->getMimeType() ?: 'audio/mpeg'),
            'tamano_bytes' => (int) $file->getSize(),
        ];
    }

    public function delete(?string $path): void
    {
        if ($path === null || $path === '') {
            return;
        }

        if (Storage::disk(self::DISK)->exists($path)) {
            Storage::disk(self::DISK)->delete($path);
        }
    }

    public function streamResponse(Audio $audio): StreamedResponse
    {
        $path = $audio->audio_path;
        $disk = Storage::disk(self::DISK);

        if (! $disk->exists($path)) {
            abort(404);
        }

        $fullPath = $disk->path($path);
        $fileSize = (int) filesize($fullPath);
        $mimeType = $audio->mime_type ?: 'audio/mpeg';

        $start = 0;
        $end = $fileSize - 1;
        $status = 200;

        if (request()->headers->has('Range')) {
            $range = request()->header('Range');
            if (preg_match('/bytes=(\d+)-(\d*)/', (string) $range, $matches)) {
                $start = (int) $matches[1];
                if ($matches[2] !== '') {
                    $end = (int) $matches[2];
                }
                $end = min($end, $fileSize - 1);
                $status = 206;
            }
        }

        $length = $end - $start + 1;

        $headers = [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'inline; filename="audio.mp3"',
            'Accept-Ranges' => 'bytes',
            'Content-Length' => (string) $length,
            'Cache-Control' => 'private, no-store',
        ];

        if ($status === 206) {
            $headers['Content-Range'] = "bytes {$start}-{$end}/{$fileSize}";
        }

        return response()->stream(function () use ($fullPath, $start, $length): void {
            $handle = fopen($fullPath, 'rb');
            if ($handle === false) {
                return;
            }

            fseek($handle, $start);
            $remaining = $length;
            $chunkSize = 8192;

            while ($remaining > 0 && ! feof($handle)) {
                $read = min($chunkSize, $remaining);
                $buffer = fread($handle, $read);
                if ($buffer === false) {
                    break;
                }
                echo $buffer;
                $remaining -= strlen($buffer);
                flush();
            }

            fclose($handle);
        }, $status, $headers);
    }
}
