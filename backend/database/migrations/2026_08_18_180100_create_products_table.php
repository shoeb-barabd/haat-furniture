<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->unsignedBigInteger('id')->primary();
            $table->string('name');
            $table->string('slug')->nullable()->index();
            $table->string('category')->nullable();
            $table->string('category_slug')->nullable()->index();
            $table->decimal('price', 12, 2)->default(0);
            $table->decimal('old_price', 12, 2)->nullable();
            $table->decimal('rating', 3, 1)->default(4.9);
            $table->unsignedInteger('reviews')->default(15);
            $table->string('image', 1024)->nullable();
            $table->string('badge')->nullable();
            $table->longText('description')->nullable();
            $table->json('categories')->nullable();
            $table->json('category_names')->nullable();
            $table->json('gallery')->nullable();
            $table->string('wood_type')->nullable();
            $table->string('warranty')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
