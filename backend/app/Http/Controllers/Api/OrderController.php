<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::query()
            ->orderByDesc('created_at')
            ->limit(500)
            ->get()
            ->map(fn (Order $order) => $order->toApiArray())
            ->values();

        return response()->json(['success' => true, 'data' => $orders]);
    }

    public function store(Request $request)
    {
        $customer = trim((string) $request->input('customer', ''));
        $phone = preg_replace('/\s+/', '', (string) $request->input('phone', ''));
        $lines = $request->input('line_items', []);

        if ($customer === '' || $phone === '') {
            return response()->json(['success' => false, 'message' => 'Missing order fields'], 400);
        }

        if (! preg_match('/^01[0-9]{9}$/', $phone)) {
            return response()->json(['success' => false, 'message' => 'Enter a valid 11-digit Bangladeshi phone number'], 400);
        }

        if (! is_array($lines) || $lines === []) {
            return response()->json(['success' => false, 'message' => 'Cart is empty'], 400);
        }

        $subtotal = 0.0;
        $itemLabels = [];

        foreach ($lines as $line) {
            $id = $line['id'] ?? null;
            $qty = (int) ($line['quantity'] ?? $line['qty'] ?? 0);
            if ($id === null || $qty < 1 || $qty > 50) {
                return response()->json(['success' => false, 'message' => 'Invalid cart item'], 400);
            }

            $product = Product::query()->find($id);
            if (! $product) {
                return response()->json(['success' => false, 'message' => 'A product in the cart is no longer available'], 400);
            }

            $lineTotal = (float) $product->price * $qty;
            $subtotal += $lineTotal;
            $itemLabels[] = $product->name.' (x'.$qty.')';
        }

        $district = strtolower(trim((string) $request->input('district', 'Dhaka')));
        $shipping = $district === 'dhaka' ? 60.0 : 150.0;
        $coupon = strtolower(trim((string) $request->input('coupon', '')));
        $discount = in_array($coupon, ['haat10', 'discount'], true) ? round($subtotal * 0.1) : 0.0;
        $total = $subtotal - $discount + $shipping;

        $payment = (string) $request->input('payment', 'cod');
        if (! in_array($payment, ['cod', 'bkash', 'nagad', 'whatsapp'], true)) {
            $payment = 'cod';
        }

        $order = Order::query()->create([
            'id' => 'HF-'.strtoupper(Str::random(6)),
            'customer' => $customer,
            'phone' => $phone,
            'email' => (string) $request->input('email', ''),
            'address' => (string) $request->input('address', ''),
            'items' => implode(', ', $itemLabels),
            'total' => $total,
            'subtotal' => $subtotal,
            'shipping' => $shipping,
            'discount' => $discount,
            'status' => 'Processing',
            'order_date' => now()->toDateString(),
            'payment' => $payment,
            'source' => 'storefront',
        ]);

        $this->mirrorOrdersJson();

        return response()->json(['success' => true, 'data' => $order->toApiArray()]);
    }

    public function updateStatus(Request $request)
    {
        $id = (string) $request->input('id', '');
        $status = trim((string) $request->input('status', ''));
        $allowed = ['Processing', 'Pending', 'Dispatched', 'Delivered', 'Cancelled'];
        if ($id === '' || ! in_array($status, $allowed, true)) {
            return response()->json(['success' => false, 'message' => 'Invalid order status'], 400);
        }

        $order = Order::query()->find($id);
        if (! $order) {
            return response()->json(['success' => false, 'message' => 'Order not found'], 404);
        }

        $order->status = $status;
        $order->save();
        $this->mirrorOrdersJson();

        return response()->json(['success' => true, 'data' => $order->toApiArray()]);
    }

    private function mirrorOrdersJson(): void
    {
        $payload = Order::query()
            ->orderByDesc('created_at')
            ->limit(500)
            ->get()
            ->map(fn (Order $order) => $order->toApiArray())
            ->values()
            ->all();

        file_put_contents(
            storage_path('app/haat-orders.json'),
            json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );
    }
}
