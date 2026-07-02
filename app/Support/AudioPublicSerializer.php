<?php

namespace App\Support;

use App\Models\Audio;

class AudioPublicSerializer
{
    /**
     * @return array<string, mixed>
     */
    public static function publico(Audio $audio): array
    {
        $historia = $audio->historia;

        return [
            'titulo' => $audio->titulo,
            'stream_url' => route('audios.stream', $audio),
            'historia' => [
                'nombre' => $historia?->nombre ?? '',
                'imagen' => $historia?->imagen ?: '/images/story_cover.png',
                'descripcion_corta' => $historia?->descripcion_corta ?? '',
            ],
        ];
    }
}
