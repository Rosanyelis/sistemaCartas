<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class TerminosCondicionesController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('legal/terminos-y-condiciones');
    }
}
