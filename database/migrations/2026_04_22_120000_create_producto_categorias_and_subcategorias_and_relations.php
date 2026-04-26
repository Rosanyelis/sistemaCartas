<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('producto_categorias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 255);
            $table->timestamps();
            $table->unique('nombre');
        });

        Schema::create('producto_subcategorias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('producto_categoria_id')->constrained('producto_categorias')->cascadeOnDelete();
            $table->string('nombre', 255);
            $table->timestamps();
            $table->unique(['producto_categoria_id', 'nombre']);
        });

        if (! Schema::hasColumn('productos', 'producto_categoria_id')) {
            Schema::table('productos', function (Blueprint $table) {
                $table->unsignedBigInteger('producto_categoria_id')->nullable()->after('detalle');
                $table->unsignedBigInteger('producto_subcategoria_id')->nullable()->after('producto_categoria_id');
            });
        }

        DB::table('producto_categorias')->insertGetId([
            'nombre' => 'Sin categoría',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        foreach (DB::table('productos')->orderBy('id')->get() as $row) {
            $catName = trim((string) ($row->categoria ?? ''));
            if ($catName === '') {
                $catName = 'Sin categoría';
            }

            $catId = (int) DB::table('producto_categorias')->where('nombre', $catName)->value('id');
            if ($catId === 0) {
                $catId = (int) DB::table('producto_categorias')->insertGetId([
                    'nombre' => $catName,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            $subId = null;
            $subName = trim((string) ($row->subcategoria ?? ''));
            if ($subName !== '') {
                $subId = (int) DB::table('producto_subcategorias')
                    ->where('producto_categoria_id', $catId)
                    ->where('nombre', $subName)
                    ->value('id');
                if ($subId === 0) {
                    $subId = (int) DB::table('producto_subcategorias')->insertGetId([
                        'producto_categoria_id' => $catId,
                        'nombre' => $subName,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            DB::table('productos')->where('id', $row->id)->update([
                'producto_categoria_id' => $catId,
                'producto_subcategoria_id' => $subId,
            ]);
        }

        if (Schema::hasColumn('productos', 'categoria')) {
            Schema::table('productos', function (Blueprint $table) {
                $table->dropIndex(['categoria']);
            });

            Schema::table('productos', function (Blueprint $table) {
                $table->dropColumn(['categoria', 'subcategoria']);
            });
        }

        Schema::table('productos', function (Blueprint $table) {
            $table->foreign('producto_categoria_id')
                ->references('id')
                ->on('producto_categorias')
                ->restrictOnDelete();
            $table->foreign('producto_subcategoria_id')
                ->references('id')
                ->on('producto_subcategorias')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropForeign(['producto_categoria_id']);
            $table->dropForeign(['producto_subcategoria_id']);
        });

        Schema::table('productos', function (Blueprint $table) {
            $table->string('categoria')->nullable()->after('detalle');
            $table->string('subcategoria')->nullable()->after('categoria');
            $table->index('categoria');
        });

        foreach (DB::table('productos')->orderBy('id')->get() as $row) {
            $catNombre = DB::table('producto_categorias')->where('id', $row->producto_categoria_id)->value('nombre');
            $subNombre = $row->producto_subcategoria_id
                ? DB::table('producto_subcategorias')->where('id', $row->producto_subcategoria_id)->value('nombre')
                : null;
            DB::table('productos')->where('id', $row->id)->update([
                'categoria' => $catNombre ?? 'Sin categoría',
                'subcategoria' => $subNombre,
            ]);
        }

        Schema::table('productos', function (Blueprint $table) {
            $table->dropColumn(['producto_categoria_id', 'producto_subcategoria_id']);
        });

        Schema::dropIfExists('producto_subcategorias');
        Schema::dropIfExists('producto_categorias');
    }
};
