<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pasarela_eventos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_order_id')->nullable()->constrained('store_orders')->nullOnDelete();
            $table->foreignId('suscripcion_id')->nullable()->constrained('suscripciones')->nullOnDelete();
            $table->string('paypal_event_id')->nullable()->unique();
            $table->string('event_type', 120)->index();
            $table->string('estado', 24)->index();
            $table->json('payload');
            $table->text('mensaje_error')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pasarela_eventos');
    }
};
