{{-- Iconos hero en SVG inline (sin dependencias externas). Variantes: lock, bag, subscription, welcome, heart, cart-warning, shield --}}
@php
    $v = $variant ?? 'bag';
@endphp
@if ($v === 'lock')
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true" role="img">
        <path fill="#1B3D6D" d="M12 1a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6a5 5 0 0 0-5-5zm-3 8V6a3 3 0 0 1 6 0v3H9z"/>
    </svg>
@elseif ($v === 'subscription')
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true" role="img">
        <path fill="#1B3D6D" d="M4 6h16v2H4V6zm0 5h10v2H4v-2zm0 5h16v2H4v-2z"/>
        <circle cx="18" cy="8" r="2" fill="#C4A574"/>
    </svg>
@elseif ($v === 'welcome')
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true" role="img">
        <path fill="#1B3D6D" d="M12 2C8 6 4 8 4 12a8 8 0 1 0 16 0c0-4-4-6-8-10z"/>
        <path fill="#f4f1ea" d="M8 14c2 2 6 2 8 0" stroke="#1B3D6D" stroke-width="1.2" fill="none"/>
    </svg>
@elseif ($v === 'heart')
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true" role="img">
        <path fill="#1B3D6D" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
@elseif ($v === 'cart-warning')
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true" role="img">
        <path fill="#1B3D6D" d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.2 14h9.45l1.38-7H6.21L5.27 4H2v2h2l3.6 8zM18.3 12l-1.4-7H6.5l-.9 2H16l-1.2 5z"/>
        <path fill="#a67c00" d="M20 3h-2v2h2V3zm-1 4L18 9h2l1-2h-2z"/>
    </svg>
@elseif ($v === 'shield')
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true" role="img">
        <path fill="#1B3D6D" d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z"/>
        <path fill="#f4f1ea" d="M10.5 14.2L7.8 11.5l1.4-1.4 1.3 1.3 3.8-3.8 1.4 1.4-5.2 5.2z"/>
    </svg>
@else
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true" role="img">
        <path fill="#1B3D6D" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-.75 1.35c-.14.25-.25.52-.25.81 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
@endif
