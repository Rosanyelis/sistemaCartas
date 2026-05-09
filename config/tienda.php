<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Porcentaje de IVA (catálogo: precios en tienda como base sin IVA)
    |--------------------------------------------------------------------------
    |
    | Se suma en checkout (PayPal Orders) y en cargos recurrentes de suscripción
    | (PayPal Billing). Ajustable vía TIENDA_IVA_PERCENTAGE en .env.
    |
    */

    'iva_percentage' => (float) env('TIENDA_IVA_PERCENTAGE', 16),

];
