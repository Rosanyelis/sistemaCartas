<?php

use Inertia\Testing\AssertableInertia as Assert;

test('la página de aviso de privacidad responde ok y renderiza el componente legal', function (): void {
    $this->get(route('aviso-de-privacidad'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('legal/aviso-de-privacidad'));
});
