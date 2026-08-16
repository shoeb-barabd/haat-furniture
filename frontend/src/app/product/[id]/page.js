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
  const [cart, setCart] = useState([]);
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
        const res = await fetch(`http://localhost:8000/api/v1/products/${productId}`);
        const allRes = await fetch(`http://localhost:8000/api/v1/products`);
        
        if (res.ok) {
          const data = await res.json();
          const p = data.data || data;
          setProduct(p);
        } else {
          // Fallback mockup if API returns 404 or fails
          setProduct({
            id: productId,
            name: "Lily 3-Door Solid Segun Almirah",
            price: 22500,
            old_price: 64000,
            sku: "HAAT-ALM-089",
            category: "Bed Room",
            sub_category: "Almirah",
            tag: "home",
            image: "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
            gallery: [
              "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
              "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
              "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg"
            ],
            materials: "Imported Chittagong 100% Solid Segun Wood.",
            color_options: "Antique, Mid Light, Wooden Lacquer Finish.",
            dimensions: 'L: 62" x W: 21" x H: 75"',
            description: "High-durability 3-door solid teak wood Almirah crafted for modern bedrooms. Features internal lockable drawers, clothes hanging rods, and 20 years anti-borer guarantee."
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
      showToast(`Added ${quantity} x "${product.name}" to Cart! Redirecting to Checkout...`);

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="text-center space-y-4 animate-pulse">
          <span className="text-5xl inline-block animate-bounce">🪑</span>
          <h2 className="text-xl font-bold text-slate-700">Loading Product Details...</h2>
        </div>
      </div>
    );
  }

  const galleryImages = product?.gallery && product.gallery.length > 0
    ? product.gallery
    : [product?.image, product?.image, product?.image];

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
        <Link href="/" className="font-extrabold text-blue-400 hover:underline flex items-center gap-1">
          <span>← Back to Haat Furniture Storefront</span>
        </Link>
        <span className="text-slate-400 hidden sm:inline">📞 Hotline: +8809617333990</span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* MAIN PRODUCT CARD CONTAINER MATCHING USER SCREENSHOT */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: VERTICAL THUMBNAIL GALLERY & MAIN IMAGE */}
            <div className="md:col-span-6 flex flex-col sm:flex-row gap-4 items-start">
              
              {/* Vertical Thumbnail List with Up/Down Arrows */}
              <div className="flex sm:flex-col items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                  className="w-8 h-8 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold flex items-center justify-center border border-slate-200"
                >
                  ▲
                </button>

                <div className="flex sm:flex-col gap-2.5">
                  {galleryImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded border overflow-hidden p-1 bg-white transition-all ${activeImageIndex === idx ? 'border-slate-800 ring-1 ring-slate-800 shadow-sm' : 'border-slate-200 opacity-70 hover:opacity-100'}`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setActiveImageIndex((prev) => (prev + 1) % galleryImages.length)}
                  className="w-8 h-8 rounded bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs font-bold flex items-center justify-center border border-slate-200"
                >
                  ▼
                </button>
              </div>

              {/* Main Product Image Container */}
              <div className="w-full h-80 sm:h-96 rounded border border-slate-200 bg-white p-4 flex items-center justify-center relative group">
                <img
                  src={galleryImages[activeImageIndex] || product?.image}
                  alt={product?.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80";
                  }}
                />

                {/* Zoom Icon Button */}
                <button className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm shadow-sm border border-slate-200">
                  ⛶
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN: PRODUCT INFORMATION & PURCHASE OPTIONS */}
            <div className="md:col-span-6 space-y-4">
              
              {/* Breadcrumb Navigation matching screenshot */}
              <nav className="text-xs text-slate-500 flex items-center flex-wrap gap-1">
                <Link href="/" className="hover:text-slate-800">Home</Link>
                <span>/</span>
                <span className="hover:text-slate-800">Home Furniture</span>
                <span>/</span>
                <span className="hover:text-slate-800">{product?.category || 'Bed Room'}</span>
                <span>/</span>
                <span className="hover:text-slate-800">{product?.sub_category || 'Almirah'}</span>
                <span>/</span>
                <span className="font-bold text-slate-800">{product?.name}</span>
              </nav>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {product?.name}
              </h1>

              {/* Price Tag in Green Font matching screenshot */}
              <div className="text-xl sm:text-2xl font-bold text-lime-600 flex items-center gap-2">
                <span>৳ {product?.price?.toLocaleString()}</span>
                {product?.old_price && (
                  <span className="text-lime-600 font-bold"> – ৳ {product?.old_price?.toLocaleString()}</span>
                )}
              </div>

              {/* Metadata list */}
              <div className="text-xs text-slate-500 space-y-1.5 pt-1">
                <p><strong className="text-slate-700">SKU:</strong> {product?.sku || 'N/A'}</p>
                <p>
                  <strong className="text-slate-700">Categories:</strong> {product?.category || 'Almirah, Bed Room, Home Furniture'}
                </p>
                <p><strong className="text-slate-700">Tag:</strong> {product?.tag || 'home'}</p>
              </div>

              {/* Variation Selection Dropdown matching screenshot */}
              <div className="pt-3 space-y-2">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                  <label htmlFor="sizeSelect">Size :</label>
                  <select
                    id="sizeSelect"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="px-3 py-2 rounded border border-slate-300 bg-white text-xs text-slate-700 focus:outline-none focus:border-slate-500 w-48"
                  >
                    <option value="">Choose an option</option>
                    <option value="6x7">Standard 62" x 21" x 75"</option>
                    <option value="custom">Custom Dimension</option>
                  </select>
                </div>
              </div>

              {/* Quantity Counter & Red Add to Cart Button matching screenshot */}
              <div className="flex items-center gap-3 pt-4">
                <div className="flex items-center border border-slate-300 rounded bg-white overflow-hidden text-xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-2.5 py-2 hover:bg-slate-100 text-slate-600 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3.5 py-2 font-bold text-slate-800 border-x border-slate-200">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-2.5 py-2 hover:bg-slate-100 text-slate-600 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={addToCart}
                  className="px-6 py-2.5 rounded bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-colors"
                >
                  ADD TO CART
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* TABBED INFORMATION CONTAINER MATCHING USER SCREENSHOT */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden">
          
          {/* Tab Navigation Header */}
          <div className="flex items-center justify-center border-b border-slate-200 text-xs font-bold text-slate-600">
            <button
              onClick={() => setActiveTab("description")}
              className={`px-6 py-3.5 border-b-2 uppercase tracking-wider transition-all ${activeTab === "description" ? 'border-lime-500 text-slate-900 font-black' : 'border-transparent hover:text-slate-900'}`}
            >
              DESCRIPTION
            </button>
            <button
              onClick={() => setActiveTab("additional")}
              className={`px-6 py-3.5 border-b-2 uppercase tracking-wider transition-all ${activeTab === "additional" ? 'border-lime-500 text-slate-900 font-black' : 'border-transparent hover:text-slate-900'}`}
            >
              ADDITIONAL INFORMATION
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`px-6 py-3.5 border-b-2 uppercase tracking-wider transition-all ${activeTab === "shipping" ? 'border-lime-500 text-slate-900 font-black' : 'border-transparent hover:text-slate-900'}`}
            >
              SHIPPING & DELIVERY
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8 space-y-4 text-xs leading-relaxed text-slate-600">
            {activeTab === "description" && (
              <div className="space-y-4">
                <h4 className="font-bold text-lime-600 text-sm">Description</h4>
                <p>
                  <strong className="text-slate-800">Materials:</strong> {product?.materials || "Imported oak veneer wood / 100% Solid Segun Wood."}
                </p>
                <p>
                  <strong className="text-slate-800">Color Option:</strong> {product?.color_options || "Antique, Mid Light, Wooden Lacquer."}
                </p>
                <p>
                  <strong className="text-slate-800">Size:</strong> {product?.dimensions || 'L: 62" x W: 21" x H: 75"'}
                </p>
                <p className="pt-2 text-slate-500">
                  {product?.description || "Authentic handcrafted solid teak wood furniture with 20 years anti-borer and anti-termite guarantee."}
                </p>
              </div>
            )}

            {activeTab === "additional" && (
              <div className="space-y-2">
                <p><strong className="text-slate-800">Warranty:</strong> 20 Years Guarantee (Borer & Termite Proof)</p>
                <p><strong className="text-slate-800">Weight:</strong> Approx 120 kg</p>
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 sm:p-8 space-y-6">
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
                className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-between hover:shadow-md transition-all group"
              >
                <div className="h-44 bg-slate-50 rounded overflow-hidden flex items-center justify-center p-2">
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
