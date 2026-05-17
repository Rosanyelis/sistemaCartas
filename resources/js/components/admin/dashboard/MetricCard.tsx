import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
    faArrowDown,
    faArrowUp,
    faCheck,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactNode } from 'react';

export type MetricStat = {
    label: string;
    value: number | string;
    tone: 'success' | 'danger';
    icon?: 'up' | 'down' | 'check' | 'times';
};

type MetricCardProps = {
    icon: IconDefinition;
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

export const metricCardClassName =
    'flex shrink-0 snap-start flex-col gap-2 rounded bg-white p-3 shadow-[0px_0px_10px_rgba(36,16,167,0.15)] md:shrink md:p-3';

const statIconMap = {
    up: faArrowUp,
    down: faArrowDown,
    check: faCheck,
    times: faTimes,
} as const;

export default function MetricCard({
    icon,
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
            className={`${metricCardClassName} ${compact ? 'max-w-[130px] min-w-[130px]' : 'max-w-[300px] min-w-[260px] md:w-auto md:max-w-none md:min-w-0'} ${className}`}
        >
            <div className="flex items-center gap-2">
                <div
                    className={`flex shrink-0 items-center rounded-sm p-1 ${iconClassName}`}
                >
                    <FontAwesomeIcon icon={icon} className="size-6" />
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

            <div className="flex items-center gap-2 pl-[5px]">
                <span className="text-[25px] font-semibold leading-none text-[#A4A4A4]">
                    {value ?? 0}
                </span>

                {growthPercent !== undefined && growthPercent > 0 ? (
                    <div className="flex items-center gap-2">
                        <span className="text-[13px] text-[#1DA534]">
                            {growthPercent.toFixed(2)}%
                        </span>
                        <FontAwesomeIcon
                            icon={faArrowUp}
                            className="size-4 text-[#1DA534]"
                        />
                    </div>
                ) : null}

                {stats && stats.length > 0 ? (
                    <div className="flex flex-col gap-0.5">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className={`flex items-center gap-0.5 text-[8px] leading-none ${
                                    stat.tone === 'success'
                                        ? 'text-[#1DA534]'
                                        : 'text-[#DF0707]'
                                }`}
                            >
                                <span>
                                    {stat.label}: {stat.value}
                                </span>
                                {stat.icon ? (
                                    <FontAwesomeIcon
                                        icon={statIconMap[stat.icon]}
                                        className="inline-block shrink-0 text-[8px] leading-none [&_svg]:h-[1em] [&_svg]:w-[1em]"
                                    />
                                ) : null}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>

            {footer ? <div>{footer}</div> : null}
        </div>
    );
}
