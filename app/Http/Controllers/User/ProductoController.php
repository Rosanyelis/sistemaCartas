<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use App\Models\ProductoCategoria;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductoController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Producto::query()
            ->where('estado', 'activo')
            ->with([
                'productoCategoria',
                'productoSubcategoria',
                'galeria' => fn ($q) => $q->orderBy('id'),
            ]);

        if ($request->filled('categoria_id')) {
            $query->where('producto_categoria_id', $request->integer('categoria_id'));
        }

        $productos = $query->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Producto $p) => ProductoTiendaSerializer::tarjetaCatalogo($p));

        $categorias = ProductoCategoria::query()
            ->whereHas('productos', fn ($q) => $q->where('estado', 'activo'))
            ->orderBy('nombre')
            ->get(['id', 'nombre']);

        return Inertia::render('user/productos', [
            'products' => $productos,
            'categorias' => $categorias,
            'filters' => [
                'categoria_id' => $request->filled('categoria_id') ? $request->integer('categoria_id') : null,
            ],
        ]);
    }

    /**
     * Demo histórica: ahora redirige al primer producto activo en BD para no mantener dos fuentes de verdad.
     * Si no hay productos activos, redirige al listado `/productos`.
     */
    public function showReference(): RedirectResponse
    {
        $first = Producto::query()
            ->where('estado', 'activo')
            ->orderBy('id')
            ->first();

        if ($first !== null) {
            return redirect()->route('productos.show', $first->slug);
        }

        return redirect()->route('productos');
    }

    public function show(string $slug): Response
    {
        $producto = Producto::query()
            ->where('slug', $slug)
            ->where('estado', 'activo')
            ->with([
                'productoCategoria',
                'productoSubcategoria',
                'galeria' => fn ($q) => $q->orderBy('id'),
            ])
            ->firstOrFail();

        return Inertia::render('user/detalles-producto', [
            'product' => ProductoTiendaSerializer::fichaProducto($producto),
        ]);
    }
}
