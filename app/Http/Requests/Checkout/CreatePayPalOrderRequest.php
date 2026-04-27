<?php

namespace App\Http\Requests\Checkout;

use App\Models\Producto;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Pago de carrito: slugs deben existir en `productos` con estado activo (SoftDeletes aplicado por el modelo).
 * Suscripciones a historias: fases futuras (otro shape de `items.*`).
 */
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
            'items.*.slug' => [
                'required',
                'string',
                'max:120',
                Rule::exists(Producto::class, 'slug')->where('estado', 'activo'),
            ],
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
            'items.*.slug.exists' => 'Hay un producto no válido en el carrito.',
        ];
    }
}
