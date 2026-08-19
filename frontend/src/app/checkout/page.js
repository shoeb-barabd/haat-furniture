'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [confirmedOrderData, setConfirmedOrderData] = useState(null);
  const [formError, setFormError] = useState('');

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
        setCart(Array.isArray(parsed) ? parsed : []);
      } else {
        setCart([]);
      }
    } catch (e) {
      setCart([]);
    }
    setCartLoaded(true);
  }, []);

  const persistCart = (next) => {
    setCart(next);
    localStorage.setItem('haat_cart', JSON.stringify(next));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = formData.district === 'Dhaka' ? 60 : 150;
  const discountAmount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const grandTotal = subtotal - discountAmount + shippingFee;
  const deliveryLabel = formData.district === 'Dhaka' ? '2–4 working days' : '4–7 working days';
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormError('');
  };

  const updateQty = (id, delta) => {
    const next = cart
      .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
      .filter((item) => item.quantity > 0);
    persistCart(next);
  };

  const removeItem = (id) => {
    persistCart(cart.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toLowerCase();
    if (code === 'haat10' || code === 'discount') {
      setCouponApplied(true);
      setCouponMessage('HAAT10 applied — 10% off on furniture total.');
    } else {
      setCouponApplied(false);
      setCouponMessage('Invalid code. Try HAAT10');
    }
  };

  const validateForm = () => {
    if (!formData.firstName.trim() || !formData.phone.trim() || !formData.streetAddress.trim()) {
      setFormError('First name, phone and street address are required.');
      return false;
    }
    if (!/^01[0-9]{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      setFormError('Enter a valid 11-digit Bangladeshi phone number.');
      return false;
    }
    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !formData.bkashTrxId.trim()) {
      setFormError('Enter the payment TrxID before placing the order.');
      return false;
    }
    return true;
  };

  const buildOrderPayload = () => ({
    orderId: 'HF-' + Math.floor(100000 + Math.random() * 900000),
    customer: `${formData.firstName} ${formData.lastName}`.trim(),
    phone: formData.phone,
    email: formData.email,
    address: `${formData.streetAddress}${formData.apartment ? ', ' + formData.apartment : ''}, ${formData.city}, ${formData.district}`,
    items: cart.map((c) => `${c.name} (x${c.quantity})`).join(', '),
    total: grandTotal,
    subtotal,
    shipping: shippingFee,
    discount: discountAmount,
    payment: paymentMethod,
    status: 'Processing',
    date: new Date().toISOString().split('T')[0],
    delivery: deliveryLabel
  });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const orderPayload = buildOrderPayload();

    try {
      const res = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: orderPayload.customer,
          phone: orderPayload.phone,
          email: orderPayload.email,
          address: orderPayload.address,
          district: formData.district,
          coupon: couponApplied ? couponCode : '',
          payment: orderPayload.payment,
          line_items: cart.map((c) => ({ id: c.id, quantity: c.quantity }))
        })
      });
      const json = await res.json();
      if (!json?.success) throw new Error(json?.message || 'Save failed');
      if (json.data) {
        orderPayload.orderId = json.data.id || orderPayload.orderId;
        orderPayload.total = json.data.total ?? orderPayload.total;
        orderPayload.subtotal = json.data.subtotal ?? orderPayload.subtotal;
        orderPayload.shipping = json.data.shipping ?? orderPayload.shipping;
        orderPayload.discount = json.data.discount ?? orderPayload.discount;
      }
    } catch (err) {
      setIsSubmitting(false);
      setFormError('Order admin-e pathano jayni. Internet check kore abar try korun.');
      return;
    }

    if (paymentMethod === 'whatsapp') {
      const text = `Assalamu Alaikum HAAT Furniture!\n\nNew order request:\nName: ${formData.firstName} ${formData.lastName}\nPhone: ${formData.phone}\nAddress: ${formData.streetAddress}, ${formData.district}\n\n${cart.map((i) => `- ${i.name} × ${i.quantity} = ৳${(i.price * i.quantity).toLocaleString()}`).join('\n')}\n\nSubtotal: ৳${subtotal.toLocaleString()}\nShipping: ৳${shippingFee}\n${couponApplied ? `Discount: -৳${discountAmount.toLocaleString()}\n` : ''}Total: ৳${grandTotal.toLocaleString()} BDT`;
      window.open(`https://wa.me/8809617333990?text=${encodeURIComponent(text)}`, '_blank');
    }

    setIsSubmitting(false);
    setConfirmedOrderData(orderPayload);
    setOrderSuccess(true);
    localStorage.removeItem('haat_cart');
  };

  const inputClass = 'w-full px-4 py-3 rounded-2xl bg-[#fbf9f5] border border-[#e4d8c4] text-slate-900 font-bold focus:outline-none focus:border-[#c59b27] transition';

  if (orderSuccess && confirmedOrderData) {
    return (
      <div className="min-h-screen bg-[#fbf9f5] text-slate-800 font-sans antialiased">
        <div className="h-[3px] bg-gradient-to-r from-[#c59b27] via-[#e6c875] to-[#c59b27]"></div>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-[#e4d8c4] text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-4xl mx-auto font-black">✓</div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a07c32]">HAAT Furniture LTD</p>
            <h1 className="text-3xl font-black text-[#1b120c] font-serif-luxury">Order confirmed</h1>
            <p className="text-sm text-[#6b5740]">
              Reference <strong className="text-slate-900 font-mono">{confirmedOrderData.orderId}</strong> · {confirmedOrderData.date}
            </p>
            <div className="bg-[#fbf9f5] p-6 rounded-2xl border border-[#e4d8c4] text-left space-y-2 text-xs font-medium">
              <p><strong>Customer:</strong> {confirmedOrderData.customer} ({confirmedOrderData.phone})</p>
              <p><strong>Delivery:</strong> {confirmedOrderData.address}</p>
              <p><strong>Items:</strong> {confirmedOrderData.items}</p>
              <p><strong>Payment:</strong> {confirmedOrderData.payment.toUpperCase()}</p>
              <p><strong>ETA:</strong> {confirmedOrderData.delivery}</p>
              <div className="flex justify-between pt-3 text-base font-black text-slate-900 border-t border-[#e4d8c4]">
                <span>Total</span>
                <span className="text-emerald-700">৳ {confirmedOrderData.total.toLocaleString()} BDT</span>
              </div>
            </div>
            <p className="text-[11px] text-[#6b5740]">Our team will call this number to confirm delivery time.</p>
            <Link href="/" className="inline-block bg-[#1a110d] text-[#e6c875] px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider">
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!cartLoaded) {
    return <div className="min-h-screen bg-[#fbf9f5]" />;
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fbf9f5] text-slate-800 font-sans flex items-center justify-center px-4">
        <div className="bg-white p-10 rounded-3xl border border-[#e4d8c4] text-center max-w-md space-y-4">
          <h1 className="text-2xl font-black text-[#1b120c] font-serif-luxury">Cart is empty</h1>
          <p className="text-sm text-[#6b5740]">Add a product first, then come back to checkout.</p>
          <Link href="/products" className="inline-block px-6 py-3 rounded-xl bg-red-600 text-white text-xs font-black uppercase">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const paymentOptions = [
    { id: 'cod', title: 'Cash on Delivery', hint: 'Pay after furniture is delivered & assembled.' },
    { id: 'bkash', title: 'bKash', hint: 'Send money, then enter TrxID.' },
    { id: 'nagad', title: 'Nagad', hint: 'Send money, then enter TrxID.' },
    { id: 'whatsapp', title: 'Order on WhatsApp', hint: 'Confirm the order with our showroom on WhatsApp.' }
  ];

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-slate-800 font-sans antialiased pb-28 lg:pb-8">
      <header className="bg-[#fbf9f5]/95 backdrop-blur-xl border-b border-[#e4d8c4] sticky top-0 z-50">
        <div className="h-[3px] bg-gradient-to-r from-[#c59b27] via-[#e6c875] to-[#c59b27]"></div>
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center bg-white rounded-2xl border border-[#e4d8c4] px-3 py-1.5 shadow-sm">
            <img src="/images/logo.jpg" alt="HAAT Furniture LTD" className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <a href="tel:+8809617333990" className="hidden sm:block text-xs font-bold text-[#8a6a3a]">
              Hotline +8809617333990
            </a>
            <span className="px-3 py-1.5 rounded-full bg-white border border-[#e4d8c4] text-[11px] font-bold text-[#5c4a32]">
              Secure checkout
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#8a6a3a]">
          <span className="text-emerald-700">1. Cart</span>
          <span>→</span>
          <span className="text-[#a07c32] border-b-2 border-[#c59b27] pb-0.5">2. Checkout</span>
          <span>→</span>
          <span>3. Confirmed</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#e4d8c4] shadow-sm space-y-6">
            <h2 className="text-xl font-black text-[#1b120c] font-serif-luxury border-b border-[#e4d8c4] pb-3">
              Billing & Delivery
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">First name <span className="text-red-500">*</span></label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required placeholder="First name" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Last name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" className={inputClass} />
              </div>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-700">Street address <span className="text-red-500">*</span></label>
              <input type="text" name="streetAddress" value={formData.streetAddress} onChange={handleInputChange} required placeholder="House, road, area (e.g. Badda, Dhaka)" className={inputClass} />
              <input type="text" name="apartment" value={formData.apartment} onChange={handleInputChange} placeholder="Apartment / floor (optional)" className={inputClass} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Town / City</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">District <span className="text-red-500">*</span></label>
                <select name="district" value={formData.district} onChange={handleInputChange} className={inputClass}>
                  <option value="Dhaka">Dhaka (৳60 · 2–4 days)</option>
                  <option value="Gazipur">Gazipur (৳150 · 4–7 days)</option>
                  <option value="Narayanganj">Narayanganj (৳150 · 4–7 days)</option>
                  <option value="Chittagong">Chittagong (৳150 · 4–7 days)</option>
                  <option value="Sylhet">Sylhet (৳150 · 4–7 days)</option>
                  <option value="Rajshahi">Rajshahi (৳150 · 4–7 days)</option>
                  <option value="Khulna">Khulna (৳150 · 4–7 days)</option>
                  <option value="Barisal">Barisal (৳150 · 4–7 days)</option>
                  <option value="Rangpur">Rangpur (৳150 · 4–7 days)</option>
                  <option value="Mymensingh">Mymensingh (৳150 · 4–7 days)</option>
                  <option value="Other">Other District (৳150)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Phone <span className="text-red-500">*</span></label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="01XXXXXXXXX" className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="optional" className={inputClass} />
              </div>
            </div>

            <div className="pt-2 space-y-2 text-xs">
              <label className="font-bold text-slate-700">Delivery notes</label>
              <textarea name="orderNotes" value={formData.orderNotes} onChange={handleInputChange} rows={3} placeholder="Floor, finish color, preferred delivery time..." className={inputClass} />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 bg-white p-6 sm:p-7 rounded-3xl border border-[#e4d8c4] shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-[#e4d8c4] pb-3">
                <h2 className="text-xl font-black text-[#1b120c] font-serif-luxury">Order summary</h2>
                <span className="text-[11px] font-bold text-[#8a6a3a]">{itemCount} item{itemCount === 1 ? '' : 's'}</span>
              </div>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#fbf9f5] border border-[#e4d8c4]">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-contain rounded-xl bg-white border border-[#e4d8c4] p-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[11px] text-emerald-700 font-bold">৳ {item.price.toLocaleString()}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <button type="button" onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-md bg-white border border-[#e4d8c4] text-xs font-black">-</button>
                        <span className="text-xs font-black w-4 text-center">{item.quantity}</span>
                        <button type="button" onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-md bg-white border border-[#e4d8c4] text-xs font-black">+</button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black">৳ {(item.price * item.quantity).toLocaleString()}</p>
                      <button type="button" onClick={() => removeItem(item.id)} className="text-[10px] font-bold text-red-600 mt-1">Remove</button>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon (HAAT10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl border border-[#e4d8c4] text-xs font-bold focus:outline-none focus:border-[#c59b27]"
                />
                <button type="submit" className="px-4 py-2.5 rounded-xl bg-[#1a110d] text-[#e6c875] text-[11px] font-black uppercase">
                  Apply
                </button>
              </form>
              {couponMessage && (
                <p className={`text-[11px] font-bold ${couponApplied ? 'text-emerald-700' : 'text-red-600'}`}>{couponMessage}</p>
              )}

              <div className="space-y-2 text-xs border-t border-[#e4d8c4] pt-3">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">৳ {subtotal.toLocaleString()}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount (10%)</span>
                    <span>-৳ {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Shipping · {formData.district}</span>
                  <span className="font-bold text-slate-900">৳ {shippingFee}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#8a6a3a]">
                  <span>Estimated delivery</span>
                  <span className="font-bold">{deliveryLabel}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#e4d8c4] font-black text-base">
                  <span>Total</span>
                  <span className="text-emerald-700">৳ {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-black uppercase tracking-wider text-[#8a6a3a]">Payment</p>
                {paymentOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition ${
                      paymentMethod === opt.id
                        ? 'border-[#c59b27] bg-[#fbf6ea]'
                        : 'border-[#e4d8c4] bg-white hover:bg-[#fbf9f5]'
                    }`}
                  >
                    <p className="text-xs font-black text-slate-900">{opt.title}</p>
                    <p className="text-[11px] text-[#6b5740] mt-0.5">{opt.hint}</p>
                  </button>
                ))}

                {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                  <div className="p-3 rounded-2xl bg-[#fbf9f5] border border-[#e4d8c4] space-y-2 text-[11px]">
                    <p>Send to <strong>01957909186</strong> ({paymentMethod === 'bkash' ? 'bKash' : 'Nagad'})</p>
                    <input
                      type="text"
                      name="bkashTrxId"
                      placeholder="TrxID"
                      value={formData.bkashTrxId}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  </div>
                )}
              </div>

              {formError && <p className="text-[11px] font-bold text-red-600">{formError}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="hidden lg:block w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs uppercase tracking-widest disabled:opacity-50"
              >
                {isSubmitting ? 'Confirming…' : `Place order · ৳ ${grandTotal.toLocaleString()}`}
              </button>

              <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-[#6b5740]">
                <div className="rounded-xl bg-[#fbf9f5] border border-[#e4d8c4] p-2">5-yr service warranty</div>
                <div className="rounded-xl bg-[#fbf9f5] border border-[#e4d8c4] p-2">Free assembly in Dhaka</div>
                <div className="rounded-xl bg-[#fbf9f5] border border-[#e4d8c4] p-2">Solid Segun teak</div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur border-t border-[#e4d8c4] p-3 flex items-center gap-3">
        <div>
          <p className="text-[10px] font-bold text-[#8a6a3a]">Total</p>
          <p className="text-sm font-black text-emerald-700">৳ {grandTotal.toLocaleString()}</p>
        </div>
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-xl bg-amber-600 text-white text-xs font-black uppercase disabled:opacity-50"
        >
          {isSubmitting ? 'Confirming…' : 'Place order'}
        </button>
      </div>
    </div>
  );
}
