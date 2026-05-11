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
    faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import UserLayout from '@/layouts/user-layout';
import { getUserInitials } from '@/lib/user-initials';
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
    paymentTypeOptions: {
        id: number;
        nombre: string;
        icono: string;
    }[];
}

export default function Profile({
    user,
    activitySummary,
    paymentMethods,
    paymentTypeOptions,
}: ProfileProps) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        email: string;
        direction: string;
        zip_code: string;
        phone: string;
    }>({
        name: user.name,
        email: user.email,
        direction: user.direction || '',
        zip_code: user.zip_code || '',
        phone: user.phone || '',
    });

    const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
    const [paymentMethodMenuId, setPaymentMethodMenuId] = useState<
        number | null
    >(null);
    const [paymentMethodDeleteId, setPaymentMethodDeleteId] = useState<
        number | null
    >(null);
    const paymentMethodForm = useForm({
        tipo_id: paymentTypeOptions[0]?.id ?? 0,
        titular: '',
        detalles: '',
        is_default: false,
    });

    useEffect(() => {
        setData({
            name: user.name,
            email: user.email,
            direction: user.direction || '',
            zip_code: user.zip_code || '',
            phone: user.phone || '',
        });
    }, [user]);

    const openAddPaymentModal = () => {
        paymentMethodForm.setData({
            tipo_id: paymentTypeOptions[0]?.id ?? 0,
            titular: '',
            detalles: '',
            is_default: false,
        });
        paymentMethodForm.clearErrors();
        setIsAddPaymentModalOpen(true);
    };

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

    const requestDeletePaymentMethod = (id: number) => {
        setPaymentMethodMenuId(null);
        setPaymentMethodDeleteId(id);
    };

    const confirmDeletePaymentMethod = () => {
        if (paymentMethodDeleteId === null) {
            return;
        }

        router.delete(
            profile.paymentMethods.destroy({
                metodo: paymentMethodDeleteId,
            }).url,
            {
                onFinish: () => setPaymentMethodDeleteId(null),
            },
        );
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
                                {user.avatar?.trim() ? (
                                    <img
                                        src={user.avatar}
                                        alt=""
                                        className="size-[120px] rounded-[16px] object-cover"
                                    />
                                ) : (
                                    <div
                                        className="flex size-[120px] items-center justify-center rounded-[16px] bg-[#E8EDF3] font-['Inter'] text-[40px] font-bold tracking-tight text-[#1B3D6D]"
                                        aria-hidden
                                    >
                                        {getUserInitials(user.name)}
                                    </div>
                                )}
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
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            className="h-[48px] rounded-[4px] border border-[#E5E7EB] px-4 font-['Inter'] text-[15px] text-[#111928] focus:border-[#1B3D6D] focus:outline-none"
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-500">
                                                {errors.email}
                                            </p>
                                        )}
                                        <p className="text-[12px] text-[#7B7B7B]">
                                            Si cambias el correo, deberás
                                            verificarlo de nuevo (recibirás un
                                            código OTP).
                                        </p>
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
                                <button
                                    type="button"
                                    onClick={openAddPaymentModal}
                                    className="flex w-full items-center justify-center gap-2 rounded-[4px] border border-[#1B3D6D] px-4 py-2 text-[14px] font-bold text-[#1B3D6D] transition-all hover:bg-[#1B3D6D] hover:text-white md:w-auto"
                                >
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
                                            <div className="relative">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setPaymentMethodMenuId(
                                                            paymentMethodMenuId ===
                                                                method.id
                                                                ? null
                                                                : method.id,
                                                        )
                                                    }
                                                    className="text-[#7B7B7B] transition-colors hover:text-[#1B3D6D]"
                                                    title="Opciones del método de pago"
                                                    aria-haspopup="menu"
                                                    aria-expanded={
                                                        paymentMethodMenuId ===
                                                        method.id
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={
                                                            faEllipsisVertical
                                                        }
                                                        className="size-4"
                                                    />
                                                </button>
                                                {paymentMethodMenuId ===
                                                    method.id && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            className="fixed inset-0 z-10 cursor-default"
                                                            aria-label="Cerrar menú"
                                                            onClick={() =>
                                                                setPaymentMethodMenuId(
                                                                    null,
                                                                )
                                                            }
                                                        />
                                                        <div className="absolute top-full right-0 z-20 mt-1 min-w-[160px] rounded-[6px] border border-[#E5E7EB] bg-white py-1 shadow-[0px_4px_15px_rgba(0,0,0,0.12)]">
                                                            <button
                                                                type="button"
                                                                className="w-full px-3 py-2 text-left text-[13px] font-medium text-red-600 hover:bg-red-50"
                                                                onClick={() =>
                                                                    requestDeletePaymentMethod(
                                                                        method.id,
                                                                    )
                                                                }
                                                            >
                                                                Eliminar método
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
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
                                    type="button"
                                    onClick={openAddPaymentModal}
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
                        {paymentTypeOptions.length === 0 ? (
                            <p className="text-[14px] text-[#7B7B7B]">
                                No hay tipos de método disponibles. Contacta con
                                soporte.
                            </p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[14px] font-medium text-[#111928]">
                                        Tipo
                                    </label>
                                    <select
                                        className="h-[48px] rounded-[4px] border border-[#E5E7EB] bg-white px-3 text-[#111928] focus:outline-none focus:ring-2 focus:ring-[#1B3D6D]/20"
                                        value={paymentMethodForm.data.tipo_id}
                                        onChange={(e) =>
                                            paymentMethodForm.setData(
                                                'tipo_id',
                                                Number(e.target.value),
                                            )
                                        }
                                    >
                                        {paymentTypeOptions.map((t) => (
                                            <option key={t.id} value={t.id}>
                                                {t.nombre}
                                            </option>
                                        ))}
                                    </select>
                                    {paymentMethodForm.errors.tipo_id && (
                                        <p className="text-sm text-red-500">
                                            {paymentMethodForm.errors.tipo_id}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[14px] font-medium text-[#111928]">
                                        Titular / alias
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentMethodForm.data.titular}
                                        onChange={(e) =>
                                            paymentMethodForm.setData(
                                                'titular',
                                                e.target.value,
                                            )
                                        }
                                        className="h-[48px] rounded-[4px] border border-[#E5E7EB] bg-white px-3 text-[#111928] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1B3D6D]/20"
                                        placeholder="Nombre visible"
                                    />
                                    {paymentMethodForm.errors.titular && (
                                        <p className="text-sm text-red-500">
                                            {paymentMethodForm.errors.titular}
                                        </p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[14px] font-medium text-[#111928]">
                                        Detalles (correo PayPal, nota, etc.)
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentMethodForm.data.detalles}
                                        onChange={(e) =>
                                            paymentMethodForm.setData(
                                                'detalles',
                                                e.target.value,
                                            )
                                        }
                                        className="h-[48px] rounded-[4px] border border-[#E5E7EB] bg-white px-3 text-[#111928] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#1B3D6D]/20"
                                        placeholder="ej. cuenta@ejemplo.com"
                                    />
                                    {paymentMethodForm.errors.detalles && (
                                        <p className="text-sm text-red-500">
                                            {paymentMethodForm.errors.detalles}
                                        </p>
                                    )}
                                </div>

                                <label className="flex items-center gap-2 text-[14px] text-[#111928]">
                                    <input
                                        type="checkbox"
                                        checked={
                                            paymentMethodForm.data.is_default
                                        }
                                        onChange={(e) =>
                                            paymentMethodForm.setData(
                                                'is_default',
                                                e.target.checked,
                                            )
                                        }
                                        className="size-4 rounded border-[#E5E7EB]"
                                    />
                                    Marcar como predeterminado
                                </label>

                                <p className="text-[13px] text-[#7B7B7B]">
                                    Solo se admiten métodos compatibles con el
                                    flujo actual de la tienda (PayPal).
                                </p>

                                <div className="mt-4 flex gap-3">
                                    <button
                                        type="button"
                                        className="h-[48px] flex-1 rounded-[4px] bg-[#1B3D6D] font-bold text-white hover:bg-[#1B3D6D]/90 disabled:opacity-50"
                                        disabled={paymentMethodForm.processing}
                                        onClick={() =>
                                            paymentMethodForm.post(
                                                profile.paymentMethods.store()
                                                    .url,
                                                {
                                                    preserveScroll: true,
                                                    onSuccess: () => {
                                                        setIsAddPaymentModalOpen(
                                                            false,
                                                        );
                                                        paymentMethodForm.reset();
                                                    },
                                                },
                                            )
                                        }
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        type="button"
                                        className="h-[48px] flex-1 rounded-[4px] border border-gray-300 bg-white font-medium text-[#1B3D6D] hover:bg-gray-50"
                                        onClick={() =>
                                            setIsAddPaymentModalOpen(false)
                                        }
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {paymentMethodDeleteId !== null && (
                <div className="fixed inset-0 z-[100] flex animate-in items-center justify-center bg-black/40 px-4 duration-300 fade-in">
                    <button
                        type="button"
                        className="absolute inset-0 cursor-default"
                        aria-label="Cerrar"
                        onClick={() => setPaymentMethodDeleteId(null)}
                    />
                    <div className="relative z-[1] w-full max-w-[490px] animate-in rounded-[16px] bg-white p-[30px] text-center shadow-[0px_0px_20px_rgba(36,16,167,0.15)] duration-300 zoom-in">
                        <div className="flex flex-col items-center gap-[28px]">
                            <div className="flex flex-col items-center gap-3">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F2F2F2]">
                                    <FontAwesomeIcon
                                        icon={faTriangleExclamation}
                                        className="h-[40px] w-[40px] text-[#1B3D6D]"
                                    />
                                </div>
                                <h3 className="font-['Inter'] text-[22px] leading-tight font-semibold text-[#111928]">
                                    ¿Eliminar método de pago?
                                </h3>
                                <div className="h-[3px] w-[90px] rounded-[2px] bg-[#1B3D6D]" />
                                <p className="font-['Inter'] text-[15px] leading-relaxed text-[#7B7B7B]">
                                    Esta acción no se puede deshacer. Podrás
                                    volver a añadir un método más tarde.
                                </p>
                            </div>
                            <div className="flex w-full gap-[18px]">
                                <button
                                    type="button"
                                    onClick={confirmDeletePaymentMethod}
                                    className="flex h-[47px] flex-1 items-center justify-center rounded-[2px] bg-[#1B3D6D] px-5 text-[16px] font-semibold text-white transition-all hover:bg-[#1B3D6D]/90"
                                >
                                    Eliminar
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setPaymentMethodDeleteId(null)
                                    }
                                    className="flex h-[47px] flex-1 items-center justify-center rounded-[2px] border border-[#1B3D6D] bg-white px-5 text-[16px] font-semibold text-[#1B3D6D] transition-all hover:bg-gray-50"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
