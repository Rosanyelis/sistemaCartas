<?php

namespace App\Support;

use App\Models\Historia;

/**
 * Serialización mínima de una historia para tarjetas en la tienda (Inertia).
 *
 * @see resources/js/types/welcome.ts Story
 */
final class HistoriaCatalogoSerializer
{
    /**
     * @return array{id: int, slug: string, title: string, desc: string, price: string, img: string, categoria: string}
     */
    public static function tarjeta(Historia $historia): array
    {
        $precioMostrar = $historia->precio_promocional ?? $historia->precio_base;
        $precioFmt = number_format((float) $precioMostrar, 2, ',', '.');

        return [
            'id' => $historia->id,
            'slug' => $historia->slug,
            'title' => $historia->nombre,
            'desc' => $historia->descripcion_corta,
            'price' => 'Desde $'.$precioFmt,
            'img' => $historia->imagen ?: '/images/story_cover.png',
            'categoria' => $historia->historiaCategoria?->nombre ?? '',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function detallePublico(Historia $historia): array
    {
        return [
            'nombre' => $historia->nombre,
            'slug' => $historia->slug,
            'categoria' => $historia->historiaCategoria?->nombre ?? '',
            'descripcion_corta' => $historia->descripcion_corta,
            'descripcion_larga' => $historia->descripcion_larga,
            'detalle' => $historia->detalle ?? [],
            'imagen' => $historia->imagen,
            'video' => $historia->video,
            'precio_base' => (string) $historia->precio_base,
            'precio_promocional' => $historia->precio_promocional !== null ? (string) $historia->precio_promocional : null,
            'precio_suscripcion' => $historia->precio_suscripcion !== null ? (string) $historia->precio_suscripcion : null,
            'duracion_meses' => $historia->duracion_meses,
            'subscription_unit_price' => (string) HistoriaSuscripcionPrecio::montoPorCiclo($historia),
            'subscription_charge_unit_price' => (string) HistoriaSuscripcionPrecio::montoPorCicloCargoPayPal($historia),
            'variantes' => $historia->variantes->map(fn ($v) => [
                'tipo' => $v->tipo->value,
                'valor' => $v->valor,
            ])->values()->all(),
            'galeria' => $historia->galeria->map(fn ($g) => [
                'id' => $g->id,
                'path' => $g->path,
                'tipo' => $g->tipo,
                'es_principal' => (bool) $g->es_principal,
            ])->values()->all(),
        ];
    }
}
