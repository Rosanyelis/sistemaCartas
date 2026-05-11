<?php

namespace App\Http\Requests\User;

use App\Models\Suscripcion;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Gate;

class CancelUserSuscripcionRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Suscripcion $suscripcion */
        $suscripcion = $this->route('suscripcion');

        return Gate::allows('cancel', $suscripcion);
    }

    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [];
    }
}
