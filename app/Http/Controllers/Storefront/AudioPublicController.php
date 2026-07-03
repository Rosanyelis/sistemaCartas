<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Audio;
use App\Support\AudioPublicSerializer;
use Inertia\Inertia;
use Inertia\Response;

class AudioPublicController extends Controller
{
    public function show(Audio $audio): Response
    {
        if (! $audio->isActivo()) {
            abort(404);
        }

        $audio->load('historia.historiaCategoria');

        if ($audio->historia === null) {
            abort(404);
        }

        return Inertia::render('user/audio-publico', [
            'audio' => AudioPublicSerializer::publico($audio),
        ]);
    }
}
