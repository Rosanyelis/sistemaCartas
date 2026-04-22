<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoriaGaleria extends Model
{
    protected $fillable = [
        'historia_id',
        'path',
        'tipo',
        'es_principal',
    ];

    public function historia(): BelongsTo
    {
        return $this->belongsTo(Historia::class);
    }
}
