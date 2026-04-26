<?php

namespace App\Models;

use Database\Factories\ProductoFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Producto extends Model
{
    /** @use HasFactory<ProductoFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nombre',
        'slug',
        'codigo',
        'imagen',
        'descripcion_corta',
        'descripcion_larga',
        'detalle',
        'producto_categoria_id',
        'producto_subcategoria_id',
        'precio_base',
        'precio_promocional',
        'impuesto',
        'stock',
        'peso',
        'dimensiones',
        'variantes',
        'galeria',
        'estado',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'precio_base' => 'decimal:2',
            'precio_promocional' => 'decimal:2',
            'impuesto' => 'decimal:2',
            'stock' => 'integer',
            'variantes' => 'array',
            'galeria' => 'array',
        ];
    }

    /**
     * @return BelongsTo<ProductoCategoria, $this>
     */
    public function productoCategoria(): BelongsTo
    {
        return $this->belongsTo(ProductoCategoria::class, 'producto_categoria_id');
    }

    /**
     * @return BelongsTo<ProductoSubcategoria, $this>
     */
    public function productoSubcategoria(): BelongsTo
    {
        return $this->belongsTo(ProductoSubcategoria::class, 'producto_subcategoria_id');
    }

    /**
     * Precio mostrado (promocional si existe; si no, base).
     *
     * @return Attribute<float, never>
     */
    protected function precio(): Attribute
    {
        return Attribute::get(function (): float {
            $promo = $this->precio_promocional;

            return (float) (($promo !== null && (float) $promo > 0) ? $promo : $this->precio_base);
        });
    }
}
