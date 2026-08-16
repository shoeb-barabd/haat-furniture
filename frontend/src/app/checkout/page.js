"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [district, setDistrict] = useState("Dhaka");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Customer Billing Info
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  const [orderPlaced, setOrderPlaced] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Cart from localStorage or mock item
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("haat_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
        // Sample item if cart is empty for previewing
        setCart([
          {
            id: 1,
            name: "Lily 3-Door Solid Segun Almirah",
            price: 22500,
            quantity: 1,
            image: "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg"
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Update delivery fee based on zone
  useEffect(() => {
    if (district === "Dhaka") {
      setDeliveryFee(0); // Free delivery in Dhaka
    } else {
      setDeliveryFee(1500); // Outside Dhaka courier/truck shipping
    }
  }, [district]);

  const grandTotal = subtotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerAddress) {
      alert("অনুগ্রহ করে আপনার নাম, মোবাইল নাম্বার এবং সম্পূর্ণ ঠিকানা লিখুন।");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      order_id: `HAAT-${Math.floor(100000 + Math.random() * 900000)}`,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      district: district,
      payment_method: paymentMethod,
      items: cart,
      subtotal: subtotal,
      delivery_fee: deliveryFee,
      total: grandTotal,
      created_at: new Date().toLocaleString()
    };

    try {
      // Post order to Laravel API backend
      await fetch("http://localhost:8000/api/v1/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
    } catch (err) {
      console.log("Saving locally fallback", err);
    }

    setIsSubmitting(false);
    setOrderPlaced(orderData);
    localStorage.removeItem("haat_cart");
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 space-y-6 text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto animate-bounce">
            ✓
          </div>

          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase">
              অর্ডার সফল হয়েছে!
            </span>
            <h2 className="text-2xl font-black text-slate-900">ধন্যবাদ, {orderPlaced.customer_name}!</h2>
            <p className="text-xs text-slate-500">আপনার অর্ডার আইডি: <strong className="text-slate-900">{orderPlaced.order_id}</strong></p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2 text-slate-700">
            <p className="flex justify-between border-b border-slate-200 pb-2">
              <span>অর্ডারের পরিমাণ:</span>
              <strong className="text-slate-900">{orderPlaced.items.length} টি পণ্য</strong>
            </p>
            <p className="flex justify-between border-b border-slate-200 pb-2">
              <span>পেমেন্ট মেথড:</span>
              <strong className="text-emerald-600 uppercase">{orderPlaced.payment_method}</strong>
            </p>
            <p className="flex justify-between border-b border-slate-200 pb-2">
              <span>ডেলিভারি ঠিকানা:</span>
              <strong className="text-slate-900">{orderPlaced.customer_address} ({orderPlaced.district})</strong>
            </p>
            <p className="flex justify-between text-sm font-black text-slate-900 pt-1">
              <span>সর্বমোট মূল্য:</span>
              <span className="text-emerald-600">৳ {orderPlaced.total.toLocaleString()} BDT</span>
            </p>
          </div>

          <div className="space-y-3">
            <a
              href={`https://wa.me/8809617333990?text=${encodeURIComponent(`আমার অর্ডার কনফার্মেশন:\nঅর্ডার আইডি: ${orderPlaced.order_id}\nনাম: ${orderPlaced.customer_name}\nমোবাইল: ${orderPlaced.customer_phone}\nমোট টাকা: ৳${orderPlaced.total}`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
            >
              <span>💬</span>
              <span>হোয়াটসঅ্যাপে আপডেট পান</span>
            </a>

            <Link href="/" className="block text-xs font-bold text-slate-600 hover:text-slate-900 pt-2">
              ← আরও কেনাকাটা করুন
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased">
      
      {/* Top Header */}
      <div className="bg-slate-900 text-white py-3 px-6 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-blue-400 text-xs hover:underline flex items-center gap-1">
          <span>← হাাট ফার্নিচার স্টোরে ফিরে যান</span>
        </Link>
        <span className="text-xs text-slate-400">🔒 ১০০% নিরাপদ সহজ চেকআউট</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Step Progress Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-around text-xs font-bold">
          <div className="flex items-center gap-2 text-emerald-600">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
            <span>পণ্য নির্বাচন</span>
          </div>
          <div className="h-0.5 w-12 bg-emerald-600 hidden sm:block"></div>
          <div className="flex items-center gap-2 text-blue-600">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
            <span>শিপিং ঠিকানা</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200 hidden sm:block"></div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">3</span>
            <span>অর্ডার কনফার্ম</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Customer Shipping Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-lg font-black text-slate-900">১. ডেলিভারি তথ্য প্রদান করুন</h3>
                <p className="text-xs text-slate-500 mt-0.5">পণ্যটি আপনার ঠিকানায় সহজে পৌঁছে দেওয়ার জন্য ফর্মটি পূরণ করুন</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">আপনার পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোঃ শরিফুল ইসলাম"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-xs bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">মোবাইল নাম্বার *</label>
                  <input
                    type="tel"
                    required
                    placeholder="যেমন: 01700000000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-xs bg-slate-50/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ডেলিভারি এরিয়া *</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-xs bg-slate-50/50 font-bold text-slate-800"
                    >
                      <option value="Dhaka">ঢাকা সিটি (ফ্রি হোম ডেলিভারি)</option>
                      <option value="Outside">ঢাকার বাইরে (কুরিয়ার/ট্রাক)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পেমেন্ট পদ্ধতি *</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-xs bg-slate-50/50 font-bold text-slate-800"
                    >
                      <option value="cod">ক্যাশ অন ডেলিভারি (COD)</option>
                      <option value="bkash">বিকাশ / নগদ অনলাইন পেমেন্ট</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">সম্পূর্ণ ডেলিভারি ঠিকানা *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="যেমন: বাসা #৪৫, রোড #১২, ব্লক #বি, ঢাকা..."
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-blue-600 text-xs bg-slate-50/50"
                  ></textarea>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Order Summary & Place Order Button */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 sticky top-8">
              
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-lg font-black text-slate-900">২. অর্ডার সামারি</h3>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-contain bg-white p-1 border border-slate-200" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 truncate">{item.name}</h4>
                      <p className="text-slate-500">পরিমাণ: {item.quantity} টি</p>
                    </div>
                    <span className="font-black text-emerald-600">৳ {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 border-t border-slate-200 pt-4 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>পণ্যের মোট মূল্য:</span>
                  <span className="font-bold text-slate-900">৳ {subtotal.toLocaleString()} BDT</span>
                </div>
                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ ({district === "Dhaka" ? "ঢাকা ফ্রি" : "ঢাকার বাইরে"}):</span>
                  <span className="font-bold text-emerald-600">
                    {deliveryFee === 0 ? "ফ্রি (Free)" : `৳ ${deliveryFee.toLocaleString()} BDT`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-3">
                  <span>সর্বমোট প্রদেয় টাকা:</span>
                  <span className="text-emerald-600">৳ {grandTotal.toLocaleString()} BDT</span>
                </div>
              </div>

              {/* Big Red Confirm Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "অর্ডার প্রসেস হচ্ছে..." : `অর্ডার কনফার্ম করুন (৳ ${grandTotal.toLocaleString()} BDT)`}
              </button>

              <div className="text-center text-[11px] text-slate-400 pt-1">
                🛡️ ২০ বছরের গ্যারান্টি সহ আসল সেগুন কাঠ ডেলিভারি দেওয়া হবে
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
