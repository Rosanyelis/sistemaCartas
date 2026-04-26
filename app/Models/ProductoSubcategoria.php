<?php

namespace App\Models;

use Database\Factories\ProductoSubcategoriaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductoSubcategoria extends Model
{
    /** @use HasFactory<ProductoSubcategoriaFactory> */
    use HasFactory;

    protected $table = 'producto_subcategorias';

    protected $fillable = [
        'producto_categoria_id',
        'nombre',
    ];

    /**
     * @return BelongsTo<ProductoCategoria, $this>
     */
    public function categoria(): BelongsTo
    {
        return $this->belongsTo(ProductoCategoria::class, 'producto_categoria_id');
    }

    /**
     * @return HasMany<Producto, $this>
     */
    public function productos(): HasMany
    {
        return $this->hasMany(Producto::class, 'producto_subcategoria_id');
    }
}
