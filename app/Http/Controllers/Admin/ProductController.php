<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        // Datos simulados según el diseño
        $products = [
            [
                'id' => '#1018',
                'nombre' => 'Papel de Hilo P',
                'imagen' => 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=200',
                'categoria' => 'Papelería',
                'subcategoria' => 'Cartas',
                'precio' => '$199 MX',
                'stock' => 45,
                'estado' => 'Activo',
            ],
            [
                'id' => '#1018',
                'nombre' => 'Kit de Lacre Re',
                'imagen' => 'https://images.unsplash.com/photo-1590080665123-af641de0c4c4?auto=format&fit=crop&q=80&w=200',
                'categoria' => 'Sellos de Lacre',
                'subcategoria' => 'Sellos',
                'precio' => '$199 MX',
                'stock' => 0,
                'estado' => 'Pausado',
            ],
            [
                'id' => '#1018',
                'nombre' => 'Kit de Lacre Re',
                'imagen' => 'https://images.unsplash.com/photo-1590080665123-af641de0c4c4?auto=format&fit=crop&q=80&w=200',
                'categoria' => 'Sellos de Lacre',
                'subcategoria' => 'Sellos',
                'precio' => '$199 MX',
                'stock' => 0,
                'estado' => 'Pausado',
            ],
            [
                'id' => '#1018',
                'nombre' => 'Kit de Lacre Re',
                'imagen' => 'https://images.unsplash.com/photo-1507206130118-b5907f817163?auto=format&fit=crop&q=80&w=200',
                'categoria' => 'Sellos de Lacre',
                'subcategoria' => 'Sellos',
                'precio' => '$199 MX',
                'stock' => 10,
                'estado' => 'Activo',
            ],
            [
                'id' => '#1018',
                'nombre' => 'Papel de Hilo P',
                'imagen' => 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=200',
                'categoria' => 'Papelería',
                'subcategoria' => 'Cartas',
                'precio' => '$199 MX',
                'stock' => 45,
                'estado' => 'Activo',
            ],
        ];

        // Duplicamos para tener suficientes para paginación (más de 10)
        $simulatedData = array_merge($products, $products, $products);

        return Inertia::render('admin/products', [
            'products' => $simulatedData,
        ]);
    }
}
