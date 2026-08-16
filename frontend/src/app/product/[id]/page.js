"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [toastMessage, setToastMessage] = useState("");

  // Toast Notification Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/products/${productId}`);
        const allRes = await fetch(`/api/v1/products`);
        
        if (res.ok) {
          const data = await res.json();
          const p = data.data || data;
          setProduct(p);
        } else {
          // Fallback mockup if API returns 404 or fails
          setProduct({
            id: productId,
            name: "Cube Dining 6 Chair Set",
            price: 62000,
            old_price: 78000,
            sku: "HAAT-DIN-620",
            category: "Dinning Room",
            sub_category: "Dinning Set",
            tag: "dinning",
            image: "https://haatfurniture.com/wp-content/uploads/2023/09/dining-table-6-chair-haat-furniture.jpg",
            materials: "Imported Chittagong 100% Solid Segun Wood.",
            color_options: "Antique, Mid Light, Wooden Lacquer Finish.",
            dimensions: 'Table: L: 66" x W: 40" x H: 30" (6 Chairs Included)',
            description: "Solid Chittagong Segun Wood 6 Chair Dining Set with 10mm tempered glass top. Handcrafted borer-proof teak chairs with ergonomically curved backrests and 20 years guarantee."
          });
        }

        if (allRes.ok) {
          const allData = await allRes.json();
          setRelatedProducts((allData.data || []).slice(0, 4));
        }
      } catch (err) {
        console.error("Error fetching product", err);
      } finally {
        setLoading(false);
      }
    }

    if (productId) fetchProduct();
  }, [productId]);

  // DYNAMIC GALLERY THUMBNAIL GENERATOR ("CHAIR ALADA KORE DEKHA JACCHE")
  const getProductGallery = (prod) => {
    if (!prod) return [];
    
    // If backend returns valid multi-image gallery array
    if (prod.gallery && Array.isArray(prod.gallery) && prod.gallery.length > 1) {
      return prod.gallery.map((img) => (typeof img === 'string' ? { url: img, label: 'Angle View' } : img));
    }

    const mainImg = prod.image || "https://haatfurniture.com/wp-content/uploads/2023/09/dining-table-6-chair-haat-furniture.jpg";
    const cat = (prod.category || prod.name || "").toLowerCase();

    // Dining Set / Chair Specific Gallery Views
    if (cat.includes("dining") || cat.includes("dinning") || cat.includes("table") || cat.includes("chair")) {
      return [
        { url: mainImg, label: "Full Set View / সম্পূর্ণ ডাইনিং সেট" },
        { url: "https://haatfurniture.com/wp-content/uploads/2023/11/school-bench.jpg", label: "Single Chair Angle / চেয়ার আলাদা ভিউ" },
        { url: "https://haatfurniture.com/wp-content/uploads/2023/02/T1.jpg", label: "Glass & Wood Top / টেবিল ও গ্লাস ভিউ" },
        { url: "https://haatfurniture.com/wp-content/uploads/2023/02/18.jpg", label: "Side Perspective / সাইড ভিউ" }
      ];
    }
    
    // Bed Room / Almirah / Wardrobe
    if (cat.includes("bed") || cat.includes("almirah") || cat.includes("wardrobe") || cat.includes("dresser")) {
      return [
        { url: mainImg, label: "Main View / মেইন ভিউ" },
        { url: "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg", label: "Headboard & Carving / খোদাই ফিনিশিং ভিউ" },
        { url: "https://haatfurniture.com/wp-content/uploads/2023/03/Wheel-Bed-Angle.jpg", label: "Side Perspective / সাইড ভিউ" },
        { url: "https://haatfurniture.com/wp-content/uploads/2023/03/Pentagon-Bed-Angle.jpg", label: "Structure Detail / সলিড কাটের ভিউ" }
      ];
    }

    // Default Living Room / Sofa
    return [
      { url: mainImg, label: "Main Set View / মেইন ভিউ" },
      { url: "https://haatfurniture.com/wp-content/uploads/2023/09/sofa-set-haat-furniture.jpg", label: "Armchair Close-up / সিঙ্গেল চেয়ার ভিউ" },
      { url: "https://haatfurniture.com/wp-content/uploads/2023/11/sofa.jpg", label: "Center Table Detail / টি-টেবিল ভিউ" },
      { url: "https://haatfurniture.com/wp-content/uploads/2023/02/S1-1.jpg", label: "Texture & Cushion / কুশন ভিউ" }
    ];
  };

  const galleryList = getProductGallery(product);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 font-sans">
        <div className="text-center space-y-4 animate-pulse">
          <span className="text-5xl inline-block animate-bounce">🪑</span>
          <h2 className="text-xl font-bold text-slate-700">Loading Product Details...</h2>
        </div>
      </div>
    );
  }

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
        
        {/* MAIN PRODUCT CARD CONTAINER MATCHING USER SCREENSHOT */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 p-6 sm:p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: VERTICAL THUMBNAIL GALLERY & MAIN IMAGE */}
            <div className="md:col-span-6 flex flex-col sm:flex-row gap-4 items-start">
              
              {/* Vertical Thumbnail List with Up/Down Controls */}
              <div className="flex sm:flex-col items-center gap-2 flex-shrink-0 w-full sm:w-auto overflow-x-auto sm:overflow-visible py-1">
                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev - 1 + galleryList.length) % galleryList.length)}
                  className="w-full sm:w-16 h-7 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold items-center justify-center border border-slate-200 hidden sm:flex"
                >
                  ▲
                </button>

                <div className="flex sm:flex-col gap-2.5">
                  {galleryList.map((item, idx) => {
                    const imgUrl = typeof item === 'string' ? item : item.url;
                    const labelText = typeof item === 'string' ? `View ${idx + 1}` : item.label;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        onMouseEnter={() => setActiveImageIndex(idx)}
                        title={labelText}
                        className={`w-16 h-16 sm:w-18 sm:h-18 rounded-xl border-2 overflow-hidden p-1.5 bg-white transition-all relative group ${activeImageIndex === idx ? 'border-amber-600 ring-2 ring-amber-500/20 shadow-md scale-102' : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-400'}`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Thumbnail ${idx + 1}`}
                          className="w-full h-full object-contain filter drop-shadow-sm"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&auto=format&fit=crop&q=80";
                          }}
                        />
                        {activeImageIndex === idx && (
                          <div className="absolute inset-x-0 bottom-0 bg-amber-600 text-white text-[8px] font-black text-center py-0.5 uppercase tracking-tighter">
                            Active
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveImageIndex((prev) => (prev + 1) % galleryList.length)}
                  className="w-full sm:w-16 h-7 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold items-center justify-center border border-slate-200 hidden sm:flex"
                >
                  ▼
                </button>
              </div>

              {/* Main Display Product Image */}
              <div className="w-full h-80 sm:h-96 rounded-2xl border border-slate-200 bg-slate-50/50 p-4 flex flex-col items-center justify-center relative group overflow-hidden">
                <img
                  key={activeImageIndex}
                  src={galleryList[activeImageIndex]?.url || product?.image}
                  alt={product?.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80";
                  }}
                />

                {/* View Angle Label Badge */}
                {galleryList[activeImageIndex]?.label && (
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md">
                    📷 {galleryList[activeImageIndex].label}
                  </div>
                )}

                {/* Zoom Icon Button */}
                <button
                  type="button"
                  className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center text-sm shadow-md border border-slate-200"
                  title="Expand Fullview"
                >
                  ⛶
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN: PRODUCT DETAILS & PURCHASING */}
            <div className="md:col-span-6 space-y-4">
              
              {/* Breadcrumb Navigation matching screenshot */}
              <nav className="text-xs text-slate-500 flex items-center flex-wrap gap-1">
                <Link href="/" className="hover:text-slate-800">Home</Link>
                <span>/</span>
                <span className="hover:text-slate-800">Home Furniture</span>
                <span>/</span>
                <span className="hover:text-slate-800">{product?.category || 'Dinning Room'}</span>
                <span>/</span>
                <span className="hover:text-slate-800">{product?.sub_category || 'Dinning Set'}</span>
                <span>/</span>
                <span className="font-bold text-slate-800">{product?.name}</span>
              </nav>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {product?.name}
              </h1>

              {/* Price Tag in Green Font matching screenshot */}
              <div className="text-2xl font-bold text-lime-600 flex items-center gap-2">
                <span>৳ {product?.price?.toLocaleString()} BDT</span>
                {product?.old_price && (
                  <span className="text-slate-400 text-base line-through font-normal"> ৳ {product?.old_price?.toLocaleString()}</span>
                )}
              </div>

              {/* Metadata list */}
              <div className="text-xs text-slate-500 space-y-1.5 pt-1 border-t border-slate-100">
                <p><strong className="text-slate-700">SKU:</strong> {product?.sku || 'HAAT-DIN-620'}</p>
                <p>
                  <strong className="text-slate-700">Categories:</strong> {product?.category || 'Dinning Room, Dinning Set, Home Furniture'}
                </p>
                <p><strong className="text-slate-700">Tag:</strong> {product?.tag || 'dinning'}</p>
              </div>

              {/* Variation Selection Dropdown matching screenshot */}
              <div className="pt-2 space-y-2">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                  <label htmlFor="sizeSelect">Size / সেট অপশন:</label>
                  <select
                    id="sizeSelect"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs text-slate-700 focus:outline-none focus:border-amber-500 w-52 font-bold cursor-pointer"
                  >
                    <option value="">Choose an option / পছন্দ করুন</option>
                    <option value="6-chair">6 Chair Set (66" x 40" x 30")</option>
                    <option value="4-chair">4 Chair Set (54" x 36" x 30")</option>
                  </select>
                </div>
              </div>

              {/* Quantity Counter & Red Add to Cart Button matching screenshot */}
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

        {/* TABBED INFORMATION CONTAINER MATCHING USER SCREENSHOT */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
          
          {/* Tab Navigation Header */}
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

          {/* Tab Content */}
          <div className="p-6 sm:p-8 space-y-4 text-xs leading-relaxed text-slate-600">
            {activeTab === "description" && (
              <div className="space-y-3">
                <h4 className="font-bold text-lime-600 text-sm">Description</h4>
                <p>
                  <strong className="text-slate-800">Materials:</strong> {product?.materials || "Imported oak veneer wood / 100% Solid Segun Wood."}
                </p>
                <p>
                  <strong className="text-slate-800">Color Option:</strong> {product?.color_options || "Antique, Mid Light, Wooden Lacquer Finish."}
                </p>
                <p>
                  <strong className="text-slate-800">Glass at top of Table:</strong> 10MM Tempered Glass.
                </p>
                <p>
                  <strong className="text-slate-800">4 Chairs Set Table Top Size:</strong> L: 54" x W: 36" x H: 30"
                </p>
                <p>
                  <strong className="text-slate-800">6 Chairs Set Table Top Size:</strong> L: 66" x W: 40" x H: 30"
                </p>
                <p className="pt-2 text-slate-500 border-t border-slate-100">
                  {product?.description || "Authentic handcrafted solid teak wood furniture with 20 years anti-borer and anti-termite guarantee."}
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
                <p><strong className="text-slate-800">Outside Dhaka:</strong> Courier / Truck transport with protective foam packaging.</p>
              </div>
            )}
          </div>

        </div>

        {/* RELATED PRODUCTS SECTION MATCHING USER SCREENSHOT */}
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
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&auto=format&fit=crop&q=80";
                    }}
                  />
                </div>

                <div className="pt-3 text-center space-y-1">
                  <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-red-600 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs font-black text-lime-600">৳ {item.price?.toLocaleString()} BDT</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
