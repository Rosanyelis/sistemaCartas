import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactNode } from 'react';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface AdminFormSidePanelProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    className?: string;
}

/**
 * Panel lateral derecho (~50% en desktop) para formularios admin de crear/editar.
 */
export function AdminFormSidePanel({
    open,
    onClose,
    title,
    children,
    className,
}: AdminFormSidePanelProps) {
    return (
        <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
            <SheetContent
                side="right"
                className={cn(
                    'flex h-full w-full max-w-none flex-col gap-0 overflow-hidden border-l border-[#E5E7EB] bg-white p-0 sm:max-w-none md:w-1/2 [&>button]:hidden',
                    className,
                )}
            >
                <SheetTitle className="sr-only">{title}</SheetTitle>
                <SheetDescription className="sr-only">
                    Formulario de administración
                </SheetDescription>

                <div className="flex shrink-0 items-center justify-between border-b border-[#F3F4F6] px-6 py-5 md:px-8">
                    <h2 className="text-[16px] font-bold text-[#1B3D6D] md:text-[17px] md:font-semibold">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="-mr-2 p-2 text-[#7B7B7B] outline-none transition-colors hover:text-[#1B3D6D]"
                        aria-label="Cerrar"
                    >
                        <FontAwesomeIcon icon={faTimes} className="text-[17px] md:text-lg" />
                    </button>
                </div>

                {children}
            </SheetContent>
        </Sheet>
    );
}
