<?php

namespace App\Http\Requests\Concerns;

use Illuminate\Contracts\Validation\Validator;

trait FlashesValidationError
{
    protected function failedValidation(Validator $validator): void
    {
        session()->flash('error', 'Corrige los datos del formulario e inténtalo de nuevo.');

        parent::failedValidation($validator);
    }
}
