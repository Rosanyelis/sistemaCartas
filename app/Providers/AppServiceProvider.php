<?php

namespace App\Providers;

use App\Models\Historia;
use App\Models\Producto;
use App\Models\ProductoCategoria;
use App\Models\ProductoSubcategoria;
use App\Models\StoreOrder;
use App\Models\Suscripcion;
use App\Models\User;
use App\Policies\HistoriaPolicy;
use App\Policies\ProductoCategoriaPolicy;
use App\Policies\ProductoPolicy;
use App\Policies\ProductoSubcategoriaPolicy;
use App\Policies\StoreOrderPolicy;
use App\Policies\SuscripcionPolicy;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();

        Gate::define('admin', function (User $user) {
            return $user->isAdmin();
        });

        Gate::policy(Historia::class, HistoriaPolicy::class);
        Gate::policy(Producto::class, ProductoPolicy::class);
        Gate::policy(StoreOrder::class, StoreOrderPolicy::class);
        Gate::policy(ProductoCategoria::class, ProductoCategoriaPolicy::class);
        Gate::policy(ProductoSubcategoria::class, ProductoSubcategoriaPolicy::class);
        Gate::policy(Suscripcion::class, SuscripcionPolicy::class);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
