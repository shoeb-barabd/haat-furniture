<?php

use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\UploadController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('v1')->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::get('/banners', [BannerController::class, 'show']);
    Route::post('/orders', [OrderController::class, 'store']);

    Route::post('/admin/login', [AdminAuthController::class, 'login'])->middleware('throttle:8,1');

    Route::middleware('haat.admin')->group(function () {
        Route::get('/admin/me', [AdminAuthController::class, 'me']);
        Route::get('/orders', [OrderController::class, 'index']);
    });

    Route::middleware('haat.admin:write')->group(function () {
        Route::post('/products/bulk-discount', [ProductController::class, 'bulkDiscount']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products', [ProductController::class, 'update']);
        Route::delete('/products', [ProductController::class, 'destroy']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);
        Route::put('/banners', [BannerController::class, 'update']);
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories', [CategoryController::class, 'update']);
        Route::delete('/categories', [CategoryController::class, 'destroy']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
        Route::put('/orders', [OrderController::class, 'updateStatus']);
        Route::post('/upload', [UploadController::class, 'store']);
    });
});
