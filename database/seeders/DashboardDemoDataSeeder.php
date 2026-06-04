<?php

namespace Database\Seeders;

use App\Models\Historia;
use App\Models\HistoriaCategoria;
use App\Models\HistoriaGaleria;
use App\Models\PasarelaEvento;
use App\Models\Producto;
use App\Models\ProductoCategoria;
use App\Models\ProductoGaleria;
use App\Models\ProductoSubcategoria;
use App\Models\StoreOrder;
use App\Models\StoreOrderItem;
use App\Models\Suscripcion;
use App\Models\User;
use App\Support\Demo\DemoStoreOrderFactory;
use App\Support\HistoriaSuscripcionPrecio;
use Database\Seeders\Support\HistoriaSeederImagenes;
use Database\Seeders\Support\ProductoSeederImagenes;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

/**
 * Datos de demostración para el panel admin (métricas, gráfico, listados).
 *
 * Ejecución manual (no se invoca desde DatabaseSeeder por defecto):
 *   php artisan demo:seed-dashboard
 *   php artisan demo:seed-dashboard --year=2026 --force
 *
 * Las compras demo se reparten entre el 1 de abril y el 3 de junio del año indicado (por defecto 2026).
 * La opción --month del comando se ignora (rango fijo abr–3 jun).
 *
 * Credenciales clientes demo: demo-cliente-{n}@historiasporcorreo.test / password
 */
class DashboardDemoDataSeeder extends Seeder
{
    public const int DEMO_CLIENTS = 30;

    public const int DEMO_PRODUCTS = 30;

    public const int DEMO_STORIES = 30;

    public const int DEMO_PAID_ORDERS = 50;

    public const int DEMO_SUBSCRIPTIONS = 45;

    /** Órdenes pagadas demo por tramo (abr / may / jun 1–3). */
    public const int DEMO_ORDERS_APRIL = 20;

    public const int DEMO_ORDERS_MAY = 25;

    public const int DEMO_ORDERS_JUNE = 5;

    /** Suscripciones demo por tramo (abr / may / jun 1–3). */
    public const int DEMO_SUBSCRIPTIONS_APRIL = 18;

    public const int DEMO_SUBSCRIPTIONS_MAY = 22;

    public const int DEMO_SUBSCRIPTIONS_JUNE = 5;

    public bool $force = false;

    private int $year = 2026;

    /** @var list<User> */
    private array $clientes = [];

    /** @var list<Producto> */
    private array $productos = [];

    /** @var list<Historia> */
    private array $historias = [];

    public function run(): void
    {
        if (app()->environment('production')) {
            throw new RuntimeException(
                'DashboardDemoDataSeeder no puede ejecutarse en producción.',
            );
        }

        $this->year = (int) (env('DEMO_DATA_YEAR') ?: $this->year);

        if ($this->shouldSkip()) {
            $this->command?->warn(
                'Datos demo del dashboard ya presentes. Usa --force o DEMO_SEED_FORCE=1 para regenerar.',
            );

            return;
        }

        $this->purgeDemoData();

        $this->ensureTaxonomia();
        $this->seedClientes();
        $this->seedProductos();
        $this->seedHistorias();
        $this->seedOrdenesProducto();
        $this->seedSuscripciones();

        $this->command?->info(sprintf(
            'Dashboard demo: %d clientes, %d productos, %d historias, %d órdenes, %d suscripciones (compras entre abril y 3 de junio de %d).',
            self::DEMO_CLIENTS,
            self::DEMO_PRODUCTS,
            self::DEMO_STORIES,
            self::DEMO_PAID_ORDERS,
            self::DEMO_SUBSCRIPTIONS,
            $this->year,
        ));
    }

    /**
     * @param  int|null  $month  Ignorado (compatibilidad); el rango de fechas es fijo abr–3 jun.
     */
    public function configure(int $year, ?int $month = null, bool $force = false): self
    {
        $this->year = $year;
        $this->force = $force;

        return $this;
    }

