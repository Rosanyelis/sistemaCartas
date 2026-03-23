<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('paypal_order_id')->unique();
            $table->string('status', 32)->index();
            $table->char('currency', 3);
            $table->decimal('total', 12, 2);
            $table->string('paypal_capture_id')->nullable();
            $table->string('paypal_capture_status')->nullable();
            $table->json('paypal_capture_payload')->nullable();
            $table->text('failure_message')->nullable();
            $table->json('failure_payload')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_orders');
    }
};
