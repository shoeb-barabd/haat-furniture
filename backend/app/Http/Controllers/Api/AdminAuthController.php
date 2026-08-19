<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Support\HaatAdminToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;

class AdminAuthController extends Controller
{
    public function login(Request $request)
    {
        $username = strtolower(trim((string) $request->input('username', '')));
        $password = (string) $request->input('password', '');
        $key = 'haat-admin-login:'.$request->ip();

        if (RateLimiter::tooManyAttempts($key, 8)) {
            return response()->json(['success' => false, 'message' => 'Too many login attempts. Try again later.'], 429);
        }

        $matched = null;
        foreach (config('haat.admins', []) as $admin) {
            $storedUser = strtolower((string) ($admin['username'] ?? ''));
            $storedPass = (string) ($admin['password'] ?? '');
            if ($storedUser === '' || $storedPass === '' || $storedUser !== $username) {
                continue;
            }
            $ok = str_starts_with($storedPass, '$2')
                ? Hash::check($password, $storedPass)
                : hash_equals($storedPass, $password);
            if ($ok) {
                $matched = $admin;
                break;
            }
        }

        if (! $matched) {
            RateLimiter::hit($key, 300);
            return response()->json(['success' => false, 'message' => 'Invalid username or password'], 401);
        }

        RateLimiter::clear($key);

        $role = (string) $matched['role'];
        $token = HaatAdminToken::issue($username, $role);

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'username' => $username,
                'role' => $role,
            ],
        ]);
    }

    public function me(Request $request)
    {
        $admin = $request->attributes->get('haat_admin');

        return response()->json([
            'success' => true,
            'data' => $admin,
        ]);
    }
}
