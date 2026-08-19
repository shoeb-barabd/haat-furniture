<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::query()
            ->orderBy('name')
            ->get()
            ->map(fn (Category $c) => $c->toApiArray())
            ->values();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $name = trim((string) $request->input('name', ''));
        if ($name === '') {
            return response()->json(['success' => false, 'message' => 'Category name is required'], 400);
        }

        $slug = Str::slug((string) ($request->input('slug') ?: $name));
        if ($slug === '') {
            $slug = 'category-'.time();
        }
        if (Category::query()->where('slug', $slug)->exists()) {
            return response()->json(['success' => false, 'message' => 'Slug already exists'], 400);
        }

        $id = (int) (Category::query()->max('id') ?: 0) + 1;
        $count = Product::query()->get(['categories'])->filter(function (Product $p) use ($slug) {
            return in_array($slug, $p->categories ?? [], true);
        })->count();

        $category = Category::query()->create([
            'id' => $id,
            'name' => $name,
            'slug' => $slug,
            'icon' => (string) ($request->input('icon') ?: '🪑'),
            'count' => $count.' Items',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category saved',
            'data' => $category->toApiArray(),
        ]);
    }

    public function update(Request $request)
    {
        $id = $request->input('id');
        $category = Category::query()->find($id);
        if (! $category) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        }

        if ($request->filled('name')) {
            $category->name = trim((string) $request->input('name'));
        }
        if ($request->filled('icon')) {
            $category->icon = (string) $request->input('icon');
        }
        if ($request->filled('slug')) {
            $slug = Str::slug((string) $request->input('slug'));
            if ($slug && $slug !== $category->slug && Category::query()->where('slug', $slug)->where('id', '!=', $category->id)->exists()) {
                return response()->json(['success' => false, 'message' => 'Slug already exists'], 400);
            }
            if ($slug) {
                $category->slug = $slug;
            }
        }
        $category->save();

        return response()->json([
            'success' => true,
            'message' => 'Category updated',
            'data' => $category->toApiArray(),
        ]);
    }

    public function destroy(Request $request, ?string $id = null)
    {
        $targetId = $id ?: $request->query('id') ?: $request->input('id');
        $category = Category::query()->find($targetId);
        if (! $category) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        }
        $category->delete();

        return response()->json(['success' => true, 'message' => 'Category deleted']);
    }
}
