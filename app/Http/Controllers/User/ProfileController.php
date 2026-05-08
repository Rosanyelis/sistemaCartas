<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\ProfileUpdateRequest;
use App\Http\Requests\User\StorePaymentMethodRequest;
use App\Models\MetodoPagoUsuario;
use App\Models\TipoMetodoPago;
use App\Support\UserActivitySummary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the profile index page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Cargar los métodos de pago con su tipo
        $paymentMethods = $user->metodosPago()->with('tipo')->get()->map(function ($method) {
            return [
                'id' => $method->id,
                'type' => $method->tipo->nombre,
                'icon' => $method->tipo->icono,
                'owner' => $method->titular,
                'details' => $method->detalles,
                'isDefault' => $method->is_default,
            ];
        });

        $allowedNames = config('payments.allowed_profile_method_type_names', ['Paypal']);
        $paymentTypeOptions = TipoMetodoPago::query()
            ->whereIn('nombre', $allowedNames)
            ->orderBy('nombre')
            ->get()
            ->map(static fn (TipoMetodoPago $t): array => [
                'id' => $t->id,
                'nombre' => $t->nombre,
                'icono' => $t->icono,
            ])
            ->values()
            ->all();

        return Inertia::render('user/profile', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar ? asset(Storage::url($user->avatar)) : null,
                'direction' => $user->direction,
                'zip_code' => $user->zip_code,
                'phone' => $user->phone,
            ],
            'activitySummary' => UserActivitySummary::forUser($user),
            'paymentMethods' => $paymentMethods,
            'paymentTypeOptions' => $paymentTypeOptions,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request)
    {
        $user = $request->user();

        $newEmail = $request->validated('email');
        $emailChanged = $newEmail !== $user->email;

        $user->fill([
            'name' => $request->validated('name'),
            'email' => $newEmail,
            'direction' => $request->validated('direction'),
            'zip_code' => $request->validated('zip_code'),
            'phone' => $request->validated('phone'),
        ]);

        if ($emailChanged) {
            $user->email_verified_at = null;
        }

        $user->save();

        if ($emailChanged) {
            $user->sendEmailVerificationNotification();
        }

        return back()->with('success', 'Perfil actualizado con éxito');
    }

    /**
     * Update the user's avatar.
     */
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => ['required', 'image', 'max:2048'],
        ]);

        $user = $request->user();

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar' => $path]);

        return back()->with('success', 'Foto de perfil actualizada');
    }

    /**
     * Store a new payment method.
     */
    public function storePaymentMethod(StorePaymentMethodRequest $request)
    {
        $user = $request->user();

        if ($request->boolean('is_default')) {
            $user->metodosPago()->update(['is_default' => false]);
        }

        $user->metodosPago()->create([
            'tipo_metodo_pago_id' => $request->validated('tipo_id'),
            'titular' => $request->validated('titular'),
            'detalles' => $request->validated('detalles'),
            'is_default' => $request->boolean('is_default'),
        ]);

        return back()->with('success', 'Método de pago añadido');
    }

    /**
     * Set a payment method as default.
     */
    public function setDefaultPaymentMethod(MetodoPagoUsuario $metodo)
    {
        Gate::authorize('update', $metodo);

        $user = auth()->user();
        $user->metodosPago()->update(['is_default' => false]);
        $metodo->update(['is_default' => true]);

        return back()->with('success', 'Método predeterminado actualizado');
    }

    /**
     * Delete a payment method.
     */
    public function destroyPaymentMethod(MetodoPagoUsuario $metodo)
    {
        Gate::authorize('delete', $metodo);
        $metodo->delete();

        return back()->with('success', 'Método de pago eliminado');
    }
}
