<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::query()->updateOrCreate([
            'email' => 'admin@historiasporcorreo.test',
        ], [
            'name' => 'Admin',
            'role' => 'admin',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ]);

        $this->call(TiposPagoSeeder::class);
        $this->call(ProductosSeeder::class);
        $this->call(HistoriasSeeder::class);
        $this->call(ProductoGaleriasSeeder::class);
        $this->call(HistoriaGaleriasSeeder::class);
    }
}
