<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Audio;
use App\Services\Audio\AudioStorageService;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AudioStreamController extends Controller
{
    public function stream(Audio $audio, AudioStorageService $audioStorage): StreamedResponse
    {
        if (! $audio->isActivo()) {
            abort(404);
        }

        return $audioStorage->streamResponse($audio);
    }
}
