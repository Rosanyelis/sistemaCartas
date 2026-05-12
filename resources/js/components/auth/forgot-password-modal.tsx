import { faCheck, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import {
    sendOtp,
    verifyOtp,
    resetPassword,
} from '@/actions/App/Http/Controllers/Auth/PasswordResetOtpController';

type ForgotPasswordModalProps = {
    open: boolean;
    onClose: () => void;
};

type Step = 'email' | 'otp' | 'new-password' | 'success';

export default function ForgotPasswordModal({
    open,
    onClose,
}: ForgotPasswordModalProps) {
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [resetToken, setResetToken] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [timer, setTimer] = useState(60);

    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Reset state when modal closes
    useEffect(() => {
        if (!open) {
            setStep('email');
            setEmail('');
            setOtp(['', '', '', '', '', '']);
            setResetToken('');
            setPassword('');
            setPasswordConfirmation('');
            setProcessing(false);
            setErrors({});
            setTimer(60);
        }
    }, [open]);

    // Countdown timer for OTP resend
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (step === 'otp' && timer > 0) {
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

    // --- OTP handlers (reused pattern from verify-email.tsx) ---
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) {
            return;
        }
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

    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text');
        const digits = text.replace(/\D/g, '').slice(0, 6).split('');
        const next: string[] = [...otp];
        for (let i = 0; i < 6; i++) {
            next[i] = digits[i] ?? '';
        }
        setOtp(next);
        const focusIdx = Math.min(Math.max(digits.length - 1, 0), 5);
        requestAnimationFrame(() => {
            otpRefs.current[focusIdx]?.focus();
        });
    };

    // --- Password requirement checks ---
    const hasMinLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecialChar = /[@#$%&*+\-=]/.test(password);

    // --- Step handlers ---
    const handleSendOtp = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setProcessing(true);
            setErrors({});
            try {
                await axios.post(sendOtp.url(), { email });
                setTimer(60);
                setStep('otp');
            } catch (err: any) {
                if (err.response?.status === 422) {
                    const validationErrors = err.response.data.errors;
                    const flatErrors: Record<string, string> = {};
                    for (const key in validationErrors) {
                        flatErrors[key] = validationErrors[key][0];
                    }
                    setErrors(flatErrors);
                }
            } finally {
                setProcessing(false);
            }
        },
        [email],
    );

    const handleVerifyOtp = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setProcessing(true);
            setErrors({});
            try {
                const response = await axios.post(verifyOtp.url(), {
                    email,
                    otp: otp.join(''),
                });
                setResetToken(response.data.reset_token);
                setStep('new-password');
            } catch (err: any) {
                if (err.response?.status === 422) {
                    const validationErrors = err.response.data.errors;
                    const flatErrors: Record<string, string> = {};
                    for (const key in validationErrors) {
                        flatErrors[key] = validationErrors[key][0];
                    }
                    setErrors(flatErrors);
                }
            } finally {
                setProcessing(false);
            }
        },
        [email, otp],
    );

    const handleResetPassword = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            setProcessing(true);
            setErrors({});
            try {
                await axios.post(resetPassword.url(), {
                    email,
                    reset_token: resetToken,
                    password,
                    password_confirmation: passwordConfirmation,
                });
                setStep('success');
            } catch (err: any) {
                if (err.response?.status === 422) {
                    const validationErrors = err.response.data.errors;
                    const flatErrors: Record<string, string> = {};
                    for (const key in validationErrors) {
                        flatErrors[key] = validationErrors[key][0];
                    }
                    setErrors(flatErrors);
                }
            } finally {
                setProcessing(false);
            }
        },
        [email, resetToken, password, passwordConfirmation],
    );

    const handleResendOtp = useCallback(async () => {
        setProcessing(true);
        setErrors({});
        try {
            await axios.post(sendOtp.url(), { email });
            setTimer(60);
            setOtp(['', '', '', '', '', '']);
        } catch {
            // Silently fail
        } finally {
            setProcessing(false);
        }
    }, [email]);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={step !== 'success' ? onClose : undefined}
            />

            {/* Modal Card */}
            <div className="relative z-10 mx-4 w-full max-w-[520px] rounded-[15px] bg-[#5A7A9B] px-6 py-10 shadow-2xl md:px-12 md:py-12">
                {/* Close button */}
                {step !== 'success' && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute top-4 right-4 flex size-7 items-center justify-center rounded-sm border border-white/40 text-white/80 transition hover:text-white"
                        aria-label="Cerrar"
                    >
                        <X className="size-4" />
                    </button>
                )}

                {/* ========== STEP 1: Email ========== */}
                {step === 'email' && (
                    <form
                        onSubmit={handleSendOtp}
                        className="flex flex-col items-center gap-5"
                    >
                        <h2 className="text-center text-[22px] font-bold text-white md:text-[26px]">
                            Recuperar contraseña
                        </h2>
                        <p className="text-center text-[13px] leading-relaxed text-white/80 md:text-[15px]">
                            Ingresa tu correo electrónico y te enviaremos
                            <br className="hidden md:inline" /> un código de
                            verificación.
                        </p>

                        <div className="w-full">
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-[13px]">
                                    <FontAwesomeIcon
                                        icon={faEnvelope}
                                        className="size-[18px] text-[#A8A8A8] md:size-[20px]"
                                    />
                                </div>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoFocus
                                    placeholder="Correo electrónico"
                                    className="h-[44px] border-transparent bg-white pl-[40px] text-[14px] text-[#31374F] placeholder:text-[#A8A8A8] focus:border-white focus:ring-0 md:h-[48px] md:pl-[46px] md:text-[16px]"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-[44px] w-full bg-linear-to-r from-[#2C4A6B] to-[#3D5F82] text-[16px] font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98] md:h-[48px] md:text-[18px]"
                        >
                            {processing && <Spinner />}
                            Enviar código de verificación
                        </Button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-1 text-[14px] text-white/70 transition hover:text-white"
                        >
                            ← Volver al inicio de sesión
                        </button>
                    </form>
                )}

                {/* ========== STEP 2: OTP Verification ========== */}
                {step === 'otp' && (
                    <form
                        onSubmit={handleVerifyOtp}
                        className="flex flex-col items-center gap-5"
                    >
                        <h2 className="text-center text-[22px] font-bold text-white md:text-[26px]">
                            Ingresa el código de verificación
                        </h2>
                        <p className="text-center text-[13px] leading-relaxed text-white/80 md:text-[15px]">
                            Hemos enviado un código de 6 dígitos a
                            <br />
                            <span className="font-semibold text-white">
                                {email}
                            </span>
                        </p>

                        <div
                            className="flex justify-center gap-2 md:gap-3"
                            onPaste={handleOtpPaste}
                        >
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
                                    onKeyDown={(e) =>
                                        handleOtpKeyDown(idx, e)
                                    }
                                    className="h-[44px] w-[40px] border-transparent bg-white p-0 text-center text-[18px] font-bold text-[#31374F] focus:border-white focus:ring-0 md:h-[50px] md:w-[48px] md:text-[20px]"
                                />
                            ))}
                        </div>

                        {errors.otp && (
                            <div className="text-center">
                                <InputError message={errors.otp} />
                            </div>
                        )}

                        <p className="text-[13px] font-medium text-white/70">
                            Reenviar código en {formatTime(timer)}
                        </p>

                        <Button
                            type="submit"
                            disabled={
                                processing || otp.join('').length < 6
                            }
                            className="h-[44px] w-full bg-linear-to-r from-[#2C4A6B] to-[#3D5F82] text-[16px] font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 md:h-[48px] md:text-[18px]"
                        >
                            {processing && <Spinner />}
                            Verificar
                        </Button>

                        <div className="mt-1 text-center">
                            <p className="text-[13px] font-medium text-white/80">
                                ¿No recibiste el código?
                            </p>
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={timer > 0 || processing}
                                className="text-[13px] font-bold text-[#A8D8FF] underline transition hover:text-white disabled:opacity-50"
                            >
                                Reenviar código
                            </button>
                        </div>

                        <p className="mt-1 text-center text-[11px] text-white/50">
                            *Si no ves el correo en tu bandeja de entrada
                            revisa tu bandeja de spam
                        </p>
                    </form>
                )}

                {/* ========== STEP 3: New Password ========== */}
                {step === 'new-password' && (
                    <form
                        onSubmit={handleResetPassword}
                        className="flex flex-col items-center gap-5"
                    >
                        <div className="text-center">
                            <h2 className="text-[22px] font-bold text-white md:text-[26px]">
                                Crea una nueva contraseña
                            </h2>
                            <p className="mt-1 text-[14px] text-white/70 md:text-[15px]">
                                para tu cuenta
                            </p>
                        </div>

                        <div className="w-full">
                            <PasswordInput
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nueva contraseña"
                                autoFocus
                                leftIcon={
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        className="size-[18px] text-[#A8A8A8] md:size-[20px]"
                                    />
                                }
                                className="h-[44px] border-transparent bg-white text-[14px] text-[#31374F] placeholder:text-[#A8A8A8] focus:border-white focus:ring-0 md:h-[48px] md:text-[16px]"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="w-full">
                            <PasswordInput
                                value={passwordConfirmation}
                                onChange={(e) =>
                                    setPasswordConfirmation(e.target.value)
                                }
                                placeholder="Confirmar contraseña"
                                leftIcon={
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        className="size-[18px] text-[#A8A8A8] md:size-[20px]"
                                    />
                                }
                                className="h-[44px] border-transparent bg-white text-[14px] text-[#31374F] placeholder:text-[#A8A8A8] focus:border-white focus:ring-0 md:h-[48px] md:text-[16px]"
                            />
                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        {/* Password requirements checklist */}
                        <div className="flex w-full flex-col gap-1.5 text-[13px]">
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    className={`size-3.5 ${hasMinLength ? 'text-[#8BC34A]' : 'text-white/40'}`}
                                />
                                <span
                                    className={
                                        hasMinLength
                                            ? 'text-white'
                                            : 'text-white/60'
                                    }
                                >
                                    Mínimo 8 caracteres
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    className={`size-3.5 ${hasLetter ? 'text-[#8BC34A]' : 'text-white/40'}`}
                                />
                                <span
                                    className={
                                        hasLetter
                                            ? 'text-white'
                                            : 'text-white/60'
                                    }
                                >
                                    1 letra
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FontAwesomeIcon
                                    icon={faCheck}
                                    className={`size-3.5 ${hasSpecialChar ? 'text-[#8BC34A]' : 'text-white/40'}`}
                                />
                                <span
                                    className={
                                        hasSpecialChar
                                            ? 'text-white'
                                            : 'text-white/60'
                                    }
                                >
                                    1 carácter especial (@#$%&*+-=)
                                </span>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-[44px] w-full bg-linear-to-r from-[#2C4A6B] to-[#3D5F82] text-[16px] font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98] md:h-[48px] md:text-[18px]"
                        >
                            {processing && <Spinner />}
                            Actualizar contraseña
                        </Button>
                    </form>
                )}

                {/* ========== STEP 4: Success ========== */}
                {step === 'success' && (
                    <div className="flex flex-col items-center gap-5">
                        <div className="flex size-[72px] items-center justify-center rounded-full bg-[#8BC34A]">
                            <FontAwesomeIcon
                                icon={faCheck}
                                className="size-[36px] text-white"
                            />
                        </div>

                        <div className="text-center">
                            <h2 className="text-[22px] font-bold text-white md:text-[26px]">
                                Contraseña actualizada
                                <br />
                                correctamente
                            </h2>
                            <p className="mt-3 text-[14px] text-white/70 md:text-[15px]">
                                Ya puedes iniciar sesión con tu
                                <br />
                                nueva contraseña
                            </p>
                        </div>

                        <Button
                            type="button"
                            onClick={onClose}
                            className="h-[44px] w-full bg-linear-to-r from-[#2C4A6B] to-[#3D5F82] text-[16px] font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98] md:h-[48px] md:text-[18px]"
                        >
                            Ir a iniciar sesión
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
