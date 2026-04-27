<?php

namespace Database\Seeders;

use App\Models\Producto;
use App\Models\ProductoCategoria;
use App\Models\ProductoSubcategoria;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductosSeeder extends Seeder
{
    public function run(): void
    {
        $taxonomy = [
            'Papelería Premium' => ['Sellos y lacres', 'Plumas', 'Accesorios'],
            'Coleccionables' => ['Edición limitada', 'Decoración de escritorio'],
            'Regalos' => ['Sets y kits', 'Presentación'],
        ];

        $subcategoriaIds = [];

        foreach ($taxonomy as $categoriaNombre => $subcategorias) {
            $categoria = ProductoCategoria::query()->firstOrCreate([
                'nombre' => $categoriaNombre,
            ]);

            foreach ($subcategorias as $subcategoriaNombre) {
                $subcategoria = ProductoSubcategoria::query()->firstOrCreate([
                    'producto_categoria_id' => $categoria->id,
                    'nombre' => $subcategoriaNombre,
                ]);

                $subcategoriaIds[$categoriaNombre.'::'.$subcategoriaNombre] = $subcategoria->id;
            }
        }

        $productos = [
            [
                'nombre' => 'Kit de Lacre Real',
                'codigo' => 'PRD-1001',
                'categoria' => 'Papelería Premium',
                'subcategoria' => 'Sellos y lacres',
                'precio_base' => 24.90,
                'precio_promocional' => 19.90,
                'stock' => 42,
                'descripcion_corta' => 'Set para sellar sobres con acabado clásico.',
                'descripcion_larga' => 'Incluye mango de madera, sello de latón y barras de cera para dar un acabado elegante a cada carta.',
                'detalle' => [
                    ['icon' => 'Package', 'title' => 'Incluye set completo', 'description' => 'Listo para usar desde el primer día.'],
                    ['icon' => 'ShieldCheck', 'title' => 'Material durable', 'description' => 'Sello metálico de alta resistencia.'],
                ],
                'imagen' => '/images/placeholder.svg',
                'video' => null,
                'peso' => '0.5kg',
                'dimensiones' => '18x12x5',
                'impuesto' => 16.00,
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Pluma Estilográfica Vintage',
                'codigo' => 'PRD-1002',
                'categoria' => 'Papelería Premium',
                'subcategoria' => 'Plumas',
                'precio_base' => 39.90,
                'precio_promocional' => null,
                'stock' => 18,
                'descripcion_corta' => 'Pluma con trazo suave para escritura prolongada.',
                'descripcion_larga' => 'Diseño inspirado en instrumentos clásicos, ideal para escritura de cartas y firmas especiales.',
                'detalle' => [
                    ['icon' => 'PenTool', 'title' => 'Trazo fino y fluido', 'description' => 'Punta diseñada para precisión constante.'],
                    ['icon' => 'Gift', 'title' => 'Estuche incluido', 'description' => 'Presentación lista para regalo.'],
                ],
                'imagen' => '/images/placeholder.svg',
                'video' => null,
                'peso' => '0.2kg',
                'dimensiones' => '16x4x3',
                'impuesto' => 16.00,
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Abrecartas de Bronce',
                'codigo' => 'PRD-1003',
                'categoria' => 'Papelería Premium',
                'subcategoria' => 'Accesorios',
                'precio_base' => 15.00,
                'precio_promocional' => 12.50,
                'stock' => 35,
                'descripcion_corta' => 'Accesorio funcional con acabado artesanal.',
                'descripcion_larga' => 'Diseñado para abrir sobres sin dañar el contenido y complementar tu escritorio con estilo clásico.',
                'detalle' => [
                    ['icon' => 'Scissors', 'title' => 'Corte preciso', 'description' => 'Abre sobres sin romper bordes.'],
                    ['icon' => 'Star', 'title' => 'Acabado premium', 'description' => 'Tono bronce envejecido.'],
                ],
                'imagen' => '/images/placeholder.svg',
                'video' => null,
                'peso' => '0.3kg',
                'dimensiones' => '22x3x2',
                'impuesto' => 16.00,
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Set Coleccionable de Sellos Históricos',
                'codigo' => 'PRD-1004',
                'categoria' => 'Coleccionables',
                'subcategoria' => 'Edición limitada',
                'precio_base' => 64.90,
                'precio_promocional' => 54.90,
                'stock' => 10,
                'descripcion_corta' => 'Colección de sellos inspirados en épocas clásicas.',
                'descripcion_larga' => 'Serie limitada de sellos decorativos para acompañar correspondencia y colecciones personales.',
                'detalle' => [
                    ['icon' => 'Crown', 'title' => 'Edición limitada', 'description' => 'Disponibilidad reducida por temporada.'],
                    ['icon' => 'Archive', 'title' => 'Incluye certificado', 'description' => 'Numeración individual en cada set.'],
                ],
                'imagen' => '/images/placeholder.svg',
                'video' => null,
                'peso' => '0.9kg',
                'dimensiones' => '26x18x6',
                'impuesto' => 16.00,
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Bandeja Decorativa para Escritorio',
                'codigo' => 'PRD-1005',
                'categoria' => 'Coleccionables',
                'subcategoria' => 'Decoración de escritorio',
                'precio_base' => 28.00,
                'precio_promocional' => null,
                'stock' => 22,
                'descripcion_corta' => 'Organiza cartas y piezas especiales en un solo lugar.',
                'descripcion_larga' => 'Bandeja de acabado mate pensada para mantener cartas, notas y accesorios ordenados.',
                'detalle' => [
                    ['icon' => 'Inbox', 'title' => 'Organización práctica', 'description' => 'Capacidad para sobres y tarjetas.'],
                    ['icon' => 'Palette', 'title' => 'Diseño sobrio', 'description' => 'Combina con espacios clásicos y modernos.'],
                ],
                'imagen' => '/images/placeholder.svg',
                'video' => null,
                'peso' => '0.7kg',
                'dimensiones' => '30x20x4',
                'impuesto' => 16.00,
                'estado' => 'activo',
            ],
            [
                'nombre' => 'Caja de Presentación para Regalo',
                'codigo' => 'PRD-1006',
                'categoria' => 'Regalos',
                'subcategoria' => 'Presentación',
                'precio_base' => 12.00,
                'precio_promocional' => 9.90,
                'stock' => 70,
                'descripcion_corta' => 'Empaque premium para obsequios de temporada.',
                'descripcion_larga' => 'Caja rígida con interior acolchado para presentar productos de papelería de forma elegante.',
                'detalle' => [
                    ['icon' => 'Gift', 'title' => 'Presentación elegante', 'description' => 'Lista para entregar como obsequio.'],
                    ['icon' => 'Shield', 'title' => 'Protección extra', 'description' => 'Resguarda piezas delicadas durante el transporte.'],
                ],
                'imagen' => '/images/placeholder.svg',
                'video' => null,
                'peso' => '0.4kg',
                'dimensiones' => '24x18x7',
                'impuesto' => 16.00,
                'estado' => 'activo',
            ],
        ];

        foreach ($productos as $data) {
            $slug = Str::slug($data['nombre']);
            $categoria = ProductoCategoria::query()->where('nombre', $data['categoria'])->first();
            $subcategoriaId = $subcategoriaIds[$data['categoria'].'::'.$data['subcategoria']] ?? null;

            if ($categoria === null) {
                continue;
            }

            Producto::query()->updateOrCreate(
                ['slug' => $slug],
                [
                    'nombre' => $data['nombre'],
                    'codigo' => $data['codigo'],
                    'imagen' => $data['imagen'],
                    'video' => $data['video'],
                    'descripcion_corta' => $data['descripcion_corta'],
                    'descripcion_larga' => $data['descripcion_larga'],
                    'detalle' => $data['detalle'],
                    'producto_categoria_id' => $categoria->id,
                    'producto_subcategoria_id' => $subcategoriaId,
                    'precio_base' => $data['precio_base'],
                    'precio_promocional' => $data['precio_promocional'],
                    'impuesto' => $data['impuesto'],
                    'stock' => $data['stock'],
                    'peso' => $data['peso'],
                    'dimensiones' => $data['dimensiones'],
                    'estado' => $data['estado'],
                ],
            );
        }
    }
}
