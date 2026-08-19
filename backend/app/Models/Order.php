<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'customer',
        'phone',
        'email',
        'address',
        'items',
        'total',
        'subtotal',
        'shipping',
        'discount',
        'status',
        'order_date',
        'payment',
        'source',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'float',
            'subtotal' => 'float',
            'shipping' => 'float',
            'discount' => 'float',
            'order_date' => 'date:Y-m-d',
        ];
    }

    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'customer' => $this->customer,
            'phone' => $this->phone,
            'email' => $this->email ?: '',
            'address' => $this->address ?: '',
            'items' => $this->items,
            'total' => (float) $this->total,
            'subtotal' => (float) $this->subtotal,
            'shipping' => (float) $this->shipping,
            'discount' => (float) $this->discount,
            'status' => $this->status,
            'date' => optional($this->order_date)->format('Y-m-d') ?: optional($this->created_at)->toDateString(),
            'payment' => $this->payment ?: 'cod',
            'source' => $this->source ?: 'storefront',
            'createdAt' => optional($this->created_at)?->toIso8601String(),
        ];
    }
}
