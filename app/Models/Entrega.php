<?php

namespace App\Models;

use Database\Factories\EntregaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Entrega extends Model
{
    /** @use HasFactory<EntregaFactory> */
    use HasFactory;

    protected $fillable = [
        'historia_id',
        'numero_entrega',
        'titulo',
        'contenido',
        'archivo',
        'estado',
        'fecha_envio',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'fecha_envio' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Historia, $this>
     */
    public function historia(): BelongsTo
    {
        return $this->belongsTo(Historia::class);
    }
}
