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
        Schema::create('historia_galerias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('historia_id')->constrained('historias')->onDelete('cascade');
            $table->string('path');
            $table->enum('tipo', ['imagen', 'video'])->default('imagen');
            $table->boolean('es_principal')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historia_galerias');
    }
};
