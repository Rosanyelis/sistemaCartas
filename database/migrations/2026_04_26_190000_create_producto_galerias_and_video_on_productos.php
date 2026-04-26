<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('productos', 'video')) {
            Schema::table('productos', function (Blueprint $table) {
                $table->string('video')->nullable()->after('imagen');
            });
        }

        Schema::create('producto_galerias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_id')->constrained('productos')->cascadeOnDelete();
            $table->string('path');
            $table->string('tipo')->default('imagen');
            $table->boolean('es_principal')->default(false);
            $table->timestamps();
        });

        if (Schema::hasColumn('productos', 'variantes')) {
            Schema::table('productos', function (Blueprint $table) {
                $table->dropColumn('variantes');
            });
        }

        if (Schema::hasColumn('productos', 'galeria')) {
            Schema::table('productos', function (Blueprint $table) {
                $table->dropColumn('galeria');
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('producto_galerias');

        if (Schema::hasColumn('productos', 'video')) {
            Schema::table('productos', function (Blueprint $table) {
                $table->dropColumn('video');
            });
        }
    }
};
