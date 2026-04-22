<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoriaVariante extends Model
{
    protected $fillable = [
        'historia_id',
        'nombre',
        'codigo_variante',
        'precio',
        'stock',
    ];

    public function historia(): BelongsTo
    {
        return $this->belongsTo(Historia::class);
    }
}
