import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createPortal } from 'react-dom';

interface ConfirmDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
    isProcessing?: boolean;
    confirmText?: string;
    cancelText?: string;
    /** z-index por encima de modales de taxonomía (z-[80]) */
    elevated?: boolean;
}

/**
 * Diálogo de confirmación con la misma UI que el modal de cerrar sesión en `panel-shell`.
 */
export function ConfirmDialog({
    isOpen,
    onOpenChange,
    title,
    description,
    onConfirm,
    isProcessing = false,
    confirmText = 'Eliminar',
    cancelText = 'Cancelar',
    elevated = false,
}: ConfirmDialogProps) {
    if (!isOpen) {
        return null;
    }

    const zIndex = elevated ? 'z-[100]' : 'z-50';

    return createPortal(
        <div
            className={`fixed inset-0 ${zIndex} flex items-center justify-center p-4`}
        >
            <div
                className="absolute inset-0 animate-in bg-black/40 duration-300 fade-in"
                onClick={() => !isProcessing && onOpenChange(false)}
                aria-hidden
            />
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
                className="relative w-full max-w-[490px] animate-in rounded-[16px] bg-white p-[30px] text-center shadow-[0px_0px_20px_rgba(36,16,167,0.15)] duration-300 zoom-in"
            >
                <div className="flex flex-col items-center gap-[35px]">
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F2F2F2]">
                            <FontAwesomeIcon
                                icon={faTriangleExclamation}
                                className="h-[40px] w-[40px] text-[#1B3D6D]"
                                style={{
                                    fill: 'none',
                                    stroke: 'currentColor',
                                    strokeWidth: '32px',
                                }}
                            />
                        </div>

                        <h3
                            id="confirm-dialog-title"
                            className="font-['Inter'] text-[25px] leading-[30px] font-semibold text-[#111928]"
                        >
                            {title}
                        </h3>

                        <div className="h-[3px] w-[90px] rounded-[2px] bg-[#1B3D6D]" />

                        <p
                            id="confirm-dialog-description"
                            className="font-['Inter'] text-[16px] leading-[19px] text-[#7B7B7B]"
                        >
                            {description}
                        </p>
                    </div>

                    <div className="flex w-full gap-[18px]">
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={isProcessing}
                            className="flex h-[47px] flex-1 items-center justify-center rounded-[2px] bg-brand-blue px-5 py-[14px] text-[16px] font-semibold text-white transition-all hover:bg-brand-blue/90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isProcessing ? 'Procesando...' : confirmText}
                        </button>
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            disabled={isProcessing}
                            className="flex h-[47px] flex-1 items-center justify-center rounded-[2px] border border-[#1B3D6D] bg-white px-5 py-[14px] text-[16px] font-semibold text-[#1B3D6D] transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
}
