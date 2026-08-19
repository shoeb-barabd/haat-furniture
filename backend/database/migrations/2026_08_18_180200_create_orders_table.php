<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->string('id', 64)->primary();
            $table->string('customer');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->text('address')->nullable();
            $table->text('items');
            $table->decimal('total', 12, 2)->default(0);
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('shipping', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->string('status')->default('Processing');
            $table->date('order_date')->nullable();
            $table->string('payment')->default('cod');
            $table->string('source')->default('storefront');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