    private function shouldSkip(): bool
    {
        if ($this->force || filter_var(env('DEMO_SEED_FORCE'), FILTER_VALIDATE_BOOL)) {
            return false;
        }

        return User::query()
            ->where('email', 'like', 'demo-cliente-%@historiasporcorreo.test')
            ->count() >= self::DEMO_CLIENTS;
    }

    private function purgeDemoData(): void
    {
        $demoUserIds = User::query()
            ->where('email', 'like', 'demo-cliente-%@historiasporcorreo.test')
            ->pluck('id');

        $demoOrderIds = StoreOrder::query()
            ->where('paypal_order_id', 'like', 'DEMO-ORDER-MAY-%')
            ->pluck('id');

        $demoSuscripcionIds = Suscripcion::query()
            ->where('paypal_subscription_id', 'like', 'I-DEMO-SUB-MAY-%')
            ->pluck('id');

        PasarelaEvento::query()
            ->where(function ($query) use ($demoOrderIds, $demoSuscripcionIds): void {
                $query->where('paypal_event_id', 'like', 'DEMO-PAYPAL-%');
                if ($demoOrderIds->isNotEmpty()) {
                    $query->orWhereIn('store_order_id', $demoOrderIds);
                }
                if ($demoSuscripcionIds->isNotEmpty()) {
                    $query->orWhereIn('suscripcion_id', $demoSuscripcionIds);
                }
            })
            ->delete();

        if ($demoOrderIds->isNotEmpty()) {
            StoreOrderItem::query()->whereIn('store_order_id', $demoOrderIds)->delete();
            StoreOrder::query()->whereIn('id', $demoOrderIds)->delete();
        }

        Suscripcion::query()
            ->where('paypal_subscription_id', 'like', 'I-DEMO-SUB-MAY-%')
            ->delete();

        Historia::query()->where('slug', 'like', 'demo-historia-%')->forceDelete();
        Producto::query()->where('slug', 'like', 'demo-producto-%')->forceDelete();

        if ($demoUserIds->isNotEmpty()) {
            User::query()->whereIn('id', $demoUserIds)->delete();
        }
    }

    private function ensureTaxonomia(): void
    {
        $this->call(HistoriaCategoriasSeeder::class);

        $categoriaProducto = ProductoCategoria::query()->firstOrCreate([
            'nombre' => 'Demo catálogo',
        ]);

        ProductoSubcategoria::query()->firstOrCreate([
            'producto_categoria_id' => $categoriaProducto->id,
            'nombre' => 'Demo general',
        ]);
    }

    private function seedClientes(): void
    {
        $this->clientes = [];

        for ($i = 1; $i <= self::DEMO_CLIENTS; $i++) {
            $createdAt = $this->randomDateInDemoPeriod();

            $user = new User([
                'name' => "Cliente demo {$i}",
                'email' => "demo-cliente-{$i}@historiasporcorreo.test",
                'role' => 'cliente',
                'password' => Hash::make('password'),
                'email_verified_at' => $createdAt,
            ]);
            $user->created_at = $createdAt;
            $user->updated_at = $createdAt;
            $user->save();

            $this->clientes[] = $user;
        }
    }

    private function seedProductos(): void
    {
        $categoria = ProductoCategoria::query()->where('nombre', 'Demo catálogo')->firstOrFail();
        $subcategoria = ProductoSubcategoria::query()
            ->where('producto_categoria_id', $categoria->id)
            ->where('nombre', 'Demo general')
            ->firstOrFail();

        $this->productos = [];

        for ($i = 1; $i <= self::DEMO_PRODUCTS; $i++) {
            $createdAt = $this->randomDateInDemoPeriod();

            $producto = Producto::query()->create([
                'nombre' => "Producto demo {$i}",
                'slug' => "demo-producto-{$i}",
                'codigo' => '#DEMO-P-'.str_pad((string) $i, 4, '0', STR_PAD_LEFT),
                'imagen' => ProductoSeederImagenes::randomMainImagePath(),
                'descripcion_corta' => 'Producto de demostración para el panel admin.',
                'descripcion_larga' => 'Descripción larga del producto demo '.$i.'.',
                'detalle' => [
                    ['icon' => 'Package', 'title' => 'Envío estándar', 'description' => 'Incluido en la demo.'],
                ],
                'producto_categoria_id' => $categoria->id,
                'producto_subcategoria_id' => $subcategoria->id,
                'precio_base' => fake()->randomFloat(2, 25, 200),
                'precio_promocional' => null,
                'impuesto' => 16.00,
                'stock' => fake()->numberBetween(10, 100),
                'peso' => '0.5kg',
                'dimensiones' => '20x15x5',
                'estado' => 'activo',
            ]);

            $producto->created_at = $createdAt;
            $producto->updated_at = $createdAt;
            $producto->save();

            foreach (ProductoSeederImagenes::secondaryGalleryPaths($i - 1) as $path) {
                ProductoGaleria::query()->create([
                    'producto_id' => $producto->id,
                    'path' => $path,
                    'tipo' => 'imagen',
                    'es_principal' => false,
                ]);
            }

            $this->productos[] = $producto;
        }
    }

