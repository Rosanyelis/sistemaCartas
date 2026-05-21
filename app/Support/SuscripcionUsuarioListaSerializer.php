<?php

namespace App\Support;

use App\Models\Suscripcion;
use Carbon\Carbon;
use DateTimeInterface;

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
            'activa' => ['label' => 'Completado', 'color' => 'success'],
            'inactiva' => ['label' => 'Rechazado', 'color' => 'danger'],
            'pendiente' => ['label' => 'Pendiente', 'color' => 'warning'],
            default => ['label' => 'Rechazado', 'color' => 'danger'],
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

        $fechaAdq = $s->fecha_adquisicion ?? $s->created_at;

        return [
            'id' => '#'.$s->id,
            'suscripcion_id' => $s->id,
            'historia' => $historiaNombre,
            'cantidad' => $s->cantidad,
            'tipo' => (string) $s->tipo,
            'fecha_adquisicion' => self::formatoFecha($fechaAdq),
            'fecha_finalizacion' => self::formatoFecha($s->fecha_finalizacion),
            'proximo_cobro' => self::formatoFecha($s->proximo_cobro),
            'estado' => $presentacion['label'],
            'estado_color' => $presentacion['color'],
            'es_activa' => $s->estado === 'activa',
        ];
    }

    private static function formatoFecha(mixed $fecha): string
    {
        if ($fecha instanceof DateTimeInterface) {
            return Carbon::parse($fecha)->format('Y-m-d');
        }

        if (is_string($fecha) && $fecha !== '') {
            try {
                return Carbon::parse($fecha)->format('Y-m-d');
            } catch (\Throwable) {
                return '';
            }
        }

        return '';
    }
}
