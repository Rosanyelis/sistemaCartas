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
        Schema::create('entregas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('historia_id')->constrained('historias')->cascadeOnDelete();
            $table->unsignedInteger('numero_entrega');
            $table->string('titulo');
            $table->text('contenido')->nullable();
            $table->string('archivo')->nullable();
            $table->enum('estado', ['pendiente', 'enviado', 'entregado'])->default('pendiente');
            $table->timestamp('fecha_envio')->nullable();
            $table->timestamps();

            $table->unique(['historia_id', 'numero_entrega']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entregas');
    }
};
