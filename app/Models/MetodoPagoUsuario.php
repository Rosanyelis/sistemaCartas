<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MetodoPagoUsuario extends Model
{
    protected $table = 'metodos_pago_usuario';

    protected $fillable = [
        'user_id',
        'tipo_metodo_pago_id',
        'titular',
        'detalles',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];

    /**
     * Get the user that owns the payment method.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the type of the payment method.
     */
    public function tipo()
    {
        return $this->belongsTo(TipoMetodoPago::class, 'tipo_metodo_pago_id');
    }
}
