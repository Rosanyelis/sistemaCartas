<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\PreparesHistoriaDetalleJson;
use App\Http\Requests\Concerns\FlashesValidationError;
use App\Rules\MaxWords;
use App\Support\HistoriaDetalleInclusionIcon;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductoRequest extends FormRequest
{
    use FlashesValidationError;
    use PreparesHistoriaDetalleJson;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->mergeHistoriaDetalleFromRequest();

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
            'detalle' => ['nullable', 'array', 'max:20'],
            'detalle.*.icon' => ['required', 'string', Rule::in(HistoriaDetalleInclusionIcon::allowed())],
            'detalle.*.title' => ['required', 'string', 'max:255'],
            'detalle.*.description' => ['nullable', 'string', 'max:500'],
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
            'imagen' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
            'video' => ['nullable', 'file', 'mimetypes:video/mp4,video/quicktime', 'max:20480'],
            'peso' => ['nullable', 'string', 'max:50'],
            'dimensiones' => ['nullable', 'string', 'max:50'],
            'estado' => ['required', 'in:activo,pausado'],
            'galeria' => ['nullable', 'array', 'max:5'],
            'galeria.*' => ['image', 'mimes:jpeg,png,jpg', 'max:2048'],
            'producto_gallery_sync' => ['prohibited'],
            'galeria_keep_ids' => ['prohibited'],
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
            'galeria.max' => 'Solo se permiten hasta 5 imágenes adicionales en la galería.',
            'detalle.array' => 'El formato de «qué incluye el envío / el producto» no es válido.',
            'detalle.max' => 'No se pueden añadir más de 20 ítems en esta sección.',
            'detalle.*.icon.required' => 'Cada ítem debe tener un icono.',
            'detalle.*.icon.in' => 'El icono seleccionado no está permitido.',
            'detalle.*.title.required' => 'Cada ítem debe tener un título.',
            'detalle.*.title.max' => 'El título de cada ítem no puede superar 255 caracteres.',
            'detalle.*.description.max' => 'La descripción de cada ítem no puede superar 500 caracteres.',
        ];
    }
}
