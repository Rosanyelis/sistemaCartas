<?php

namespace App\Console\Commands;

use Database\Seeders\DashboardDemoDataSeeder;
use Illuminate\Console\Command;

class SeedDashboardDemoCommand extends Command
{
    protected $signature = 'demo:seed-dashboard
                            {--year=2026 : Año de las fechas demo}
                            {--month=5 : Mes de las fechas demo (1-12)}
                            {--force : Regenerar aunque ya existan datos demo}';

    protected $description = 'Inserta datos de demostración para el panel admin (métricas y gráfico)';

    public function handle(): int
    {
        $year = (int) $this->option('year');
        $month = (int) $this->option('month');

        if ($month < 1 || $month > 12) {
            $this->error('El mes debe estar entre 1 y 12.');

            return self::FAILURE;
        }

        $seeder = (new DashboardDemoDataSeeder)
            ->configure($year, $month, (bool) $this->option('force'));
        $seeder->setCommand($this);
        $seeder->run();

        $this->newLine();
        $this->line('Clientes: demo-cliente-1@historiasporcorreo.test … demo-cliente-30@historiasporcorreo.test');
        $this->line('Contraseña: password');

        return self::SUCCESS;
    }
}
