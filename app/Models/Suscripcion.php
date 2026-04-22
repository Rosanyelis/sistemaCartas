<?php

namespace App\Models;

use Database\Factories\SuscripcionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Suscripcion extends Model
{
    /** @use HasFactory<SuscripcionFactory> */
    use HasFactory;

    protected $table = 'suscripciones';

    protected $fillable = [
        'user_id',
        'historia_id',
        'tipo',
        'cantidad',
        'fecha_adquisicion',
        'fecha_finalizacion',
        'proximo_cobro',
        'estado',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'fecha_adquisicion' => 'date',
            'fecha_finalizacion' => 'date',
            'proximo_cobro' => 'date',
            'cantidad' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Historia, $this>
     */
    public function historia(): BelongsTo
    {
        return $this->belongsTo(Historia::class);
    }
}
