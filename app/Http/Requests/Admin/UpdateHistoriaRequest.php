<?php

namespace App\Http\Requests\Admin;

use App\Rules\MaxWords;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateHistoriaRequest extends FormRequest
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
            'descripcion_larga' => ['required', 'string', new MaxWords(500)],
            'detalle' => ['nullable', 'string', new MaxWords(500)],
            'categoria' => ['required', 'string', 'max:255'],
            'autor' => ['required', 'string', 'max:255'],
            'precio_base' => ['required', 'numeric', 'min:0'],
            'precio_promocional' => ['nullable', 'numeric', 'min:0'],
            'impuesto' => ['nullable', 'numeric', 'min:0'],
            'codigo' => ['required', 'string', 'max:50', 'unique:historias,codigo,'.$this->route('historia')->id],
            'imagen' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048'],
            'video' => ['nullable', 'file', 'mimetypes:video/mp4,video/quicktime', 'max:20480'],
            'peso' => ['nullable', 'string', 'max:50'],
            'dimensiones' => ['nullable', 'string', 'max:50'],
            'tipo_envio' => ['nullable', 'string', 'max:100'],
            'estado' => ['required', 'in:activo,pausado'],
            'duracion_meses' => ['required', 'integer', 'min:1'],
            'variantes' => ['nullable', 'array'],
            'variantes.*.nombre' => ['required', 'string', 'max:255'],
            'variantes.*.codigo_variante' => ['required', 'string', 'max:50'],
            'variantes.*.precio' => ['nullable', 'numeric', 'min:0'],
            'variantes.*.stock' => ['required', 'integer', 'min:0'],
            'galeria' => ['nullable', 'array', 'max:5'],
            'galeria.*' => ['image', 'mimes:jpeg,png,jpg', 'max:2048'],
            'historia_gallery_sync' => ['sometimes', 'boolean'],
            'galeria_keep_ids' => ['sometimes', 'array', 'max:5'],
            'galeria_keep_ids.*' => [
                'integer',
                Rule::exists('historia_galerias', 'id')->where(function ($query) {
                    $query->where('historia_id', $this->route('historia')->id)
                        ->where('es_principal', false);
                }),
            ],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre de la historia es obligatorio.',
            'codigo.unique' => 'Este código ya está en uso.',
            'galeria.max' => 'Solo se permiten hasta 5 imágenes adicionales en la galería.',
        ];
    }
}
