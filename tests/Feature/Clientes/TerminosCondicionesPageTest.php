<?php

use Inertia\Testing\AssertableInertia as Assert;

test('la página de términos y condiciones responde ok y renderiza el componente legal', function (): void {
    $this->get(route('terminos-y-condiciones'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('legal/terminos-y-condiciones'));
});
