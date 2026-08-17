'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import productsData from '../../products_128_data.json';

export default function SingleProductPage() {
  const params = useParams();
  const productId = params?.id;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState('');
  const [toast, setToast] = useState('');

  // Interactive Image Lens Zoom & Fullscreen Lightbox State
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxScale, setLightboxScale] = useState(1);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const handleMouseLeave = () => {
    setZoomPos((prev) => ({ ...prev, show: false }));
  };

  // Find target product from products_128_data.json
  const product = useMemo(() => {
    if (!productId) return productsData[0];
    const found = productsData.find(p => String(p.id) === String(productId));
    return found || productsData[0];
  }, [productId]);

  // Gallery List
  const galleryList = useMemo(() => {
    if (product.gallery && Array.isArray(product.gallery) && product.gallery.length > 0) {
      return product.gallery.map((gUrl, idx) => ({
        url: gUrl,
        label: idx === 0 ? "Main View / মেইন ভিউ" : `Angle View ${idx + 1} / এঙ্গেল ভিউ ${idx + 1}`
      }));
    }

    return [
      { url: product.image, label: "Main View / মেইন ভিউ" }
    ];
  }, [product]);

  const catNames = product.category_names || [product.category || 'Home Furniture'];
  const catSlugs = product.categories || ['home-furniture'];

  const showToastMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddToCart = () => {
    try {
      const existing = localStorage.getItem('haat_cart');
      let cartItems = existing ? JSON.parse(existing) : [];

      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: galleryList[activeImageIndex]?.url || product.image,
        variation: selectedVariation
      };

      const foundIdx = cartItems.findIndex(item => item.id === product.id);
      if (foundIdx > -1) {
        cartItems[foundIdx].quantity += quantity;
      } else {
        cartItems.push(cartItem);
      }

      localStorage.setItem('haat_cart', JSON.stringify(cartItems));
      showToastMsg(`Added ${quantity} × "${product.name}" to cart!`);
    } catch (e) {
      showToastMsg(`Added "${product.name}" to cart!`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-slate-800 font-sans antialiased">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl font-bold text-xs border border-slate-700 animate-bounce flex items-center gap-2">
          <span>✨</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header Navigation */}
      <div className="bg-[#0b0c10] text-white text-xs py-3 px-6 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-amber-400 hover:underline flex items-center gap-1">
          <span>← Back to Haat Furniture Storefront / স্টোরে ফিরে যান</span>
        </Link>
        <span className="text-slate-400 hidden sm:inline">📞 Hotline: +8809617333990</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* MAIN PRODUCT CARD CONTAINER */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 p-6 sm:p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: GALLERY & MAIN IMAGE */}
            <div className="md:col-span-6 flex flex-col sm:flex-row gap-4 items-start">
              
              {/* Thumbnails */}
              <div className="flex sm:flex-col items-center gap-2 flex-shrink-0 w-full sm:w-auto overflow-x-auto sm:overflow-visible py-1">
                <div className="flex sm:flex-col gap-2.5">
                  {galleryList.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      onMouseEnter={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl border-2 overflow-hidden p-1.5 bg-white transition-all relative group ${activeImageIndex === idx ? 'border-amber-600 ring-2 ring-amber-500/20 shadow-md scale-102' : 'border-slate-200 opacity-70 hover:opacity-100'}`}
                    >
                      <img
                        src={item.url}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain filter drop-shadow-sm"
                      />
                      {activeImageIndex === idx && (
                        <div className="absolute inset-x-0 bottom-0 bg-amber-600 text-white text-[8px] font-black text-center py-0.5 uppercase tracking-tighter">
                          Active
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Product Image with Interactive Lens Zoom & Lightbox Trigger */}
              <div className="w-full flex-1 space-y-3">
                <div 
                  className="w-full h-80 sm:h-[420px] rounded-2xl border border-slate-200 bg-white p-4 flex flex-col items-center justify-center relative group overflow-hidden cursor-zoom-in shadow-sm"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setIsLightboxOpen(true)}
                >
                  <img
                    key={activeImageIndex}
                    src={galleryList[activeImageIndex]?.url || product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* HOVER LENS MAGNIFIER OVERLAY */}
                  {zoomPos.show && (
                    <div
                      className="absolute inset-0 pointer-events-none z-20 bg-white bg-no-repeat shadow-2xl rounded-2xl border-2 border-amber-500"
                      style={{
                        backgroundImage: `url(${galleryList[activeImageIndex]?.url || product.image})`,
                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        backgroundSize: '280%'
                      }}
                    />
                  )}

                  {/* Top Label Pill */}
                  {galleryList[activeImageIndex]?.label && (
                    <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md z-10 border border-slate-700">
                      📷 {galleryList[activeImageIndex].label}
                    </div>
                  )}

                  {/* Click to Enlarge Badge */}
                  <div className="absolute bottom-3 right-3 bg-slate-900/90 backdrop-blur-md text-amber-400 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg z-10 opacity-90 group-hover:opacity-100 flex items-center gap-1.5 transition-all">
                    <span>🔍</span>
                    <span>Click to Enlarge / বড় করে দেখুন</span>
                  </div>
                </div>

                {/* Sub-Product View Switcher */}
                <div className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                  <div className="text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                    <span>🔍 COMPONENT VIEW / আলাদা আলাদা পার্ট দেখুন:</span>
                    <span className="text-amber-600 font-extrabold text-[9px]">{galleryList.length} SUB-VIEWS</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    {galleryList.map((gItem, gIdx) => (
                      <button
                        key={gIdx}
                        type="button"
                        onClick={() => setActiveImageIndex(gIdx)}
                        className={`py-2 px-2 rounded-xl border text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${activeImageIndex === gIdx ? 'bg-slate-900 text-white border-slate-900 font-black shadow-md' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 font-bold'}`}
                      >
                        <span className="text-[10px] truncate">{gItem.label.split('/')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT COLUMN: PRODUCT DETAILS */}
            <div className="md:col-span-6 space-y-4">
              
              {/* Dynamic Breadcrumbs */}
              <nav className="text-xs text-slate-500 flex items-center flex-wrap gap-1 font-medium">
                <Link href="/" className="hover:text-amber-700">Home</Link>
                <span>/</span>
                <Link href="/product-category/home-furniture" className="hover:text-amber-700">Home Furniture</Link>
                {catNames.map((cName, cIdx) => (
                  <React.Fragment key={cIdx}>
                    <span>/</span>
                    <Link href={`/product-category/${catSlugs[cIdx] || 'home-furniture'}`} className="hover:text-amber-700">
                      {cName}
                    </Link>
                  </React.Fragment>
                ))}
                <span>/</span>
                <span className="font-bold text-slate-900">{product.name}</span>
              </nav>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight font-serif-luxury">
                {product.name}
              </h1>

              {/* Price Tag in Green Font */}
              <div className="text-2xl font-black text-lime-600 flex items-center gap-2">
                <span>৳ {product.price.toLocaleString()} BDT</span>
                {product.oldPrice && (
                  <span className="text-slate-400 text-base line-through font-normal">
                    ৳ {product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* Product SKU & Tag Meta */}
              <div className="pt-2 border-t border-slate-100 text-xs space-y-1 text-slate-600 font-medium">
                <p><strong>SKU:</strong> <span className="font-mono text-slate-800">HAAT-FN-{product.id}</span></p>
                <p><strong>Categories:</strong> {catNames.join(', ')}</p>
                <p><strong>Tag:</strong> <span className="text-amber-700 font-bold">{catSlugs[0] || 'segun-wood'}</span></p>
              </div>

              {/* Variation Options Dropdown */}
              <div className="pt-3 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Size / সেট অপশন:
                </label>
                <select
                  value={selectedVariation}
                  onChange={(e) => setSelectedVariation(e.target.value)}
                  className="w-full sm:w-72 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:border-amber-600 focus:outline-none shadow-sm cursor-pointer"
                >
                  <option value="">Choose an option / পছন্দ করুন</option>
                  <option value="standard">Standard Size / স্ট্যান্ডার্ড সাইজ (4'x6')</option>
                  <option value="king">King Size / কিং সাইজ (5'x7')</option>
                  <option value="super-king">Super King / সুপার কিং (6'x7')</option>
                </select>
              </div>

              {/* Quantity Selector & Add to Cart Action */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50 font-extrabold text-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-3.5 py-2.5 hover:bg-slate-200 text-slate-700 transition"
                  >
                    -
                  </button>
                  <span className="px-4 py-2.5 text-slate-900 bg-white border-x border-slate-200 min-w-[40px] text-center font-black">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="px-3.5 py-2.5 hover:bg-slate-200 text-slate-700 transition"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/20 transition-all hover:scale-102 active:scale-95 flex items-center gap-2"
                >
                  <span>🛒</span> ADD TO CART
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* TABBED INFORMATION CONTAINER */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/90 overflow-hidden">
          <div className="flex items-center justify-center border-b border-slate-200 text-xs font-black uppercase tracking-wider overflow-x-auto bg-slate-50">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`py-4 px-6 border-b-2 transition-all ${activeTab === 'description' ? 'border-lime-600 text-lime-600 bg-white font-black' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
              DESCRIPTION
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('additional')}
              className={`py-4 px-6 border-b-2 transition-all ${activeTab === 'additional' ? 'border-lime-600 text-lime-600 bg-white font-black' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
              ADDITIONAL INFORMATION
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('shipping')}
              className={`py-4 px-6 border-b-2 transition-all ${activeTab === 'shipping' ? 'border-lime-600 text-lime-600 bg-white font-black' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
              SHIPPING & DELIVERY
            </button>
          </div>

          <div className="p-6 sm:p-8 text-xs leading-relaxed text-slate-700">
            {activeTab === 'description' && (
              <div className="space-y-4">
                <h4 className="font-extrabold text-slate-900 text-sm text-lime-600">Description</h4>
                <p><strong>Materials:</strong> 100% Genuine Chittagong Solid Segun Teak Wood.</p>
                <p><strong>Color Option:</strong> Antique, Mid Light, Wooden Italian Lacquer Finish.</p>
                <p><strong>Guarantee:</strong> 20 Years Anti-Borer & Termite Proof Guarantee.</p>
                <p className="pt-2 text-slate-600">
                  {product.description || 'Crafted with premium solid Chittagong Segun teak wood by Haat Furniture Limited.'}
                </p>
              </div>
            )}

            {activeTab === 'additional' && (
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 text-sm">Additional Specifications</h4>
                <p><strong>Brand:</strong> HAAT FURNITURE LIMITED</p>
                <p><strong>Wood Type:</strong> 100% Seasoned & Chemical Treated Solid Chittagong Teak</p>
                <p><strong>Warranty Card:</strong> 20-Year Anti-Borer & Termite Guarantee Card Included</p>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-2">
                <h4 className="font-extrabold text-slate-900 text-sm">Home Delivery Information</h4>
                <p>✔ Free Fitting & Assembly inside Dhaka City.</p>
                <p>✔ Flat Rate Home Transport: ৳60 Inside Dhaka | ৳150 Outside Dhaka.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ULTRA-HD FULLSCREEN LIGHTBOX MODAL */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-8 animate-entrance">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between text-white border-b border-slate-800 pb-4 z-50">
            <div>
              <h3 className="text-lg font-black text-white">{product.name}</h3>
              <p className="text-xs text-amber-400 font-bold">{galleryList[activeImageIndex]?.label || 'High-Resolution View'}</p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setLightboxScale(prev => Math.min(prev + 0.5, 3))}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-black text-xs border border-slate-700"
                title="Zoom In"
              >
                🔍 +
              </button>
              <button 
                onClick={() => setLightboxScale(prev => Math.max(prev - 0.5, 1))}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-black text-xs border border-slate-700"
                title="Zoom Out"
              >
                🔍 -
              </button>
              <button 
                onClick={() => setLightboxScale(1)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-black text-xs border border-slate-700"
              >
                Reset (1:1)
              </button>
              <button 
                onClick={() => { setIsLightboxOpen(false); setLightboxScale(1); }}
                className="w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full font-black text-base flex items-center justify-center shadow-lg transition"
                title="Close Fullscreen View"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Modal Main Image Canvas */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden py-4">
            <img
              src={galleryList[activeImageIndex]?.url || product.image}
              alt={product.name}
              className="max-h-[80vh] max-w-full object-contain transition-transform duration-300 filter drop-shadow-2xl"
              style={{ transform: `scale(${lightboxScale})` }}
            />
          </div>

          {/* Modal Bottom Gallery Selector */}
          <div className="flex items-center justify-center gap-3 border-t border-slate-800 pt-4 overflow-x-auto z-50">
            {galleryList.map((gItem, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`w-16 h-16 rounded-xl border-2 overflow-hidden p-1 bg-white transition-all ${activeImageIndex === idx ? 'border-amber-500 scale-110 shadow-lg' : 'border-slate-700 opacity-50 hover:opacity-100'}`}
              >
                <img src={gItem.url} alt={`Angle ${idx}`} className="w-full h-full object-contain" />
              </button>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