    private function seedHistorias(): void
    {
        $categoriaId = HistoriaCategoria::query()->value('id');

        $this->historias = [];

        for ($i = 1; $i <= self::DEMO_STORIES; $i++) {
            $createdAt = $this->randomDateInDemoPeriod();
            $duracionMeses = fake()->numberBetween(6, 12);

            $historia = Historia::query()->create([
                'nombre' => "Historia demo {$i}",
                'slug' => "demo-historia-{$i}",
                'codigo' => '#DEMO-H-'.str_pad((string) $i, 4, '0', STR_PAD_LEFT),
                'imagen' => HistoriaSeederImagenes::mainImagePathForIndex($i - 1),
                'descripcion_corta' => 'Historia de demostración para métricas del dashboard.',
                'descripcion_larga' => 'Descripción larga de la historia demo '.$i.'.',
                'detalle' => [
                    ['icon' => 'Mail', 'title' => 'Carta mensual', 'description' => 'Contenido demo.'],
                ],
                'historia_categoria_id' => $categoriaId,
                'autor' => 'Autor demo',
                'precio_base' => fake()->randomFloat(2, 80, 400),
                'precio_promocional' => null,
                'precio_suscripcion' => fake()->randomFloat(2, 12.50, 99.00),
                'impuesto' => 16.00,
                'peso' => '0.3kg',
                'dimensiones' => '15x10x2',
                'estado' => 'activo',
                'destacada' => 'no',
                'duracion_meses' => $duracionMeses,
                'fecha_publicacion' => $createdAt,
            ]);

            $historia->created_at = $createdAt;
            $historia->updated_at = $createdAt;
            $historia->save();

            foreach (HistoriaSeederImagenes::secondaryGalleryPaths($i - 1) as $path) {
                HistoriaGaleria::query()->create([
                    'historia_id' => $historia->id,
                    'path' => $path,
                    'tipo' => 'imagen',
                    'es_principal' => false,
                ]);
            }

            $this->historias[] = $historia;
        }
    }

    private function seedOrdenesProducto(): void
    {
        $segments = $this->shuffledDemoSegments(
            self::DEMO_ORDERS_APRIL,
            self::DEMO_ORDERS_MAY,
            self::DEMO_ORDERS_JUNE,
        );

        for ($i = 1; $i <= self::DEMO_PAID_ORDERS; $i++) {
            $producto = $this->productos[array_rand($this->productos)];
            $cliente = $this->clientes[array_rand($this->clientes)];
            $lineTotal = fake()->randomFloat(2, 10, 150);
            $createdAt = $this->randomDateInDemoSegment($segments[$i - 1]);

            DemoStoreOrderFactory::createPaidProductOrder(
                $producto,
                $cliente,
                $createdAt,
                'DEMO-ORDER-MAY-'.str_pad((string) $i, 4, '0', STR_PAD_LEFT),
                $lineTotal,
            );
        }
    }

