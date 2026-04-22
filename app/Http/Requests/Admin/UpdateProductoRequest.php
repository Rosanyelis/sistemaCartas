<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion_corta' => ['required', 'string', 'max:255'],
            'descripcion_larga' => ['required', 'string'],
            'detalle' => ['nullable', 'string'],
            'categoria' => ['required', 'string', 'max:255'],
            'subcategoria' => ['nullable', 'string', 'max:255'],
            'precio_base' => ['required', 'numeric', 'min:0'],
            'precio_promocional' => ['nullable', 'numeric', 'min:0'],
            'impuesto' => ['nullable', 'numeric', 'min:0'],
            'codigo' => ['required', 'string', 'max:50', 'unique:productos,codigo,'.$this->route('producto')],
            'stock' => ['required', 'integer', 'min:0'],
            'imagen' => ['nullable', 'string'],
            'peso' => ['nullable', 'string', 'max:50'],
            'dimensiones' => ['nullable', 'string', 'max:50'],
            'tipo_envio' => ['nullable', 'string', 'max:100'],
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
            'codigo.unique' => 'Este código ya está en uso.',
        ];
    }
}
