<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Support\Store\ProductCatalog;
use Inertia\Inertia;
use Inertia\Response;

class ProductoController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('user/productos', [
            'products' => ProductCatalog::forCatalog(),
        ]);
    }

    /**
     * Ficha de demostración con datos de referencia del catálogo estático (sin slug en URL).
     * Cuando exista catálogo real, esta ruta puede redirigir o delegar al modelo de producto.
     */
    public function showReference(): Response
    {
        $product = ProductCatalog::find('kit-lacre-real');

        if ($product === null) {
            $product = ProductCatalog::all()[0];
        }

        return Inertia::render('user/detalles-producto', [
            'product' => ProductCatalog::forProductPage($product),
            'referenceDemo' => true,
        ]);
    }

    public function show(string $slug): Response
    {
        $product = ProductCatalog::find($slug);

        if ($product === null) {
            abort(404);
        }

        return Inertia::render('user/detalles-producto', [
            'product' => ProductCatalog::forProductPage($product),
            'referenceDemo' => false,
        ]);
    }
}
