<?php

namespace App\Support;

use App\Models\Suscripcion;
use Illuminate\Support\Carbon;

/**
 * Serializa suscripciones del usuario autenticado para la página Inertia `user/subscriptions`.
 */
final class SuscripcionUsuarioListaSerializer
{
    /**
     * @return array{label: string, color: 'success'|'warning'|'danger'}
     */
    public static function estadoPresentacion(string $estado): array
    {
        return match ($estado) {
            'activa' => ['label' => 'Activa', 'color' => 'success'],
            'inactiva' => ['label' => 'Inactiva', 'color' => 'warning'],
            'pendiente' => ['label' => 'Pendiente', 'color' => 'warning'],
            default => ['label' => ucfirst($estado), 'color' => 'danger'],
        };
    }

    /**
     * @return array<string, mixed>
     */
    public static function fila(Suscripcion $s): array
    {
        $presentacion = self::estadoPresentacion((string) $s->estado);
        $historiaNombre = $s->relationLoaded('historia') && $s->historia
            ? (string) $s->historia->nombre
            : 'Historia no disponible';

        return [
            'id' => '#'.$s->id,
            'historia' => $historiaNombre,
            'cantidad' => $s->cantidad,
            'tipo' => (string) $s->tipo,
            'fecha_adquisicion' => self::formatoFecha($s->fecha_adquisicion),
            'fecha_finalizacion' => self::formatoFecha($s->fecha_finalizacion),
            'proximo_cobro' => self::formatoFecha($s->proximo_cobro),
            'estado' => $presentacion['label'],
            'estado_color' => $presentacion['color'],
        ];
    }

    private static function formatoFecha(mixed $fecha): string
    {
        if ($fecha instanceof Carbon) {
            return $fecha->format('Y-m-d');
        }

        return '';
    }
}
