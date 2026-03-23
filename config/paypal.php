<?php

return [

    /*
    |--------------------------------------------------------------------------
    | PayPal REST API (sandbox o live)
    |--------------------------------------------------------------------------
    |
    | Credenciales desde developer.paypal.com — aplicación sandbox para pruebas.
    |
    */

    'mode' => env('PAYPAL_MODE', 'sandbox'),

    'client_id' => env('PAYPAL_CLIENT_ID', ''),

    'client_secret' => env('PAYPAL_CLIENT_SECRET', ''),

    'currency' => env('PAYPAL_CURRENCY', 'USD'),

    'timeout' => (int) env('PAYPAL_HTTP_TIMEOUT', 45),

    /*
     * Se puede sobrescribir en tests con config(['paypal.enabled' => true]).
     * Por defecto: activo si hay credenciales en .env.
     */
    'enabled' => env('PAYPAL_ENABLED') !== null
        ? (bool) env('PAYPAL_ENABLED')
        : (filled(env('PAYPAL_CLIENT_ID')) && filled(env('PAYPAL_CLIENT_SECRET'))),

];
