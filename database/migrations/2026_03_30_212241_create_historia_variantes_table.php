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
        Schema::create('historia_variantes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('historia_id')->constrained('historias')->onDelete('cascade');
            $table->string('nombre');
            $table->string('codigo_variante')->unique();
            $table->decimal('precio', 12, 2)->nullable(); // Si es null, usa el precio base
            $table->integer('stock')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('historia_variantes');
    }
};
