'use client';
import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import productsData from "../../products_128_data.json";

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams?.id;

  // Resolve product initial state directly for instant SSR rendering
  const initialProduct = React.useMemo(() => {
    const targetId = String(productId);
    return productsData.find(p => String(p.id) === targetId) || productsData[0];
  }, [productId]);

  const [product, setProduct] = useState(initialProduct);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    const targetId = String(productId);
    const found = productsData.find(p => String(p.id) === targetId);
    if (found) setProduct(found);
  }, [productId]);

  // Dynamic gallery list
  const getProductGallery = (prod) => {
    if (!prod) return [];
    
    const mainImg = prod.image || "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg";
    const nameLower = (prod.name || "").toLowerCase();
    const catList = (prod.categories || []).join(' ');

    if (nameLower.includes("dining") || nameLower.includes("dinning") || catList.includes("dinning")) {
      return [
        { url: mainImg, label: "Full Set View / সম্পূর্ণ ডাইনিং সেট" },
        { url: "https://haatfurniture.com/wp-content/uploads/2023/02/18.jpg", label: "Single Chair View / সলিড সেগুন চেয়ার" },
        { url: "https://haatfurniture.com/wp-content/uploads/2023/02/T1.jpg", label: "Dining Table View / টেবিল ভিউ" }
      ];
    }

    if (nameLower.includes("dressing") || nameLower.includes("almirah") || nameLower.includes("wardrobe") || nameLower.includes("bed")) {
      return [
        { url: mainImg, label: "Main View / মেইন ভিউ" },
        { url: "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg", label: "Front Carving View / ফ্রন্ট ভিউ" },
        { url: "https://haatfurniture.com/wp-content/uploads/2023/03/Wheel-Bed-Angle.jpg", label: "Side Perspective / সাইড ভিউ" }
      ];
    }

    return [
      { url: mainImg, label: "Main View / মেইন ভিউ" },
      { url: "https://haatfurniture.com/wp-content/uploads/2023/09/sofa-set-haat-furniture.jpg", label: "Detail Angle / সাইড ভিউ" }
    ];
  };

  const galleryList = getProductGallery(product);

  const relatedProducts = React.useMemo(() => {
    if (!product) return productsData.slice(0, 4);
    const mainCat = product.categories ? product.categories[0] : 'home-furniture';
    const rel = productsData.filter(p => p.id !== product.id && p.categories?.includes(mainCat));
    return rel.length > 0 ? rel.slice(0, 4) : productsData.slice(0, 4);
  }, [product]);

  const addToCart = () => {
    if (!product) return;
    try {
      const existingCartRaw = localStorage.getItem("haat_cart");
      let currentCart = existingCartRaw ? JSON.parse(existingCartRaw) : [];

      const itemIndex = currentCart.findIndex((i) => i.id === product.id);
      if (itemIndex > -1) {
        currentCart[itemIndex].quantity += quantity;
      } else {
        currentCart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.image,
          size: selectedSize || "Standard"
        });
      }

      localStorage.setItem("haat_cart", JSON.stringify(currentCart));
      showToast(`Added ${quantity} x "${product.name}" to Cart! Redirecting...`);

      setTimeout(() => {
        window.location.href = "/checkout";
      }, 500);
    } catch (err) {
      console.error("Cart error", err);
      window.location.href = "/checkout";
    }
  };

  // Dynamic breadcrumb paths & SKU
  const catNames = product.category_names || ['Bed Room', 'Furniture'];
  const catSlugs = product.categories || ['home-furniture'];
  
  let skuPrefix = "HAAT-FN";
  if (catSlugs.includes('sofa')) skuPrefix = "HAAT-SF";
  else if (catSlugs.includes('bed')) skuPrefix = "HAAT-BD";
  else if (catSlugs.includes('almirah')) skuPrefix = "HAAT-AL";
  else if (catSlugs.includes('dressing-table')) skuPrefix = "HAAT-DT";
  else if (catSlugs.includes('dinning-set')) skuPrefix = "HAAT-DIN";
  else if (catSlugs.includes('door')) skuPrefix = "HAAT-[#DR]";

  const dynamicSku = `${skuPrefix}-${String(product.id).padStart(3, '0')}`;
  const primaryTag = catSlugs[catSlugs.length - 1] || 'furniture';

  return (
    <div className="min-h-screen bg-[#f2f3f5] text-slate-800 font-sans antialiased">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce font-semibold text-sm">
          <span className="text-lg">✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Ribbon */}
      <div className="bg-slate-900 text-white text-xs py-3 px-6 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-amber-400 hover:underline flex items-center gap-1">
          <span>← Back to Haat Furniture Storefront / স্টোরে ফিরে যান</span>
        </Link>
        <span className="text-slate-400 hidden sm:inline">📞 Hotline: +8809617333990</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* MAIN PRODUCT CARD CONTAINER */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 sm:p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: GALLERY & MAIN IMAGE */}
            <div className="md:col-span-6 flex flex-col sm:flex-row gap-4 items-start">
              
              {/* Thumbnails */}
              <div className="flex sm:flex-col items-center gap-2 flex-shrink-0 w-full sm:w-auto overflow-x-auto sm:overflow-visible py-1">
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev - 1 + galleryList.length) % galleryList.length)}
                  className="w-full sm:w-16 h-7 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold items-center justify-center border border-slate-200 hidden sm:flex"
                >
                  ▲
                </button>

                <div className="flex sm:flex-col gap-2.5">
                  {galleryList.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      onMouseEnter={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 sm:w-18 sm:h-18 rounded-xl border-2 overflow-hidden p-1.5 bg-white transition-all relative group ${activeImageIndex === idx ? 'border-amber-600 ring-2 ring-amber-500/20 shadow-md scale-102' : 'border-slate-200 opacity-70 hover:opacity-100'}`}
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

                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev + 1) % galleryList.length)}
                  className="w-full sm:w-16 h-7 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold items-center justify-center border border-slate-200 hidden sm:flex"
                >
                  ▼
                </button>
              </div>

              {/* Main Product Image & Component Switcher */}
              <div className="w-full flex-1 space-y-3">
                <div className="w-full h-80 sm:h-96 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col items-center justify-center relative group overflow-hidden">
                  <img
                    key={activeImageIndex}
                    src={galleryList[activeImageIndex]?.url || product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
                  />

                  {galleryList[activeImageIndex]?.label && (
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                      📷 {galleryList[activeImageIndex].label}
                    </div>
                  )}
                </div>

                {/* Sub-Product View Switcher */}
                <div className="w-full p-3 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {product.name}
              </h1>

              {/* Price Tag in Green Font */}
              <div className="text-2xl font-bold text-lime-600 flex items-center gap-2">
                <span>৳ {product.price.toLocaleString()} BDT</span>
                {product.oldPrice && (
                  <span className="text-slate-400 text-base line-through font-normal"> ৳ {product.oldPrice.toLocaleString()}</span>
                )}
              </div>

              {/* Metadata list */}
              <div className="text-xs text-slate-500 space-y-1.5 pt-1 border-t border-slate-100">
                <p><strong className="text-slate-700">SKU:</strong> {dynamicSku}</p>
                <p><strong className="text-slate-700">Categories:</strong> {catNames.join(', ')}</p>
                <p><strong className="text-slate-700">Tag:</strong> {primaryTag}</p>
              </div>

              {/* Variation Selection Dropdown */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                  <label htmlFor="sizeSelect">Size / সেট অপশন:</label>
                  <select
                    id="sizeSelect"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-700 focus:outline-none focus:border-amber-500 w-56 font-bold cursor-pointer"
                  >
                    <option value="">Choose an option / পছন্দ করুন</option>
                    <option value="standard">Standard Solid Teak Size</option>
                    <option value="custom">Custom Dimensions (Order on Demand)</option>
                  </select>
                </div>
              </div>

              {/* Quantity Counter & Red Add to Cart Button */}
              <div className="flex items-center gap-3 pt-3">
                <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden text-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2.5 hover:bg-slate-100 text-slate-600 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2.5 font-bold text-slate-800 border-x border-slate-200">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-2.5 hover:bg-slate-100 text-slate-600 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={addToCart}
                  className="px-8 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all hover:scale-102 active:scale-95"
                >
                  ADD TO CART
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* TABBED INFORMATION CONTAINER */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
          <div className="flex items-center justify-center border-b border-slate-200 text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`px-6 py-3.5 border-b-2 uppercase tracking-wider transition-all ${activeTab === "description" ? 'border-lime-500 text-slate-900 font-black' : 'border-transparent hover:text-slate-900'}`}
            >
              DESCRIPTION
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("additional")}
              className={`px-6 py-3.5 border-b-2 uppercase tracking-wider transition-all ${activeTab === "additional" ? 'border-lime-500 text-slate-900 font-black' : 'border-transparent hover:text-slate-900'}`}
            >
              ADDITIONAL INFORMATION
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("shipping")}
              className={`px-6 py-3.5 border-b-2 uppercase tracking-wider transition-all ${activeTab === "shipping" ? 'border-lime-500 text-slate-900 font-black' : 'border-transparent hover:text-slate-900'}`}
            >
              SHIPPING & DELIVERY
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-4 text-xs leading-relaxed text-slate-600">
            {activeTab === "description" && (
              <div className="space-y-3">
                <h4 className="font-bold text-lime-600 text-sm">Description</h4>
                <p><strong className="text-slate-800">Materials:</strong> 100% Genuine Chittagong Solid Segun Teak Wood.</p>
                <p><strong className="text-slate-800">Color Option:</strong> Antique, Mid Light, Wooden Italian Lacquer Finish.</p>
                <p><strong className="text-slate-800">Guarantee:</strong> 20 Years Anti-Borer & Termite Proof Guarantee.</p>
                <p className="pt-2 text-slate-500 border-t border-slate-100">
                  {product.description || "Handcrafted solid Chittagong Segun teak wood furniture. Made for elegant homes with maximum durability and premium lacquer finish."}
                </p>
              </div>
            )}

            {activeTab === "additional" && (
              <div className="space-y-2">
                <p><strong className="text-slate-800">Warranty:</strong> 20 Years Guarantee (Borer & Termite Proof)</p>
                <p><strong className="text-slate-800">Wood Finish:</strong> Premium Italian Lacquer Finish</p>
                <p><strong className="text-slate-800">Assembly:</strong> Free Home Delivery & Professional Assembly Included</p>
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="space-y-2">
                <p><strong className="text-slate-800">Dhaka City:</strong> Free Home Delivery within 3-5 Business Days.</p>
                <p><strong className="text-slate-800">Outside Dhaka:</strong> Safe transport with protective foam & wooden crating.</p>
              </div>
            )}
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-sm font-extrabold uppercase text-slate-900 tracking-wider inline-block border-b-2 border-lime-500 pb-2">
              RELATED PRODUCTS
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-between hover:shadow-lg transition-all group"
              >
                <div className="h-44 bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center p-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="pt-3 text-center space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-red-600 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs font-black text-lime-600">৳ {item.price.toLocaleString()} BDT</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
