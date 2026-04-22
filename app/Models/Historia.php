<?php

namespace App\Models;

use Database\Factories\HistoriaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

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
        'categoria',
        'autor',
        'precio_base',
        'precio_promocional',
        'impuesto',
        'peso',
        'dimensiones',
        'tipo_envio',
        'estado',
        'fecha_publicacion',
        'duracion_meses',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'precio_base' => 'decimal:2',
            'precio_promocional' => 'decimal:2',
            'impuesto' => 'decimal:2',
            'fecha_publicacion' => 'datetime',
            'duracion_meses' => 'integer',
        ];
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
}
