'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [confirmedOrderData, setConfirmedOrderData] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    country: 'Bangladesh',
    streetAddress: '',
    apartment: '',
    city: 'Dhaka',
    district: 'Dhaka',
    postcode: '1212',
    phone: '',
    email: '',
    orderNotes: '',
    bkashTrxId: ''
  });

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('haat_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        if (parsed.length > 0) {
          setCart(parsed);
        } else {
          setCart(getSampleCart());
        }
      } else {
        setCart(getSampleCart());
      }
    } catch (e) {
      setCart(getSampleCart());
    }
  }, []);

  const getSampleCart = () => [
    { id: 105, name: "Wheel Bed", price: 23000, quantity: 1, image: "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg" }
  ];

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = formData.district === 'Dhaka' ? 60 : 150;
  const discountAmount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const grandTotal = subtotal - discountAmount + shippingFee;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toLowerCase() === 'haat10' || couponCode.toLowerCase() === 'discount') {
      setCouponApplied(true);
      alert('10% Coupon Discount Applied!');
    } else {
      alert('Invalid coupon code. Try "HAAT10"');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.phone || !formData.streetAddress) {
      alert('Please fill in required fields (First name, Phone, Street address)');
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      orderId: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      customer: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone,
      address: `${formData.streetAddress}, ${formData.district}`,
      items: cart.map(c => `${c.name} (x${c.quantity})`).join(', '),
      total: grandTotal,
      subtotal: subtotal,
      shipping: shippingFee,
      status: 'Processing',
      date: new Date().toISOString().split('T')[0]
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmedOrderData(orderPayload);
      setOrderSuccess(true);
      localStorage.removeItem('haat_cart');
    }, 1000);
  };

  if (orderSuccess && confirmedOrderData) {
    return (
      <div className="min-h-screen bg-[#fbf9f5] text-slate-800 font-sans antialiased">
        <div className="bg-[#0b0c10] text-white py-6 px-4 text-center border-b border-amber-500/20">
          <div className="flex items-center justify-center gap-4 text-xs font-black uppercase tracking-wider">
            <span className="text-slate-400">SHOPPING CART ✓</span>
            <span className="text-slate-400">→</span>
            <span className="text-slate-400">CHECKOUT ✓</span>
            <span className="text-slate-400">→</span>
            <span className="text-amber-400 font-black">ORDER COMPLETE 🎉</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-200 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto font-black shadow-inner">
              ✓
            </div>
            <h1 className="text-3xl font-black text-slate-900 font-serif-luxury">Thank You! Your Order is Received.</h1>
            <p className="text-xs text-slate-500 font-medium">Order Reference #: <strong className="text-slate-900 font-mono text-sm">{confirmedOrderData.orderId}</strong> | Date: {confirmedOrderData.date}</p>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-left space-y-3 text-xs font-medium">
              <h3 className="font-black text-slate-900 text-sm border-b border-slate-200 pb-2 uppercase tracking-wider">Order Summary</h3>
              <p><strong>Customer:</strong> {confirmedOrderData.customer} ({confirmedOrderData.phone})</p>
              <p><strong>Delivery Address:</strong> {confirmedOrderData.address}</p>
              <p><strong>Items:</strong> {confirmedOrderData.items}</p>
              <div className="flex justify-between pt-3 text-base font-black text-slate-900 border-t">
                <span>Total Amount:</span>
                <span className="text-lime-600">৳ {confirmedOrderData.total.toLocaleString()} BDT</span>
              </div>
            </div>

            <Link href="/" className="inline-block bg-slate-900 hover:bg-amber-600 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition">
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-slate-800 font-sans antialiased">
      
      {/* 1. BRAND HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="https://haatfurniture.com/wp-content/uploads/2023/02/haalogo.jpg" 
              alt="HAAT FURNITURE LIMITED" 
              className="h-10 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-9 h-9 rounded-full bg-lime-600 text-white flex items-center justify-center text-base font-bold">📞</span>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Hotline</p>
                <p className="text-xs font-bold text-slate-800">+8809617333990</p>
              </div>
            </div>

            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black flex items-center gap-1.5">
              <span>🔒</span> 256-Bit SSL Secure Checkout
            </span>
          </div>
        </div>
      </header>

      {/* 2. PROGRESS STEPPER RIBBON */}
      <div className="bg-[#0b0c10] text-white py-4 px-4 text-center border-b border-amber-500/20">
        <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider">
          <span className="text-slate-400">SHOPPING CART</span>
          <span className="text-slate-500">→</span>
          <span className="text-amber-400 font-black border-b-2 border-amber-400 pb-0.5">2. CHECKOUT & BILLING</span>
          <span className="text-slate-500">→</span>
          <span className="text-slate-400">3. ORDER COMPLETE</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* COUPON TOGGLE */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-slate-600 font-medium">Have a discount coupon? </span>
            <button 
              type="button"
              onClick={() => setShowCouponInput(!showCouponInput)} 
              className="text-amber-700 font-black hover:underline"
            >
              Click here to enter your coupon code
            </button>
          </div>
        </div>

        {showCouponInput && (
          <form onSubmit={handleApplyCoupon} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Enter code (e.g. HAAT10)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-600 w-64 font-bold"
            />
            <button type="submit" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-amber-600 transition shadow">
              Apply Coupon
            </button>
          </form>
        )}

        {/* MAIN CHECKOUT FORM */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: BILLING & SHIPPING FORM (CLEAN NO-PURPLE BORDERS) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 font-serif-luxury">
              Billing & Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">First name <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="Mahin"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-amber-600 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Last name <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  placeholder="Ahmed"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-amber-600 transition"
                />
              </div>

            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700">Company name (optional)</label>
              <input 
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-amber-600 transition"
              />
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700">Country / Region <span className="text-red-500">*</span></label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-amber-600"
              >
                <option value="Bangladesh">Bangladesh</option>
              </select>
            </div>

            <div className="space-y-3 text-xs">
              <label className="font-bold text-slate-700">Street address <span className="text-red-500">*</span></label>
              <input 
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                required
                placeholder="House #, Road #, Area name (e.g. Badda, Dhaka)"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-amber-600 transition"
              />
              <input 
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleInputChange}
                placeholder="Apartment, suite, unit, etc. (optional)"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-amber-600 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Town / City <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Dhaka"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-amber-600 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">District <span className="text-red-500">*</span></label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-amber-600"
                >
                  <option value="Dhaka">Dhaka (৳60 Delivery)</option>
                  <option value="Chittagong">Chittagong (৳150 Delivery)</option>
                  <option value="Gazipur">Gazipur</option>
                  <option value="Narayanganj">Narayanganj</option>
                  <option value="Sylhet">Sylhet</option>
                  <option value="Rajshahi">Rajshahi</option>
                  <option value="Khulna">Khulna</option>
                  <option value="Barisal">Barisal</option>
                  <option value="Rangpur">Rangpur</option>
                  <option value="Mymensingh">Mymensingh</option>
                  <option value="Other">Other District</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Phone <span className="text-red-500">*</span></label>
                <input 
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="01957909186"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-bold focus:outline-none focus:border-amber-600 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Email address <span className="text-red-500">*</span></label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="haatfurniture@gmail.com"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-amber-600 transition"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <label className="font-bold text-slate-700">Order notes (optional)</label>
              <textarea
                name="orderNotes"
                value={formData.orderNotes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Special notes for home delivery, wood finish preferences..."
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none focus:border-amber-600 transition"
              />
            </div>

          </div>

          {/* RIGHT COLUMN: YOUR ORDER (TICKET / RECEIPT CARD STYLE) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md relative space-y-6">
              
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wider text-center border-b border-slate-100 pb-3 font-serif-luxury">
                Your Order Summary
              </h2>

              {/* Order Table */}
              <div className="space-y-3 text-xs border-b border-slate-200 pb-4">
                <div className="flex justify-between font-black text-slate-900 border-b border-slate-100 pb-2 uppercase text-[10px]">
                  <span>PRODUCT</span>
                  <span>SUBTOTAL</span>
                </div>

                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-slate-800 py-2 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded-lg border bg-slate-50 p-0.5" />
                      <span className="font-bold line-clamp-1 max-w-[180px]">{item.name} × {item.quantity}</span>
                    </div>
                    <span className="font-black text-slate-900 whitespace-nowrap">৳ {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}

                <div className="flex justify-between font-bold text-slate-800 pt-2">
                  <span>Subtotal</span>
                  <span className="text-lime-600 font-black">৳ {subtotal.toLocaleString()} BDT</span>
                </div>

                <div className="flex justify-between text-slate-700 py-1 font-medium">
                  <span>Shipping Fee ({formData.district})</span>
                  <span className="font-bold text-slate-900">৳ {shippingFee}</span>
                </div>

                <div className="flex justify-between font-black text-base text-slate-900 pt-3 border-t border-slate-200">
                  <span>TOTAL AMOUNT:</span>
                  <span className="text-lime-600 text-xl font-black">৳ {grandTotal.toLocaleString()} BDT</span>
                </div>
              </div>

              {/* PAYMENT METHOD SELECTION */}
              <div className="space-y-4 text-xs">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-bold text-slate-900 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-amber-600 w-4 h-4"
                    />
                    <span>Cash on Delivery (Home Delivery)</span>
                  </label>

                  {paymentMethod === 'cod' && (
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-slate-600 font-medium text-[11px]">
                      Pay cash upon home delivery. Safe & secure Chittagong Segun furniture delivery.
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-bold text-slate-900 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="bkash" 
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="accent-amber-600 w-4 h-4"
                    />
                    <span>bKash / Nagad / Mobile Banking</span>
                  </label>

                  {paymentMethod === 'bkash' && (
                    <div className="bg-pink-50 p-3.5 rounded-2xl border border-pink-200 text-slate-800 font-medium text-[11px] space-y-2">
                      <p>Merchant Number: <strong>01957909186</strong></p>
                      <input 
                        type="text"
                        name="bkashTrxId"
                        placeholder="Enter TrxID"
                        value={formData.bkashTrxId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-pink-300 rounded-xl text-xs bg-white font-bold"
                      />
                    </div>
                  )}
                </div>

              </div>

              {/* ACTION BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-600/20 transition-all duration-300 transform hover:scale-[1.01] active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'CONFIRMING ORDER...' : `PLACE ORDER (৳ ${grandTotal.toLocaleString()} BDT)`}
              </button>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
