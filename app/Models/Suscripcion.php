<?php

namespace App\Models;

use Database\Factories\SuscripcionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property-read StoreOrder|null $storeOrder
 */
class Suscripcion extends Model
{
    /** @use HasFactory<SuscripcionFactory> */
    use HasFactory;

    protected $table = 'suscripciones';

    protected $fillable = [
        'user_id',
        'historia_id',
        'store_order_id',
        'tipo',
        'cantidad',
        'fecha_adquisicion',
        'fecha_finalizacion',
        'proximo_cobro',
        'estado',
        'paypal_product_id',
        'paypal_plan_id',
        'paypal_subscription_id',
        'paypal_last_payload',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'fecha_adquisicion' => 'date',
            'fecha_finalizacion' => 'date',
            'proximo_cobro' => 'date',
            'cantidad' => 'integer',
            'paypal_last_payload' => 'array',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Historia, $this>
     */
    public function historia(): BelongsTo
    {
        return $this->belongsTo(Historia::class);
    }

    /**
     * @return BelongsTo<StoreOrder, $this>
     */
    public function storeOrder(): BelongsTo
    {
        return $this->belongsTo(StoreOrder::class);
    }

    /**
     * @return HasMany<PasarelaEvento, $this>
     */
    public function pasarelaEventos(): HasMany
    {
        return $this->hasMany(PasarelaEvento::class);
    }
}
