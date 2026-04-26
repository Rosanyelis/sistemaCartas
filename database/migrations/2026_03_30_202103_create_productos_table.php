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
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('slug')->unique();
            $table->string('codigo')->unique();
            $table->string('imagen')->nullable();
            $table->string('descripcion_corta');
            $table->text('descripcion_larga');
            $table->text('detalle')->nullable();
            $table->unsignedBigInteger('producto_categoria_id')->nullable();
            $table->unsignedBigInteger('producto_subcategoria_id')->nullable();
            $table->decimal('precio_base', 12, 2);
            $table->decimal('precio_promocional', 12, 2)->nullable();
            $table->decimal('impuesto', 5, 2)->default(0);
            $table->unsignedInteger('stock')->default(0);
            $table->string('peso')->nullable();
            $table->string('dimensiones')->nullable();
            $table->enum('estado', ['activo', 'pausado'])->default('activo');
            $table->timestamps();
            $table->softDeletes();

            $table->index('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
