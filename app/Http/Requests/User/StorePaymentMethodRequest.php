<?php

namespace App\Http\Requests\User;

use App\Models\TipoMetodoPago;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePaymentMethodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $allowedNames = config('payments.allowed_profile_method_type_names', ['Paypal']);
        $allowedIds = TipoMetodoPago::query()
            ->whereIn('nombre', $allowedNames)
            ->pluck('id')
            ->all();

        return [
            'tipo_id' => ['required', 'integer', Rule::in($allowedIds)],
            'titular' => ['required', 'string', 'max:255'],
            'detalles' => ['required', 'string', 'max:255'],
            'is_default' => ['boolean'],
        ];
    }
}
