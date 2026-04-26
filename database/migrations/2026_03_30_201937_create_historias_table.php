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
        Schema::create('historias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('slug')->unique();
            $table->string('codigo')->unique();
            $table->string('imagen')->nullable();
            $table->string('video')->nullable();
            $table->string('descripcion_corta');
            $table->text('descripcion_larga');
            $table->text('detalle')->nullable();
            $table->string('categoria');
            $table->string('autor');
            $table->decimal('precio_base', 12, 2);
            $table->decimal('precio_promocional', 12, 2)->nullable();
            $table->decimal('impuesto', 5, 2)->default(0);
            $table->string('peso')->nullable();
            $table->string('dimensiones')->nullable();
            $table->integer('duracion_meses')->nullable();
            $table->enum('estado', ['activo', 'pausado'])->default('activo');
            $table->enum('destacada', ['si', 'no'])->default('no');
            $table->timestamp('fecha_publicacion')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('categoria');
            $table->index('estado');
            $table->index('destacada');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historias');
    }
};
