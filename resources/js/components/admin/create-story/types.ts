import type { HistoriaDetalleInclusionIconName } from '@/constants/historia-detalle-inclusion-icons';

/** Coincide con `App\Enums\HistoriaVarianteTipo` en backend. */
export type HistoriaVarianteTipoForm = 'papel' | 'color';

/** Coincide con la columna enum `historias.destacada` (si | no). */
export type HistoriaDestacadaForm = 'si' | 'no';

/** Una fila de «¿Qué incluye cada envío?» (JSON en `historias.detalle`). */
export interface HistoriaDetalleInclusionRow {
    /** Vacío hasta que el usuario elija; al guardar sin icono se usa `FileText` en el payload. */
    icon: HistoriaDetalleInclusionIconName | '';
    title: string;
    description: string;
}

export interface HistoriaVarianteForm {
    tipo: HistoriaVarianteTipoForm;
    /** Texto libre: descripción del papel o del color según `tipo` */
    valor: string;
}

export interface HistoriaGaleriaItem {
    id: number;
    path: string;
    es_principal: boolean;
}

/** Entrada en la galería del modal: fila existente (BD) o archivo nuevo. */
export type GallerySlot =
    | { kind: 'existente'; id: number; preview: string }
    | { kind: 'nuevo'; clientKey: string; preview: string; file: File };

/** Datos parciales que puede traer el listado o la API al abrir el modal en edición */
export interface HistoriaParaFormulario {
    id?: number;
    nombre?: string;
    descripcion_corta?: string;
    descripcion_larga?: string;
    /** JSON estructurado o, en datos legacy, HTML/string (se normaliza a filas en el formulario). */
    detalle?: HistoriaDetalleInclusionRow[] | string | null;
    categoria?: string;
    autor?: string;
    precio_base?: string | number;
    precio_promocional?: string | number | null;
    impuesto?: string | number | null;
    codigo?: string;
    peso?: string | null;
    dimensiones?: string | null;
    estado?: string;
    destacada?: string | null;
    imagen?: string | null;
    video?: string | null;
    variantes?: HistoriaVarianteForm[];
    galeria?: HistoriaGaleriaItem[];
    duracion_meses?: number | string | null;
}

export interface HistoriaFormData {
    nombre: string;
    descripcion_corta: string;
    descripcion_larga: string;
    detalle: HistoriaDetalleInclusionRow[];
    categoria: string;
    autor: string;
    precio_base: string;
    precio_promocional: string;
    impuesto: string;
    codigo: string;
    imagen: File | null;
    video: File | null;
    peso: string;
    dimensiones: string;
    estado: string;
    destacada: HistoriaDestacadaForm;
    /** Obligatorio en API (store/update); meses de duración de la suscripción/historia. */
    duracion_meses: string;
    variantes: HistoriaVarianteForm[];
    galeria: File[];
    /** Solo en PATCH desde el panel admin: sincroniza extras conservando ids. */
    historia_gallery_sync?: boolean;
    galeria_keep_ids?: number[];
    /** Solo lo añade `transform` de Inertia al actualizar con archivos (POST + spoof). */
    _method?: 'patch';
}
