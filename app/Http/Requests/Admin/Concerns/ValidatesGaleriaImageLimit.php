<?php

namespace App\Http\Requests\Admin\Concerns;

use Illuminate\Validation\Validator;

trait ValidatesGaleriaImageLimit
{
    public const GALERIA_IMAGENES_MAX = 5;

    public const GALERIA_IMAGENES_MAX_MESSAGE = 'Máximo 5 imágenes en la galería.';

    /**
     * @return array<int, callable(Validator): void>
     */
    protected function galeriaTotalCountValidators(): array
    {
        return [
            function (Validator $validator): void {
                if (! $this->shouldValidateGaleriaCombinedCount()) {
                    return;
                }

                $keepIds = $this->input('galeria_keep_ids', []);
                $keepCount = is_array($keepIds) ? count($keepIds) : 0;
                $newFiles = $this->file('galeria') ?? [];
                $newCount = is_array($newFiles) ? count($newFiles) : 0;

                if ($keepCount + $newCount > self::GALERIA_IMAGENES_MAX) {
                    $validator->errors()->add('galeria', self::GALERIA_IMAGENES_MAX_MESSAGE);
                }
            },
        ];
    }

    protected function shouldValidateGaleriaCombinedCount(): bool
    {
        return $this->boolean('historia_gallery_sync')
            || $this->boolean('producto_gallery_sync')
            || $this->has('galeria_keep_ids');
    }
}
