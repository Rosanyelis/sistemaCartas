<?php

namespace App\Http\Requests\Checkout;

use App\Support\Store\ProductCatalog;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreatePayPalOrderRequest extends FormRequest
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
        return [
            'items' => ['required', 'array', 'min:1', 'max:50'],
            'items.*.slug' => ['required', 'string', 'max:120', Rule::in(ProductCatalog::slugs())],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'items.required' => 'El carrito está vacío.',
            'items.*.slug.in' => 'Hay un producto no válido en el carrito.',
        ];
    }
}
