<?php

namespace Database\Seeders;

use App\Models\Historia;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class HistoriasSeeder extends Seeder
{
    public function run(): void
    {
        $historias = [
            [
                'nombre' => 'La Carta Perdida del Faro',
                'codigo' => 'HST-2001',
                'categoria' => 'Aventura',
                'autor' => 'Marina Varela',
                'precio_base' => 18.90,
                'precio_promocional' => 14.90,
                'duracion_meses' => 6,
                'destacada' => 'si',
                'estado' => 'activo',
                'fecha_publicacion' => Carbon::now()->subDays(120),
                'descripcion_corta' => 'Una travesía por la costa guiada por cartas antiguas.',
                'descripcion_larga' => 'Cada entrega revela pistas del pasado familiar de un guardafaros y secretos escondidos en su correspondencia.',
                'detalle' => [
                    ['icon' => 'FileText', 'title' => 'Carta principal', 'description' => 'Relato central de cada entrega.'],
                    ['icon' => 'Map', 'title' => 'Pista ilustrada', 'description' => 'Fragmentos visuales para seguir la historia.'],
                ],
            ],
            [
                'nombre' => 'Susurros en la Biblioteca',
                'codigo' => 'HST-2002',
                'categoria' => 'Misterio',
                'autor' => 'Iván Rojas',
                'precio_base' => 22.00,
                'precio_promocional' => null,
                'duracion_meses' => 12,
                'destacada' => 'si',
                'estado' => 'activo',
                'fecha_publicacion' => Carbon::now()->subDays(95),
                'descripcion_corta' => 'Un enigma literario contado página a página.',
                'descripcion_larga' => 'Una serie de cartas anónimas pone en marcha una investigación entre estanterías, diarios y manuscritos olvidados.',
                'detalle' => [
                    ['icon' => 'BookOpen', 'title' => 'Narrativa por capítulos', 'description' => 'Entregas episódicas mes a mes.'],
                    ['icon' => 'Search', 'title' => 'Desafíos de deducción', 'description' => 'Pistas para resolver al final de cada carta.'],
                ],
            ],
            [
                'nombre' => 'Postales para Julia',
                'codigo' => 'HST-2003',
                'categoria' => 'Romance',
                'autor' => 'Elena Cifuentes',
                'precio_base' => 16.50,
                'precio_promocional' => 12.00,
                'duracion_meses' => 4,
                'destacada' => 'no',
                'estado' => 'activo',
                'fecha_publicacion' => Carbon::now()->subDays(60),
                'descripcion_corta' => 'Historia epistolar de reencuentros y decisiones.',
                'descripcion_larga' => 'Cartas y postales conectan dos ciudades y dos versiones del amor en una trama íntima y nostálgica.',
                'detalle' => [
                    ['icon' => 'Heart', 'title' => 'Relato romántico', 'description' => 'Tono emotivo y cercano.'],
                    ['icon' => 'Calendar', 'title' => 'Ritmo quincenal', 'description' => 'Ideal para lectura breve y continua.'],
                ],
            ],
            [
                'nombre' => 'El Club del Bosque Azul',
                'codigo' => 'HST-2004',
                'categoria' => 'Infantil',
                'autor' => 'Sara Molina',
                'precio_base' => 14.00,
                'precio_promocional' => null,
                'duracion_meses' => 8,
                'destacada' => 'no',
                'estado' => 'activo',
                'fecha_publicacion' => Carbon::now()->subDays(30),
                'descripcion_corta' => 'Aventura para lectores jóvenes con acertijos sencillos.',
                'descripcion_larga' => 'Un grupo de amigos recibe cartas con misiones para proteger su bosque, fomentar la cooperación y descubrir nuevos valores.',
                'detalle' => [
                    ['icon' => 'Trees', 'title' => 'Aventura infantil', 'description' => 'Lenguaje accesible para niños y niñas.'],
                    ['icon' => 'Puzzle', 'title' => 'Actividad incluida', 'description' => 'Pequeño reto al final de cada entrega.'],
                ],
            ],
            [
                'nombre' => 'Bitácora del Viajero Imposible',
                'codigo' => 'HST-2005',
                'categoria' => 'Ficción',
                'autor' => 'Tomás Leal',
                'precio_base' => 20.00,
                'precio_promocional' => 17.50,
                'duracion_meses' => 10,
                'destacada' => 'si',
                'estado' => 'activo',
                'fecha_publicacion' => Carbon::now()->subDays(10),
                'descripcion_corta' => 'Cartas desde lugares donde el tiempo no corre igual.',
                'descripcion_larga' => 'Un narrador imposible escribe desde mundos paralelos y envía objetos narrativos que conectan realidades distintas.',
                'detalle' => [
                    ['icon' => 'Rocket', 'title' => 'Ficción fantástica', 'description' => 'Escenarios inusuales y giros inesperados.'],
                    ['icon' => 'Package', 'title' => 'Elemento coleccionable', 'description' => 'Incluye pieza temática en entregas seleccionadas.'],
                ],
            ],
        ];

        foreach ($historias as $data) {
            $slug = Str::slug($data['nombre']);

            Historia::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'nombre' => $data['nombre'],
                    'codigo' => $data['codigo'],
                    'imagen' => '/images/placeholder.svg',
                    'video' => null,
                    'descripcion_corta' => $data['descripcion_corta'],
                    'descripcion_larga' => $data['descripcion_larga'],
                    'detalle' => $data['detalle'],
                    'categoria' => $data['categoria'],
                    'autor' => $data['autor'],
                    'precio_base' => $data['precio_base'],
                    'precio_promocional' => $data['precio_promocional'],
                    'impuesto' => 16.00,
                    'peso' => '0.3kg',
                    'dimensiones' => '20x14x2',
                    'estado' => $data['estado'],
                    'fecha_publicacion' => $data['fecha_publicacion'],
                    'duracion_meses' => $data['duracion_meses'],
                    'destacada' => $data['destacada'],
                ],
            );
        }
    }
}
