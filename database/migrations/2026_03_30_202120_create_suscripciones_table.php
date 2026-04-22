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
        Schema::create('suscripciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('historia_id')->constrained('historias')->cascadeOnDelete();
            $table->string('tipo');
            $table->unsignedInteger('cantidad')->default(1);
            $table->date('fecha_adquisicion');
            $table->date('fecha_finalizacion')->nullable();
            $table->date('proximo_cobro')->nullable();
            $table->enum('estado', ['activa', 'inactiva', 'pendiente'])->default('activa');
            $table->timestamps();

            $table->index('estado');
            $table->index('fecha_adquisicion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suscripciones');
    }
};
