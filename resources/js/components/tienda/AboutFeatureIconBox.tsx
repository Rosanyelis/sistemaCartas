import { cn } from '@/lib/utils';

const FRAME_SRC = '/images/about-feature-icon-frame.svg';

/** Tamaños ópticos alineados con Figma (área útil ~92px dentro de estampilla 112px). */
const ICON_SIZE_CLASS = {
    scroll: 'h-auto w-[68px] max-h-[92px]',
    envelope: 'h-[70px] w-auto max-w-[96px]',
    open: 'h-[76px] w-[76px] max-h-[80px]',
} as const;

export type AboutFeatureIconSize = keyof typeof ICON_SIZE_CLASS;

export type AboutFeatureIconBoxProps = {
    iconSrc: string;
    /** Preset de proporción según asset PNG (Figma 15482:3819). */
    iconSize?: AboutFeatureIconSize;
    iconClassName?: string;
};

export function AboutFeatureIconBox({
    iconSrc,
    iconSize = 'scroll',
    iconClassName,
}: AboutFeatureIconBoxProps) {
    return (
        <div className="relative size-[112px] shrink-0 grow-0">
            <div
                className="pointer-events-none absolute inset-[-14%]"
                aria-hidden
            >
                <img
                    src={FRAME_SRC}
                    alt=""
                    className="block size-full max-w-none object-contain"
                />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
                <img
                    src={iconSrc}
                    alt=""
                    aria-hidden
                    className={cn(
                        'relative z-10 object-contain',
                        ICON_SIZE_CLASS[iconSize],
                        iconClassName,
                    )}
                />
            </div>
        </div>
    );
}
