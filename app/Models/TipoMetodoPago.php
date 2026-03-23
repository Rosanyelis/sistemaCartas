<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoMetodoPago extends Model
{
    protected $table = 'tipos_pago';

    protected $fillable = [
        'nombre',
        'icono',
        'is_active',
    ];

    /**
     * Get the payment methods of this type.
     */
    public function metodosPago()
    {
        return $this->hasMany(MetodoPagoUsuario::class, 'tipo_metodo_pago_id');
    }
}
