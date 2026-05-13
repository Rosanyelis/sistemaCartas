<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class AvisoPrivacidadController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('legal/aviso-de-privacidad');
    }
}
