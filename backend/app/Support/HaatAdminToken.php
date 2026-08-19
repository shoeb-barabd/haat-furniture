<?php

namespace App\Support;

use Illuminate\Support\Facades\Crypt;
use Throwable;

class HaatAdminToken
{
    public static function issue(string $username, string $role): string
    {
        $payload = [
            'u' => $username,
            'r' => $role,
            'exp' => time() + (int) config('haat.token_ttl', 43200),
        ];

        return Crypt::encryptString(json_encode($payload));
    }

    public static function verify(?string $token): ?array
    {
        if (! is_string($token) || $token === '') {
            return null;
        }

        try {
            $decoded = json_decode(Crypt::decryptString($token), true);
        } catch (Throwable) {
            return null;
        }

        if (! is_array($decoded) || empty($decoded['u']) || empty($decoded['r']) || empty($decoded['exp'])) {
            return null;
        }

        if ((int) $decoded['exp'] < time()) {
            return null;
        }

        if (! in_array($decoded['r'], ['sudo', 'admin', 'view'], true)) {
            return null;
        }

        return [
            'username' => (string) $decoded['u'],
            'role' => (string) $decoded['r'],
        ];
    }
}
