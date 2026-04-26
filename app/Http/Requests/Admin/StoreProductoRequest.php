<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Concerns\FlashesValidationError;
use App\Rules\MaxWords;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductoRequest extends FormRequest
{
    use FlashesValidationError;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('producto_subcategoria_id') && $this->input('producto_subcategoria_id') === '') {
            $this->merge(['producto_subcategoria_id' => null]);
        }
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion_corta' => ['required', 'string', 'max:255'],
            'descripcion_larga' => ['required', 'string', new MaxWords(500)],
            'detalle' => ['nullable', 'string', new MaxWords(500)],
            'producto_categoria_id' => ['required', 'integer', 'exists:producto_categorias,id'],
            'producto_subcategoria_id' => [
                'nullable',
                'integer',
                Rule::exists('producto_subcategorias', 'id')->where(
                    'producto_categoria_id',
                    (int) $this->input('producto_categoria_id')
                ),
            ],
            'precio_base' => ['required', 'numeric', 'min:0'],
            'precio_promocional' => ['nullable', 'numeric', 'min:0'],
            'impuesto' => ['nullable', 'numeric', 'min:0'],
            'codigo' => ['required', 'string', 'max:50', 'unique:productos,codigo'],
            'stock' => ['required', 'integer', 'min:0'],
            'imagen' => ['nullable', 'string'],
            'peso' => ['nullable', 'string', 'max:50'],
            'dimensiones' => ['nullable', 'string', 'max:50'],
            'variantes' => ['nullable', 'array'],
            'galeria' => ['nullable', 'array'],
            'estado' => ['required', 'in:activo,pausado'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre del producto es obligatorio.',
            'descripcion_corta.required' => 'La descripción corta es obligatoria.',
            'descripcion_larga.required' => 'La descripción larga es obligatoria.',
            'producto_categoria_id.required' => 'La categoría es obligatoria.',
            'producto_categoria_id.exists' => 'La categoría seleccionada no es válida.',
            'producto_subcategoria_id.exists' => 'La subcategoría no corresponde a la categoría elegida.',
            'precio_base.required' => 'El precio base es obligatorio.',
            'codigo.required' => 'El código es obligatorio.',
            'codigo.unique' => 'Este código ya está en uso.',
            'stock.required' => 'El stock es obligatorio.',
            'stock.min' => 'El stock no puede ser negativo.',
            'estado.required' => 'El estado es obligatorio.',
        ];
    }
}
