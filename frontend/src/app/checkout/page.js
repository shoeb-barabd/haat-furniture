"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const translations = {
  EN: {
    backToStore: "← Return to Store",
    secureCheckout: "🔒 100% Secure Checkout",
    step1: "1. Cart Items",
    step2: "2. Delivery Info",
    step3: "3. Order Confirmed",
    deliveryTitle: "1. Delivery Information",
    deliverySub: "Please fill in your shipping details below",
    fullNameLabel: "Full Name *",
    fullNamePlaceholder: "e.g. Md. Shariful Islam",
    phoneLabel: "Mobile Number *",
    phonePlaceholder: "e.g. 01700000000",
    areaLabel: "Delivery Area *",
    areaDhaka: "Dhaka City (Free Delivery ৳0)",
    areaSuburbs: "Dhaka Suburbs (Savar/Gazipur ৳500)",
    areaOutside: "Outside Dhaka (All Districts ৳1200)",
    paymentLabel: "Payment Method *",
    paymentCod: "Cash on Delivery (COD)",
    paymentBkash: "bKash / Nagad Online Payment",
    addressLabel: "Full Delivery Address *",
    addressPlaceholder: "e.g. House #45, Road #12, Block #B, Dhaka...",
    orderSummaryTitle: "2. Order Summary",
    itemsCount: "Items",
    remove: "Remove",
    couponLabel: "Promo Coupon Discount",
    couponPlaceholder: "Coupon Code (e.g. HAAT10)",
    applyCoupon: "Apply Coupon",
    couponApplied: "Coupon '{code}' applied successfully!",
    subtotal: "Subtotal:",
    promoDiscount: "Promo Discount:",
    deliveryFee: "Delivery Fee:",
    free: "Free ৳0",
    grandTotal: "Grand Total:",
    confirmOrder: "CONFIRM ORDER",
    processing: "Processing Order...",
    guaranteeNotice: "🛡️ 20 Years Chittagong Segun Guarantee Included",
    invalidCoupon: "Invalid coupon code! Try 'HAAT10' or 'WOOD2000'",
    enterAllDetails: "Please enter your name, mobile number and delivery address.",
    // Confirmation Screen
    orderSuccessBadge: "ORDER CONFIRMED SUCCESSFULLY!",
    thankYou: "Thank You",
    trackingId: "Tracking ID:",
    itemsLabel: "Order Items:",
    paymentMethodLabel: "Payment Method:",
    deliveryAddressLabel: "Delivery Address:",
    whatsappBtn: "Get Instant Updates on WhatsApp",
    continueShopping: "← Continue Shopping"
  },
  BN: {
    backToStore: "← হাাট ফার্নিচার স্টোরে ফিরে যান",
    secureCheckout: "🔒 ১০০% নিরাপদ চেকআউট",
    step1: "১. পণ্য কার্ট",
    step2: "২. ডেলিভারি তথ্য",
    step3: "৩. অর্ডার কনফার্ম",
    deliveryTitle: "১. ডেলিভারি তথ্য প্রদান করুন",
    deliverySub: "পণ্যটি আপনার ঠিকানায় পৌঁছে দেওয়ার জন্য ফর্মটি পূরণ করুন",
    fullNameLabel: "আপনার পূর্ণ নাম *",
    fullNamePlaceholder: "যেমন: মোঃ শরিফুল ইসলাম",
    phoneLabel: "মোবাইল নাম্বার *",
    phonePlaceholder: "যেমন: 01700000000",
    areaLabel: "ডেলিভারি এরিয়া *",
    areaDhaka: "ঢাকা সিটি (ফ্রি হোম ডেলিভারি ৳0)",
    areaSuburbs: "ঢাকার আশপাশে (সাভার/গাজীপুর ৳500)",
    areaOutside: "ঢাকার বাইরে যেকোনো জেলা (৳1200)",
    paymentLabel: "পেমেন্ট পদ্ধতি *",
    paymentCod: "ক্যাশ অন ডেলিভারি (COD)",
    paymentBkash: "বিকাশ / নগদ অনলাইন পেমেন্ট",
    addressLabel: "সম্পূর্ণ ডেলিভারি ঠিকানা *",
    addressPlaceholder: "যেমন: বাসা #৪৫, রোড #১২, ব্লক #বি, ঢাকা...",
    orderSummaryTitle: "২. অর্ডার সামারি",
    itemsCount: "টি আইটেম",
    remove: "রিমুভ",
    couponLabel: "স্মার্ট কুপন ডিসকাউন্ট",
    couponPlaceholder: "কুপন কোড (যেমন: HAAT10)",
    applyCoupon: "কুপন দিন",
    couponApplied: "কুপন '{code}' সফলভাবে যুক্ত হয়েছে!",
    subtotal: "পণ্যের মোট মূল্য:",
    promoDiscount: "প্রমো ডিসকাউন্ট ছাড়:",
    deliveryFee: "ডেলিভারি চার্জ:",
    free: "ফ্রি (Free ৳0)",
    grandTotal: "সর্বমোট প্রদেয় টাকা:",
    confirmOrder: "অর্ডার কনফার্ম করুন",
    processing: "অর্ডার প্রসেস হচ্ছে...",
    guaranteeNotice: "🛡️ ২০ বছরের গ্যারান্টি সহ আসল সেগুন কাঠ ডেলিভারি দেওয়া হবে",
    invalidCoupon: "অবৈধ কুপন কোড! অনুগ্রহ করে 'HAAT10' বা 'WOOD2000' ট্রাই করুন।",
    enterAllDetails: "অনুগ্রহ করে আপনার নাম, মোবাইল নাম্বার এবং সম্পূর্ণ ঠিকানা লিখুন।",
    // Confirmation Screen
    orderSuccessBadge: "অর্ডার সফলভাবে কনফার্ম হয়েছে!",
    thankYou: "ধন্যবাদ",
    trackingId: "আপনার ট্র্যাকিং আইডি:",
    itemsLabel: "পণ্যের বিবরণ:",
    paymentMethodLabel: "পেমেন্ট পদ্ধতি:",
    deliveryAddressLabel: "ডেলিভারি ঠিকানা:",
    whatsappBtn: "হোয়াটসঅ্যাপে তাৎক্ষণিক আপডেট পান",
    continueShopping: "← আরও কেনাকাটা করুন"
  }
};

