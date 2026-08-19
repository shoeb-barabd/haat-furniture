<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Product extends Model
{
    public $incrementing = false;

    protected $keyType = 'int';

    protected $fillable = [
        'id',
        'name',
        'slug',
        'category',
        'category_slug',
        'price',
        'old_price',
        'rating',
        'reviews',
        'image',
        'badge',
        'description',
        'categories',
        'category_names',
        'gallery',
        'wood_type',
        'warranty',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'float',
            'old_price' => 'float',
            'rating' => 'float',
            'reviews' => 'integer',
            'categories' => 'array',
            'category_names' => 'array',
            'gallery' => 'array',
        ];
    }

    public static function nextId(): int
    {
        $max = (int) static::query()->max('id');
        $fromTime = (int) (microtime(true) * 1000);

        return max($max + 1, $fromTime);
    }

    public function toApiArray(): array
    {
        $categories = $this->categories ?? [];
        $categoryNames = $this->category_names ?? [];
        $gallery = $this->gallery ?? [];
        $oldPrice = $this->old_price;

        return [
            'id' => (string) $this->id,
            'name' => $this->name,
            'slug' => $this->slug ?: Str::slug((string) $this->name),
            'category' => $this->category,
            'category_slug' => $this->category_slug ?: ($categories[0] ?? null),
            'price' => (float) $this->price,
            'oldPrice' => $oldPrice !== null ? (float) $oldPrice : null,
            'old_price' => $oldPrice !== null ? (float) $oldPrice : null,
            'rating' => (float) ($this->rating ?? 4.9),
            'reviews' => (int) ($this->reviews ?? 15),
            'image' => $this->image,
            'badge' => $this->badge ?: '100% Solid Segun',
            'description' => $this->description,
            'categories' => $categories,
            'category_names' => $categoryNames,
            'gallery' => $gallery ?: array_values(array_filter([$this->image])),
            'wood_type' => $this->wood_type ?: '100% Solid Chittagong Teak Wood',
            'warranty' => $this->warranty ?: '5 Years Service Warranty',
        ];
    }
}
