<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class HaatCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedProductsAndCategories();
        $this->seedOrders();
        $this->seedBanners();
    }

    private function seedProductsAndCategories(): void
    {
        $richPath = base_path('../frontend/src/app/products_128_data.json');
        $wpPath = base_path('../imported_wp_products.json');

        $products = [];
        if (is_file($richPath)) {
            $decoded = json_decode((string) file_get_contents($richPath), true);
            $products = is_array($decoded) ? $decoded : [];
        }

        $wp = [];
        if (is_file($wpPath)) {
            $wp = json_decode((string) file_get_contents($wpPath), true) ?: [];
        }

        $wpById = [];
        foreach (($wp['products'] ?? []) as $item) {
            if (isset($item['id'])) {
                $wpById[(string) $item['id']] = $item;
            }
        }

        Product::query()->delete();
        foreach ($products as $item) {
            $id = (int) ($item['id'] ?? 0);
            if ($id <= 0) {
                continue;
            }
            $wpItem = $wpById[(string) $id] ?? [];
            $categories = $item['categories'] ?? [];
            $categoryNames = $item['category_names'] ?? [];
            $name = (string) ($item['name'] ?? 'Untitled');

            Product::query()->create([
                'id' => $id,
                'name' => $name,
                'slug' => $wpItem['slug'] ?? Str::slug($name),
                'category' => $item['category'] ?? ($wpItem['category'] ?? ($categoryNames[0] ?? 'Home Furniture')),
                'category_slug' => $wpItem['category_slug'] ?? ($categories[0] ?? 'home-furniture'),
                'price' => (float) ($item['price'] ?? 0),
                'old_price' => isset($item['oldPrice']) && $item['oldPrice'] !== null
                    ? (float) $item['oldPrice']
                    : (isset($wpItem['old_price']) && $wpItem['old_price'] !== null ? (float) $wpItem['old_price'] : null),
                'rating' => (float) ($item['rating'] ?? 4.9),
                'reviews' => (int) ($item['reviews'] ?? 15),
                'image' => $item['image'] ?? null,
                'badge' => $item['badge'] ?? '100% Solid Segun',
                'description' => $item['description'] ?? '',
                'categories' => $categories,
                'category_names' => $categoryNames,
                'gallery' => $item['gallery'] ?? [],
                'wood_type' => $item['wood_type'] ?? '100% Solid Chittagong Teak Wood',
                'warranty' => $item['warranty'] ?? '5 Years Service Warranty',
            ]);
        }

        $categoryRows = $wp['categories'] ?? [];
        if ($categoryRows === []) {
            $seen = [];
            foreach ($products as $item) {
                foreach ($item['categories'] ?? [] as $index => $slug) {
                    if (isset($seen[$slug])) {
                        continue;
                    }
                    $seen[$slug] = true;
                    $categoryRows[] = [
                        'id' => count($seen),
                        'name' => $item['category_names'][$index] ?? Str::title(str_replace('-', ' ', $slug)),
                        'slug' => $slug,
                    ];
                }
            }
        }

        Category::query()->delete();
        $allProducts = Product::query()->get(['categories']);
        foreach ($categoryRows as $row) {
            $slug = $row['slug'] ?? null;
            if (! $slug) {
                continue;
            }
            $count = $allProducts->filter(fn (Product $p) => in_array($slug, $p->categories ?? [], true))->count();
            Category::query()->create([
                'id' => (int) ($row['id'] ?? abs(crc32($slug))),
                'name' => $row['name'] ?? Str::title(str_replace('-', ' ', $slug)),
                'slug' => $slug,
                'count' => $count.' Items',
                'icon' => null,
            ]);
        }
    }

    private function seedOrders(): void
    {
        $path = storage_path('app/haat-orders.json');
        if (! is_file($path)) {
            return;
        }

        $orders = json_decode((string) file_get_contents($path), true);
        if (! is_array($orders)) {
            return;
        }

        Order::query()->delete();
        foreach ($orders as $item) {
            if (empty($item['id'])) {
                continue;
            }
            $order = Order::query()->create([
                'id' => (string) $item['id'],
                'customer' => $item['customer'] ?? '',
                'phone' => $item['phone'] ?? '',
                'email' => $item['email'] ?? '',
                'address' => $item['address'] ?? '',
                'items' => $item['items'] ?? '',
                'total' => (float) ($item['total'] ?? 0),
                'subtotal' => (float) ($item['subtotal'] ?? 0),
                'shipping' => (float) ($item['shipping'] ?? 0),
                'discount' => (float) ($item['discount'] ?? 0),
                'status' => $item['status'] ?? 'Processing',
                'order_date' => $item['date'] ?? now()->toDateString(),
                'payment' => $item['payment'] ?? 'cod',
                'source' => $item['source'] ?? 'storefront',
            ]);

            if (! empty($item['createdAt'])) {
                $order->created_at = $item['createdAt'];
                $order->save();
            }
        }
    }

    private function seedBanners(): void
    {
        $path = base_path('../frontend/src/app/site-banners.json');
        $banners = [
            'heroOffer' => ['enabled' => true, 'image' => ''],
            'heroSlides' => [],
        ];
        if (is_file($path)) {
            $decoded = json_decode((string) file_get_contents($path), true);
            if (is_array($decoded)) {
                $banners = $decoded;
            }
        }

        SiteSetting::query()->updateOrCreate(
            ['key' => 'banners'],
            ['value' => $banners]
        );
    }
}
