<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function show()
    {
        return response()->json([
            'success' => true,
            'data' => $this->currentBanners(),
        ]);
    }

    public function update(Request $request)
    {
        $current = $this->currentBanners();
        $next = [
            'heroOffer' => array_merge($current['heroOffer'], $request->input('heroOffer', []) ?: []),
            'heroSlides' => is_array($request->input('heroSlides'))
                ? $request->input('heroSlides')
                : $current['heroSlides'],
        ];

        SiteSetting::query()->updateOrCreate(
            ['key' => 'banners'],
            ['value' => $next]
        );

        return response()->json([
            'success' => true,
            'message' => 'Banner published to homepage',
            'data' => $next,
        ]);
    }

    private function currentBanners(): array
    {
        $setting = SiteSetting::query()->find('banners');
        $value = $setting?->value;

        return [
            'heroOffer' => is_array($value['heroOffer'] ?? null) ? $value['heroOffer'] : [
                'enabled' => true,
                'image' => '',
            ],
            'heroSlides' => is_array($value['heroSlides'] ?? null) ? $value['heroSlides'] : [],
        ];
    }
}