export default function CheckoutPage() {
  const [lang, setLang] = useState("EN");
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

  const [orderPlaced, setOrderPlaced] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load language preference
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("haat_lang");
      if (savedLang === "BN" || savedLang === "EN") {
        setLang(savedLang);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleLanguage = (selectedLang) => {
    setLang(selectedLang);
    try {
      localStorage.setItem("haat_lang", selectedLang);
    } catch (e) {
      console.error(e);
    }
  };

  const t = translations[lang];

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
      setDeliveryFee(0);
    } else if (district === "Dhaka-Suburbs") {
      setDeliveryFee(500);
    } else {
      setDeliveryFee(1200);
    }
  }, [district]);

  // Smart Promo Coupon Handler
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError("");
    const code = couponCode.trim().toUpperCase();

    if (code === "HAAT10" || code === "HAAT2026") {
      const disc = Math.round(subtotal * 0.10);
      setDiscountAmount(disc);
      setAppliedCoupon(code);
    } else if (code === "SEGUNA2000" || code === "WOOD2000") {
      const disc = Math.min(2000, subtotal);
      setDiscountAmount(disc);
      setAppliedCoupon(code);
    } else {
      setCouponError(t.invalidCoupon);
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
      alert(t.enterAllDetails);
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
              {t.orderSuccessBadge}
            </span>
            <h2 className="text-2xl font-black text-slate-900">{t.thankYou}, {orderPlaced.customer_name}!</h2>
            <p className="text-xs text-slate-500">{t.trackingId} <strong className="text-slate-900 font-mono text-sm">{orderPlaced.order_id}</strong></p>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left text-xs space-y-2.5 text-slate-700">
            <p className="flex justify-between border-b border-slate-200 pb-2">
              <span>{t.itemsLabel}</span>
              <strong className="text-slate-900">{orderPlaced.items.length} {t.itemsCount}</strong>
            </p>
            {orderPlaced.coupon_applied && (
              <p className="flex justify-between border-b border-slate-200 pb-2 text-emerald-600 font-bold">
                <span>{t.promoDiscount} ({orderPlaced.coupon_applied}):</span>
                <span>- ৳ {orderPlaced.discount_amount.toLocaleString()} BDT</span>
              </p>
            )}
            <p className="flex justify-between border-b border-slate-200 pb-2">
              <span>{t.paymentMethodLabel}</span>
              <strong className="text-emerald-600 uppercase font-black">{orderPlaced.payment_method}</strong>
            </p>
            <p className="flex justify-between border-b border-slate-200 pb-2">
              <span>{t.deliveryAddressLabel}</span>
              <strong className="text-slate-900">{orderPlaced.customer_address} ({orderPlaced.district})</strong>
            </p>
            <p className="flex justify-between text-base font-black text-slate-900 pt-1">
              <span>{t.grandTotal}</span>
              <span className="text-emerald-600">৳ {orderPlaced.total.toLocaleString()} BDT</span>
            </p>
          </div>

          <div className="space-y-3">
            <a
              href={`https://wa.me/8809617333990?text=${encodeURIComponent(`Order Confirmation:\nID: ${orderPlaced.order_id}\nName: ${orderPlaced.customer_name}\nPhone: ${orderPlaced.customer_phone}\nAddress: ${orderPlaced.customer_address}\nTotal: ৳${orderPlaced.total}`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 uppercase tracking-wider"
            >
              <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 24 24">
                <path d="M12.031 0C5.393 0 0 5.393 0 12.031c0 2.124.553 4.197 1.604 6.014L.071 23.929l6.046-1.585A11.968 11.968 0 0 0 12.031 24c6.638 0 12.031-5.393 12.031-12.031C24.062 5.393 18.669 0 12.031 0zm0 22.016a9.92 9.92 0 0 1-5.06-1.39l-.363-.216-3.754.984.1-3.659-.237-.377a9.927 9.927 0 0 1-1.528-5.332c0-5.485 4.463-9.948 9.948-9.948 5.485 0 9.948 4.463 9.948 9.948 0 5.485-4.463 9.948-9.948 9.948zm5.452-7.447c-.299-.149-1.768-.873-2.042-.972-.274-.099-.474-.149-.673.149-.199.299-.773.972-.947 1.171-.174.199-.349.224-.648.075-1.768-.883-2.924-1.579-4.091-3.578-.313-.537.313-.498.897-1.666.099-.199.05-.373-.025-.523-.075-.149-.673-1.62-.922-2.217-.242-.583-.488-.504-.673-.513l-.573-.01c-.199 0-.523.075-.797.373-.274.299-1.046 1.021-1.046 2.49 0 1.47 1.071 2.89 1.22 3.089.149.199 2.107 3.218 5.105 4.512 2.138.924 2.977.925 4.02.775 1.127-.162 2.463-1.008 2.808-1.982.348-.974.348-1.808.244-1.982-.099-.174-.299-.273-.598-.423z"/>
              </svg>
              <span>{t.whatsappBtn}</span>
            </a>

            <Link href="/" className="block text-xs font-black text-slate-600 hover:text-slate-900 pt-2 uppercase">
              {t.continueShopping}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased selection:bg-slate-900 selection:text-white">
      
      {/* Top Header with Interactive Language Switcher Toggle */}
      <div className="bg-slate-900 text-white py-3 px-4 sm:px-6 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-amber-400 text-xs hover:underline flex items-center gap-1">
          <span>{t.backToStore}</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 font-bold hidden sm:inline-block">{t.secureCheckout}</span>
          
          {/* EN | BN LANGUAGE SWITCHER TOGGLE */}
          <div className="flex items-center bg-slate-800/90 rounded-full p-1 border border-slate-700 text-[11px] font-black shadow-inner">
            <button
              type="button"
              onClick={() => toggleLanguage("EN")}
              className={`px-3 py-1 rounded-full transition-all duration-300 ${lang === "EN" ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white'}`}
            >
              EN 🇬🇧
            </button>
            <button
              type="button"
              onClick={() => toggleLanguage("BN")}
              className={`px-3 py-1 rounded-full transition-all duration-300 ${lang === "BN" ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold' : 'text-slate-400 hover:text-white'}`}
            >
              BN 🇧🇩
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Step Progress Bar */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm flex items-center justify-around text-xs font-black uppercase tracking-wider">
          <div className="flex items-center gap-2 text-emerald-600">
            <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs">1</span>
            <span>{t.step1}</span>
          </div>
          <div className="h-0.5 w-12 bg-emerald-600 hidden sm:block"></div>
          <div className="flex items-center gap-2 text-slate-900">
            <span className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs">2</span>
            <span>{t.step2}</span>
          </div>
          <div className="h-0.5 w-12 bg-slate-200 hidden sm:block"></div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs">3</span>
            <span>{t.step3}</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Customer Shipping Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-lg font-black text-slate-900">{t.deliveryTitle}</h3>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{t.deliverySub}</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1">{t.fullNameLabel}</label>
                  <input
                    type="text"
                    required
                    placeholder={t.fullNamePlaceholder}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-amber-500 text-xs bg-slate-50/50 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1">{t.phoneLabel}</label>
                  <input
                    type="tel"
                    required
                    placeholder={t.phonePlaceholder}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-amber-500 text-xs bg-slate-50/50 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1">{t.areaLabel}</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3.5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-amber-500 text-xs bg-slate-50/50 font-bold text-slate-800 cursor-pointer"
                    >
                      <option value="Dhaka">{t.areaDhaka}</option>
                      <option value="Dhaka-Suburbs">{t.areaSuburbs}</option>
                      <option value="Outside">{t.areaOutside}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1">{t.paymentLabel}</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3.5 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:border-amber-500 text-xs bg-slate-50/50 font-bold text-slate-800 cursor-pointer"
                    >
                      <option value="cod">{t.paymentCod}</option>
                      <option value="bkash">{t.paymentBkash}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-black text-slate-700 uppercase text-[10px] tracking-wider mb-1">{t.addressLabel}</label>
                  <textarea
                    rows={3}
                    required
                    placeholder={t.addressPlaceholder}
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
                <h3 className="text-lg font-black text-slate-900">{t.orderSummaryTitle}</h3>
                <span className="text-xs text-slate-500 font-bold">{cart.length} {t.itemsCount}</span>
              </div>

              {/* Items List with Quantity Adjuster */}
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
                          {t.remove}
                        </button>
                      </div>
                    </div>

                    <span className="font-black text-emerald-600 text-xs">৳ {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* SMART PROMO COUPON DISCOUNT SYSTEM */}
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-wider">{t.couponLabel}</label>
                
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                    <span>🎉 {t.couponApplied.replace("{code}", appliedCoupon)}</span>
                    <button type="button" onClick={removeCoupon} className="text-red-600 font-black text-xs hover:underline">{t.remove}</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={t.couponPlaceholder}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-amber-500 uppercase font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase"
                    >
                      {t.applyCoupon}
                    </button>
                  </div>
                )}

                {couponError && <p className="text-[10px] font-bold text-red-600">{couponError}</p>}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 border-t border-slate-200 pt-4 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="font-bold text-slate-900">৳ {subtotal.toLocaleString()} BDT</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>{t.promoDiscount}</span>
                    <span>- ৳ {discountAmount.toLocaleString()} BDT</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>{t.deliveryFee} ({district === "Dhaka" ? (lang === "EN" ? "Dhaka Free" : "ঢাকা ফ্রি") : district === "Dhaka-Suburbs" ? (lang === "EN" ? "Suburbs ৳500" : "সাভার/গাজীপুর") : (lang === "EN" ? "Outside ৳1200" : "ঢাকার বাইরে")}):</span>
                  <span className="font-bold text-emerald-600">
                    {deliveryFee === 0 ? t.free : `৳ ${deliveryFee.toLocaleString()} BDT`}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-3">
                  <span>{t.grandTotal}</span>
                  <span className="text-emerald-600">৳ {grandTotal.toLocaleString()} BDT</span>
                </div>
              </div>

              {/* Big Red Confirm Button */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-red-600/30 transition-all hover:scale-102 active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? t.processing : `${t.confirmOrder} (৳ ${grandTotal.toLocaleString()} BDT)`}
              </button>

              <div className="text-center text-[11px] text-slate-400 font-bold pt-1">
                {t.guaranteeNotice}
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
