import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <AuthLayout
            title="Nueva contraseña"
            description="Introduce y confirma tu nueva contraseña para continuar."
        >
            <Head title="Restablecer contraseña" />

            <Form
                action="/reset-password"
                method="post"
                resetOnSuccess={['password', 'password_confirmation']}
                className="flex w-full flex-col gap-4"
            >
                {({ processing, errors }) => (
                    <>
                        <input type="hidden" name="token" value={token} />
                        <input type="hidden" name="email" value={email} />

                        <div className="flex flex-col gap-1.5">
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="new-password"
                                placeholder="Nueva contraseña"
                                leftIcon={
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        className="size-[18px] text-[#A8A8A8] md:size-[23px]"
                                    />
                                }
                                className="h-[44px] border-[#DEDDDD] bg-[#FAFAFA] text-[14px] text-[#31374F] placeholder:text-[#A8A8A8] focus:border-[#49637F] focus:ring-0 md:h-[48px] md:text-[16px]"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                required
                                tabIndex={2}
                                autoComplete="new-password"
                                placeholder="Confirmar contraseña"
                                leftIcon={
                                    <FontAwesomeIcon
                                        icon={faLock}
                                        className="size-[18px] text-[#A8A8A8] md:size-[23px]"
                                    />
                                }
                                className="h-[44px] border-[#DEDDDD] bg-[#FAFAFA] text-[14px] text-[#31374F] placeholder:text-[#A8A8A8] focus:border-[#49637F] focus:ring-0 md:h-[48px] md:text-[16px]"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 h-[44px] w-full bg-linear-to-r from-[#385E88] to-[#4E76A0] text-[18px] font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98] md:h-[50px] md:text-[22px]"
                            tabIndex={3}
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            Guardar contraseña
                        </Button>
                    </>
                )}
            </Form>

            <Link
                href={login.url()}
                className="mt-8 block text-center text-[14px] text-[#636363] transition hover:text-[#31374F] md:mt-12 md:text-[16px]"
            >
                Volver al inicio de sesión
            </Link>
        </AuthLayout>
    );
}