    private function seedSuscripciones(): void
    {
        $segments = $this->shuffledDemoSegments(
            self::DEMO_SUBSCRIPTIONS_APRIL,
            self::DEMO_SUBSCRIPTIONS_MAY,
            self::DEMO_SUBSCRIPTIONS_JUNE,
        );

        for ($i = 1; $i <= self::DEMO_SUBSCRIPTIONS; $i++) {
            $cliente = $this->clientes[array_rand($this->clientes)];
            $historia = $this->historias[array_rand($this->historias)];
            $createdAt = $this->randomDateInDemoSegment($segments[$i - 1]);

            $fechaAdquisicion = $createdAt->toDateString();
            $mesesEntregaTotal = HistoriaSuscripcionPrecio::mesesEntregaTotal($historia);
            $fechaFinalizacion = $mesesEntregaTotal !== null
                ? Carbon::parse($fechaAdquisicion)
                    ->addMonthsNoOverflow($mesesEntregaTotal)
                    ->toDateString()
                : null;

            $suscripcion = Suscripcion::query()->create([
                'user_id' => $cliente->id,
                'historia_id' => $historia->id,
                'tipo' => 'Mensual',
                'cantidad' => 1,
                'meses_entrega_total' => $mesesEntregaTotal,
                'fecha_adquisicion' => $fechaAdquisicion,
                'fecha_finalizacion' => $fechaFinalizacion,
                'proximo_cobro' => Carbon::parse($fechaAdquisicion)
                    ->addMonthsNoOverflow(HistoriaSuscripcionPrecio::intervaloFacturacionMeses($historia))
                    ->toDateString(),
                'estado' => 'activa',
                'paypal_subscription_id' => 'I-DEMO-SUB-MAY-'.str_pad((string) $i, 4, '0', STR_PAD_LEFT),
            ]);

            $suscripcion->created_at = $createdAt;
            $suscripcion->updated_at = $createdAt;
            $suscripcion->save();

            $evento = new PasarelaEvento([
                'suscripcion_id' => $suscripcion->id,
                'paypal_event_id' => 'DEMO-PAYPAL-SALE-'.str_pad((string) $i, 4, '0', STR_PAD_LEFT),
                'event_type' => 'PAYMENT.SALE.COMPLETED',
                'estado' => PasarelaEvento::ESTADO_COMPLETADO,
                'payload' => [],
            ]);
            $evento->created_at = $createdAt;
            $evento->updated_at = $createdAt;
            $evento->save();
        }
    }

    private function demoPeriodStart(): Carbon
    {
        return Carbon::create($this->year, 4, 1)->startOfDay();
    }

    private function demoPeriodEnd(): Carbon
    {
        return Carbon::create($this->year, 6, 3)->endOfDay();
    }

    private function randomDateInDemoPeriod(): Carbon
    {
        $start = $this->demoPeriodStart();
        $end = $this->demoPeriodEnd();
        $timestamp = fake()->numberBetween($start->timestamp, $end->timestamp);

        return Carbon::createFromTimestamp($timestamp)
            ->setTime(
                fake()->numberBetween(8, 20),
                fake()->numberBetween(0, 59),
            );
    }

    private function randomDateInDemoSegment(string $segment): Carbon
    {
        return match ($segment) {
            'april' => $this->randomDateInDemoMonth(4, 1, 30),
            'may' => $this->randomDateInDemoMonth(5, 1, 31),
            'june' => $this->randomDateInDemoMonth(6, 1, 3),
            default => $this->randomDateInDemoPeriod(),
        };
    }

    private function randomDateInDemoMonth(int $month, int $dayMin, int $dayMax): Carbon
    {
        return Carbon::create(
            $this->year,
            $month,
            fake()->numberBetween($dayMin, $dayMax),
            fake()->numberBetween(8, 20),
            fake()->numberBetween(0, 59),
        );
    }

    /**
     * @return list<string>
     */
    private function shuffledDemoSegments(int $aprilCount, int $mayCount, int $juneCount): array
    {
        $segments = array_merge(
            array_fill(0, $aprilCount, 'april'),
            array_fill(0, $mayCount, 'may'),
            array_fill(0, $juneCount, 'june'),
        );
        shuffle($segments);

        return $segments;
    }
}
