<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('historias', function (Blueprint $table) {
            $table->decimal('precio_suscripcion', 12, 2)->nullable()->after('precio_promocional');
            $table->string('paypal_product_id')->nullable()->after('duracion_meses');
            $table->string('paypal_plan_id')->nullable()->after('paypal_product_id');
        });

        Schema::table('suscripciones', function (Blueprint $table) {
            $table->foreignId('store_order_id')->nullable()->after('historia_id')->constrained('store_orders')->nullOnDelete();
            $table->string('paypal_product_id')->nullable()->after('estado');
            $table->string('paypal_plan_id')->nullable()->after('paypal_product_id');
            $table->string('paypal_subscription_id')->nullable()->unique()->after('paypal_plan_id');
            $table->json('paypal_last_payload')->nullable()->after('paypal_subscription_id');
        });
    }

    public function down(): void
    {
        Schema::table('suscripciones', function (Blueprint $table) {
            $table->dropConstrainedForeignId('store_order_id');
            $table->dropColumn([
                'paypal_product_id',
                'paypal_plan_id',
                'paypal_subscription_id',
                'paypal_last_payload',
            ]);
        });

        Schema::table('historias', function (Blueprint $table) {
            $table->dropColumn([
                'precio_suscripcion',
                'paypal_product_id',
                'paypal_plan_id',
            ]);
        });
    }
};
