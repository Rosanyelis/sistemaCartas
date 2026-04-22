import type { ReactNode } from 'react';
import { countWords, clampToMaxWords } from './wordLimit';

const inputBase =
    'w-full rounded-[4px] border bg-white px-3 py-2.5 text-[14px] text-gray-800 focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/20 outline-none transition-all resize-y min-h-[96px]';

interface LimitedWordTextareaProps {
    id?: string;
    label: ReactNode;
    value: string;
    onChange: (value: string) => void;
    maxWords: number;
    placeholder?: string;
    rows?: number;
    error?: string;
    hint?: string;
}

/**
 * Textarea con contador de palabras y tope duro al escribir o pegar (alineado con validación Laravel).
 */
export function LimitedWordTextarea({
    id,
    label,
    value,
    onChange,
    maxWords,
    placeholder,
    rows = 5,
    error,
    hint,
}: LimitedWordTextareaProps) {
    const words = countWords(value);
    const atLimit = words >= maxWords;

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-[13px] font-semibold text-[#1B3D6D]">
                {label}
            </label>
            <div
                className={`rounded-[4px] border overflow-hidden shadow-sm ${error ? 'border-red-500' : 'border-[#DFE4EA]'}`}
            >
                <textarea
                    id={id}
                    value={value}
                    rows={rows}
                    placeholder={placeholder}
                    onChange={(e) => onChange(clampToMaxWords(e.target.value, maxWords))}
                    className={`${inputBase} border-0 rounded-none focus:ring-0`}
                    aria-invalid={Boolean(error)}
                    aria-describedby={hint && !error ? `${id}-hint` : undefined}
                />
                <div className="flex items-center justify-between gap-2 border-t border-[#F3F4F6] bg-[#FAFBFC] px-3 py-1.5">
                    {hint && !error ? (
                        <span id={`${id}-hint`} className="text-[11px] text-[#A0A0A0]">
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
        </div>
    );
}
