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
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import UserLayout from '@/layouts/user-layout';
import profile from '@/routes/user/profile';

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
        id: number;
        name: string;
        email: string;
        avatar: string | null;
        direction: string | null;
        zip_code: string | null;
        phone: string | null;
    };
    activitySummary: {
        activeSubscriptions: number;
        acquiredProducts: number;
    };
    paymentMethods: {
        id: number;
        type: string;
        icon: string;
        owner: string;
        details: string;
        isDefault: boolean;
    }[];
}

export default function Profile({
    user,
    activitySummary,
    paymentMethods,
}: ProfileProps) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        direction: string;
        zip_code: string;
        phone: string;
    }>({
        name: user.name,
        direction: user.direction || '',
        zip_code: user.zip_code || '',
        phone: user.phone || '',
    });

    const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
    const [newPaymentType, setNewPaymentType] = useState('Paypal');

    useEffect(() => {
        setData({
            name: user.name,
            direction: user.direction || '',
            zip_code: user.zip_code || '',
            phone: user.phone || '',
        });
    }, [user]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(profile.update().url);
    };

    const updateAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            router.post(
                profile.avatar().url,
                {
                    avatar: e.target.files[0],
                },
                {
                    forceFormData: true,
                },
            );
        }
    };

    const deletePaymentMethod = (id: number) => {
        if (
            confirm('¿Estás seguro de que deseas eliminar este método de pago?')
        ) {
            router.delete(profile.paymentMethods.destroy({ metodo: id }).url);
        }
    };

    const setDefaultPaymentMethod = (id: number) => {
        router.patch(profile.paymentMethods.setDefault({ metodo: id }).url);
    };

    const getPaymentIcon = (iconName: string) => {
        switch (iconName) {
            case 'paypal':
                return faCreditCard;
            case 'bank':
                return faBuildingColumns;
            case 'wallet':
                return faWallet;
            default:
                return faBuildingColumns;
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
                                    src={
                                        user.avatar ||
                                        '/images/avatar-placeholder.jpg'
                                    }
                                    alt="Avatar"
                                    className="size-[120px] rounded-[16px] object-cover"
                                />
                                <label
                                    htmlFor="avatar-upload"
                                    className="absolute -top-2 -right-2 flex size-8 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-white text-[#1B3D6D] shadow-md transition-transform hover:scale-110"
                                >
                                    <FontAwesomeIcon
                                        icon={faCamera}
                                        className="size-3.5"
                                    />
                                    <input
                                        id="avatar-upload"
                                        type="file"
                                        className="hidden"
                                        onChange={updateAvatar}
                                    />
                                </label>
                            </div>

                            <button className="mb-2 w-full rounded-[4px] border border-[#1B3D6D] py-2 text-[14px] font-semibold text-[#1B3D6D] transition-all hover:bg-[#1B3D6D] hover:text-white">
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
                                            {
                                                activitySummary.activeSubscriptions
                                            }{' '}
                                            Suscripciones a historias
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="size-4 rounded-sm bg-[#22AD5C]" />
                                        <span className="text-[11px] font-medium text-[#7B7B7B]">
                                            {activitySummary.acquiredProducts}{' '}
                                            Productos adquiridos
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Content */}
                    <div className="flex flex-1 flex-col gap-6">
                        {/* Section 1: Personal Info */}
                        <div className="rounded-[12px] bg-white p-6 shadow-[0px_0px_15px_rgba(36,16,167,0.08)] md:p-8">
                            <h2 className="mb-6 font-['Inter'] text-[20px] font-bold text-[#1B3D6D]">
                                Información Personal
                            </h2>
                            <div className="mb-8 h-[1px] w-full bg-[#F2F2F2]" />

                            {/* Info Forms */}
                            <form
                                onSubmit={submit}
                                className="flex flex-col gap-6"
                            >
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="font-['Inter'] text-[14px] font-medium text-[#111928]">
                                            Nombre completo
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            className="h-[48px] rounded-[4px] border border-[#E5E7EB] px-4 font-['Inter'] text-[15px] text-[#111928] focus:border-[#1B3D6D] focus:outline-none"
                                            placeholder="Tu nombre"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-500">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="font-['Inter'] text-[14px] font-medium text-[#111928]">
                                            Dirección de correo electrónico
                                        </label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            disabled
                                            className="h-[48px] rounded-[4px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 font-['Inter'] text-[15px] text-[#111928]"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="font-['Inter'] text-[14px] font-medium text-[#111928]">
                                            Dirección
                                        </label>
                                        <input
                                            type="text"
                                            value={data.direction}
                                            onChange={(e) =>
                                                setData(
                                                    'direction',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-[48px] rounded-[4px] border border-[#E5E7EB] px-4 font-['Inter'] text-[15px] text-[#111928] focus:border-[#1B3D6D] focus:outline-none"
                                            placeholder="Ej. Urbanización los altos"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="font-['Inter'] text-[14px] font-medium text-[#111928]">
                                            Código postal
                                        </label>
                                        <input
                                            type="text"
                                            value={data.zip_code}
                                            onChange={(e) =>
                                                setData(
                                                    'zip_code',
                                                    e.target.value,
                                                )
                                            }
                                            className="h-[48px] rounded-[4px] border border-[#E5E7EB] px-4 font-['Inter'] text-[15px] text-[#111928] focus:border-[#1B3D6D] focus:outline-none"
                                            placeholder="Ej. 11012"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                                        <label className="font-['Inter'] text-[14px] font-medium text-[#111928]">
                                            Número de teléfono móvil
                                        </label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                            className="h-[48px] rounded-[4px] border border-[#E5E7EB] px-4 font-['Inter'] text-[15px] text-[#111928] focus:border-[#1B3D6D] focus:outline-none"
                                            placeholder="Ej. 000 000 000"
                                        />
                                    </div>
                                </div>

                                <div className="mt-2 flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={() => reset()}
                                        className="h-[48px] rounded-[4px] border border-[#1B3D6D] bg-white px-8 font-['Inter'] text-[16px] font-bold text-[#1B3D6D] transition-all hover:bg-gray-50 sm:w-auto"
                                    >
                                        Cancelar cambios
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="h-[48px] rounded-[4px] bg-[#1B3D6D] px-8 font-['Inter'] text-[16px] font-bold text-white transition-all hover:bg-[#1B3D6D]/90 sm:w-auto"
                                    >
                                        Guardar cambios
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Section 2: Payment Methods */}
                        <div className="rounded-[12px] bg-white p-6 shadow-[0px_0px_15px_rgba(36,16,167,0.08)] md:p-8">
                            <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                                <h2 className="font-['Inter'] text-[20px] font-bold text-[#1B3D6D]">
                                    Método de pago
                                </h2>
                                <button className="flex w-full items-center justify-center gap-2 rounded-[4px] border border-[#1B3D6D] px-4 py-2 text-[14px] font-bold text-[#1B3D6D] transition-all hover:bg-[#1B3D6D] hover:text-white md:w-auto">
                                    <FontAwesomeIcon
                                        icon={faPlus}
                                        className="size-3"
                                    />
                                    Añadir nuevo
                                </button>
                            </div>
                            <div className="mb-8 h-[1px] w-full bg-[#F2F2F2]" />

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        className="relative rounded-[8px] border border-[#E5E7EB] p-4 transition-all hover:border-[#1B3D6D] hover:shadow-md"
                                    >
                                        <div className="mb-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex size-8 items-center justify-center rounded-[4px] bg-[#1B3D6D] text-white">
                                                    <FontAwesomeIcon
                                                        icon={getPaymentIcon(
                                                            method.icon,
                                                        )}
                                                        className="size-4"
                                                    />
                                                </div>
                                                <span className="text-[14px] font-bold text-[#1B3D6D]">
                                                    {method.type}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    deletePaymentMethod(
                                                        method.id,
                                                    )
                                                }
                                                className="text-[#7B7B7B] transition-colors hover:text-red-500"
                                                title="Eliminar método de pago"
                                            >
                                                <FontAwesomeIcon
                                                    icon={faEllipsisVertical}
                                                    className="size-4"
                                                />
                                            </button>
                                        </div>

                                        <div className="mb-4 flex flex-col">
                                            <span className="text-[11px] font-medium text-[#7B7B7B]">
                                                {method.owner}
                                            </span>
                                            <span className="text-[12px] font-medium text-[#111928]">
                                                {method.details}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-2 border-t pt-3">
                                            <button
                                                onClick={() =>
                                                    setDefaultPaymentMethod(
                                                        method.id,
                                                    )
                                                }
                                                disabled={method.isDefault}
                                                className={`rounded-full px-4 py-1.5 font-['Inter'] text-[12px] font-medium transition-all ${method.isDefault ? 'cursor-default bg-[#22AD5C] text-white' : 'bg-gray-100 text-[#7B7B7B] hover:bg-gray-200'}`}
                                            >
                                                {method.isDefault
                                                    ? 'Predeterminado'
                                                    : 'Marcar predeterminado'}
                                            </button>
                                            {method.isDefault && (
                                                <span className="flex items-center gap-1.5 rounded-[4px] border border-[#BFDBFE] bg-[#EFF6FF] px-2 py-0.5 text-[10px] font-bold text-[#1D4ED8] uppercase">
                                                    Activo
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() =>
                                        setIsAddPaymentModalOpen(true)
                                    }
                                    className="mt-4 flex h-[44px] w-full items-center justify-center rounded-[4px] border border-dashed border-[#1B3D6D] font-['Inter'] text-[14px] font-semibold text-[#1B3D6D] transition-all hover:bg-[#1B3D6D]/5"
                                >
                                    + Añadir nuevo método de pago
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Añadir Pago */}
            {isAddPaymentModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setIsAddPaymentModalOpen(false)}
                    />
                    <div className="relative w-full max-w-[420px] animate-in rounded-[16px] bg-white p-8 shadow-2xl duration-300 zoom-in">
                        <h3 className="mb-6 font-['Inter'] text-[24px] font-bold text-[#1B3D6D]">
                            Añadir método de pago
                        </h3>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[14px] font-medium text-[#111928]">
                                    Tipo
                                </label>
                                <select
                                    className="h-[48px] rounded-[4px] border border-[#E5E7EB] px-3 focus:outline-none"
                                    value={newPaymentType}
                                    onChange={(e) =>
                                        setNewPaymentType(e.target.value)
                                    }
                                >
                                    <option value="1">Paypal</option>
                                    <option value="2">
                                        Tarjeta de Crédito
                                    </option>
                                    <option value="3">Mercado Pago</option>
                                </select>
                            </div>

                            <p className="text-[13px] text-[#7B7B7B]">
                                Selecciona el tipo de método de pago que deseas
                                vincular a tu cuenta.
                            </p>

                            <div className="mt-4 flex gap-3">
                                <button
                                    className="h-[48px] flex-1 rounded-[4px] bg-[#1B3D6D] font-bold text-white hover:bg-[#1B3D6D]/90"
                                    onClick={() =>
                                        setIsAddPaymentModalOpen(false)
                                    }
                                >
                                    Aceptar
                                </button>
                                <button
                                    className="h-[48px] flex-1 rounded-[4px] border border-gray-300 hover:bg-gray-50"
                                    onClick={() =>
                                        setIsAddPaymentModalOpen(false)
                                    }
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
