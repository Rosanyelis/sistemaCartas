<?php

namespace App\Http\Controllers\Storefront;

use App\Http\Controllers\Controller;
use App\Models\Historia;
use App\Models\Producto;
use App\Support\HistoriaCatalogoSerializer;
use App\Support\ProductoTiendaSerializer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $products = Producto::query()
            ->where('estado', 'activo')
            ->with([
                'productoCategoria',
                'productoSubcategoria',
                'galeria' => fn ($q) => $q->orderBy('id'),
            ])
            ->latest()
            ->limit(3)
            ->get()
            ->map(fn (Producto $p) => ProductoTiendaSerializer::tarjetaCatalogo($p))
            ->values()
            ->all();

        $maxDestacadas = max(1, (int) config('historias.tienda_destacadas_max', 10));

        $stories = Historia::query()
            ->where('estado', 'activo')
            ->where('destacada', 'si')
            ->latest('fecha_publicacion')
            ->latest('id')
            ->limit($maxDestacadas)
            ->get()
            ->map(fn (Historia $h) => HistoriaCatalogoSerializer::tarjeta($h))
            ->values()
            ->all();

        return Inertia::render('user/welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'products' => $products,
            'stories' => $stories,
        ]);
    }
}
