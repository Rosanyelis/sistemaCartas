<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoreOrderItem extends Model
{
    protected $fillable = [
        'store_order_id',
        'product_slug',
        'product_name',
        'quantity',
        'unit_price',
        'line_total',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'line_total' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<StoreOrder, $this>
     */
    public function storeOrder(): BelongsTo
    {
        return $this->belongsTo(StoreOrder::class);
    }
}
