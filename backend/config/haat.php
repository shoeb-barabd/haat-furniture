<?php

return [
    'admins' => [
        [
            'username' => env('HAAT_ADMIN_SUDO_USER', 'sudoadmin'),
            'password' => env('HAAT_ADMIN_SUDO_PASS'),
            'role' => 'sudo',
        ],
        [
            'username' => env('HAAT_ADMIN_MANAGER_USER', 'adminmanager'),
            'password' => env('HAAT_ADMIN_MANAGER_PASS'),
            'role' => 'admin',
        ],
        [
            'username' => env('HAAT_ADMIN_VIEW_USER', 'viewonly'),
            'password' => env('HAAT_ADMIN_VIEW_PASS'),
            'role' => 'view',
        ],
    ],
    'token_ttl' => (int) env('HAAT_ADMIN_TOKEN_TTL', 43200),
];
