<?php

namespace App\Http\Middleware;

use App\Support\HaatAdminToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureHaatAdmin
{
    public function handle(Request $request, Closure $next, string $ability = 'any'): Response
    {
        $token = $request->bearerToken();
        $admin = HaatAdminToken::verify($token);

        if (! $admin) {
            return response()->json(['success' => false, 'message' => 'Admin login required'], 401);
        }

        if ($ability === 'write' && $admin['role'] === 'view') {
            return response()->json(['success' => false, 'message' => 'View-only role cannot change data'], 403);
        }

        $request->attributes->set('haat_admin', $admin);

        return $next($request);
    }
}
