<?php

namespace App\Services\Media;

use App\Exceptions\MediaCompressionException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Drivers\Imagick\Driver as ImagickDriver;
use Intervention\Image\ImageManager;

final class WebpImageStorageService
{
    private ImageManager $manager;

    public function __construct()
    {
        $driver = extension_loaded('imagick')
            ? new ImagickDriver
            : new GdDriver;

        $this->manager = new ImageManager($driver);
    }

    /**
     * Comprime, redimensiona si aplica y guarda como .webp en disco public.
     *
     * @return string Path público: /storage/{directory}/{uuid}.webp
     */
    public function store(UploadedFile $file, string $directory): string
    {
        $realPath = $file->getRealPath();
        if ($realPath === false) {
            throw new MediaCompressionException('No se pudo leer el archivo de imagen.');
        }

        try {
            $maxWidth = (int) config('media.image.max_width', 1920);
            $maxHeight = (int) config('media.image.max_height', 1920);
            $quality = (int) config('media.image.webp_quality', 82);

            $image = $this->manager->read($realPath);
            $image->scaleDown($maxWidth, $maxHeight);

            $filename = Str::uuid().'.webp';
            $relativePath = trim($directory, '/').'/'.$filename;

            Storage::disk('public')->put($relativePath, (string) $image->toWebp($quality));

            return '/storage/'.$relativePath;
        } catch (MediaCompressionException $e) {
            throw $e;
        } catch (\Throwable $e) {
            throw new MediaCompressionException('No se pudo procesar la imagen.', previous: $e);
        }
    }
}
