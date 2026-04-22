<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoriaCapitulo extends Model
{
    protected $fillable = [
        'historia_id',
        'titulo',
        'texto',
        'orden',
        'estatus',
    ];

    public function historia(): BelongsTo
    {
        return $this->belongsTo(Historia::class);
    }
}
