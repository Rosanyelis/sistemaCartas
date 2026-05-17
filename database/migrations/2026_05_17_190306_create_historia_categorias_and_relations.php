<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('historia_categorias')) {
            return;
        }

        Schema::create('historia_categorias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 255);
            $table->timestamps();
            $table->unique('nombre');
        });

        if (! Schema::hasColumn('historias', 'historia_categoria_id')) {
            Schema::table('historias', function (Blueprint $table) {
                $table->unsignedBigInteger('historia_categoria_id')->nullable()->after('detalle');
            });
        }

        $sinCategoriaId = (int) DB::table('historia_categorias')->insertGetId([
            'nombre' => 'Sin categoría',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        foreach (DB::table('historias')->orderBy('id')->get() as $row) {
            $catName = trim((string) ($row->categoria ?? ''));
            if ($catName === '') {
                $catName = 'Sin categoría';
            }

            $catId = (int) DB::table('historia_categorias')->where('nombre', $catName)->value('id');
            if ($catId === 0) {
                $catId = (int) DB::table('historia_categorias')->insertGetId([
                    'nombre' => $catName,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            DB::table('historias')->where('id', $row->id)->update([
                'historia_categoria_id' => $catId,
            ]);
        }

        if (Schema::hasColumn('historias', 'categoria')) {
            Schema::table('historias', function (Blueprint $table) {
                $table->dropIndex(['categoria']);
            });

            Schema::table('historias', function (Blueprint $table) {
                $table->dropColumn('categoria');
            });
        }

        Schema::table('historias', function (Blueprint $table) {
            $table->foreign('historia_categoria_id')
                ->references('id')
                ->on('historia_categorias')
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('historias', function (Blueprint $table) {
            $table->dropForeign(['historia_categoria_id']);
        });

        Schema::table('historias', function (Blueprint $table) {
            $table->string('categoria')->nullable()->after('detalle');
            $table->index('categoria');
        });

        foreach (DB::table('historias')->orderBy('id')->get() as $row) {
            $catNombre = DB::table('historia_categorias')->where('id', $row->historia_categoria_id)->value('nombre');
            DB::table('historias')->where('id', $row->id)->update([
                'categoria' => $catNombre ?? 'Sin categoría',
            ]);
        }

        Schema::table('historias', function (Blueprint $table) {
            $table->dropColumn('historia_categoria_id');
        });

        Schema::dropIfExists('historia_categorias');
    }
};
