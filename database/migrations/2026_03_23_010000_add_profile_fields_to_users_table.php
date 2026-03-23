<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $col) {
            $col->string('avatar')->nullable()->after('name');
            $col->string('direction')->nullable()->after('email');
            $col->string('zip_code')->nullable()->after('direction');
            $col->string('phone')->nullable()->after('zip_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $col) {
            $col->dropColumn(['avatar', 'direction', 'zip_code', 'phone']);
        });
    }
};
