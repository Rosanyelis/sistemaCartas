import type { ComponentType } from 'react';

export type IconComponent = ComponentType<{
    className?: string;
    strokeWidth?: number;
}>;

interface IconProps {
    iconNode?: IconComponent | null;
    className?: string;
    strokeWidth?: number;
}

export function Icon({
    iconNode: IconComponent,
    className,
    strokeWidth,
}: IconProps) {
    if (!IconComponent) {
        return null;
    }

    return (
        <IconComponent className={className} strokeWidth={strokeWidth} />
    );
}
