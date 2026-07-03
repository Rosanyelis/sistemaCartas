<?php

namespace App\Http\Requests\Admin;

use App\Http\Requests\Concerns\FlashesValidationError;
use Illuminate\Foundation\Http\FormRequest;

class UpdateAudioRequest extends FormRequest
{
    use FlashesValidationError;

    public function authorize(): bool
    {
        return true;
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
            'estado' => ['required', 'in:activo,pausado'],
            'audio' => ['nullable', 'file', 'mimetypes:'.implode(',', $mimetypes), 'max:'.$maxKb],
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
            'estado.required' => 'El estado es obligatorio.',
            'audio.mimetypes' => 'El formato de audio no está permitido.',
            'audio.max' => 'El audio no puede superar 50 MB.',
        ];
    }
}
