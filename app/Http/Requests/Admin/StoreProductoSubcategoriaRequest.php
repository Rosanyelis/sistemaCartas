<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductoSubcategoriaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'producto_categoria_id' => ['required', 'integer', 'exists:producto_categorias,id'],
            'nombre' => [
                'required',
                'string',
                'max:255',
                Rule::unique('producto_subcategorias', 'nombre')->where(
                    fn ($query) => $query->where('producto_categoria_id', $this->integer('producto_categoria_id'))
                ),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'producto_categoria_id.required' => 'Debes indicar la categoría padre.',
            'nombre.required' => 'El nombre de la subcategoría es obligatorio.',
            'nombre.unique' => 'Ya existe una subcategoría con ese nombre en esta categoría.',
        ];
    }
}
