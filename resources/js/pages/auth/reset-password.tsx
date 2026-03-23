import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { home } from '@/routes';
import { update } from '@/routes/password';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <AuthLayout
            title="Restablecer contraseña"
            description="Por favor, ingresa tu nueva contraseña a continuación"
        >
            <Head title="Restablecer contraseña" />

            <Form
                {...((update as any).form
                    ? (update as any).form()
                    : { action: update.url(), method: 'post' })}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
                className="flex w-full flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="flex flex-col gap-1.5">
                            <Label
                                htmlFor="email"
                                className="text-[23.3px] font-medium leading-[28px] text-[#31374F]"
                            >
                                Correo electrónico
                            </Label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-[13px]">
                                    <FontAwesomeIcon icon={faEnvelope} className="size-[23px] text-[#A8A8A8]" />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    readOnly
                                    className="h-[52.5px] border-[#DEDDDD] bg-[#FAFAFA] pl-[46px] text-[19.5px] text-[#31374F] placeholder:text-[#A8A8A8] focus:border-[#49637F] focus:ring-0 opacity-70"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label
                                htmlFor="password"
                                className="text-[23.3px] font-medium leading-[28px] text-[#31374F]"
                            >
                                Nueva contraseña
                            </Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                autoFocus
                                placeholder="Nueva contraseña"
                                leftIcon={
                                    <FontAwesomeIcon icon={faLock} className="size-[19.5px] text-[#A8A8A8]" />
                                }
                                className="h-[52.5px] border-[#DEDDDD] bg-[#FAFAFA] text-[19.5px] text-[#31374F] placeholder:text-[#A8A8A8] focus:border-[#49637F] focus:ring-0"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label
                                htmlFor="password_confirmation"
                                className="text-[23.3px] font-medium leading-[28px] text-[#31374F]"
                            >
                                Confirmar contraseña
                            </Label>
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                autoComplete="new-password"
                                placeholder="Confirmar contraseña"
                                leftIcon={
                                    <FontAwesomeIcon icon={faLock} className="size-[19.5px] text-[#A8A8A8]" />
                                }
                                className="h-[52.5px] border-[#DEDDDD] bg-[#FAFAFA] text-[19.5px] text-[#31374F] placeholder:text-[#A8A8A8] focus:border-[#49637F] focus:ring-0"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button
                            type="submit"
                            className="mt-6 h-[56.4px] w-full bg-linear-to-r from-[#385E88] to-[#4E76A0] text-[24.3px] font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98]"
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            Restablecer contraseña
                        </Button>
                    </>
                )}
            </Form>

            <Link
                href={home()}
                className="mt-12 text-center text-[21.4px] text-[#636363] transition hover:text-[#31374F]"
            >
                Volver al inicio
            </Link>
        </AuthLayout>
    );
}
