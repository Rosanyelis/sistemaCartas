<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('suscripciones', function (Blueprint $table) {
            $table->timestamp('renewal_reminder_sent_at')->nullable()->after('proximo_cobro');
        });
    }

    public function down(): void
    {
        Schema::table('suscripciones', function (Blueprint $table) {
            $table->dropColumn('renewal_reminder_sent_at');
        });
    }
};
