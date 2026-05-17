<?php

namespace App\Models;

use Database\Factories\ProductoFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property array<int, array{icon: string, title: string, description?: string|null}>|null $detalle
 */
class Producto extends Model
{
    /** @use HasFactory<ProductoFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'nombre',
        'slug',
        'codigo',
        'imagen',
        'video',
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
        'estado',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'detalle' => 'array',
            'precio_base' => 'decimal:2',
            'precio_promocional' => 'decimal:2',
            'impuesto' => 'decimal:2',
            'stock' => 'integer',
        ];
    }

    /**
     * @param  Builder<Producto>  $query
     * @param  array<string, mixed>  $filters
     * @return Builder<Producto>
     */
    public function scopeAdminFilters(Builder $query, array $filters): Builder
    {
        if (! empty($filters['search'])) {
            $search = (string) $filters['search'];
            $query->where(function (Builder $q) use ($search): void {
                $q->where('nombre', 'like', "%{$search}%")
                    ->orWhere('codigo', 'like', "%{$search}%")
                    ->orWhereHas('productoSubcategoria', fn (Builder $s) => $s->where('nombre', 'like', "%{$search}%"))
                    ->orWhereHas('productoCategoria', fn (Builder $c) => $c->where('nombre', 'like', "%{$search}%"));
            });
        }

        if (! empty($filters['categoria_id'])) {
            $query->where('producto_categoria_id', (int) $filters['categoria_id']);
        }

        return $query;
    }

    /**
     * @return HasMany<ProductoGaleria, $this>
     */
    public function galeria(): HasMany
    {
        return $this->hasMany(ProductoGaleria::class);
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
