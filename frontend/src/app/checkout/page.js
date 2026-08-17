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
    city: '',
    district: 'Dhaka',
    postcode: '',
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
    { id: 109, name: "Beijing Dining 4 Chair Set", price: 40000, quantity: 1, image: "https://haatfurniture.com/wp-content/uploads/2023/02/T1.jpg" },
    { id: 101, name: "Crown Royal Segun Teak Bed", price: 30000, quantity: 3, image: "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg" },
    { id: 116, name: "Bridge Dining 6 Chair Set", price: 55000, quantity: 1, image: "https://haatfurniture.com/wp-content/uploads/2023/02/18.jpg" },
    { id: 104, name: "HFCT-Round Center Table", price: 13000, quantity: 1, image: "https://haatfurniture.com/wp-content/uploads/2023/03/purley-dining.jpg" },
    { id: 105, name: "Bullet Teak Door 2.6'x6'", price: 22500, quantity: 1, image: "https://haatfurniture.com/wp-content/uploads/2023/03/door-1.jpg" }
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
      alert('Please fill in all required fields (First name, Phone, Street address)');
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      orderId: 'HF-' + Math.floor(100000 + Math.random() * 900000),
      customer: formData,
      cart: cart,
      subtotal: subtotal,
      shipping: shippingFee,
      discount: discountAmount,
      total: grandTotal,
      paymentMethod: paymentMethod,
      date: new Date().toLocaleDateString('en-GB')
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmedOrderData(orderPayload);
      setOrderSuccess(true);
      localStorage.removeItem('haat_cart');
    }, 1200);
  };

  if (orderSuccess && confirmedOrderData) {
    return (
      <div className="min-h-screen bg-slate-100 text-slate-800 font-sans">
        {/* Step Indicator Header */}
        <div className="bg-[#0f1115] text-white py-4 px-4 text-center border-b border-slate-800">
          <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider">
            <span className="text-slate-400">SHOPPING CART</span>
            <span className="text-slate-400">→</span>
            <span className="text-slate-400">CHECKOUT</span>
            <span className="text-slate-400">→</span>
            <span className="text-lime-500 underline font-black">ORDER COMPLETE</span>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl border border-slate-200 text-center space-y-6">
            <span className="w-16 h-16 bg-lime-100 text-lime-600 rounded-full flex items-center justify-center text-3xl mx-auto font-black">
              ✓
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900">Thank You! Your Order is Received.</h1>
            <p className="text-xs text-slate-500">Order Number: <strong className="text-slate-900">{confirmedOrderData.orderId}</strong> | Date: {confirmedOrderData.date}</p>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 text-left space-y-3 text-xs">
              <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-200 pb-2">Order Details</h3>
              <div className="space-y-1">
                {confirmedOrderData.cart.map((item, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-slate-100">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-bold">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-2 text-sm font-extrabold text-slate-900">
                <span>Total Amount:</span>
                <span className="text-lime-600">৳{confirmedOrderData.total.toLocaleString()} BDT</span>
              </div>
            </div>

            <Link href="/" className="inline-block bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-xs hover:bg-amber-700 transition">
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* 1. TOP HEADER PROGRESS RIBBON MATCHING SCREENSHOT */}
      <div className="bg-[#0f1115] text-white py-4 px-4 text-center border-b border-slate-800">
        <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-wider">
          <span className="text-slate-400">SHOPPING CART</span>
          <span className="text-slate-400 font-normal">→</span>
          <span className="text-lime-500 underline font-black">CHECKOUT</span>
          <span className="text-slate-400 font-normal">→</span>
          <span className="text-slate-400">ORDER COMPLETE</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* 2. COUPON BANNER MATCHING SCREENSHOT */}
        <div className="bg-white p-4 rounded-xl border-t-2 border-lime-500 shadow-sm text-xs flex flex-wrap items-center justify-between gap-2">
          <div>
            <span>Have a coupon? </span>
            <button 
              type="button"
              onClick={() => setShowCouponInput(!showCouponInput)} 
              className="text-lime-600 font-bold hover:underline"
            >
              Click here to enter your code
            </button>
          </div>
        </div>

        {showCouponInput && (
          <form onSubmit={handleApplyCoupon} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
            <input 
              type="text" 
              placeholder="Coupon code (e.g. HAAT10)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded text-xs focus:outline-none focus:border-lime-600 w-60"
            />
            <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded text-xs font-bold hover:bg-amber-700 transition">
              Apply Coupon
            </button>
          </form>
        )}

        {/* 3. TWO-COLUMN CHECKOUT FORM MATCHING SCREENSHOT */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: BILLING & SHIPPING FORM */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
              BILLING & SHIPPING
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* First name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">First name <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  placeholder="Mahin"
                  className="w-full px-3 py-2.5 border border-purple-400 rounded-lg focus:outline-none focus:border-amber-600 text-xs font-medium"
                />
              </div>

              {/* Last name */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Last name <span className="text-red-500">*</span></label>
                <input 
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  placeholder="Ahmed"
                  className="w-full px-3 py-2.5 border border-purple-400 rounded-lg focus:outline-none focus:border-amber-600 text-xs font-medium"
                />
              </div>

            </div>

            {/* Company name */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Company name (optional)</label>
              <input 
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-purple-400 rounded-lg focus:outline-none focus:border-amber-600 text-xs font-medium"
              />
            </div>

            {/* Country / Region */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Country / Region <span className="text-red-500">*</span></label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-xs font-bold text-slate-800"
              >
                <option value="Bangladesh">Bangladesh</option>
              </select>
            </div>

            {/* Street address */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700">Street address <span className="text-red-500">*</span></label>
              <input 
                type="text"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleInputChange}
                required
                placeholder="House #, Road #, Area name (e.g. Badda, Dhaka)"
                className="w-full px-3 py-2.5 border border-purple-400 rounded-lg focus:outline-none focus:border-amber-600 text-xs font-medium"
              />
              <input 
                type="text"
                name="apartment"
                value={formData.apartment}
                onChange={handleInputChange}
                placeholder="Apartment, suite, unit, etc. (optional)"
                className="w-full px-3 py-2.5 border border-purple-400 rounded-lg focus:outline-none focus:border-amber-600 text-xs font-medium"
              />
            </div>

            {/* Town / City */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Town / City <span className="text-red-500">*</span></label>
              <input 
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Dhaka"
                className="w-full px-3 py-2.5 border border-purple-400 rounded-lg focus:outline-none focus:border-amber-600 text-xs font-medium"
              />
            </div>

            {/* District */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">District <span className="text-red-500">*</span></label>
              <select
                name="district"
                value={formData.district}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-xs font-bold text-slate-800"
              >
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
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

            {/* Postcode / ZIP */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700">Postcode / ZIP (optional)</label>
              <input 
                type="text"
                name="postcode"
                value={formData.postcode}
                onChange={handleInputChange}
                placeholder="1212"
                className="w-full px-3 py-2.5 border border-purple-400 rounded-lg focus:outline-none focus:border-amber-600 text-xs font-medium"
              />
            </div>

            {/* Phone & Email */}
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Phone <span className="text-red-500">*</span></label>
                <input 
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="01957909186"
                  className="w-full px-3 py-2.5 border border-purple-400 rounded-lg focus:outline-none focus:border-amber-600 text-xs font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Email address <span className="text-red-500">*</span></label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="haatfurniture@gmail.com"
                  className="w-full px-3 py-2.5 border border-purple-400 rounded-lg focus:outline-none focus:border-amber-600 text-xs font-medium"
                />
              </div>
            </div>

            {/* ADDITIONAL INFORMATION */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">
                ADDITIONAL INFORMATION
              </h3>
              <label className="font-bold text-slate-700">Order notes (optional)</label>
              <textarea
                name="orderNotes"
                value={formData.orderNotes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Notes about your order, e.g. special notes for delivery."
                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600 text-xs font-medium"
              />
            </div>

          </div>

          {/* RIGHT COLUMN: YOUR ORDER (TICKET / RECEIPT CARD STYLE) MATCHING SCREENSHOT */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-[#f9f9fb] p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-md relative space-y-6">
              
              {/* Receipt Header */}
              <h2 className="text-base font-black text-slate-900 uppercase tracking-wider text-center border-b border-slate-200 pb-3">
                YOUR ORDER
              </h2>

              {/* Order Table */}
              <div className="space-y-3 text-xs border-b border-slate-200 pb-4">
                <div className="flex justify-between font-black text-slate-900 border-b border-slate-200 pb-2">
                  <span>PRODUCT</span>
                  <span>SUBTOTAL</span>
                </div>

                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-slate-700 py-1.5 border-b border-slate-100">
                    <span className="font-semibold pr-2">{item.name} × {item.quantity}</span>
                    <span className="font-bold text-slate-900 whitespace-nowrap">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}

                {/* Subtotal */}
                <div className="flex justify-between font-bold text-slate-800 pt-2">
                  <span>Subtotal</span>
                  <span className="text-lime-600 font-extrabold">৳{subtotal.toLocaleString()}</span>
                </div>

                {/* Shipment */}
                <div className="flex justify-between text-slate-700 py-1">
                  <span>Shipment</span>
                  <span className="font-bold text-slate-900">Flat rate: <span className="text-lime-600">৳{shippingFee}</span></span>
                </div>

                {/* Total */}
                <div className="flex justify-between font-black text-base text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-lime-600 text-xl font-black">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* PAYMENT METHOD SELECTION MATCHING SCREENSHOT */}
              <div className="space-y-4 text-xs">
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-red-600"
                    />
                    <span>Cash on delivery</span>
                  </label>

                  {paymentMethod === 'cod' && (
                    <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-600 font-medium text-[11px]">
                      Pay with cash upon delivery. Safe and secure home delivery.
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="bkash" 
                      checked={paymentMethod === 'bkash'}
                      onChange={() => setPaymentMethod('bkash')}
                      className="accent-red-600"
                    />
                    <span>bKash / Nagad / Rocket Mobile Banking</span>
                  </label>

                  {paymentMethod === 'bkash' && (
                    <div className="bg-pink-50 p-3 rounded-lg border border-pink-200 text-slate-700 font-medium text-[11px] space-y-2">
                      <p>Send payment to Merchant bKash: <strong>01957909186</strong></p>
                      <input 
                        type="text"
                        name="bkashTrxId"
                        placeholder="Enter bKash / Nagad TrxID"
                        value={formData.bkashTrxId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-1.5 border border-pink-300 rounded text-xs bg-white"
                      />
                    </div>
                  )}
                </div>

              </div>

              {/* Privacy Terms Notice */}
              <p className="text-[10px] text-slate-500 leading-relaxed border-t border-slate-200 pt-3">
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <strong className="text-slate-800 underline">privacy policy</strong>.
              </p>

              {/* PINKISH-RED "PLACE ORDER" BUTTON MATCHING SCREENSHOT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#ff3b68] hover:bg-[#e02b55] text-white font-extrabold text-xs uppercase tracking-widest shadow-xl transition-all duration-300 transform hover:scale-[1.01] active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'PROCESSING ORDER...' : 'PLACE ORDER'}
              </button>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
