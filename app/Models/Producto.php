<?php

namespace App\Models;

use Database\Factories\ProductoFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
        'categoria',
        'subcategoria',
        'precio_base',
        'precio_promocional',
        'impuesto',
        'stock',
        'peso',
        'dimensiones',
        'tipo_envio',
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
}
