<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->orderByDesc('id');

        $category = $request->query('category');
        $search = strtolower((string) $request->query('search', ''));

        if ($category && $category !== 'all') {
            $query->where(function ($q) use ($category) {
                $q->where('category_slug', $category)
                    ->orWhere('category', $category)
                    ->orWhere('categories', 'like', '%"'.$category.'"%');
            });
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', ['%'.$search.'%'])
                    ->orWhereRaw('LOWER(category) LIKE ?', ['%'.$search.'%']);
            });
        }

        $products = $query->get()->map(fn (Product $p) => $p->toApiArray())->values();

        return response()->json([
            'success' => true,
            'count' => $products->count(),
            'data' => $products,
        ]);
    }

    public function show(string $id)
    {
        $product = Product::query()->find($id);
        if (! $product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        return response()->json(['success' => true, 'data' => $product->toApiArray()]);
    }

    public function store(Request $request)
    {
        $name = trim((string) $request->input('name', ''));
        if ($name === '') {
            return response()->json(['success' => false, 'message' => 'Product name is required'], 400);
        }

        $id = $request->input('id') ?: Product::nextId();
        $categories = $this->asStringList($request->input('categories', []));
        $categoryNames = $this->asStringList($request->input('category_names', []));
        $gallery = $this->asStringList($request->input('gallery', []));
        $image = (string) $request->input('image', 'https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg');
        $categorySlug = (string) ($request->input('category_slug') ?: ($categories[0] ?? 'home-furniture'));
        $categoryName = (string) ($request->input('category') ?: ($categoryNames[0] ?? 'Home Furniture'));

        if ($categories === []) {
            $categories = [$categorySlug];
        }
        if ($categoryNames === []) {
            $categoryNames = [$categoryName];
        }
        if ($gallery === []) {
            $gallery = array_values(array_filter([$image]));
        }

        $product = Product::query()->create([
            'id' => (int) $id,
            'name' => $name,
            'slug' => Str::slug($name) ?: ('product-'.$id),
            'category' => $categoryName,
            'category_slug' => $categorySlug,
            'price' => (float) $request->input('price', 0),
            'old_price' => $this->nullableNumber($request->input('oldPrice', $request->input('old_price'))),
            'rating' => (float) $request->input('rating', 4.9),
            'reviews' => (int) $request->input('reviews', 15),
            'image' => $image,
            'badge' => (string) $request->input('badge', 'New Arrival'),
            'description' => (string) $request->input('description', 'Solid Chittagong Segun Teak Wood.'),
            'categories' => $categories,
            'category_names' => $categoryNames,
            'gallery' => $gallery,
            'wood_type' => (string) $request->input('wood_type', '100% Solid Chittagong Teak Wood'),
            'warranty' => (string) $request->input('warranty', '5 Years Service Warranty'),
        ]);

        $this->refreshCategoryCounts();

        return response()->json([
            'success' => true,
            'message' => 'Product published to storefront!',
            'data' => $product->toApiArray(),
        ]);
    }

    public function update(Request $request)
    {
        $id = $request->input('id');
        if ($id === null || $id === '') {
            return response()->json(['success' => false, 'message' => 'Missing product ID'], 400);
        }

        $product = Product::query()->find($id);
        if (! $product) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        $payload = [
            'name' => $request->input('name', $product->name),
            'price' => $request->has('price') ? (float) $request->input('price') : $product->price,
            'image' => $request->input('image', $product->image),
            'description' => $request->input('description', $product->description),
        ];

        if ($request->exists('oldPrice') || $request->exists('old_price')) {
            $payload['old_price'] = $this->nullableNumber($request->input('oldPrice', $request->input('old_price')));
        }
        if ($request->filled('category')) {
            $payload['category'] = $request->input('category');
        }
        if ($request->filled('category_slug')) {
            $payload['category_slug'] = $request->input('category_slug');
        }
        if ($request->has('gallery') && is_array($request->input('gallery')) && count($request->input('gallery')) > 0) {
            $payload['gallery'] = $this->asStringList($request->input('gallery'));
        }
        if ($request->has('categories')) {
            $payload['categories'] = $this->asStringList($request->input('categories'));
        }
        if ($request->has('category_names')) {
            $payload['category_names'] = $this->asStringList($request->input('category_names'));
        }
        if ($request->filled('wood_type')) {
            $payload['wood_type'] = $request->input('wood_type');
        }
        if ($request->filled('warranty')) {
            $payload['warranty'] = $request->input('warranty');
        }
        if ($request->filled('badge')) {
            $payload['badge'] = $request->input('badge');
        }
        if ($request->filled('name')) {
            $payload['slug'] = Str::slug((string) $request->input('name')) ?: $product->slug;
        }

        $product->fill($payload);
        $product->save();
        $this->refreshCategoryCounts();

        return response()->json([
            'success' => true,
            'message' => 'Storefront updated live!',
            'data' => $product->toApiArray(),
        ]);
    }

    public function destroy(Request $request, ?string $id = null)
    {
        $targetId = $id ?: $request->query('id');
        if (! $targetId) {
            return response()->json(['success' => false, 'message' => 'Missing product ID'], 400);
        }

        $deleted = Product::query()->where('id', $targetId)->delete();
        if (! $deleted) {
            return response()->json(['success' => false, 'message' => 'Product not found'], 404);
        }

        $this->refreshCategoryCounts();

        return response()->json(['success' => true, 'message' => 'Product deleted from storefront!']);
    }

    public function bulkDiscount(Request $request)
    {
        $admin = $request->attributes->get('haat_admin') ?? [];
        if (($admin['role'] ?? '') !== 'sudo') {
            return response()->json(['success' => false, 'message' => 'Only sudoadmin can apply bulk discount'], 403);
        }

        $percent = (int) $request->input('percent', 0);
        $category = (string) $request->input('category', 'all');
        if ($percent < 1 || $percent > 50) {
            return response()->json(['success' => false, 'message' => 'Discount must be 1–50%'], 400);
        }

        $factor = (100 - $percent) / 100;
        $updated = 0;
        Product::query()->each(function (Product $product) use ($category, $factor, &$updated) {
            $cats = $product->categories ?? [];
            if ($category !== 'all' && ! in_array($category, $cats, true) && $product->category_slug !== $category) {
                return;
            }
            $current = (float) $product->price;
            if ($current <= 0) {
                return;
            }
            $product->old_price = $current;
            $product->price = round($current * $factor);
            $product->save();
            $updated++;
        });

        return response()->json([
            'success' => true,
            'message' => "Applied {$percent}% discount to {$updated} products",
            'count' => $updated,
        ]);
    }

    private function refreshCategoryCounts(): void
    {
        $products = Product::query()->get(['categories']);
        Category::query()->each(function (Category $category) use ($products) {
            $count = $products->filter(function (Product $product) use ($category) {
                return in_array($category->slug, $product->categories ?? [], true);
            })->count();
            $category->count = $count.' Items';
            $category->save();
        });
    }

    private function asStringList(mixed $value): array
    {
        if (! is_array($value)) {
            return [];
        }

        return array_values(array_filter(array_map(fn ($item) => is_string($item) ? trim($item) : (string) $item, $value)));
    }

    private function nullableNumber(mixed $value): ?float
    {
        if ($value === null || $value === '') {
            return null;
        }

        return (float) $value;
    }
}
