import {
    faBold,
    faItalic,
    faListOl,
    faListUl,
    faQuoteLeft,
    faRotateLeft,
    faRotateRight,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useId, useState } from 'react';
import type { ReactNode } from 'react';
import { countEditorWords, countEditorWordsFromHtml } from './editorWordCount';

const toolbarBtn =
    'rounded px-2 py-1.5 text-[12px] text-gray-700 transition-colors hover:bg-[#1B3D6D]/10 disabled:cursor-not-allowed disabled:opacity-40';

interface LimitedWordRichEditorProps {
    id?: string;
    label: ReactNode;
    initialHtml: string;
    onChange: (html: string) => void;
    maxWords: number;
    placeholder?: string;
    rows?: number;
    error?: string;
    hint?: string;
}

/**
 * Editor TipTap (HTML) con contador de palabras solo para la UI (texto del documento).
 * El límite `maxWords` es referencia orientativa; la validación definitiva la hace el backend.
 */
export function LimitedWordRichEditor({
    id,
    label,
    initialHtml,
    onChange,
    maxWords,
    placeholder,
    rows = 5,
    error,
    hint,
}: LimitedWordRichEditorProps) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    const minHeightPx = Math.max(96, rows * 24);
    /** Incrementa en cada transacción del editor para forzar repintado (contador + estados activos de la barra). */
    const [, setTransactionNonce] = useState(0);

    const editor = useEditor({
        shouldRerenderOnTransaction: true,
        extensions: [
            StarterKit.configure({
                heading: false,
            }),
            Placeholder.configure({
                placeholder: placeholder ?? '',
            }),
        ],
        content: initialHtml || '',
        editorProps: {
            attributes: {
                id: fieldId,
                class: 'tiptap-editor-prose px-3 py-2 text-[14px] text-gray-800 focus:outline-none',
                'aria-multiline': 'true',
            },
        },
        onUpdate: ({ editor: ed }) => {
            onChange(ed.getHTML());
        },
    });

    useEffect(() => {
        if (!editor) {
            return;
        }

        const bump = (): void => {
            setTransactionNonce((n) => n + 1);
        };

        editor.on('transaction', bump);

        return () => {
            editor.off('transaction', bump);
        };
    }, [editor]);

    const words = editor ? countEditorWords(editor) : countEditorWordsFromHtml(initialHtml);
    const atLimit = words >= maxWords;

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={fieldId} className="text-[13px] font-semibold text-[#1B3D6D]">
                {label}
            </label>
            <div
                className={`rounded-[4px] border overflow-hidden shadow-sm ${error ? 'border-red-500' : 'border-[#DFE4EA]'}`}
            >
                {editor ? (
                    <div className="border-b border-[#F3F4F6] bg-[#FAFBFC] px-2 py-1.5 flex flex-wrap items-center gap-0.5">
                        <button
                            type="button"
                            className={`${toolbarBtn} ${editor.isActive('bold') ? 'bg-[#1B3D6D]/15 text-[#1B3D6D]' : ''}`}
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            disabled={!editor.can().chain().focus().toggleBold().run()}
                            title="Negrita"
                        >
                            <FontAwesomeIcon icon={faBold} />
                        </button>
                        <button
                            type="button"
                            className={`${toolbarBtn} ${editor.isActive('italic') ? 'bg-[#1B3D6D]/15 text-[#1B3D6D]' : ''}`}
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            disabled={!editor.can().chain().focus().toggleItalic().run()}
                            title="Cursiva"
                        >
                            <FontAwesomeIcon icon={faItalic} />
                        </button>
                        <span className="mx-1 h-4 w-px bg-[#DFE4EA]" aria-hidden />
                        <button
                            type="button"
                            className={`${toolbarBtn} ${editor.isActive('bulletList') ? 'bg-[#1B3D6D]/15 text-[#1B3D6D]' : ''}`}
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            title="Lista con viñetas"
                        >
                            <FontAwesomeIcon icon={faListUl} />
                        </button>
                        <button
                            type="button"
                            className={`${toolbarBtn} ${editor.isActive('orderedList') ? 'bg-[#1B3D6D]/15 text-[#1B3D6D]' : ''}`}
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            title="Lista numerada"
                        >
                            <FontAwesomeIcon icon={faListOl} />
                        </button>
                        <button
                            type="button"
                            className={`${toolbarBtn} ${editor.isActive('blockquote') ? 'bg-[#1B3D6D]/15 text-[#1B3D6D]' : ''}`}
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            title="Cita"
                        >
                            <FontAwesomeIcon icon={faQuoteLeft} />
                        </button>
                        <span className="mx-1 h-4 w-px bg-[#DFE4EA]" aria-hidden />
                        <button
                            type="button"
                            className={toolbarBtn}
                            onClick={() => editor.chain().focus().undo().run()}
                            disabled={!editor.can().chain().focus().undo().run()}
                            title="Deshacer"
                        >
                            <FontAwesomeIcon icon={faRotateLeft} />
                        </button>
                        <button
                            type="button"
                            className={toolbarBtn}
                            onClick={() => editor.chain().focus().redo().run()}
                            disabled={!editor.can().chain().focus().redo().run()}
                            title="Rehacer"
                        >
                            <FontAwesomeIcon icon={faRotateRight} />
                        </button>
                    </div>
                ) : null}
                <div
                    className="max-h-[min(40vh,320px)] overflow-y-auto bg-white"
                    style={{ minHeight: minHeightPx }}
                >
                    <EditorContent editor={editor} />
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-[#F3F4F6] bg-[#FAFBFC] px-3 py-1.5">
                    {hint && !error ? (
                        <span id={`${fieldId}-hint`} className="text-[11px] text-[#A0A0A0]">
                            {hint}
                        </span>
                    ) : (
                        <span />
                    )}
                    <span
                        className={`text-[11px] font-medium tabular-nums ${atLimit ? 'text-amber-700' : 'text-[#6B7280]'}`}
                    >
                        {words} / {maxWords} palabras
                    </span>
                </div>
            </div>
            {error ? <span className="text-red-500 text-[11px]">{error}</span> : null}
            <style>{`
                .tiptap-editor-prose p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    height: 0;
                    pointer-events: none;
                    color: #a0a0a0;
                }
                .tiptap-editor-prose ul { list-style-type: disc; padding-left: 1.25rem; margin: 0.25rem 0; }
                .tiptap-editor-prose ol { list-style-type: decimal; padding-left: 1.25rem; margin: 0.25rem 0; }
                .tiptap-editor-prose blockquote {
                    border-left: 3px solid #1b3d6d40;
                    padding-left: 0.75rem;
                    margin: 0.35rem 0;
                    color: #4b5563;
                }
                .tiptap-editor-prose p { margin: 0.25rem 0; }
            `}</style>
        </div>
    );
}
