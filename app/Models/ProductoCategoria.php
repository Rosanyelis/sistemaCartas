<?php

namespace App\Models;

use Database\Factories\ProductoCategoriaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductoCategoria extends Model
{
    /** @use HasFactory<ProductoCategoriaFactory> */
    use HasFactory;

    protected $table = 'producto_categorias';

    protected $fillable = [
        'nombre',
    ];

    /**
     * @return HasMany<ProductoSubcategoria, $this>
     */
    public function subcategorias(): HasMany
    {
        return $this->hasMany(ProductoSubcategoria::class, 'producto_categoria_id');
    }

    /**
     * @return HasMany<Producto, $this>
     */
    public function productos(): HasMany
    {
        return $this->hasMany(Producto::class, 'producto_categoria_id');
    }
}
