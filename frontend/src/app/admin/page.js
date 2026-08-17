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
  const [activeTab, setActiveTab] = useState("products"); // products | add-product | categories | orders
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  // Sample Live Customer Orders
  const [orders, setOrders] = useState([
    {
      id: "ORD-9821",
      customer: "Mahin Ahmed",
      phone: "+8801957909186",
      address: "House #12, Road #4, Badda, Dhaka",
      items: "Beijing Dining 4 Chair Set (x1), Bullet Teak Door (x1)",
      total: 62560,
      status: "Processing",
      date: "2026-08-17 10:30 AM"
    },
    {
      id: "ORD-9822",
      customer: "Walid Ahmed",
      phone: "+8801711223344",
      address: "Sector 3, Uttara, Dhaka",
      items: "Wheel Dressing Table (x1)",
      total: 22560,
      status: "Delivered",
      date: "2026-08-16 02:15 PM"
    },
    {
      id: "ORD-9823",
      customer: "Tanvir Hossain",
      phone: "+8801811223344",
      address: "GEC Circle, Chittagong",
      items: "Crown Royal Segun Teak Bed (x1)",
      total: 30150,
      status: "Pending",
      date: "2026-08-16 03:40 PM"
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

  // Handle Admin Login Submit
  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    const validUsers = ["walid2420", "admin", "haatadmin", "haatjjog"];
    const validPasses = ["jony1234@@##$$", "@Haat#$2026#", "admin123", "Q9QlL1n6Wxu7"];

    if (
      validUsers.includes(loginUser.trim().toLowerCase()) &&
      validPasses.includes(loginPass)
    ) {
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

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Please fill in Product Name and Price!");
      return;
    }

    if (editingProduct) {
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: formData.name,
              price: parseFloat(formData.price),
              oldPrice: formData.old_price ? parseFloat(formData.old_price) : null,
              category: formData.category,
              category_slug: formData.category_slug,
              image: formData.image || p.image,
              wood_type: formData.wood_type,
              warranty: formData.warranty,
              badge: formData.badge,
              description: formData.description
            }
          : p
      );
      setProducts(updated);
      showToast(`Updated Product: "${formData.name}"`);
      setEditingProduct(null);
    } else {
      const newProd = {
        id: Date.now(),
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        price: parseFloat(formData.price),
        oldPrice: formData.old_price ? parseFloat(formData.old_price) : null,
        categories: [formData.category_slug],
        category_names: [formData.category],
        image: formData.image || "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
        wood_type: formData.wood_type,
        warranty: formData.warranty,
        rating: 5.0,
        badge: formData.badge,
        description: formData.description || "Premium handcrafted solid Chittagong Segun teak furniture by Haat Furniture Limited."
      };
      setProducts([newProd, ...products]);
      showToast(`Successfully Published Product: "${newProd.name}"`);
    }

    setActiveTab("products");
    resetForm();
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      old_price: product.oldPrice || "",
      category: product.category || "Home Furniture",
      category_slug: product.categories ? product.categories[0] : "home-furniture",
      image: product.image || "",
      wood_type: product.wood_type || "100% Solid Chittagong Teak Wood",
      warranty: product.warranty || "20 Years Guarantee",
      badge: product.badge || "New Arrival",
      description: product.description || ""
    });
    setActiveTab("add-product");
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      old_price: "",
      category: "Home Furniture",
      category_slug: "home-furniture",
      image: "",
      wood_type: "100% Solid Chittagong Teak Wood",
      warranty: "20 Years Guarantee",
      badge: "New Arrival",
      description: ""
    });
  };

  const handleDeleteProduct = (id) => {
    if (confirm("Are you sure you want to delete this product entry?")) {
      setProducts(products.filter(p => p.id !== id));
      showToast("Product deleted from catalog successfully!");
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order ${orderId} status updated to "${newStatus}"`);
  };

  const filteredProducts = products.filter(p =>
    (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // ----------------------------------------------------
  // RENDER 1: LOGIN SCREEN (When Not Authenticated)
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4 selection:bg-amber-500 selection:text-slate-900 font-sans">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative space-y-6">
          
          {/* Top Logo & Title */}
          <div className="text-center space-y-2">
            <img
              src="https://haatfurniture.com/wp-content/uploads/2023/02/haalogo.jpg"
              alt="HAAT FURNITURE Logo"
              className="h-12 w-auto mx-auto object-contain rounded-xl border border-slate-700 p-1 bg-white"
            />
            <div className="pt-2">
              <h2 className="text-xl font-black tracking-wide text-white">HAAT FURNITURE LIMITED</h2>
              <p className="text-xs text-amber-500 font-bold uppercase tracking-widest mt-0.5">Admin Security Portal</p>
            </div>
          </div>

          {/* Login Error Notification */}
          {loginError && (
            <div className="p-3.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold text-center animate-pulse">
              ⚠️ {loginError}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-black uppercase text-[10px] tracking-wider mb-1.5">Username *</label>
              <input
                type="text"
                required
                placeholder="Enter admin username (e.g. admin)"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-black uppercase text-[10px] tracking-wider mb-1.5">Password *</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="Enter admin password"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full px-4 py-3.5 pr-10 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white text-sm"
                >
                  {showPass ? "👁️" : "🔒"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              🔐 Secure Admin Login
            </button>
          </form>

          {/* Back to Website Link */}
          <div className="text-center pt-2 border-t border-slate-800">
            <Link href="/" className="text-xs text-slate-400 hover:text-amber-400 font-bold transition-colors">
              ← Return to Haat Furniture Website
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER 2: AUTHENTICATED ADMIN DASHBOARD
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col antialiased selection:bg-slate-900 selection:text-white">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl font-bold text-xs border border-slate-700 animate-bounce flex items-center gap-2">
          <span>✨</span>
          <span>{toast}</span>
        </div>
      )}

      {/* TOP ULTRA-CLEAN NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-3">
            <img
              src="https://haatfurniture.com/wp-content/uploads/2023/02/haalogo.jpg"
              alt="HAAT FURNITURE LIMITED Logo"
              className="h-9 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="border-l border-slate-200 pl-3">
              <div className="flex items-baseline gap-1">
                <span className="text-base font-black text-red-600 tracking-tight">HAAT</span>
                <span className="text-xs font-black text-slate-900 uppercase tracking-tight">FURNITURE</span>
              </div>
              <span className="text-[10px] text-amber-700 font-black uppercase tracking-wider block">Admin Control Center</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex flex-wrap items-center gap-1.5 text-xs font-black uppercase tracking-wider">
            <button
              onClick={() => setActiveTab("products")}
              className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 ${activeTab === "products" ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <span>📦</span>
              <span>All Products ({products.length})</span>
            </button>

            <button
              onClick={() => { resetForm(); setActiveTab("add-product"); }}
              className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 ${activeTab === "add-product" ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <span>➕</span>
              <span>{editingProduct ? 'Edit Product' : 'Add Product'}</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 ${activeTab === "orders" ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <span>🛒</span>
              <span>Live Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 ${activeTab === "categories" ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <span>🗂️</span>
              <span>Categories ({categories.length})</span>
            </button>
          </nav>

          {/* Website & Logout Buttons */}
          <div className="flex items-center gap-2">
            <Link href="/" className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5 uppercase">
              <span>🌐</span> Website
            </Link>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all shadow-md flex items-center gap-1 uppercase"
              title="Secure Admin Logout"
            >
              <span>🚪</span> Logout
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT BODY */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Section Title Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {activeTab === "products" && "Product Catalog Management"}
              {activeTab === "add-product" && (editingProduct ? "Edit Product Details" : "Publish New Furniture Entry")}
              {activeTab === "categories" && "Furniture Collections"}
              {activeTab === "orders" && "Live Customer Order Tracking"}
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">Manage product inventory, pricing, images, and live customer orders in real-time</p>
          </div>

          {activeTab === "products" && (
            <button
              onClick={() => { resetForm(); setActiveTab("add-product"); }}
              className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider shadow-md"
            >
              + Add New Product
            </button>
          )}
        </div>

        {/* Overview Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Live Products</span>
            <p className="text-3xl font-black text-slate-900 mt-1">{products.length}</p>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">✓ Active in Storefront</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Product Categories</span>
            <p className="text-3xl font-black text-amber-600 mt-1">{categories.length}</p>
            <span className="text-[11px] text-amber-700 font-bold mt-1 inline-block">Teak & Solid Wood</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Order Volume</span>
            <p className="text-3xl font-black text-emerald-600 mt-1">৳ {totalRevenue.toLocaleString()}</p>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">BDT Revenue Tracked</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Backend Engine</span>
            <p className="text-xl font-black text-slate-900 mt-1.5">Fullstack Next.js & PM2</p>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">● Production Online</span>
          </div>
        </div>

        {/* TAB 1: ALL PRODUCTS DATA TABLE */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-96">
                <input
                  type="text"
                  placeholder="Search products by title or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
                />
                <span className="absolute left-3 top-3 text-slate-400 text-xs">🔍</span>
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-black text-[10px]">
                    <tr>
                      <th className="p-4">Image</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price (BDT)</th>
                      <th className="p-4">Wood Material</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1" />
                        </td>
                        <td className="p-4 font-black text-slate-900 max-w-xs truncate">{p.name}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-black text-[10px] uppercase">
                            {p.category || (p.category_names ? p.category_names[0] : 'Solid Segun')}
                          </span>
                        </td>
                        <td className="p-4 font-black text-emerald-600 text-sm">৳ {p.price?.toLocaleString()}</td>
                        <td className="p-4 text-slate-500 font-medium">{p.wood_type || 'Chittagong Teak'}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => startEditProduct(p)}
                            className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-black text-[11px]"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-black text-[11px]"
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADD / EDIT PRODUCT FORM */}
        {activeTab === "add-product" && (
          <div className="max-w-3xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mx-auto">
            <h3 className="text-xl font-black text-slate-900 mb-6">
              {editingProduct ? `Edit Product Entry (#${editingProduct.id})` : "Publish New Furniture Item"}
            </h3>
            
            <form onSubmit={handleAddProduct} className="space-y-5 text-xs">
              <div>
                <label className="block text-slate-700 font-black uppercase text-[10px] tracking-wider mb-1.5">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Solid Segun Wood Executive Sofa Set"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-black uppercase text-[10px] tracking-wider mb-1.5">Regular Price (BDT) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 85000"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-black uppercase text-[10px] tracking-wider mb-1.5">Original Price (Old Price)</label>
                  <input
                    type="number"
                    placeholder="e.g. 98000"
                    value={formData.old_price}
                    onChange={(e) => setFormData({...formData, old_price: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-black uppercase text-[10px] tracking-wider mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const catName = e.target.value;
                      const catSlug = catName.toLowerCase().replace(/\s+/g, '-');
                      setFormData({...formData, category: catName, category_slug: catSlug});
                    }}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-500 focus:outline-none font-bold"
                  >
                    <option value="Bed Room">Bed Room</option>
                    <option value="Dining">Dining</option>
                    <option value="Living Room">Living Room</option>
                    <option value="Almirah & Wardrobe">Almirah & Wardrobe</option>
                    <option value="Office & School">Office & School</option>
                    <option value="Door Collection">Door Collection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-black uppercase text-[10px] tracking-wider mb-1.5">Badge</label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-500 focus:outline-none font-bold"
                  >
                    <option value="20 Yrs Warranty">20 Yrs Warranty</option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Top Seller">Top Seller</option>
                    <option value="Featured">Featured</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-black uppercase text-[10px] tracking-wider mb-1.5">Image URL</label>
                <input
                  type="text"
                  placeholder="https://haatfurniture.com/wp-content/uploads/..."
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-black uppercase text-[10px] tracking-wider mb-1.5">Wood Type & Guarantee</label>
                <input
                  type="text"
                  value={formData.wood_type}
                  onChange={(e) => setFormData({...formData, wood_type: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-black uppercase text-[10px] tracking-wider mb-1.5">Product Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the furniture craftsmanship, wood finish, and dimensions..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-wider shadow-lg">
                  {editingProduct ? 'Save Product Updates' : 'Publish Product to Store'}
                </button>
                <button type="button" onClick={() => { resetForm(); setActiveTab("products"); }} className="px-6 py-4 rounded-2xl bg-slate-100 text-slate-700 font-extrabold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: LIVE ORDERS TRACKING TABLE */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900">Recent Customer Orders</h3>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase">
                WhatsApp Order Dispatch Active
              </span>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-black text-[10px]">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Ordered Items</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Update Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-mono font-black text-slate-900">{o.id}</td>
                        <td className="p-4">
                          <div className="font-black text-slate-900">{o.customer}</div>
                          <div className="text-[10px] text-slate-500 font-bold">{o.phone} • {o.address}</div>
                        </td>
                        <td className="p-4 max-w-xs font-bold text-slate-800">{o.items}</td>
                        <td className="p-4 font-black text-emerald-600 text-sm">৳ {o.total.toLocaleString()}</td>
                        <td className="p-4 text-slate-400 font-mono text-[11px]">{o.date}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                            o.status === 'Processing' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                          }`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id, "Processing")}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-black text-[10px] hover:bg-amber-100"
                          >
                            Processing
                          </button>
                          <button
                            onClick={() => handleUpdateOrderStatus(o.id, "Delivered")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-black text-[10px] hover:bg-emerald-100"
                          >
                            Delivered
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.id || cat.slug} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
                <div className="text-4xl">{cat.icon || '🪑'}</div>
                <h4 className="text-lg font-black text-slate-900">{cat.name}</h4>
                <p className="text-xs text-amber-700 font-black">{cat.count || 'Active Collection'}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono border border-slate-200">
                  slug: {cat.slug}
                </span>
              </div>
            ))}
          </div>
        )}

      </main>

    </div>
  );
}
