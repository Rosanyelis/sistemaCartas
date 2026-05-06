<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('historias', function (Blueprint $table) {
            $table->decimal('paypal_plan_amount', 12, 2)->nullable()->after('paypal_plan_id');
            $table->unsignedSmallInteger('paypal_plan_interval_meses')->nullable()->after('paypal_plan_amount');
        });
    }

    public function down(): void
    {
        Schema::table('historias', function (Blueprint $table) {
            $table->dropColumn(['paypal_plan_amount', 'paypal_plan_interval_meses']);
        });
    }
};
