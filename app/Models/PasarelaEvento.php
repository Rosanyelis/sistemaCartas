<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PasarelaEvento extends Model
{
    public const ESTADO_PENDIENTE = 'pendiente';

    public const ESTADO_COMPLETADO = 'completado';

    public const ESTADO_RECHAZADO = 'rechazado';

    protected $table = 'pasarela_eventos';

    protected $fillable = [
        'store_order_id',
        'suscripcion_id',
        'paypal_event_id',
        'event_type',
        'estado',
        'payload',
        'mensaje_error',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'payload' => 'array',
        ];
    }

    /**
     * @return BelongsTo<StoreOrder, $this>
     */
    public function storeOrder(): BelongsTo
    {
        return $this->belongsTo(StoreOrder::class);
    }

    /**
     * @return BelongsTo<Suscripcion, $this>
     */
    public function suscripcion(): BelongsTo
    {
        return $this->belongsTo(Suscripcion::class);
    }
}
