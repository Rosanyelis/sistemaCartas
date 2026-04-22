import { MAX_PALABRAS_TEXTO_LARGO } from './constants';
import type { HistoriaFormData, HistoriaParaFormulario, HistoriaVarianteForm } from './types';
import { clampToMaxWords } from './wordLimit';

function str(v: unknown, fallback = ''): string {
    if (v === null || v === undefined) {
        return fallback;
    }
    return String(v);
}

export function buildHistoriaFormData(source?: HistoriaParaFormulario | null): HistoriaFormData {
    if (!source) {
        return {
            nombre: '',
            descripcion_corta: '',
            descripcion_larga: '',
            detalle: '',
            categoria: '',
            autor: '',
            precio_base: '',
            precio_promocional: '',
            impuesto: '18',
            codigo: '',
            imagen: null,
            video: null,
            peso: '',
            dimensiones: '',
            tipo_envio: '',
            estado: 'activo',
            duracion_meses: '12',
            variantes: [],
            galeria: [],
        };
    }

    const variantes: HistoriaVarianteForm[] = (source.variantes ?? []).map((v) => ({
        nombre: str(v.nombre),
        codigo_variante: str(v.codigo_variante),
        precio: str(v.precio),
        stock: typeof v.stock === 'number' ? v.stock : parseInt(String(v.stock), 10) || 0,
    }));

    return {
        nombre: str(source.nombre),
        descripcion_corta: str(source.descripcion_corta),
        descripcion_larga: clampToMaxWords(str(source.descripcion_larga), MAX_PALABRAS_TEXTO_LARGO),
        detalle: clampToMaxWords(str(source.detalle), MAX_PALABRAS_TEXTO_LARGO),
        categoria: str(source.categoria),
        autor: str(source.autor),
        precio_base: str(source.precio_base),
        precio_promocional: str(source.precio_promocional),
        impuesto: str(source.impuesto, '18'),
        codigo: str(source.codigo),
        imagen: null,
        video: null,
        peso: str(source.peso),
        dimensiones: str(source.dimensiones),
        tipo_envio: str(source.tipo_envio),
        estado: str(source.estado, 'activo') || 'activo',
        duracion_meses: str(
            source.duracion_meses !== undefined && source.duracion_meses !== null ? String(source.duracion_meses) : '',
            '12',
        ),
        variantes,
        galeria: [],
    };
}
