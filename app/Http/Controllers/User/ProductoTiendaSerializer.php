<?php

namespace App\Http\Controllers\User;

use App\Models\Producto;

/**
 * Serialización de productos activos para la tienda pública (catálogo y ficha).
 *
 * @see resources/js/types/welcome.ts Product
 * @see resources/js/pages/user/detalles-producto.tsx
 */
final class ProductoTiendaSerializer
{
    /**
     * Tarjeta del listado paginado (alineado al shape estático previo de ProductCatalog::forCatalog).
     *
     * @return array{slug: string, name: string, desc: string, price: string, img: string, unit_price: float}
     */
    public static function tarjetaCatalogo(Producto $producto): array
    {
        $precio = (float) $producto->precio;

        return [
            'slug' => $producto->slug,
            'name' => $producto->nombre,
            'desc' => $producto->descripcion_corta,
            'price' => self::formatDisplayPrice($precio),
            'img' => self::mainImageUrl($producto),
            'unit_price' => $precio,
        ];
    }

    /**
     * Ficha de detalle para Inertia (campos consumidos por `detalles-producto.tsx`).
     *
     * @return array<string, mixed>
     */
    public static function fichaProducto(Producto $producto): array
    {
        $base = (float) $producto->precio_base;
        $promoRaw = $producto->precio_promocional;
        $promo = $promoRaw !== null ? (float) $promoRaw : null;
        $tienePromo = $promo !== null && $promo > 0;
        $precio = $tienePromo ? $promo : $base;
        $old = $tienePromo && $promo < $base ? $base : null;

        $categoria = trim(implode(' — ', array_filter([
            $producto->productoCategoria?->nombre,
            $producto->productoSubcategoria?->nombre,
        ])));

        $descripcionLarga = (string) ($producto->descripcion_larga ?? '');
        $descriptionIsHtml = $descripcionLarga !== strip_tags($descripcionLarga);

        return [
            'slug' => $producto->slug,
            'name' => $producto->nombre,
            'subtitle' => $producto->descripcion_corta,
            'description' => $descripcionLarga,
            'description_is_html' => $descriptionIsHtml,
            'unit_price' => $precio,
            'old_price' => $old,
            'category' => $categoria !== '' ? $categoria : 'Producto',
            'images' => self::imageUrls($producto),
            'included' => self::detalleToIncluded($producto->detalle ?? []),
            'video' => $producto->video,
            'stock' => (int) $producto->stock,
            'in_stock' => (int) $producto->stock > 0,
        ];
    }

    /**
     * @param  list<array<string, mixed>>  $detalle
     * @return list<array{title: string, desc: string, icon: string}>
     */
    private static function detalleToIncluded(array $detalle): array
    {
        $out = [];
        foreach ($detalle as $row) {
            if (! is_array($row)) {
                continue;
            }
            $title = trim((string) ($row['title'] ?? ''));
            if ($title === '') {
                continue;
            }
            $out[] = [
                'title' => $title,
                'desc' => trim((string) ($row['description'] ?? '')),
                'icon' => trim((string) ($row['icon'] ?? 'Package')) ?: 'Package',
            ];
        }

        return $out;
    }

    /**
     * @return list<string>
     */
    private static function imageUrls(Producto $producto): array
    {
        $urls = [];
        if ($producto->imagen) {
            $urls[] = $producto->imagen;
        }
        foreach ($producto->galeria as $g) {
            if (! $g->es_principal && $g->path && ! in_array($g->path, $urls, true)) {
                $urls[] = $g->path;
            }
        }
        if ($urls === []) {
            $urls[] = '/images/products/product-1.png';
        }

        return $urls;
    }

    private static function mainImageUrl(Producto $producto): string
    {
        if ($producto->imagen) {
            return $producto->imagen;
        }
        $urls = self::imageUrls($producto);

        return $urls[0] ?? '/images/products/product-1.png';
    }

    private static function formatDisplayPrice(float $amount): string
    {
        return '$'.number_format($amount, 2, ',', '');
    }
}
