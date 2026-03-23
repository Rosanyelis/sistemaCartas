<?php

namespace Database\Seeders;

use App\Models\TipoMetodoPago;
use Illuminate\Database\Seeder;

class TiposPagoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tipos = [
            ['nombre' => 'Paypal', 'icono' => 'paypal'],
            ['nombre' => 'Tarjeta Crédito', 'icono' => 'credit-card'],
            ['nombre' => 'Mercado Pago', 'icono' => 'mercadopago'],
        ];

        foreach ($tipos as $tipo) {
            TipoMetodoPago::updateOrCreate(
                ['nombre' => $tipo['nombre']],
                ['icono' => $tipo['icono']]
            );
        }
    }
}
