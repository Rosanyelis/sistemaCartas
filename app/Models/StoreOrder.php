<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StoreOrder extends Model
{
    public const STATUS_PENDING_PAYMENT = 'pending_payment';

    public const STATUS_PAID = 'paid';

    public const STATUS_CAPTURE_FAILED = 'capture_failed';

    protected $fillable = [
        'user_id',
        'paypal_order_id',
        'status',
        'currency',
        'total',
        'paypal_capture_id',
        'paypal_capture_status',
        'paypal_capture_payload',
        'failure_message',
        'failure_payload',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
            'paypal_capture_payload' => 'array',
            'failure_payload' => 'array',
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
     * @return HasMany<StoreOrderItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(StoreOrderItem::class);
    }
}
