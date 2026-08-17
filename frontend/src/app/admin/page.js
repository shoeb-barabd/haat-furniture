'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import productsData from "../products_128_data.json";

export default function AdminDashboard() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [products, setProducts] = useState(productsData);
  const [categories, setCategories] = useState([
    { id: 1, name: "Home Furniture", slug: "home-furniture", icon: "🏠", count: "126 Products" },
    { id: 2, name: "Bed Room", slug: "bed-room", icon: "🛏️", count: "54 Products" },
    { id: 3, name: "Dinning Room", slug: "dinning-room", icon: "🍽️", count: "28 Products" },
    { id: 4, name: "Living Room", slug: "living-room", icon: "🛋️", count: "32 Products" },
    { id: 5, name: "Office Furniture", slug: "office-furniture", icon: "🏢", count: "2 Products" },
    { id: 6, name: "Door Collection", slug: "door", icon: "🚪", count: "10 Products" }
  ]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("products"); // products | add-product | categories | orders | analytics | bulk-discount | inquiries
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  // Modal States
  const [printableInvoice, setPrintableInvoice] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCatModal, setShowCatModal] = useState(false);

  // Bulk Discount Form State
  const [bulkDiscountCat, setBulkDiscountCat] = useState("all");
  const [bulkDiscountPercent, setBulkDiscountPercent] = useState(10);

  // Customer Inquiries
  const [inquiries, setInquiries] = useState([
    { id: 1, name: "Dr. Rakib Hasan", phone: "01799887766", message: "Want custom 8-chair Teak Dining Table with marble top size 7ft x 3.5ft.", date: "2026-08-17", status: "New" },
    { id: 2, name: "Engr. Farhana Islam", phone: "01811223344", message: "Is delivery to Sylhet Sadar included with wooden crating protection?", date: "2026-08-16", status: "Replied" }
  ]);

  // Category Form State
  const [catFormData, setCatFormData] = useState({ name: "", slug: "", icon: "🪑", count: "0 Products" });

  // Live Customer Orders
  const [orders, setOrders] = useState([
    {
      id: "ORD-9821",
      customer: "Mahin Ahmed",
      phone: "+8801957909186",
      address: "House #12, Road #4, Badda, Dhaka",
      items: "Beijing Dining 4 Chair Set (x1), Bullet Teak Door (x1)",
      total: 62560,
      subtotal: 62500,
      shipping: 60,
      status: "Processing",
      date: "2026-08-17"
    },
    {
      id: "ORD-9822",
      customer: "Walid Ahmed",
      phone: "+8801711223344",
      address: "Sector 3, Uttara, Dhaka",
      items: "Wheel Dressing Table (x1)",
      total: 22560,
      subtotal: 22500,
      shipping: 60,
      status: "Delivered",
      date: "2026-08-16"
    },
    {
      id: "ORD-9823",
      customer: "Tanvir Hossain",
      phone: "+8801811223344",
      address: "GEC Circle, Chittagong",
      items: "Crown Royal Segun Teak Bed (x1)",
      total: 30150,
      subtotal: 30000,
      shipping: 150,
      status: "Pending",
      date: "2026-08-16"
    }
  ]);

  // Form State for Add / Edit Product
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    old_price: "",
    category: "Home Furniture",
    category_slug: "home-furniture",
    image: "",
    gallery_images: [],
    wood_type: "100% Solid Chittagong Teak Wood",
    warranty: "20 Years Guarantee",
    badge: "New Arrival",
    description: ""
  });

  // Check Local Session Authentication
  useEffect(() => {
    const savedAuth = localStorage.getItem("haat_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");
    const validUsers = ["walid2420", "admin", "haatadmin", "haatjjog"];
    const validPasses = ["jony1234@@##$$", "@Haat#$2026#", "admin123", "Q9QlL1n6Wxu7"];

    if (validUsers.includes(loginUser.trim().toLowerCase()) && validPasses.includes(loginPass)) {
      localStorage.setItem("haat_admin_auth", "true");
      setIsAuthenticated(true);
      showToast("Welcome to HAAT FURNITURE Admin Control Center!");
    } else {
      setLoginError("Invalid Username or Password! Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("haat_admin_auth");
    setIsAuthenticated(false);
    setLoginUser("");
    setLoginPass("");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  // FEATURE 1: 1-CLICK OFFICIAL INVOICE GENERATOR & PRINT
  const handlePrintInvoice = (order) => {
    setPrintableInvoice(order);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // FEATURE 2: 1-CLICK WHATSAPP DISPATCHER
  const handleSendWhatsAppOrder = (order) => {
    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('880') ? cleanPhone : `880${cleanPhone.replace(/^0/, '')}`;
    const message = `Assalamu Alaikum ${order.customer}! 🌟\n\nYour HAAT Furniture Limited Order #${order.id} for "${order.items}" (Total: ৳${order.total.toLocaleString()} BDT) has been confirmed and dispatched for home delivery!\n\n🛡️ Includes 20-Year Anti-Borer & Termite Proof Warranty Card.\n📞 Hotline: +8809617333990\n🏬 Showrooms: Badda & Mirpur, Dhaka.`;
    
    const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    showToast(`WhatsApp Order Dispatch sent to ${order.customer}!`);
  };

  // FEATURE 4: BULK DISCOUNT & PRICE MANAGER
  const handleApplyBulkDiscount = (e) => {
    e.preventDefault();
    if (!confirm(`Are you sure you want to apply a ${bulkDiscountPercent}% discount across selected products?`)) return;

    const discountFactor = (100 - bulkDiscountPercent) / 100;
    const updated = products.map((p) => {
      const pCats = p.categories || [];
      if (bulkDiscountCat === "all" || pCats.includes(bulkDiscountCat)) {
        return {
          ...p,
          oldPrice: p.price,
          price: Math.round(p.price * discountFactor)
        };
      }
      return p;
    });

    setProducts(updated);
    showToast(`Applied ${bulkDiscountPercent}% discount to selected products!`);
  };

  // FEATURE 5: DRAG & DROP MULTI-ANGLE GALLERY UPLOADER
  const handleAddGalleryImageUrl = () => {
    const url = prompt("Enter additional angle image URL (e.g. https://haatfurniture.com/wp-content/uploads/...)");
    if (url) {
      setFormData({ ...formData, gallery_images: [...formData.gallery_images, url] });
      showToast("Added gallery image!");
    }
  };

  // CATEGORY CRUD
  const handleSaveCategory = (e) => {
    e.preventDefault();
    if (!catFormData.name) return;
    const slug = catFormData.slug ? catFormData.slug.toLowerCase().replace(/\s+/g, '-') : catFormData.name.toLowerCase().replace(/\s+/g, '-');

    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? { ...c, name: catFormData.name, slug, icon: catFormData.icon } : c));
      showToast(`Updated Category: "${catFormData.name}"`);
    } else {
      setCategories([...categories, { id: Date.now(), name: catFormData.name, slug, icon: catFormData.icon || "🪑", count: "0 Products" }]);
      showToast(`Created Category: "${catFormData.name}"`);
    }
    setShowCatModal(false);
  };

  const handleDeleteCategory = (catId) => {
    if (confirm("Delete this category?")) {
      setCategories(categories.filter(c => c.id !== catId));
      showToast("Category removed!");
    }
  };

  // PRODUCT CRUD
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? {
        ...p,
        name: formData.name,
        price: parseFloat(formData.price),
        oldPrice: formData.old_price ? parseFloat(formData.old_price) : null,
        image: formData.image || p.image,
        gallery: formData.gallery_images.length > 0 ? formData.gallery_images : p.gallery,
        description: formData.description
      } : p));
      showToast(`Updated: "${formData.name}"`);
    } else {
      const newP = {
        id: Date.now(),
        name: formData.name,
        price: parseFloat(formData.price),
        oldPrice: formData.old_price ? parseFloat(formData.old_price) : null,
        categories: [formData.category_slug || 'home-furniture'],
        category_names: [formData.category],
        image: formData.image || "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
        gallery: formData.gallery_images,
        description: formData.description || "Solid Chittagong Segun Wood."
      };
      setProducts([newP, ...products]);
      showToast(`Published: "${newP.name}"`);
    }
    setActiveTab("products");
    resetForm();
  };

  const startEditProduct = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      price: p.price,
      old_price: p.oldPrice || "",
      category: p.category || "Home Furniture",
      category_slug: p.categories ? p.categories[0] : "home-furniture",
      image: p.image || "",
      gallery_images: p.gallery || [p.image],
      wood_type: p.wood_type || "100% Solid Chittagong Teak Wood",
      warranty: p.warranty || "20 Years Guarantee",
      badge: p.badge || "New Arrival",
      description: p.description || ""
    });
    setActiveTab("add-product");
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: "", old_price: "", category: "Home Furniture", category_slug: "home-furniture", image: "", gallery_images: [], wood_type: "100% Solid Chittagong Teak Wood", warranty: "20 Years Guarantee", badge: "New Arrival", description: "" });
  };

  const handleDeleteProduct = (id) => {
    if (confirm("Delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
      showToast("Product deleted!");
    }
  };

  const filteredProducts = products.filter(p => (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()));
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // ----------------------------------------------------
  // LOGIN RENDER
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <img src="https://haatfurniture.com/wp-content/uploads/2023/02/haalogo.jpg" alt="Logo" className="h-12 w-auto mx-auto bg-white p-1 rounded-xl" />
            <h2 className="text-xl font-black text-white">HAAT FURNITURE LIMITED</h2>
            <p className="text-xs text-amber-500 font-bold uppercase tracking-widest">Admin Security Portal</p>
          </div>

          {loginError && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold text-center">{loginError}</div>}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Username</label>
              <input type="text" required value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Password</label>
              <input type={showPass ? "text" : "password"} required value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>

            <button type="submit" className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider">
              Secure Admin Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // AUTHENTICATED DASHBOARD RENDER
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col antialiased print:bg-white print:p-0">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl font-bold text-xs border border-slate-700 animate-bounce flex items-center gap-2 print:hidden">
          <span>✨</span><span>{toast}</span>
        </div>
      )}

      {/* TOP NAVBAR (HIDDEN IN PRINT) */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="https://haatfurniture.com/wp-content/uploads/2023/02/haalogo.jpg" alt="Logo" className="h-9 w-auto object-contain" />
            <div className="border-l border-slate-200 pl-3">
              <span className="text-base font-black text-red-600">HAAT</span>
              <span className="text-xs font-black text-slate-900"> FURNITURE</span>
              <span className="text-[10px] text-amber-700 font-black block">Admin Control Center</span>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-1.5 text-xs font-black uppercase">
            <button onClick={() => setActiveTab("products")} className={`px-3.5 py-2 rounded-xl ${activeTab === "products" ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              📦 Products ({products.length})
            </button>
            <button onClick={() => { resetForm(); setActiveTab("add-product"); }} className={`px-3.5 py-2 rounded-xl ${activeTab === "add-product" ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              ➕ Add Product
            </button>
            <button onClick={() => setActiveTab("orders")} className={`px-3.5 py-2 rounded-xl ${activeTab === "orders" ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              🛒 Orders ({orders.length})
            </button>
            <button onClick={() => setActiveTab("categories")} className={`px-3.5 py-2 rounded-xl ${activeTab === "categories" ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              🗂️ Categories ({categories.length})
            </button>
            <button onClick={() => setActiveTab("analytics")} className={`px-3.5 py-2 rounded-xl ${activeTab === "analytics" ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              📊 Analytics
            </button>
            <button onClick={() => setActiveTab("bulk-discount")} className={`px-3.5 py-2 rounded-xl ${activeTab === "bulk-discount" ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              ⚡ Bulk Discount
            </button>
            <button onClick={() => setActiveTab("inquiries")} className={`px-3.5 py-2 rounded-xl ${activeTab === "inquiries" ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              💬 Inquiries ({inquiries.length})
            </button>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/" className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-black">🌐 Storefront</Link>
            <button onClick={handleLogout} className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-black">Logout</button>
          </div>
        </div>
      </header>

      {/* PRINTABLE INVOICE / CHALLAN MODAL (VISIBLE WHEN PRINTING) */}
      {printableInvoice && (
        <div className="hidden print:block fixed inset-0 bg-white p-8 text-black font-sans leading-relaxed">
          <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight">HAAT FURNITURE LIMITED</h1>
              <p className="text-xs font-bold">100% Solid Chittagong Segun Teak Wood Heritage</p>
              <p className="text-[10px]">Showrooms: Merul Badda & Mirpur 10, Dhaka | Hotline: +8809617333990</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold uppercase">OFFICIAL CASH MEMO & CHALLAN</h2>
              <p className="text-xs">Invoice #: <strong>{printableInvoice.id}</strong></p>
              <p className="text-xs">Date: {printableInvoice.date}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-xs mb-6 border p-4 rounded">
            <div>
              <h3 className="font-bold border-b pb-1 mb-1">CUSTOMER BILLING ADDRESS:</h3>
              <p><strong>Name:</strong> {printableInvoice.customer}</p>
              <p><strong>Phone:</strong> {printableInvoice.phone}</p>
              <p><strong>Address:</strong> {printableInvoice.address}</p>
            </div>
            <div>
              <h3 className="font-bold border-b pb-1 mb-1">WARRANTY & DELIVERY TERMS:</h3>
              <p>✔ 20-Year Anti-Borer & Termite Proof Warranty Card Included</p>
              <p>✔ Free Assembly & Fitting Services</p>
              <p>✔ Status: {printableInvoice.status}</p>
            </div>
          </div>

          <table className="w-full text-left text-xs border-collapse mb-6">
            <thead>
              <tr className="border-y-2 border-black font-bold bg-slate-100">
                <th className="p-2">Item Description</th>
                <th className="p-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-bold">{printableInvoice.items}</td>
                <td className="p-2 text-right font-bold">৳{printableInvoice.subtotal.toLocaleString()} BDT</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Delivery / Home Transport Fee</td>
                <td className="p-2 text-right">৳{printableInvoice.shipping} BDT</td>
              </tr>
              <tr className="border-t-2 border-black font-black text-sm">
                <td className="p-2">GRAND TOTAL AMOUNT:</td>
                <td className="p-2 text-right text-emerald-700">৳{printableInvoice.total.toLocaleString()} BDT</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-12 pt-8 border-t flex justify-between text-xs font-bold">
            <div className="text-center">
              <div className="w-36 border-b border-black mb-1"></div>
              <span>Customer Signature</span>
            </div>
            <div className="text-center">
              <div className="w-36 border-b border-black mb-1"></div>
              <span>Authorized Signature (HAAT Furniture Ltd)</span>
            </div>
          </div>
        </div>
      )}

      {/* MAIN BODY AREA (HIDDEN WHEN PRINTING) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8 print:hidden">
        
        {/* Analytics Top Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-500 uppercase">Live Products</span>
            <p className="text-2xl font-black text-slate-900">{products.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-500 uppercase">Total Categories</span>
            <p className="text-2xl font-black text-amber-600">{categories.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-500 uppercase">Revenue Tracked</span>
            <p className="text-2xl font-black text-emerald-600">৳ {totalRevenue.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-500 uppercase">Pending Inquiries</span>
            <p className="text-2xl font-black text-purple-600">{inquiries.length}</p>
          </div>
        </div>

        {/* TAB 1: ALL PRODUCTS DATA TABLE */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-900">Products Catalog ({products.length})</h2>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs w-64"
              />
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase text-[10px] font-black border-b">
                  <tr>
                    <th className="p-3">Image</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredProducts.slice(0, 15).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3"><img src={p.image} alt={p.name} className="w-10 h-10 object-contain rounded bg-slate-50 border p-0.5" /></td>
                      <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{p.name}</td>
                      <td className="p-3 font-black text-emerald-600">৳ {p.price?.toLocaleString()}</td>
                      <td className="p-3 text-slate-500 font-bold">{p.category || 'Solid Segun'}</td>
                      <td className="p-3 text-right space-x-2">
                        <button onClick={() => startEditProduct(p)} className="px-2.5 py-1 rounded bg-amber-50 text-amber-800 font-bold text-[11px]">Edit</button>
                        <button onClick={() => handleDeleteProduct(p.id)} className="px-2.5 py-1 rounded bg-red-50 text-red-600 font-bold text-[11px]">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ADD / EDIT PRODUCT WITH FEATURE 5: MULTI-ANGLE GALLERY UPLOADER */}
        {activeTab === "add-product" && (
          <div className="max-w-3xl bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mx-auto space-y-4">
            <h3 className="text-xl font-black text-slate-900">{editingProduct ? `Edit Product (#${editingProduct.id})` : "Publish New Product"}</h3>
            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border bg-slate-50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (BDT) *</label>
                  <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border bg-slate-50" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Main Image URL</label>
                  <input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border bg-slate-50" />
                </div>
              </div>

              {/* FEATURE 5: MULTI-ANGLE GALLERY UPLOADER */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-black text-slate-900">🖼️ Multi-Angle Gallery Images ({formData.gallery_images.length})</span>
                  <button type="button" onClick={handleAddGalleryImageUrl} className="px-3 py-1 bg-amber-600 text-white rounded font-bold text-[11px]">
                    + Add Angle Image URL
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.gallery_images.map((gUrl, gIdx) => (
                    <div key={gIdx} className="w-14 h-14 rounded-lg border bg-white p-1 relative group">
                      <img src={gUrl} alt={`Angle ${gIdx}`} className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-black uppercase">
                {editingProduct ? 'Save Product Changes' : 'Publish Product'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: LIVE ORDERS WITH FEATURE 1 (PDF INVOICE) & FEATURE 2 (WHATSAPP DISPATCH) */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Customer Orders</h2>
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase text-[10px] font-black border-b">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Ordered Items</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3 text-right">Actions & Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{o.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{o.customer}</div>
                        <div className="text-[10px] text-slate-500">{o.phone} • {o.address}</div>
                      </td>
                      <td className="p-3 font-bold text-slate-800 max-w-xs">{o.items}</td>
                      <td className="p-3 font-black text-emerald-600">৳ {o.total.toLocaleString()}</td>
                      <td className="p-3 text-right space-x-2">
                        {/* FEATURE 1: 1-CLICK INVOICE PRINT */}
                        <button
                          onClick={() => handlePrintInvoice(o)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 shadow"
                        >
                          📄 Print Invoice
                        </button>
                        
                        {/* FEATURE 2: 1-CLICK WHATSAPP DISPATCH */}
                        <button
                          onClick={() => handleSendWhatsAppOrder(o)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 shadow"
                        >
                          📲 WhatsApp Order
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES WITH EDIT & ADD MODAL */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">Categories</h3>
              <button onClick={() => { setEditingCategory(null); setCatFormData({ name: "", slug: "", icon: "🪑", count: "0 Products" }); setShowCatModal(true); }} className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-black">
                + Add Category
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div key={cat.id || cat.slug} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
                  <div className="text-3xl">{cat.icon || '🪑'}</div>
                  <h4 className="text-lg font-black text-slate-900">{cat.name}</h4>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingCategory(cat); setCatFormData({ name: cat.name, slug: cat.slug, icon: cat.icon, count: cat.count }); setShowCatModal(true); }} className="flex-1 py-1.5 rounded bg-amber-50 text-amber-900 font-bold text-xs">✏️ Edit</button>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="px-3 py-1.5 rounded bg-red-50 text-red-600 font-bold text-xs">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FEATURE 3: TAB 5: SALES & REVENUE ANALYTICS REPORT */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900">📊 Sales & Revenue Analytics Report</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Top Category Sales</span>
                <h3 className="text-2xl font-black text-slate-900">Bed Room Furniture</h3>
                <p className="text-xs text-emerald-600 font-bold">45% of Total Sales Revenue</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Average Order Value</span>
                <h3 className="text-2xl font-black text-amber-600">৳ 38,420 BDT</h3>
                <p className="text-xs text-amber-700 font-bold">Solid Chittagong Segun Teak</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Completed Delivery Rate</span>
                <h3 className="text-2xl font-black text-emerald-600">98.5% Success</h3>
                <p className="text-xs text-slate-500 font-bold">Dhaka & 64 Districts</p>
              </div>
            </div>
          </div>
        )}

        {/* FEATURE 4: TAB 6: BULK DISCOUNT & PRICE MANAGER */}
        {activeTab === "bulk-discount" && (
          <div className="max-w-2xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">⚡ Bulk Discount & Price Manager</h2>
              <p className="text-xs text-slate-500 font-medium">Apply percentage discount across selected category items at once</p>
            </div>

            <form onSubmit={handleApplyBulkDiscount} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Category</label>
                <select value={bulkDiscountCat} onChange={(e) => setBulkDiscountCat(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border text-xs font-bold">
                  <option value="all">All Categories (128 Products)</option>
                  <option value="home-furniture">Home Furniture</option>
                  <option value="bed-room">Bed Room</option>
                  <option value="dinning-room">Dinning Room</option>
                  <option value="living-room">Living Room</option>
                  <option value="sofa">Sofa</option>
                  <option value="almirah">Almirah</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Discount Percentage (%)</label>
                <input type="number" min="1" max="50" value={bulkDiscountPercent} onChange={(e) => setBulkDiscountPercent(Number(e.target.value))} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border text-xs font-bold text-amber-600" />
              </div>

              <button type="submit" className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black uppercase text-xs shadow-lg">
                Apply Bulk Discount Now
              </button>
            </form>
          </div>
        )}

        {/* FEATURE 6: TAB 7: CUSTOMER INQUIRIES & MESSAGES MANAGER */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">💬 Customer Inquiries ({inquiries.length})</h2>
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase text-[10px] font-black border-b">
                  <tr>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Message</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{inq.name} <br/><span className="text-[10px] text-slate-500 font-normal">{inq.phone}</span></td>
                      <td className="p-3 max-w-md text-slate-800">{inq.message}</td>
                      <td className="p-3 text-slate-500">{inq.date}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px] uppercase">{inq.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
