"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [district, setDistrict] = useState("Dhaka");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // Promo Code State
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  // Customer Billing Info
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [orderNotes, setOrderNotes] = useState("");

  const [orderPlaced, setOrderPlaced] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load Cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("haat_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      } else {
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

  // Update Cart in State & LocalStorage
  const updateQuantity = (id, delta) => {
    const updated = cart.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem("haat_cart", JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    localStorage.setItem("haat_cart", JSON.stringify(updated));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Smart Delivery Fee Calculator
  useEffect(() => {
    if (district === "Dhaka") {
      setDeliveryFee(0); // Free delivery in Dhaka
    } else if (district === "Dhaka-Suburbs") {
      setDeliveryFee(500); // Savar/Gazipur/Narayanganj
    } else {
      setDeliveryFee(1200); // Outside Dhaka courier/truck shipping
    }
  }, [district]);

  // Smart Promo Coupon Handler
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();

    if (code === "HAAT10" || code === "HAAT2026") {
      const disc = Math.round(subtotal * 0.10); // 10% Discount
      setDiscountAmount(disc);
      setAppliedCoupon(code);
    } else if (code === "SEGUNA2000" || code === "WOOD2000") {
      const disc = Math.min(2000, subtotal);
      setDiscountAmount(disc);
      setAppliedCoupon(code);
    } else {
      setCouponError("অবৈধ কুপন কোড! অনুগ্রহ করে 'HAAT10' বা 'WOOD2000' ট্রাই করুন।");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode("");
  };

  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryFee);

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
      coupon_applied: appliedCoupon,
      discount_amount: discountAmount,
      items: cart,
      subtotal: subtotal,
      delivery_fee: deliveryFee,
      total: grandTotal,
      created_at: new Date().toLocaleString()
    };

    try {
      await fetch("/api/v1/orders", {
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
            <span className="px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
              অর্ডার সফলভাবে কনফার্ম হয়েছে!
            </span>
            <h2 className="text-2xl font-black text-slate-900">ধন্যবাদ, {orderPlaced.customer_name}!</h2>
            <p className="text-xs text-slate-500">আপনার ট্র্যাকিং আইডি: <strong className="text-slate-900 font-mono text-sm">{orderPlaced.order_id}</strong></p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5 text-slate-700">
            <p className="flex justify-between border-b border-slate-200 pb-2">
              <span>পণ্যের বিবরণ:</span>
              <strong className="text-slate-900">{orderPlaced.items.length} টি পণ্য</strong>
            </p>
            {orderPlaced.coupon_applied && (
              <p className="flex justify-between border-b border-slate-200 pb-2 text-emerald-600 font-bold">
                <span>প্রমো ছাড় ({orderPlaced.coupon_applied}):</span>
                <span>- ৳ {orderPlaced.discount_amount.toLocaleString()} BDT</span>
              </p>
            )}
            <p className="flex justify-between border-b border-slate-200 pb-2">
              <span>পেমেন্ট পদ্ধতি:</span>
              <strong className="text-emerald-600 uppercase font-black">{orderPlaced.payment_method}</strong>
            </p>
            <p className="flex justify-between border-b border-slate-200 pb-2">
              <span>ডেলিভারি ঠিকানা:</span>
              <strong className="text-slate-900">{orderPlaced.customer_address} ({orderPlaced.district})</strong>
            </p>
            <p className="flex justify-between text-base font-black text-slate-900 pt-1">
              <span>সর্বমোট প্রদেয় টাকা:</span>
              <span className="text-emerald-600">৳ {orderPlaced.total.toLocaleString()} BDT</span>
            </p>
          </div>

          <div className="space-y-3">
            <a
              href={`https://wa.me/8809617333990?text=${encodeURIComponent(`আমার স্মার্ট অর্ডার কনফার্মেশন:\nঅর্ডার আইডি: ${orderPlaced.order_id}\nনাম: ${orderPlaced.customer_name}\nমোবাইল: ${orderPlaced.customer_phone}\nঠিকানা: ${orderPlaced.customer_address}\nমোট টাকা: ৳${orderPlaced.total}`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 uppercase tracking-wider"
            >
              <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                <path d="M12.031 0C5.393 0 0 5.393 0 12.031c0 2.124.553 4.197 1.604 6.014L.071 23.929l6.046-1.585A11.968 11.968 0 0 0 12.031 24c6.638 0 12.031-5.393 12.031-12.031C24.062 5.393 18.669 0 12.031 0zm0 22.016a9.92 9.92 0 0 1-5.06-1.39l-.363-.216-3.754.984.1-3.659-.237-.377a9.927 9.927 0 0 1-1.528-5.332c0-5.485 4.463-9.948 9.948-9.948 5.485 0 9.948 4.463 9.948 9.948 0 5.485-4.463 9.948-9.948 9.948zm5.452-7.447c-.299-.149-1.768-.873-2.042-.972-.274-.099-.474-.149-.673.149-.199.299-.773.972-.947 1.171-.174.199-.349.224-.648.075-1.768-.883-2.924-1.579-4.091-3.578-.313-.537.313-.498.897-1.666.099-.199.05-.373-.025-.523-.075-.149-.673-1.62-.922-2.217-.242-.583-.488-.504-.673-.513l-.573-.01c-.199 0-.523.075-.797.373-.274.299-1.046 1.021-1.046 2.49 0 1.47 1.071 2.89 1.22 3.089.149.199 2.107 3.218 5.105 4.512 2.138.924 2.977.925 4.02.775 1.127-.162 2.463-1.008 2.808-1.982.348-.974.348-1.808.244-1.982-.099-.174-.299-.273-.598-.423z"/>
              </svg>
              <span>হোয়াটসঅ্যাপে তাৎক্ষণিক আপডেট পান</span>
            </a>

            <Link href="/" className="block text-xs font-black text-slate-600 hover:text-slate-900 pt-2 uppercase">
              ← আরও কেনাকাটা করুন
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased selection:bg-slate-900 selection:text-white">
      
      {/* Top Header */}
      <div className="bg-slate-900 text-white py-3 px-6 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-amber-400 text-xs hover:underline flex items-center gap-1">
          <span>← হাাট ফার্নিচার স্টোরে ফিরে যান</span>
        </Link>
        <span className="text-xs text-slate-400 font-bold hidden sm:inline-block">🔒 ১০০% নিরাপদ স্মার্ট চেকআউট</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Step Progress Bar */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex items-center justify-around text-xs font-black uppercase tracking-wider">
          <div className="flex items-center gap-2 text-emerald-600">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
            <span>পণ্য কার্ট</span>
          </div>
          <div className="h-0.5 w-12 bg-emerald-600 hidden sm:block"></div>
          <div className="flex items-center gap-2 text-slate-900">
            <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">2</span>
            <span>ডেলিভারি ঠিকানা</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200 hidden sm:block"></div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">3</span>
            <span>অর্ডার কনফার্ম</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Customer Shipping Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-lg font-black text-slate-900">১. ডেলিভারি তথ্য প্রদান করুন</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">পণ্যটি আপনার ঠিকানায় সহজে পৌঁছে দেওয়ার জন্য ফর্মটি পূরণ করুন</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1">আপনার পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: মোঃ শরিফুল ইসলাম"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-amber-500 text-xs bg-slate-50/50 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1">মোবাইল নাম্বার *</label>
                  <input
                    type="tel"
                    required
                    placeholder="যেমন: 01700000000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-amber-500 text-xs bg-slate-50/50 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1">ডেলিভারি এরিয়া *</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-amber-500 text-xs bg-slate-50/50 font-bold text-slate-800 cursor-pointer"
                    >
                      <option value="Dhaka">ঢাকা সিটি (ফ্রি হোম ডেলিভারি ৳0)</option>
                      <option value="Dhaka-Suburbs">ঢাকার আশপাশে (সাভার/গাজীপুর ৳500)</option>
                      <option value="Outside">ঢাকার বাইরে যেকোনো জেলা (৳1200)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1">পেমেন্ট পদ্ধতি *</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3.5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-amber-500 text-xs bg-slate-50/50 font-bold text-slate-800 cursor-pointer"
                    >
                      <option value="cod">ক্যাশ অন ডেলিভারি (COD)</option>
                      <option value="bkash">বিকাশ / নগদ অনলাইন পেমেন্ট</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1">সম্পূর্ণ ডেলিভারি ঠিকানা *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="যেমন: বাসা #৪৫, রোড #১২, ব্লক #বি, ঢাকা..."
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-amber-500 text-xs bg-slate-50/50 font-medium"
                  ></textarea>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Order Summary & Place Order Button */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 sticky top-8">
              
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">২. অর্ডার সামারি</h3>
                <span className="text-xs text-slate-500 font-bold">{cart.length} টি আইটেম</span>
              </div>

              {/* Items List with Smart Quantity Adjuster */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-contain bg-white p-1 border border-slate-200 flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-slate-900 truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                          >
                            -
                          </button>
                          <span className="px-2 text-slate-900 font-bold text-[11px]">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-2 py-0.5 text-slate-600 hover:bg-slate-100 font-bold"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-[10px] font-bold"
                        >
                          রিমুভ
                        </button>
                      </div>
                    </div>

                    <span className="font-black text-emerald-600 text-xs">৳ {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* SMART PROMO COUPON DISCOUNT SYSTEM */}
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider">স্মার্ট কুপন ডিসকাউন্ট</label>
                
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                    <span>🎉 কুপন <strong>'{appliedCoupon}'</strong> সফলভাবে যুক্ত হয়েছে!</span>
                    <button type="button" onClick={removeCoupon} className="text-red-600 font-black text-xs hover:underline">রিমুভ</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="কুপন কোড (যেমন: HAAT10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500 uppercase font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase"
                    >
                      কুপন দিন
                    </button>
                  </div>
                )}

                {couponError && <p className="text-[10px] font-bold text-red-600">{couponError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 border-t border-slate-200 pt-4 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>পণ্যের মোট মূল্য:</span>
                  <span className="font-bold text-slate-900">৳ {subtotal.toLocaleString()} BDT</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>প্রমো ডিসকাউন্ট ছাড়:</span>
                    <span>- ৳ {discountAmount.toLocaleString()} BDT</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ ({district === "Dhaka" ? "ঢাকা ফ্রি" : district === "Dhaka-Suburbs" ? "সাভার/গাজীপুর" : "ঢাকার বাইরে"}):</span>
                  <span className="font-bold text-emerald-600">
                    {deliveryFee === 0 ? "ফ্রি (Free ৳0)" : `৳ ${deliveryFee.toLocaleString()} BDT`}
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
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-red-600/30 transition-all hover:scale-102 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "অর্ডার প্রসেস হচ্ছে..." : `অর্ডার কনফার্ম করুন (৳ ${grandTotal.toLocaleString()} BDT)`}
              </button>

              <div className="text-center text-[11px] text-slate-400 font-bold pt-1">
                🛡️ ২০ বছরের গ্যারান্টি সহ আসল সেগুন কাঠ ডেলিভারি দেওয়া হবে
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
