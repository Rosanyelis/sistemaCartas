import { usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircleExclamation, faTriangleExclamation, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export type FlashPayload = {
    success?: string | null;
    error?: string | null;
    warning?: string | null;
};

type ToastKind = 'success' | 'error' | 'warning';

type ToastItem = {
    id: number;
    kind: ToastKind;
    message: string;
};

const AUTO_DISMISS_MS = 5500;

function readFlash(page: ReturnType<typeof usePage>): FlashPayload | undefined {
    // Inertia mantiene `flash` en la página (ver App de @inertiajs/react); Laravel suele enviarlo también en `props.flash`.
    const fromProps = (page.props as { flash?: FlashPayload }).flash;
    const fromPage = (page as unknown as { flash?: FlashPayload }).flash;
    const merged: FlashPayload = {
        success: fromPage?.success ?? fromProps?.success,
        error: fromPage?.error ?? fromProps?.error,
        warning: fromPage?.warning ?? fromProps?.warning,
    };
    if (!merged.success && !merged.error && !merged.warning) {
        return undefined;
    }
    return merged;
}

/**
 * Muestra toasts según `flash` compartido por Laravel (session), no inventa mensajes en el cliente.
 */
export function FlashToasts() {
    const page = usePage();
    const flash = readFlash(page);
    const success = flash?.success ?? null;
    const error = flash?.error ?? null;
    const warning = flash?.warning ?? null;

    const [toasts, setToasts] = useState<ToastItem[]>([]);
    /** Evita doble toast en el mismo render / misma carga (p. ej. StrictMode). */
    const seenSignature = useRef<string>('');

    const dismiss = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    useEffect(() => {
        const parts: string[] = [];
        if (success) {
            parts.push(`success:${success}`);
        }
        if (error) {
            parts.push(`error:${error}`);
        }
        if (warning) {
            parts.push(`warning:${warning}`);
        }

        if (parts.length === 0) {
            seenSignature.current = '';
            return;
        }

        const signature = `${parts.join('|')}|v:${page.version}`;
        if (signature === seenSignature.current) {
            return;
        }
        seenSignature.current = signature;

        const next: ToastItem[] = [];
        let idBase = Date.now();
        if (success) {
            next.push({ id: idBase++, kind: 'success', message: success });
        }
        if (error) {
            next.push({ id: idBase++, kind: 'error', message: error });
        }
        if (warning) {
            next.push({ id: idBase++, kind: 'warning', message: warning });
        }

        setToasts((prev) => [...prev, ...next]);
        next.forEach((t) => {
            window.setTimeout(() => dismiss(t.id), AUTO_DISMISS_MS);
        });
    }, [success, error, warning, page.version, dismiss]);

    if (toasts.length === 0) {
        return null;
    }

    return (
        <div
            className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-end gap-2 p-4 sm:p-6"
            style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={cn(
                        'pointer-events-auto flex max-w-[min(100%,28rem)] items-start gap-3 rounded-lg border px-4 py-3 text-[13px] shadow-lg transition-all',
                        t.kind === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-950',
                        t.kind === 'error' && 'border-red-200 bg-red-50 text-red-950',
                        t.kind === 'warning' && 'border-amber-200 bg-amber-50 text-amber-950',
                    )}
                    role="status"
                >
                    <span className="mt-0.5 shrink-0">
                        {t.kind === 'success' && <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600" />}
                        {t.kind === 'error' && <FontAwesomeIcon icon={faCircleExclamation} className="text-red-600" />}
                        {t.kind === 'warning' && <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600" />}
                    </span>
                    <p className="min-w-0 flex-1 leading-snug">{t.message}</p>
                    <button
                        type="button"
                        onClick={() => dismiss(t.id)}
                        className="shrink-0 rounded p-1 opacity-70 transition-opacity hover:opacity-100"
                        aria-label="Cerrar notificación"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-[12px]" />
                    </button>
                </div>
            ))}
        </div>
    );
}
