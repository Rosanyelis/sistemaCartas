<?php

namespace App\Support;

use Illuminate\Http\Request;
use Stringable;

/**
 * Evita open redirects: solo URL relativas a la app y sin rutas de panel/admin.
 */
final class ValidPublicStoreRedirect
{
    /**
     * Acepta path + query (p. ej. /?openCart=1&checkout=1) o null.
     */
    public static function validate(mixed $value, Request $request): ?string
    {
        if (! is_string($value) && ! ($value instanceof Stringable)) {
            return null;
        }

        $s = trim((string) $value);
        if ($s === '' || str_contains($s, "\n") || str_contains($s, "\r")) {
            return null;
        }

        if (! str_starts_with($s, '/')) {
            return null;
        }

        if (str_starts_with($s, '//') || str_starts_with($s, '/\\')) {
            return null;
        }

        $rawPath = parse_url($s, PHP_URL_PATH);
        $path = is_string($rawPath) && $rawPath !== ''
            ? $rawPath
            : '/';
        if ($path[0] !== '/') {
            return null;
        }

        if (self::isBlockedPath($path)) {
            return null;
        }

        if (! self::sameOriginIfAbsolute($s, $request)) {
            return null;
        }

        return $s;
    }

    private static function isBlockedPath(string $path): bool
    {
        $blocked = [
            '/admin',
            '/api',
            '/dashboard',
            '/settings',
            '/email',
        ];

        foreach ($blocked as $prefix) {
            if ($path === $prefix || str_starts_with($path, $prefix.'/')) {
                return true;
            }
        }

        return false;
    }

    /**
     * Si el valor contiene esquema/host, exige coincidir con el host de la petición.
     */
    private static function sameOriginIfAbsolute(string $value, Request $request): bool
    {
        if (! str_contains($value, '://')) {
            return true;
        }

        $parts = parse_url($value);
        if (! is_array($parts) || ! isset($parts['scheme'], $parts['host'])) {
            return false;
        }

        $appHost = parse_url($request->root(), PHP_URL_HOST);
        if (! is_string($appHost) || $appHost === '') {
            return false;
        }

        if (($parts['host'] ?? null) !== $appHost) {
            return false;
        }

        $path = (string) ($parts['path'] ?? '/');

        return ! self::isBlockedPath($path);
    }
}
