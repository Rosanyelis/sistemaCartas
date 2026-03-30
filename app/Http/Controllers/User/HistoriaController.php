<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class HistoriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('user/historias');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $slug): Response
    {
        return Inertia::render('user/detalles-historia', [
            'slug' => $slug,
        ]);
    }
}
