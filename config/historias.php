<?php

use App\Support\HistoriaFormLimits;

return [

    /*
    |--------------------------------------------------------------------------
    | Tienda pública — listado
    |--------------------------------------------------------------------------
    */

    'tienda_per_page' => (int) env('HISTORIAS_TIENDA_PER_PAGE', 6),

    /*
    |--------------------------------------------------------------------------
    | Tienda pública — carrusel de destacadas
    |--------------------------------------------------------------------------
    */

    'tienda_destacadas_max' => (int) env('HISTORIAS_TIENDA_DESTACADAS_MAX', 10),

    /*
    |--------------------------------------------------------------------------
    | Formulario admin — descripción larga
    |--------------------------------------------------------------------------
    */

    'max_descripcion_larga_caracteres' => HistoriaFormLimits::MAX_DESCRIPCION_LARGA_CARACTERES,

];
