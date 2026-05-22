import type { LucideIcon } from 'lucide-react';
import { ArrowDown, ArrowUp, Check, X } from 'lucide-react';
import { ReactNode } from 'react';

export type MetricStat = {
    label: string;
    value: number | string;
    tone: 'success' | 'danger';
    icon?: 'up' | 'down' | 'check' | 'times';
};

type MetricCardProps = {
    icon: LucideIcon;
    title: string;
    subtitle?: string;
    value?: number | string;
    growthPercent?: number;
    stats?: MetricStat[];
    footer?: ReactNode;
    iconClassName?: string;
    className?: string;
    compact?: boolean;
};

/** Tamaños Figma nodo 15553:7798 — estándar 160×94, compacta 130×94. */
export const metricCardStandardDesktopClass =
    'lg:h-[94px] lg:w-[160px] lg:min-w-[160px] lg:max-w-[160px] lg:shrink-0';

export const metricCardCompactDesktopClass =
    'lg:h-[94px] lg:w-[130px] lg:min-w-[130px] lg:max-w-[130px] lg:shrink-0';

export const metricCardClassName =
    'flex min-h-[94px] flex-col gap-2 rounded-[4px] bg-white p-3 shadow-[0px_0px_10px_rgba(36,16,167,0.15)] max-lg:snap-start max-lg:shrink-0';

const statIconMap = {
    up: ArrowUp,
    down: ArrowDown,
    check: Check,
    times: X,
} as const;

const ICON_STROKE = 1.75;

export default function MetricCard({
    icon: IconComponent,
    title,
    subtitle,
    value,
    growthPercent,
    stats,
    footer,
    iconClassName = 'bg-[#F5F5FF] text-[#1B3D6D]',
    className = '',
    compact = false,
}: MetricCardProps) {
    return (
        <div
            className={`${metricCardClassName} ${
                compact
                    ? `max-lg:min-w-[130px] max-lg:max-w-[130px] ${metricCardCompactDesktopClass}`
                    : `max-lg:min-w-[160px] max-lg:max-w-[160px] ${metricCardStandardDesktopClass}`
            } ${className}`}
        >
            <div
                className={`flex gap-2 ${compact ? 'items-center justify-center' : 'items-center'}`}
            >
                <div
                    className={`flex shrink-0 items-center rounded-[2px] p-1 ${iconClassName}`}
                >
                    <IconComponent
                        className="size-6"
                        strokeWidth={ICON_STROKE}
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold leading-none text-[#373737]">
                        {title}
                    </p>
                    {subtitle ? (
                        <p className="mt-0.5 text-[10px] leading-[13px] font-normal text-[#7B7B7B]">
                            {subtitle}
                        </p>
                    ) : null}
                </div>
            </div>

            <div
                className={`flex items-center gap-2 pl-[5px] ${compact ? 'justify-center' : ''}`}
            >
                <span className="text-[25px] font-semibold leading-none text-[#A4A4A4]">
                    {value ?? 0}
                </span>

                {growthPercent !== undefined && growthPercent > 0 ? (
                    <div className="flex items-center gap-2">
                        <span className="text-[13px] font-normal text-[#1DA534]">
                            {growthPercent.toFixed(2)}%
                        </span>
                        <ArrowUp
                            className="size-4 text-[#1DA534]"
                            strokeWidth={ICON_STROKE}
                        />
                    </div>
                ) : null}

                {stats && stats.length > 0 ? (
                    <div className="flex flex-col">
                        {stats.map((stat) => {
                            const StatIcon = stat.icon
                                ? statIconMap[stat.icon]
                                : null;

                            return (
                                <div
                                    key={stat.label}
                                    className={`flex items-center gap-1 text-[8px] leading-none font-normal ${
                                        stat.tone === 'success'
                                            ? 'text-[#1DA534]'
                                            : 'text-[#DF0707]'
                                    }`}
                                >
                                    <span>
                                        {stat.label}: {stat.value}
                                    </span>
                                    {StatIcon ? (
                                        <StatIcon
                                            className="size-3 shrink-0"
                                            strokeWidth={ICON_STROKE}
                                        />
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                ) : null}
            </div>

            {footer ? <div>{footer}</div> : null}
        </div>
    );
}
