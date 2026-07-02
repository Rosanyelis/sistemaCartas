<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Concerns\FlashesValidationError;
use Illuminate\Foundation\Http\FormRequest;

class StoreAudioRequest extends FormRequest
{
    use FlashesValidationError;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('codigo') && $this->input('codigo') === '') {
            $this->merge(['codigo' => null]);
        }
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        $maxKb = (int) config('media.audio.max_upload_kb', 51200);
        $mimetypes = config('media.audio.allowed_mimetypes', []);

        return [
            'historia_id' => ['required', 'integer', 'exists:historias,id'],
            'titulo' => ['required', 'string', 'max:255'],
            'codigo' => ['nullable', 'string', 'max:50', 'unique:audios,codigo'],
            'estado' => ['required', 'in:activo,pausado'],
            'audio' => ['required', 'file', 'mimetypes:'.implode(',', $mimetypes), 'max:'.$maxKb],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'historia_id.required' => 'La historia es obligatoria.',
            'historia_id.exists' => 'La historia seleccionada no es válida.',
            'titulo.required' => 'El título es obligatorio.',
            'codigo.unique' => 'Este código ya está en uso.',
            'estado.required' => 'El estado es obligatorio.',
            'audio.required' => 'El archivo de audio es obligatorio.',
            'audio.mimetypes' => 'El formato de audio no está permitido.',
            'audio.max' => 'El audio no puede superar 50 MB.',
        ];
    }
}
