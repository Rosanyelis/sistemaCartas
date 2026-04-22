<?php

use App\Models\Historia;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('la redirección tras cambiar el estado de una historia conserva el flash en la página de listado', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $historia = Historia::factory()->create();

    $patch = $this->actingAs($admin)->patch(route('admin.historias.toggle-status', $historia));

    $patch->assertRedirect(route('admin.historias', absolute: false));
    $patch->assertSessionHas('success');

    $page = $this->actingAs($admin)->get(route('admin.historias'));

    $page->assertOk();
    $page->assertInertia(fn (Assert $assert) => $assert
        ->where('flash.success', 'Estado actualizado.')
    );
});
