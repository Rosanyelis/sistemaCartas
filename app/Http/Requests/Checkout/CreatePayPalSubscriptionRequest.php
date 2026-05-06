<?php

namespace App\Http\Requests\Checkout;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreatePayPalSubscriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'historia_slug' => [
                'required',
                'string',
                'max:255',
                Rule::exists('historias', 'slug')->where('estado', 'activo'),
            ],
            'store_order_id' => ['nullable', 'integer', Rule::exists('store_orders', 'id')],
        ];
    }
}
