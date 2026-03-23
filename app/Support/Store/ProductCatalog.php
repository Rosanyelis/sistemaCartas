<?php

namespace App\Support\Store;

/**
 * Catálogo demo alineado con la sección Productos (precios uniformes para la presentación).
 *
 * @phpstan-type ProductRecord array{
 *     slug: string,
 *     name: string,
 *     subtitle: string,
 *     description: string,
 *     unit_price: float,
 *     old_price: float|null,
 *     category: string,
 *     images: list<string>,
 *     included: list<array{title: string, desc: string, icon: string}>
 * }
 */
class ProductCatalog
{
    /**
     * @return list<ProductRecord>
     */
    public static function all(): array
    {
        $defaultIncluded = [
            [
                'title' => 'Producto artesanal',
                'desc' => 'Pieza seleccionada con acabado de calidad para tu escritorio.',
                'icon' => 'faStamp',
            ],
            [
                'title' => 'Embalaje cuidado',
                'desc' => 'Preparado para regalo o envío seguro.',
                'icon' => 'faBoxOpen',
            ],
        ];

        $kitIncluded = [
            [
                'title' => 'Sello de latón',
                'desc' => 'Lorem ipsum dolor sit amet consectetur. Mi nibh egestas tellus.',
                'icon' => 'faStamp',
            ],
            [
                'title' => 'Cuchara de fundición',
                'desc' => 'Lorem ipsum dolor sit amet consectetur. Sagittis venenatis.',
                'icon' => 'faUtensilSpoon',
            ],
            [
                'title' => 'Tres barras de cera',
                'desc' => 'Lorem ipsum dolor sit amet consectetur. Dis enim egestas non.',
                'icon' => 'faLayerGroup',
            ],
            [
                'title' => 'Estuche personalizado',
                'desc' => 'Lorem ipsum dolor sit amet consectetur. Sagittis venenatis.',
                'icon' => 'faBriefcase',
            ],
        ];

        $kitDescription = <<<'TXT'
El producto incluye dos sellos de cera completos con mangos de madera de color
caoba y bases de latón pulido, uno más alto que el otro, y un tercer mango más corto
visible en segundo plano. Hay dos sellos de cera roja prefabricados y solidificados: uno
grande con un intricado escudo de armas detallado y uno pequeño con un monograma.

Pequeñas bolitas de cera cruda de color gris-beige están esparcidas por la escena,
completando la presentación del kit de lacrado artesanal. La composición tiene una
estética sofisticada y clásica, con un enfoque nítido en el sello grande.
TXT;

        return [
            self::row(
                slug: 'sello-lacre-artesanal',
                name: 'Sello de Lacre Artesanal',
                subtitle: 'Un sello de latón grabado a mano con mango de madera de nogal, ideal para sellar tus cartas con elegancia clásica.',
                description: $kitDescription,
                unitPrice: 24.90,
                oldPrice: null,
                category: 'Sellos de Lacre',
                images: ['/images/products/product-1.png'],
                included: $defaultIncluded,
            ),
            self::row(
                slug: 'pluma-estilografica-vintage',
                name: 'Pluma Estilográfica Vintage',
                subtitle: 'Inspirada en los diseños de los años 40, con plumín de acero inoxidable para una escritura fluida y pausada.',
                description: $kitDescription,
                unitPrice: 24.90,
                oldPrice: null,
                category: 'Escritura',
                images: ['/images/products/product-2.png'],
                included: $defaultIncluded,
            ),
            self::row(
                slug: 'papel-hilo-prensado',
                name: 'Papel de Hilo Prensado',
                subtitle: '25 pliegos de papel de alta calidad con textura artesanal, perfecto para conservar tus pensamientos más valiosos.',
                description: $kitDescription,
                unitPrice: 24.90,
                oldPrice: null,
                category: 'Papelería',
                images: ['/images/products/product-3.png'],
                included: $defaultIncluded,
            ),
            self::row(
                slug: 'kit-lacre-real',
                name: 'Kit de Lacre Real',
                subtitle: 'Set completo con sello de latón personalizado, cuchara de fundición y tres barras de cera borgoña.',
                description: $kitDescription,
                unitPrice: 24.90,
                oldPrice: 34.90,
                category: 'Papelería',
                images: [
                    '/images/products/kit_lacre_real.png',
                    '/images/products/kit_lacre_real_details_2.png',
                    '/images/products/product-1.png',
                ],
                included: $kitIncluded,
            ),
            self::row(
                slug: 'sobres-artesanales',
                name: 'Sobres Artesanales',
                subtitle: 'Paquete de 10 sobres con bordes rasgados a mano y forro interior de seda color azul marino.',
                description: $kitDescription,
                unitPrice: 24.90,
                oldPrice: null,
                category: 'Papelería',
                images: ['/images/products/product-5.png'],
                included: $defaultIncluded,
            ),
            self::row(
                slug: 'abrecartas-bronce',
                name: 'Abrecartas de Bronce',
                subtitle: 'Pieza de escritorio fundida en bronce con motivo de pluma de ave. Un clásico esencial.',
                description: $kitDescription,
                unitPrice: 24.90,
                oldPrice: null,
                category: 'Accesorios',
                images: ['/images/products/product-6.png'],
                included: $defaultIncluded,
            ),
            self::row(
                slug: 'pluma-estilografica-vintage-2',
                name: 'Pluma Estilográfica Vintage',
                subtitle: 'Inspirada en los diseños de los años 40, con plumín de acero inoxidable para una escritura fluida y pausada.',
                description: $kitDescription,
                unitPrice: 24.90,
                oldPrice: null,
                category: 'Escritura',
                images: ['/images/products/product-1.png'],
                included: $defaultIncluded,
            ),
            self::row(
                slug: 'sello-lacre-artesanal-2',
                name: 'Sello de Lacre Artesanal',
                subtitle: 'Un sello de latón grabado a mano con mango de madera de nogal, ideal para sellar tus cartas con elegancia clásica.',
                description: $kitDescription,
                unitPrice: 24.90,
                oldPrice: null,
                category: 'Sellos de Lacre',
                images: ['/images/products/product-3.png'],
                included: $defaultIncluded,
            ),
        ];
    }

