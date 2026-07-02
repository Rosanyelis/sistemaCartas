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
        Schema::create('audios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('historia_id')->constrained('historias')->cascadeOnDelete();
            $table->string('titulo');
            $table->string('slug')->unique();
            $table->string('codigo')->unique()->nullable();
            $table->string('audio_path')->nullable();
            $table->string('qr_path')->nullable();
            $table->unsignedInteger('duracion_segundos')->nullable();
            $table->unsignedBigInteger('tamano_bytes')->nullable();
            $table->string('mime_type', 64)->nullable();
            $table->enum('estado', ['activo', 'pausado'])->default('activo');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audios');
    }
};
