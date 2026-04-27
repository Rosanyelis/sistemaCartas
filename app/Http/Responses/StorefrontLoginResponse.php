<?php

namespace App\Http\Responses;

use App\Support\ValidPublicStoreRedirect;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;
use Symfony\Component\HttpFoundation\Response;

class StorefrontLoginResponse implements LoginResponseContract
{
    public function toResponse($request): Response
    {
        if ($request->wantsJson()) {
            return new JsonResponse(['two_factor' => false]);
        }

        $user = $request->user();
        $safe = ValidPublicStoreRedirect::validate($request->input('redirect'), $request);

        if ($user !== null && ! $user->hasVerifiedEmail()) {
            if (is_string($safe)) {
                session(['storefront_redirect_after_verify' => $safe]);
            }

            return redirect()->route('verification.notice');
        }

        if (is_string($safe)) {
            return redirect($safe);
        }

        return redirect()->intended(Fortify::redirects('login'));
    }
}
