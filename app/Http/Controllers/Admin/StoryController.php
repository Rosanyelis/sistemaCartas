<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class StoryController extends Controller
{
    public function index(): Response
    {
        $stories = [];

        $nombres = ['El Enigma del Galeón', 'Cartas desde Versalles', 'El Enigma del Galeón', 'Cartas desde Versalles', 'El Enigma del Galeón', 'Cartas desde Versalles', 'El Enigma del Galeón', 'Cartas desde Versalles', 'El Enigma del Galeón', 'Cartas desde Versalles', 'El Enigma del Galeón', 'Cartas desde Versalles'];
        $categorias = ['Aventura', 'Misterio', 'Aventura', 'Misterio', 'Aventura', 'Misterio', 'Aventura', 'Misterio', 'Aventura', 'Misterio', 'Aventura', 'Misterio'];
        $autores = ['Ana Remires', 'Erik Daugherty', 'Ana Remires', 'Erik Daugherty', 'Ana Remires', 'Erik Daugherty', 'Ana Remires', 'Erik Daugherty', 'Ana Remires', 'Erik Daugherty', 'Ana Remires', 'Erik Daugherty'];
        $precios = ['$199 MX', '$199 MX', '$199 MX', '$199 MX', '$199 MX', '$199 MX', '$199 MX', '$199 MX', '$199 MX', '$199 MX', '$199 MX', '$199 MX'];
        $estados = ['Activo', 'Pausado', 'Activo', 'Pausado', 'Activo', 'Pausado', 'Activo', 'Pausado', 'Activo', 'Pausado', 'Activo', 'Pausado'];

        // Imágenes genéricas estilo vintage o placeholder
        $imagenAventura = 'https://images.unsplash.com/photo-1543888544-e53c4314dc80?q=80&w=200&auto=format&fit=crop';
        $imagenMisterio = 'https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=200&auto=format&fit=crop';

        $imagenes = [$imagenAventura, $imagenMisterio, $imagenAventura, $imagenMisterio, $imagenAventura, $imagenMisterio, $imagenAventura, $imagenMisterio, $imagenAventura, $imagenMisterio, $imagenAventura, $imagenMisterio];

        for ($i = 0; $i < 12; $i++) {
            $stories[] = [
                'id' => '#10'.(18 + $i),
                'nombre' => $nombres[$i],
                'imagen' => $imagenes[$i],
                'categoria' => $categorias[$i],
                'autor' => $autores[$i],
                'precio' => $precios[$i],
                'estado' => $estados[$i],
                'fecha_publicacion' => ($i % 2 === 0) ? '2025-04-05' : '2025-04-12',
            ];
        }

        return Inertia::render('admin/stories', [
            'stories' => $stories,
        ]);
    }
}
