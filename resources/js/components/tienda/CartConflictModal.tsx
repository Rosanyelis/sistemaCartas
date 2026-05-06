import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { createPortal } from 'react-dom';

type CartConflictModalProps = {
    open: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function CartConflictModal({
    open,
    title,
    description,
    confirmLabel,
    cancelLabel = 'Cancelar',
    onConfirm,
    onCancel,
}: CartConflictModalProps) {
    if (!open || typeof document === 'undefined') {
        return null;
    }

    return createPortal(
        <div
            className="fixed inset-0 z-[220] flex items-center justify-center p-4 pointer-events-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-conflict-title"
        >
            <button
                type="button"
                className="absolute inset-0 bg-black/40"
                aria-label="Cerrar"
                onClick={onCancel}
            />
            <div className="relative z-[1] w-full max-w-[440px] rounded-[2px] border border-[#DCDCDC] bg-white p-6 shadow-[0px_12px_40px_rgba(0,0,0,0.12)] md:p-8">
                <button
                    type="button"
                    className="absolute top-4 right-4 text-[#7B7B7B] hover:text-[#1B3D6D]"
                    aria-label={cancelLabel}
                    onClick={onCancel}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <h2
                    id="cart-conflict-title"
                    className="mb-3 pr-8 font-['Inter',sans-serif] text-[18px] font-bold text-[#1B3D6D] md:text-[20px]"
                >
                    {title}
                </h2>
                <p className="font-['Inter',sans-serif] text-[14px] leading-relaxed text-[#5C5C5C]">
                    {description}
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="h-[44px] rounded-[2px] border border-[#DCDCDC] bg-white px-4 font-['Inter',sans-serif] text-[14px] font-semibold text-[#1B3D6D] hover:bg-[#F5F8FC]"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="h-[44px] rounded-[2px] bg-[#1B3D6D] px-4 font-['Inter',sans-serif] text-[14px] font-semibold text-white hover:bg-[#254a7a]"
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
}
