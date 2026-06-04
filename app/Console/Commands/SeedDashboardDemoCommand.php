<?php

namespace App\Console\Commands;

use Database\Seeders\DashboardDemoDataSeeder;
use Illuminate\Console\Command;

class SeedDashboardDemoCommand extends Command
{
    protected $signature = 'demo:seed-dashboard
                            {--year=2026 : Año del periodo demo (1 abr – 3 jun)}
                            {--month= : Ignorado: el rango de fechas es fijo abril–3 de junio}
                            {--force : Regenerar aunque ya existan datos demo}';

    protected $description = 'Inserta datos de demostración para el panel admin (métricas y gráfico, abr–3 jun)';

    public function handle(): int
    {
        if ($this->option('month') !== null && $this->option('month') !== '') {
            $this->warn('La opción --month ya no aplica: las compras demo se reparten entre abril y el 3 de junio del año indicado.');
        }

        $year = (int) $this->option('year');

        $seeder = (new DashboardDemoDataSeeder)
            ->configure($year, null, (bool) $this->option('force'));
        $seeder->setCommand($this);
        $seeder->run();

        $this->newLine();
        $this->line('Clientes: demo-cliente-1@historiasporcorreo.test … demo-cliente-30@historiasporcorreo.test');
        $this->line('Contraseña: password');
        $this->line(sprintf('Periodo de compras demo: 1 abr – 3 jun %d.', $year));

        return self::SUCCESS;
    }
}
