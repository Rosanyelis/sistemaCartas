import type { Editor } from '@tiptap/core';

/**
 * Cuenta palabras solo para la UI del editor enriquecido.
 * No replica la validación del servidor (`App\Rules\MaxWords` ni `wordLimit.ts`).
 */
export function countEditorWordsFromPlainText(plainText: string): number {
    const normalized = plainText.replace(/\s+/g, ' ').trim();

    if (!normalized) {
        return 0;
    }

    return normalized.split(/\s+/).length;
}

/** Contador a partir del documento TipTap (texto que ve el usuario). */
export function countEditorWords(editor: Editor): number {
    return countEditorWordsFromPlainText(editor.getText({ blockSeparator: ' ' }));
}

/** Antes de montar el editor: referencia visual a partir del HTML inicial. */
export function countEditorWordsFromHtml(html: string): number {
    const stripped = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ');

    return countEditorWordsFromPlainText(stripped);
}
