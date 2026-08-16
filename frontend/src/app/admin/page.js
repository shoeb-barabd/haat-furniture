"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products"); // products | add-product | categories | orders | stats
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  // Sample Live Customer Orders
  const [orders, setOrders] = useState([
    {
      id: "ORD-9821",
      customer: "Shariful Islam",
      phone: "+8801712345678",
      address: "Gulshan-2, Dhaka",
      items: "Purley Teak King Bed (x1), Teak Nightstand (x2)",
      total: 35000,
      status: "Delivered",
      date: "2026-08-16 12:30 PM"
    },
    {
      id: "ORD-9822",
      customer: "Tanvir Ahmed",
      phone: "+8801898765432",
      address: "Mirpur-10, Dhaka",
      items: "Royal 6 Chair Segun Dining Set (x1)",
      total: 68000,
      status: "Processing",
      date: "2026-08-16 02:15 PM"
    },
    {
      id: "ORD-9823",
      customer: "Mahmudul Hasan",
      phone: "+8801555666777",
      address: "Agrabad, Chittagong",
      items: "Solid Wood Master Almirah (x1)",
      total: 54000,
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

  useEffect(() => {
    fetchAdminData();
  }, []);

  async function fetchAdminData() {
    setLoading(true);
    try {
      const resP = await fetch("/api/v1/products");
      const resC = await fetch("/api/v1/categories");
      if (resP.ok && resC.ok) {
        const dataP = await resP.json();
        const dataC = await resC.json();
        setProducts(dataP.data || dataP || []);
        setCategories(dataC.data || dataC || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

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
      // Edit Existing Product
      const updated = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: formData.name,
              price: parseFloat(formData.price),
              old_price: formData.old_price ? parseFloat(formData.old_price) : null,
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
      // Create New Product
      const newProd = {
        id: Date.now(),
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        price: parseFloat(formData.price),
        old_price: formData.old_price ? parseFloat(formData.old_price) : null,
        category: formData.category,
        category_slug: formData.category_slug,
        image: formData.image || "https://haatfurniture.com/wp-content/uploads/2023/09/dining-table-6-chair-haat-furniture.jpg",
        wood_type: formData.wood_type,
        warranty: formData.warranty,
        rating: 5.0,
        badge: formData.badge,
        description: formData.description || "Premium handcrafted furniture by Haat Furniture Limited."
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
      old_price: product.old_price || "",
      category: product.category || "Home Furniture",
      category_slug: product.category_slug || "home-furniture",
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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex antialiased">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl font-bold text-xs border border-slate-700 animate-bounce flex items-center gap-2">
          <span>✨</span>
          <span>{toast}</span>
        </div>
      )}

      {/* Admin Sidebar Navigation - Fixed Width Non-Shrinking */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 p-6 flex flex-col justify-between hidden lg:flex shadow-sm min-h-screen">
        <div className="space-y-8">
          
          {/* Admin Header Official Logo */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
            <img
              src="https://haatfurniture.com/wp-content/uploads/2023/02/haalogo.jpg"
              alt="HAAT FURNITURE LIMITED Logo"
              className="h-9 w-auto object-contain flex-shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-black text-red-600">HAAT</span>
                <span className="text-xs font-black text-slate-900 uppercase">FURNITURE</span>
              </div>
              <span className="text-[10px] text-amber-700 font-extrabold uppercase tracking-wider block">Admin Control Center</span>
            </div>
          </div>

          {/* Sidebar Menu Links */}
          <nav className="space-y-2 text-xs font-extrabold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === "products" ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <span>📦</span>
              <span>All Products ({products.length})</span>
            </button>

            <button
              onClick={() => { resetForm(); setActiveTab("add-product"); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === "add-product" ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <span>➕</span>
              <span>{editingProduct ? 'Edit Product' : 'Add New Product'}</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === "orders" ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <span>🛒</span>
              <span>Live Orders ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${activeTab === "categories" ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <span>🗂️</span>
              <span>Categories ({categories.length})</span>
            </button>
          </nav>
        </div>

        {/* Back to Live Site Link */}
        <div className="pt-6 border-t border-slate-200">
          <Link href="/" className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md uppercase tracking-wider">
            <span>🌐</span> View Storefront
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto w-full">
        
        {/* Mobile & Tablet Header Navigation (Visible when sidebar hidden) */}
        <div className="lg:hidden bg-white border border-slate-200 rounded-3xl p-4 mb-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src="https://haatfurniture.com/wp-content/uploads/2023/02/haalogo.jpg"
                alt="HAAT FURNITURE Logo"
                className="h-8 w-auto object-contain"
              />
              <div>
                <span className="text-sm font-black text-red-600">HAAT </span>
                <span className="text-xs font-black text-slate-900 uppercase">ADMIN</span>
              </div>
            </div>
            <Link href="/" className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-black uppercase">
              🌐 Website
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-black uppercase">
            <button onClick={() => setActiveTab("products")} className={`py-2 px-3 rounded-xl transition-all ${activeTab === "products" ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
              📦 Products ({products.length})
            </button>
            <button onClick={() => { resetForm(); setActiveTab("add-product"); }} className={`py-2 px-3 rounded-xl transition-all ${activeTab === "add-product" ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
              ➕ Add Product
            </button>
            <button onClick={() => setActiveTab("orders")} className={`py-2 px-3 rounded-xl transition-all ${activeTab === "orders" ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
              🛒 Orders ({orders.length})
            </button>
            <button onClick={() => setActiveTab("categories")} className={`py-2 px-3 rounded-xl transition-all ${activeTab === "categories" ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
              🗂️ Categories ({categories.length})
            </button>
          </div>
        </div>
        
        {/* Top Bar Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {activeTab === "products" && "Product Catalog Management"}
              {activeTab === "add-product" && (editingProduct ? "Edit Existing Product" : "Publish New Product")}
              {activeTab === "categories" && "Furniture Collections"}
              {activeTab === "orders" && "Live Customer Order Tracking"}
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">Manage product inventory, pricing, images, and live customer orders in real-time</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="https://haat.barabdonline.com" target="_blank" className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5 uppercase">
              <span>🚀</span> Live Domain
            </Link>
          </div>
        </header>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 my-8">
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
            <p className="text-xl font-black text-slate-900 mt-1.5">Laravel API & PM2</p>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">● Production Online</span>
          </div>
        </div>

        {/* TAB 1: ALL PRODUCTS DATA TABLE */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search products by title or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
                />
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
              </div>
              <button
                onClick={() => { resetForm(); setActiveTab("add-product"); }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider shadow-md"
              >
                + Add New Product
              </button>
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
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 font-bold">Loading Complete 128 Products Catalog...</td>
                      </tr>
                    ) : filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1" />
                        </td>
                        <td className="p-4 font-black text-slate-900 max-w-xs truncate">{p.name}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-black text-[10px] uppercase">
                            {p.category || 'Solid Segun'}
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
          <div className="max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-black text-slate-900 mb-6">
              {editingProduct ? `Edit Product (ID: #${editingProduct.id})` : "Publish New Furniture Item"}
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

              <div className="grid grid-cols-2 gap-4">
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

              <div className="grid grid-cols-2 gap-4">
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
