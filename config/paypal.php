<?php

return [

    /*
    |--------------------------------------------------------------------------
    | PayPal REST API (sandbox o live)
    |--------------------------------------------------------------------------
    |
    | Credenciales desde https://developer.paypal.com — crea una aplicación
    | REST por entorno (Sandbox / Live) y copia Client ID y Secret.
    |
    | Variables .env recomendadas:
    |
    |   PAYPAL_MODE=sandbox          # sandbox | live
    |   PAYPAL_CLIENT_ID=...
    |   PAYPAL_CLIENT_SECRET=...
    |   PAYPAL_CURRENCY=USD
    |   PAYPAL_HTTP_TIMEOUT=45
    |   PAYPAL_ENABLED=               # opcional: true/false; si se omite, activo si hay id+secret
    |
    | Webhooks (misma app en Developer Dashboard → Webhooks):
    |
    |   PAYPAL_WEBHOOK_ID=...        # id del webhook (obligatorio para verificar firma en prod)
    |   PAYPAL_WEBHOOK_VERIFY=true   # false solo en diagnóstico local (no en producción)
    |
    | Esta tienda usa solo PayPal: Orders v2 (productos) y Subscriptions v1 (historias).
    |
    */

    'mode' => env('PAYPAL_MODE', 'sandbox'),

    'client_id' => env('PAYPAL_CLIENT_ID', ''),

    'client_secret' => env('PAYPAL_CLIENT_SECRET', ''),

    'currency' => env('PAYPAL_CURRENCY', 'USD'),

    'timeout' => (int) env('PAYPAL_HTTP_TIMEOUT', 45),

    'webhook_id' => env('PAYPAL_WEBHOOK_ID', ''),

    'webhook_verify' => filter_var(env('PAYPAL_WEBHOOK_VERIFY', true), FILTER_VALIDATE_BOOL),

    /*
     * Se puede sobrescribir en tests con config(['paypal.enabled' => true]).
     * Por defecto: activo si hay credenciales en .env.
     */
    'enabled' => env('PAYPAL_ENABLED') !== null
        ? (bool) env('PAYPAL_ENABLED')
        : (filled(env('PAYPAL_CLIENT_ID')) && filled(env('PAYPAL_CLIENT_SECRET'))),

];
