<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Haat Furniture V2 API Routes
Route::prefix('v1')->group(function () {

    // Categories Endpoint
    Route::get('/categories', function () {
        $data = json_decode(file_get_contents(base_path('../imported_wp_products.json')), true);
        return response()->json([
            'success' => true,
            'data' => $data['categories'] ?? []
        ]);
    });

    // Products Endpoint
    Route::get('/products', function (Request $request) {
        $category = $request->query('category');
        $search = strtolower($request->query('search', ''));

        $data = json_decode(file_get_contents(base_path('../imported_wp_products.json')), true);
        $allProducts = $data['products'] ?? [];

        if ($category && $category !== 'all') {
            $allProducts = array_values(array_filter($allProducts, function ($item) use ($category) {
                return ($item['category_slug'] ?? '') === $category || strtolower($item['category'] ?? '') === strtolower($category);
            }));
        }

        if ($search) {
            $allProducts = array_values(array_filter($allProducts, function ($item) use ($search) {
                return str_contains(strtolower($item['name'] ?? ''), $search) || str_contains(strtolower($item['category'] ?? ''), $search);
            }));
        }

        return response()->json([
            'success' => true,
            'count' => count($allProducts),
            'data' => $allProducts
        ]);
    });

    // Single Product Detail Endpoint
    Route::get('/products/{id}', function ($id) {
        $data = json_decode(file_get_contents(base_path('../imported_wp_products.json')), true);
        $allProducts = $data['products'] ?? [];

        foreach ($allProducts as $p) {
            if ($p['id'] == $id) {
                return response()->json(['success' => true, 'data' => $p]);
            }
        }
        return response()->json(['success' => false, 'message' => 'Product not found'], 404);
    });

});
