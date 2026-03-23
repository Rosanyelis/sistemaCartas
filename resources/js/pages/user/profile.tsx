import {
    faBuildingColumns,
    faCamera,
    faChevronDown,
    faEllipsisVertical,
    faEnvelope,
    faLocationDot,
    faMapPin,
    faPhone,
    faPlus,
    faUser,
    faWallet,
    faCreditCard,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, useForm } from '@inertiajs/react';
import UserLayout from '@/layouts/user-layout';

interface PaymentMethod {
    id: number;
    type: string;
    icon: 'paypal' | 'bank' | 'wallet';
    owner: string;
    details: string;
    is_default: boolean;
}

interface ProfileProps {
    user: {
        name: string;
        email: string;
        avatar: string | null;
        direction: string;
        zip_code: string;
        phone: string;
    };
    resumenActivities: {
        suscripciones_historias: number;
        productos_adquiridos: number;
    };
    paymentMethods: PaymentMethod[];
}

export default function Profile({ user, resumenActivities, paymentMethods }: ProfileProps) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        name: user.name,
        email: user.email,
        direction: user.direction,
        zip_code: user.zip_code,
        phone: user.phone,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // action would go here
    };

    const getPaymentIcon = (iconName: string) => {
        switch (iconName) {
            case 'paypal': return faCreditCard;
            case 'bank': return faBuildingColumns;
            case 'wallet': return faWallet;
            default: return faBuildingColumns;
        }
    };

    return (
        <UserLayout title="Mi perfil">
            <Head title="Mi Perfil" />
            
            <div className="flex w-full flex-col gap-6">
                <h1 className="font-['Inter'] text-[24px] font-bold text-[#1B3D6D] md:text-[28px]">
                    Mi perfil
                </h1>

                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Left Column: User Card */}
                    <div className="flex w-full flex-col gap-6 lg:w-[280px]">
                        <div className="flex flex-col items-center rounded-[12px] bg-white p-8 shadow-[0px_0px_15px_rgba(36,16,167,0.08)]">
                            <div className="relative mb-6">
                                <img
                                    src={user.avatar || "/images/avatar-placeholder.jpg"}
                                    alt="Avatar"
                                    className="size-[120px] rounded-[16px] object-cover"
                                />
                                <button className="absolute -top-2 -right-2 flex size-8 items-center justify-center rounded-full border-4 border-white bg-white text-[#1B3D6D] shadow-md hover:scale-110 transition-transform">
                                    <FontAwesomeIcon icon={faCamera} className="size-3.5" />
                                </button>
                            </div>
                            
                            <button className="mb-2 w-full rounded-[4px] border border-[#1B3D6D] py-2 text-[14px] font-semibold text-[#1B3D6D] hover:bg-[#1B3D6D] hover:text-white transition-all">
                                Cambiar foto
                            </button>
                            <span className="text-[10px] text-[#7B7B7B]">
                                Formatos admitidos: PNG o JPG
                            </span>

                            <div className="mt-8 w-full border-t border-[#F2F2F2] pt-6">
                                <span className="mb-4 block rounded-[4px] bg-[#F5F6F7] px-3 py-1.5 text-[12px] font-medium text-[#7B7B7B]">
                                    Resumen de actividades
                                </span>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="size-4 rounded-sm bg-[#1B3D6D]" />
                                        <span className="text-[11px] font-medium text-[#7B7B7B]">
                                            {resumenActivities.suscripciones_historias} Suscripciones a historias
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="size-4 rounded-sm bg-[#22AD5C]" />
                                        <span className="text-[11px] font-medium text-[#7B7B7B]">
                                            {resumenActivities.productos_adquiridos} Productos adquiridos
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="flex flex-1 flex-col gap-6">
                        {/* Section 1: Personal Info */}
                        <div className="rounded-[12px] bg-white p-6 md:p-8 shadow-[0px_0px_15px_rgba(36,16,167,0.08)]">
                            <h2 className="mb-6 font-['Inter'] text-[20px] font-bold text-[#1B3D6D]">
                                Información Personal
                            </h2>
                            <div className="h-[1px] w-full bg-[#F2F2F2] mb-8" />

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-medium text-[#1B3D6D]">Nombre completo</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1B3D6D] opacity-40">
                                            <FontAwesomeIcon icon={faUser} className="size-3.5" />
                                        </span>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="h-[48px] w-full rounded-[4px] border border-[#DFE4EA] pl-11 pr-4 text-[14px] text-[#111928] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-medium text-[#1B3D6D]">Correo electrónico</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1B3D6D] opacity-40">
                                            <FontAwesomeIcon icon={faEnvelope} className="size-3.5" />
                                        </span>
                                        <input
                                            type="email"
                                            value={data.email}
                                            disabled
                                            className="h-[48px] w-full cursor-not-allowed rounded-[4px] border border-[#DFE4EA] bg-[#F5F6F7] pl-11 pr-4 text-[14px] text-[#7B7B7B] outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-medium text-[#1B3D6D]">Dirección</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1B3D6D] opacity-40">
                                            <FontAwesomeIcon icon={faLocationDot} className="size-3.5" />
                                        </span>
                                        <input
                                            type="text"
                                            value={data.direction}
                                            onChange={e => setData('direction', e.target.value)}
                                            className="h-[48px] w-full rounded-[4px] border border-[#DFE4EA] pl-11 pr-4 text-[14px] text-[#111928] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-medium text-[#1B3D6D]">Código postal</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={data.zip_code}
                                            onChange={e => setData('zip_code', e.target.value)}
                                            className="h-[48px] w-full rounded-[4px] border border-[#DFE4EA] px-4 text-[14px] text-[#111928] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 md:col-span-1">
                                    <label className="text-[14px] font-medium text-[#1B3D6D]">Teléfono</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1B3D6D] opacity-40 rotate-90">
                                            <FontAwesomeIcon icon={faPhone} className="size-3.5" />
                                        </span>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            className="h-[48px] w-full rounded-[4px] border border-[#DFE4EA] pl-11 pr-4 text-[14px] text-[#111928] focus:border-[#1B3D6D] focus:ring-1 focus:ring-[#1B3D6D]/10 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex w-full flex-col-reverse gap-4 md:col-span-2 md:flex-row md:justify-end">
                                    <button
                                        type="button"
                                        onClick={() => reset()}
                                        className="h-[48px] w-full rounded-[4px] bg-[#F5F6F7] px-8 text-[15px] font-bold text-[#7B7B7B] hover:bg-gray-200 transition-all md:w-auto"
                                    >
                                        Cancelar cambios
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="h-[48px] w-full rounded-[4px] bg-[#1B3D6D] px-8 text-[15px] font-bold text-white hover:bg-[#1B3D6D]/90 transition-all md:w-auto"
                                    >
                                        Guardar cambios
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Section 2: Payment Methods */}
                        <div className="rounded-[12px] bg-white p-6 md:p-8 shadow-[0px_0px_15px_rgba(36,16,167,0.08)]">
                            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                                <h2 className="font-['Inter'] text-[20px] font-bold text-[#1B3D6D]">
                                    Método de pago
                                </h2>
                                <button className="flex w-full items-center justify-center gap-2 rounded-[4px] border border-[#1B3D6D] px-4 py-2 text-[14px] font-bold text-[#1B3D6D] hover:bg-[#1B3D6D] hover:text-white transition-all md:w-auto">
                                    <FontAwesomeIcon icon={faPlus} className="size-3" />
                                    Añadir nuevo
                                </button>
                            </div>
                            <div className="h-[1px] w-full bg-[#F2F2F2] mb-8" />

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {paymentMethods.map((method) => (
                                    <div key={method.id} className="relative rounded-[8px] border border-[#E5E7EB] p-4 transition-all hover:border-[#1B3D6D] hover:shadow-md">
                                        <div className="mb-2 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex size-8 items-center justify-center rounded-[4px] bg-[#1B3D6D] text-white">
                                                    <FontAwesomeIcon icon={getPaymentIcon(method.icon)} className="size-4" />
                                                </div>
                                                <span className="text-[14px] font-bold text-[#1B3D6D]">{method.type}</span>
                                            </div>
                                            <button className="text-[#7B7B7B] hover:text-[#1B3D6D]">
                                                <FontAwesomeIcon icon={faEllipsisVertical} className="size-4" />
                                            </button>
                                        </div>
                                        
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-medium text-[#7B7B7B]">{method.owner}</span>
                                            <span className="text-[12px] font-medium text-[#111928]">{method.details}</span>
                                        </div>

                                        {method.is_default && (
                                            <div className="absolute top-2 right-10 flex items-center gap-1.5 rounded-[4px] bg-[#EFF6FF] px-2 py-0.5 border border-[#BFDBFE]">
                                                <div className="size-2 rounded-full bg-[#2563EB]" />
                                                <span className="text-[9px] font-bold text-[#2563EB] uppercase">Predeterminado</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
