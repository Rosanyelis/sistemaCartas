<?php

namespace App\Models;

use Database\Factories\HistoriaCategoriaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HistoriaCategoria extends Model
{
    /** @use HasFactory<HistoriaCategoriaFactory> */
    use HasFactory;

    protected $table = 'historia_categorias';

    protected $fillable = [
        'nombre',
    ];

    /**
     * @return HasMany<Historia, $this>
     */
    public function historias(): HasMany
    {
        return $this->hasMany(Historia::class, 'historia_categoria_id');
    }
}