    /**
     * @return list<string>
     */
    public static function slugs(): array
    {
        return array_column(self::all(), 'slug');
    }

    /**
     * @return ProductRecord|null
     */
    public static function find(string $slug): ?array
    {
        foreach (self::all() as $product) {
            if ($product['slug'] === $slug) {
                return $product;
            }
        }

        return null;
    }

    /**
     * Datos para la cuadrícula del catálogo (Inertia).
     *
     * @return list<array{slug: string, name: string, desc: string, price: string, img: string, unit_price: float}>
     */
    public static function forCatalog(): array
    {
        return array_map(fn (array $p): array => [
            'slug' => $p['slug'],
            'name' => $p['name'],
            'desc' => $p['subtitle'],
            'price' => self::formatDisplayPrice($p['unit_price']),
            'img' => $p['images'][0],
            'unit_price' => $p['unit_price'],
        ], self::all());
    }

    /**
     * @param  ProductRecord  $product
     * @return array<string, mixed>
     */
    public static function forProductPage(array $product): array
    {
        return [
            'slug' => $product['slug'],
            'name' => $product['name'],
            'subtitle' => $product['subtitle'],
            'description' => $product['description'],
            'unit_price' => $product['unit_price'],
            'old_price' => $product['old_price'],
            'category' => $product['category'],
            'images' => $product['images'],
            'included' => $product['included'],
        ];
    }

    private static function formatDisplayPrice(float $amount): string
    {
        return '$'.number_format($amount, 2, ',', '');
    }

    /**
     * @param  list<array{title: string, desc: string, icon: string}>  $included
     * @return ProductRecord
     */
    private static function row(
        string $slug,
        string $name,
        string $subtitle,
        string $description,
        float $unitPrice,
        ?float $oldPrice,
        string $category,
        array $images,
        array $included,
    ): array {
        return [
            'slug' => $slug,
            'name' => $name,
            'subtitle' => $subtitle,
            'description' => $description,
            'unit_price' => $unitPrice,
            'old_price' => $oldPrice,
            'category' => $category,
            'images' => $images,
            'included' => $included,
        ];
    }
}
