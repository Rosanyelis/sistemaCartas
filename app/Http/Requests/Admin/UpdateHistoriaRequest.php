<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Admin\Concerns\PreparesHistoriaDetalleJson;
use App\Http\Requests\Admin\Concerns\ValidatesGaleriaImageLimit;
use App\Support\HistoriaDetalleInclusionIcon;
use App\Support\HistoriaFormLimits;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateHistoriaRequest extends FormRequest
{
    use PreparesHistoriaDetalleJson;
    use ValidatesGaleriaImageLimit;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->mergeHistoriaDetalleFromRequest();

        if (! $this->has('variantes') || ! is_array($this->input('variantes'))) {
            return;
        }

        $fixed = collect($this->input('variantes'))->map(function ($row) {
            if (! is_array($row)) {
                return $row;
            }
            $t = strtolower(trim((string) ($row['tipo'] ?? 'papel')));
            $row['tipo'] = in_array($t, ['papel', 'color'], true) ? $t : 'papel';
            $row['valor'] = trim((string) ($row['valor'] ?? ''));

            return $row;
        })->all();

        $this->merge(['variantes' => $fixed]);
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'nombre' => ['required', 'string', 'max:255'],
            'descripcion_corta' => ['required', 'string', 'max:255'],
            'descripcion_larga' => ['required', 'string', 'max:'.HistoriaFormLimits::MAX_DESCRIPCION_LARGA_CARACTERES],
            'detalle' => ['nullable', 'array', 'max:20'],
            'detalle.*.icon' => ['required', 'string', Rule::in(HistoriaDetalleInclusionIcon::allowed())],
            'detalle.*.title' => ['required', 'string', 'max:255'],
            'detalle.*.description' => ['nullable', 'string', 'max:500'],
            'historia_categoria_id' => ['required', 'integer', 'exists:historia_categorias,id'],
            'autor' => ['required', 'string', 'max:255'],
            'precio_base' => ['required', 'numeric', 'min:0'],
            'precio_promocional' => ['nullable', 'numeric', 'min:0'],
            'impuesto' => ['nullable', 'numeric', 'min:0'],
            'codigo' => ['required', 'string', 'max:50', 'unique:historias,codigo,'.$this->route('historia')->id],
            'imagen' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'video' => ['nullable', 'file', 'mimetypes:video/mp4,video/quicktime'],
            'peso' => ['nullable', 'string', 'max:50'],
            'dimensiones' => ['nullable', 'string', 'max:50'],
            'estado' => ['required', 'in:activo,pausado'],
            'destacada' => ['required', 'in:si,no'],
            'duracion_meses' => ['required', 'integer', 'min:1'],
            'variantes' => ['nullable', 'array'],
            'variantes.*.tipo' => ['required', 'string', 'in:papel,color'],
            'variantes.*.valor' => ['required', 'string', 'max:2000'],
            'galeria' => ['nullable', 'array', 'max:5'],
            'galeria.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
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
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return $this->galeriaTotalCountValidators();
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre de la historia es obligatorio.',
            'descripcion_larga.max' => 'La descripción larga no puede superar :max caracteres.',
            'codigo.unique' => 'Este código ya está en uso.',
            'galeria.max' => self::GALERIA_IMAGENES_MAX_MESSAGE,
            'detalle.array' => 'El formato de «qué incluye cada envío» no es válido.',
            'detalle.max' => 'No se pueden añadir más de 20 ítems en «qué incluye cada envío».',
            'detalle.*.icon.required' => 'Cada ítem debe tener un icono.',
            'detalle.*.icon.in' => 'El icono seleccionado no está permitido.',
            'detalle.*.title.required' => 'Cada ítem debe tener un título.',
            'detalle.*.title.max' => 'El título de cada ítem no puede superar 255 caracteres.',
            'detalle.*.description.max' => 'La descripción de cada ítem no puede superar 500 caracteres.',
            'destacada.required' => 'Indica si la historia es destacada o no.',
            'destacada.in' => 'El valor de destacada debe ser si o no.',
            'imagen.max' => 'La imagen no puede superar 5 MB.',
            'video.mimetypes' => 'El video debe ser MP4 o MOV.',
            'video.file' => 'El archivo de video no es válido.',
        ];
    }
}
