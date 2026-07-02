<?php

namespace App\Services\Audio;

use App\Models\Audio;
use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\RoundBlockSizeMode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Support\Facades\Storage;

class AudioQrGeneratorService
{
    public function generate(Audio $audio): string
    {
        $publicUrl = route('audios.show', $audio);
        $size = (int) config('media.audio.qr_size', 512);
        $logoPath = (string) config('media.audio.qr_logo_path');
        $hasLogo = $logoPath !== '' && is_file($logoPath);

        $builder = new Builder(
            writer: new PngWriter,
            validateResult: false,
            data: $publicUrl,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::High,
            size: $size,
            margin: 10,
            roundBlockSizeMode: RoundBlockSizeMode::Margin,
            logoPath: $hasLogo ? $logoPath : '',
            logoResizeToWidth: $hasLogo ? (int) ($size * 0.22) : null,
        );

        $result = $builder->build();
        $relativePath = "qr/audios/{$audio->slug}.png";

        Storage::disk('public')->put($relativePath, $result->getString());

        return '/storage/'.$relativePath;
    }

    public function delete(?string $qrPath): void
    {
        if ($qrPath === null || $qrPath === '') {
            return;
        }

        $relative = str_replace('/storage/', '', $qrPath);

        if (Storage::disk('public')->exists($relative)) {
            Storage::disk('public')->delete($relative);
        }
    }
}
