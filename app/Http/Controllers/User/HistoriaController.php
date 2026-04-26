<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Historia;
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
        $historia = Historia::query()
            ->where('slug', $slug)
            ->where('estado', 'activo')
            ->with(['galeria' => fn ($q) => $q->orderBy('id')])
            ->firstOrFail();

        return Inertia::render('user/detalles-historia', [
            'historia' => [
                'nombre' => $historia->nombre,
                'slug' => $historia->slug,
                'categoria' => $historia->categoria,
                'descripcion_corta' => $historia->descripcion_corta,
                'descripcion_larga' => $historia->descripcion_larga,
                'detalle' => $historia->detalle ?? [],
                'imagen' => $historia->imagen,
                'video' => $historia->video,
                'precio_base' => (string) $historia->precio_base,
                'precio_promocional' => $historia->precio_promocional !== null ? (string) $historia->precio_promocional : null,
                'galeria' => $historia->galeria->map(fn ($g) => [
                    'id' => $g->id,
                    'path' => $g->path,
                    'tipo' => $g->tipo,
                    'es_principal' => (bool) $g->es_principal,
                ])->values()->all(),
            ],
        ]);
    }
}
