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

    /*
    |--------------------------------------------------------------------------
    | Recordatorio de renovación de suscripción (correo programado)
    |--------------------------------------------------------------------------
    |
    | Días antes de proximo_cobro en los que se envía el recordatorio al usuario.
    | El cobro lo sigue gestionando PayPal Subscriptions.
    |
    */

    'renewal_reminder_days_before' => (int) env('TIENDA_RENEWAL_REMINDER_DAYS', 3),

];
