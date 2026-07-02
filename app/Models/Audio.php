<?php

namespace App\Models;

use Database\Factories\AudioFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Audio extends Model
{
    /** @use HasFactory<AudioFactory> */
    use HasFactory, SoftDeletes;

    protected $table = 'audios';

    protected $fillable = [
        'historia_id',
        'titulo',
        'slug',
        'codigo',
        'audio_path',
        'qr_path',
        'duracion_segundos',
        'tamano_bytes',
        'mime_type',
        'estado',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'duracion_segundos' => 'integer',
            'tamano_bytes' => 'integer',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * @return BelongsTo<Historia, $this>
     */
    public function historia(): BelongsTo
    {
        return $this->belongsTo(Historia::class);
    }

    /**
     * @param  Builder<Audio>  $query
     * @param  array<string, mixed>  $filters
     * @return Builder<Audio>
     */
    public function scopeAdminFilters(Builder $query, array $filters): Builder
    {
        if (! empty($filters['search'])) {
            $search = (string) $filters['search'];
            $query->where(function (Builder $q) use ($search): void {
                $q->where('titulo', 'like', "%{$search}%")
                    ->orWhere('codigo', 'like', "%{$search}%")
                    ->orWhereHas('historia', function (Builder $hq) use ($search): void {
                        $hq->where('nombre', 'like', "%{$search}%");
                    });
            });
        }

        return $query;
    }

    /**
     * @param  Builder<Audio>  $query
     * @return Builder<Audio>
     */
    public function scopeActivos(Builder $query): Builder
    {
        return $query->where('estado', 'activo');
    }

    public function isActivo(): bool
    {
        return $this->estado === 'activo';
    }

    public function publicUrl(): string
    {
        return route('audios.show', $this);
    }
}
