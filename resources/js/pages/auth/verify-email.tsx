import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout, dashboard } from '@/routes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEnvelope,
    faCheck,
    faRotateRight,
    faArrowRight,
    faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import InputError from '@/components/input-error';

type VerifyEmailProps = {
    status?: string;
    showSuccess?: boolean;
    redirectAfterVerify?: string | null;
};

export default function VerifyEmail({
    status: initialStatus,
    showSuccess = false,
    redirectAfterVerify = null,
}: VerifyEmailProps) {
    const [step, setStep] = useState(showSuccess ? 2 : 1); // 1: OTP, 2: Success
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        otp: '',
    });

    useEffect(() => {
        setData('otp', otp.join(''));
    }, [otp]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 1 && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        post('/email/verification-otp', {
            onSuccess: () => setStep(2),
        });
    };

    return (
        <AuthLayout title="" description="">
            <Head title="Verificación de correo" />

            {/* Stepper Header indicator for UX consistency */}
            <div className="mb-0 w-full">
                <div className="flex items-center justify-between text-[11.6px] font-bold tracking-tight text-[#49637F]">
                    <span>PASO {step + 1} DE 3</span>
                    <span className="text-[#A8A8A8]">
                        {step === 1 ? '80%' : '100%'} completado
                    </span>
                </div>
                <div className="mt-2 h-[5.8px] w-full overflow-hidden rounded-full border border-[#EEEEEE] bg-[#FAFAFA]">
                    <div
                        className="h-full bg-[#49637F] transition-all duration-500"
                        style={{ width: step === 1 ? '80%' : '100%' }}
                    />
                </div>
                <p className="mt-2 text-[11.6px] font-medium text-[#A8A8A8]">
                    Registro de información personal
                </p>
            </div>

            <div className="mt-3 flex flex-col items-center">
                <div className="mb-6 flex h-[74px] w-[74px] items-center justify-center rounded-[10px] bg-[#F4F7FA]">
                    <FontAwesomeIcon
                        icon={step === 1 ? faEnvelope : faCheck}
                        className="text-[#49637F]"
                        style={{ width: '42px', height: '42px' }}
                    />
                </div>

                <h1 className="mb-2 text-center text-[26px] leading-tight font-medium text-[#31374F] md:text-[28px] md:leading-[40px]">
                    {step === 1
                        ? 'Verifica tu correo'
                        : '¡Cuenta creada con éxito!'}
                </h1>
                <p className="mb-0 text-center text-[15px] leading-relaxed font-normal text-[#31374F] md:text-[16px] md:leading-[24px]">
                    {step === 1 
                        ? 'Hemos enviado un código de 6 dígitos a tu correo electrónico. Por favor, ingrésalo abajo para continuar.' 
                        : (
                            <>
                                Bienvenido a <span className="font-bold text-[#385E88]">Historias por Correo</span>. Tu buzón está listo para llenarse de aventuras inolvidables. Ya puedes empezar a explorar todas nuestras historias.
                            </>
                        )
                    }
                </p>
            </div>

            {step === 1 && (
                <form
                    onSubmit={handleVerifyOtp}
                    className="flex w-full flex-col gap-6"
                >
                    <div className="flex justify-center gap-2 md:gap-3">
                        {otp.map((digit, idx) => (
                            <Input
                                key={idx}
                                ref={(el) => {
                                    otpRefs.current[idx] = el;
                                }}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) =>
                                    handleOtpChange(idx, e.target.value)
                                }
                                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                className="h-[44px] w-[36px] border-[#DEDDDD] bg-[#FAFAFA] p-0 text-center text-[18px] font-bold text-[#31374F] focus:border-[#49637F] focus:ring-0 md:h-[50px] md:w-[44px] md:text-[20px]"
                            />
                        ))}
                    </div>

                    {errors.otp && (
                        <div className="text-center">
                            <InputError message={errors.otp} />
                        </div>
                    )}

                    {initialStatus === 'verification-link-sent' && (
                        <div className="text-center text-sm font-medium text-green-600">
                            Se ha enviado un nuevo código a tu correo.
                        </div>
                    )}

                    <div className="text-center">
                        <p className="text-[13.6px] font-medium text-[#49637F]">
                            Reenviar código en {formatTime(timer)}
                        </p>
                    </div>

                    <Button
                        type="submit"
                        disabled={processing || otp.join('').length < 6}
                        className="h-[44px] w-full bg-[#385E88] text-[18px] font-bold text-white shadow-md transition-all hover:bg-[#4E76A0] disabled:opacity-50 md:h-[50px] md:text-[22px]"
                    >
                        {processing && <Spinner />}
                        Verificar código
                    </Button>

                    <div className="mt-4 border-t border-[#EEEEEE] pt-6 text-center">
                        <p className="text-[14px] text-[#636363]">
                            ¿No recibiste el código?
                        </p>
                        <Link
                            href="/email/verification-otp/resend"
                            method="post"
                            as="button"
                            disabled={timer > 0}
                            className="mx-auto mt-2 flex items-center justify-center font-bold text-[#49637F] hover:opacity-80 disabled:opacity-50"
                            onSuccess={() => setTimer(60)}
                        >
                            <FontAwesomeIcon
                                icon={faRotateRight}
                                className="mr-1 size-3"
                            />
                            Reenviar código
                        </Link>
                    </div>
                </form>
            )}

            {step === 2 && (
                <div className="flex w-full flex-col gap-6">
                    <Button
                        onClick={() =>
                            router.visit(
                                redirectAfterVerify ?? dashboard().url,
                            )
                        }
                        className="h-[44px] w-full bg-[#385E88] text-[18px] font-bold text-white shadow-md transition-all hover:bg-[#4E76A0] md:h-[50px] md:text-[22px]"
                    >
                        Empezar ahora{' '}
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            className="ml-2 size-[18px]"
                        />
                    </Button>

                    <div className="border-t border-[#EEEEEE] pt-6">
                        <p className="text-center text-[15px] leading-relaxed text-[#636363] md:text-[16px]">
                            Te hemos enviado un correo de bienvenida con los primeros pasos.
                        </p>
                    </div>
                </div>
            )}

            <Link
                href={logout()}
                method="post"
                as="button"
                className="mt-8 flex w-full items-center justify-center text-[14px] text-[#636363] transition hover:text-[#31374F] md:text-[18px]"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2 size-4" />
                Cerrar sesión
            </Link>
        </AuthLayout>
    );
}
