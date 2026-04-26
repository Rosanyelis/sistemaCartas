<?php

namespace App\Models;

use App\Enums\HistoriaVarianteTipo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoriaVariante extends Model
{
    protected $fillable = [
        'historia_id',
        'tipo',
        'valor',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tipo' => HistoriaVarianteTipo::class,
        ];
    }

    public function historia(): BelongsTo
    {
        return $this->belongsTo(Historia::class);
    }
}
