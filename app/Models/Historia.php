<?php

namespace App\Models;

use Database\Factories\HistoriaFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property array<int, array{icon: string, title: string, description?: string|null}>|null $detalle JSON en columna `detalle`: «¿Qué incluye cada envío?» (icono Lucide en PascalCase, título obligatorio, descripción opcional).
 * @property string $destacada Enum `si` | `no`: historia prioritaria en portadas o bloques destacados.
 */
class Historia extends Model
{
    /** @use HasFactory<HistoriaFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nombre',
        'slug',
        'codigo',
        'imagen',
        'video',
        'descripcion_corta',
        'descripcion_larga',
        'detalle',
        'historia_categoria_id',
        'autor',
        'precio_base',
        'precio_promocional',
        'precio_suscripcion',
        'impuesto',
        'peso',
        'dimensiones',
        'estado',
        'fecha_publicacion',
        'duracion_meses',
        'paypal_product_id',
        'paypal_plan_id',
        'paypal_plan_amount',
        'paypal_plan_interval_meses',
        'destacada',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'detalle' => 'array',
            'precio_base' => 'decimal:2',
            'precio_promocional' => 'decimal:2',
            'precio_suscripcion' => 'decimal:2',
            'paypal_plan_amount' => 'decimal:2',
            'paypal_plan_interval_meses' => 'integer',
            'impuesto' => 'decimal:2',
            'fecha_publicacion' => 'datetime',
            'duracion_meses' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<HistoriaCategoria, $this>
     */
    public function historiaCategoria(): BelongsTo
    {
        return $this->belongsTo(HistoriaCategoria::class, 'historia_categoria_id');
    }

    /**
     * @param  Builder<Historia>  $query
     * @param  array<string, mixed>  $filters
     * @return Builder<Historia>
     */
    public function scopeAdminFilters(Builder $query, array $filters): Builder
    {
        if (! empty($filters['search'])) {
            $search = (string) $filters['search'];
            $query->where(function (Builder $q) use ($search): void {
                $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('codigo', 'like', "%{$search}%")
                    ->orWhere('autor', 'like', "%{$search}%");
            });
        }

        if (! empty($filters['categoria_id'])) {
            $query->where('historia_categoria_id', (int) $filters['categoria_id']);
        }

        if (! empty($filters['start_date'])) {
            $query->whereDate('fecha_publicacion', '>=', $filters['start_date']);
        }

        if (! empty($filters['end_date'])) {
            $query->whereDate('fecha_publicacion', '<=', $filters['end_date']);
        }

        return $query;
    }

    /**
     * @return HasMany<HistoriaVariante, $this>
     */
    public function variantes(): HasMany
    {
        return $this->hasMany(HistoriaVariante::class);
    }

    /**
     * @return HasMany<HistoriaGaleria, $this>
     */
    public function galeria(): HasMany
    {
        return $this->hasMany(HistoriaGaleria::class);
    }

    /**
     * @return HasMany<Entrega, $this>
     */
    public function entregas(): HasMany
    {
        return $this->hasMany(Entrega::class);
    }

    /**
     * @return HasMany<Suscripcion, $this>
     */
    public function suscripciones(): HasMany
    {
        return $this->hasMany(Suscripcion::class);
    }

    /**
     * @return HasMany<Audio, $this>
     */
    public function audios(): HasMany
    {
        return $this->hasMany(Audio::class);
    }
}
