'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import productsData from "../products_128_data.json";

export default function WordPressAdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [products, setProducts] = useState(productsData);
  const [activeMenu, setActiveMenu] = useState("products-all"); // dashboard | products-all | products-add | orders | categories | settings
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [toast, setToast] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  // WooCommerce Live Orders
  const [orders, setOrders] = useState([
    {
      id: "12891",
      customer: "Mahin Ahmed",
      email: "haatfurniture@gmail.com",
      phone: "01957909186",
      address: "House #12, Road #4, Badda, Dhaka",
      district: "Dhaka",
      items: "Beijing Dining 4 Chair Set × 1, Bullet Teak Door × 1",
      subtotal: 62500,
      shipping: 60,
      total: 62560,
      status: "Processing",
      paymentMethod: "Cash on delivery",
      date: "2026-08-17"
    },
    {
      id: "12890",
      customer: "Walid Ahmed",
      email: "walid@barabdonline.com",
      phone: "01711223344",
      address: "Sector 3, Uttara, Dhaka",
      district: "Dhaka",
      items: "Wheel Dressing Table × 1",
      subtotal: 22500,
      shipping: 60,
      total: 22560,
      status: "Completed",
      paymentMethod: "bKash Mobile Banking",
      date: "2026-08-16"
    },
    {
      id: "12889",
      customer: "Tanvir Hossain",
      email: "tanvir@gmail.com",
      phone: "01811223344",
      address: "GEC Circle, Chittagong",
      district: "Chittagong",
      items: "Crown Royal Segun Teak Bed × 1",
      subtotal: 30000,
      shipping: 150,
      total: 30150,
      status: "Processing",
      paymentMethod: "Cash on delivery",
      date: "2026-08-16"
    }
  ]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    old_price: "",
    sku: "",
    category: "bed-room",
    image: "",
    description: ""
  });

  useEffect(() => {
    const savedAuth = localStorage.getItem("haat_wp_admin_auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    const validUsers = ["walid2420", "admin", "haatadmin", "haatjjog"];
    const validPasses = ["jony1234@@##$$", "@Haat#$2026#", "admin123", "Q9QlL1n6Wxu7"];

    if (
      validUsers.includes(loginUser.trim().toLowerCase()) &&
      validPasses.includes(loginPass)
    ) {
      localStorage.setItem("haat_wp_admin_auth", "true");
      setIsAuthenticated(true);
      showToast("Welcome to WordPress Dashboard!");
    } else {
      setLoginError("ERROR: The password you entered for the username is incorrect.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("haat_wp_admin_auth");
    setIsAuthenticated(false);
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const handleAddOrUpdateProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Please fill in Product Name and Price!");
      return;
    }

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? {
        ...p,
        name: formData.name,
        price: parseFloat(formData.price),
        oldPrice: formData.old_price ? parseFloat(formData.old_price) : null,
        image: formData.image || p.image,
        description: formData.description
      } : p));
      showToast(`Updated product: "${formData.name}"`);
    } else {
      const newP = {
        id: Date.now(),
        name: formData.name,
        price: parseFloat(formData.price),
        oldPrice: formData.old_price ? parseFloat(formData.old_price) : null,
        categories: [formData.category],
        category_names: [formData.category.replace('-', ' ')],
        image: formData.image || "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
        description: formData.description || "Solid Chittagong Segun Teak Wood."
      };
      setProducts([newP, ...products]);
      showToast(`Published new product: "${formData.name}"`);
    }

    setActiveMenu("products-all");
    resetForm();
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      old_price: product.oldPrice || "",
      sku: `HAAT-${product.id}`,
      category: product.categories ? product.categories[0] : "home-furniture",
      image: product.image,
      description: product.description || ""
    });
    setActiveMenu("products-add");
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({ name: "", price: "", old_price: "", sku: "", category: "bed-room", image: "", description: "" });
  };

  const handleDeleteProduct = (id) => {
    if (confirm("Are you sure you want to move this product to Trash?")) {
      setProducts(products.filter(p => p.id !== id));
      showToast("Item moved to Trash.");
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    showToast(`Order #${orderId} changed to ${newStatus}`);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategoryFilter === "all" || (p.categories && p.categories.includes(selectedCategoryFilter));
    return matchesSearch && matchesCat;
  });

  // -------------------------------------------------------------------
  // 1. WORDPRESS LOGIN SCREEN
  // -------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f0f0f1] text-[#3c434a] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-sm space-y-6">
          
          {/* WordPress Logo */}
          <div className="text-center">
            <div className="w-20 h-20 bg-[#2271b1] text-white rounded-full mx-auto flex items-center justify-center font-black text-3xl shadow-md border-4 border-white">
              W
            </div>
            <h1 className="text-base font-bold text-slate-800 mt-3">HAAT FURNITURE LIMITED</h1>
            <p className="text-xs text-slate-500 font-semibold">WordPress / WooCommerce Admin Login</p>
          </div>

          {/* Error Banner */}
          {loginError && (
            <div className="p-3 bg-white border-l-4 border-red-600 shadow-sm text-xs font-bold text-slate-800">
              {loginError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md border border-slate-200 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Username or Email Address</label>
              <input
                type="text"
                required
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded text-xs focus:border-[#2271b1] focus:outline-none font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  className="w-full p-2.5 pr-8 border border-slate-300 rounded text-xs focus:border-[#2271b1] focus:outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 text-xs"
                >
                  👁️
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-1.5 text-slate-600 font-medium">
                <input type="checkbox" className="accent-[#2271b1]" defaultChecked />
                <span>Remember Me</span>
              </label>
              <button
                type="submit"
                className="bg-[#2271b1] hover:bg-[#135e96] text-white px-5 py-2 rounded font-bold text-xs shadow transition"
              >
                Log In
              </button>
            </div>
          </form>

          <div className="text-center text-xs space-y-1 text-slate-500 font-medium">
            <p><Link href="/" className="hover:text-[#2271b1]">← Go to HAAT Furniture Limited</Link></p>
            <p><a href="#" className="hover:text-[#2271b1]">Lost your password?</a></p>
          </div>

        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------
  // 2. AUTHENTICATED WORDPRESS ADMIN PANEL
  // -------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f0f0f1] text-[#3c434a] font-sans flex flex-col antialiased">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-12 right-5 z-50 bg-[#1d2327] text-white px-4 py-2.5 rounded shadow-xl font-bold text-xs border border-slate-700 flex items-center gap-2">
          <span>✨</span>
          <span>{toast}</span>
        </div>
      )}

      {/* 1. WORDPRESS TOP BLACK ADMIN BAR (#1d2327) */}
      <header className="bg-[#1d2327] text-white text-xs h-8 flex items-center justify-between px-3 fixed top-0 left-0 right-0 z-50 border-b border-slate-800">
        
        {/* Left Links */}
        <div className="flex items-center gap-4 font-semibold">
          <Link href="/" className="flex items-center gap-1.5 hover:text-amber-400 transition">
            <span className="font-black text-amber-500">W</span>
            <span className="font-bold">HAAT FURNITURE LIMITED</span>
          </Link>

          <Link href="/" className="hover:text-amber-400 transition hidden sm:inline">
            🏠 Visit Site
          </Link>

          <button onClick={() => { resetForm(); setActiveMenu("products-add"); }} className="hover:text-amber-400 transition hidden md:flex items-center gap-1">
            <span>➕</span> New Product
          </button>
        </div>

        {/* Right Admin Profile */}
        <div className="flex items-center gap-3">
          <span className="text-slate-300 text-[11px]">Howdy, <strong className="text-white">Walid Ahmed</strong></span>
          <div className="w-5 h-5 rounded-full bg-[#2271b1] text-white text-[10px] font-black flex items-center justify-center">
            W
          </div>
          <button 
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-400 font-bold transition text-[11px] border-l border-slate-700 pl-2"
          >
            Log Out
          </button>
        </div>

      </header>

      {/* MAIN LAYOUT WITH LEFT SIDEBAR & CONTENT AREA */}
      <div className="flex pt-8 min-h-screen">
        
        {/* 2. WORDPRESS DARK LEFT SIDEBAR (#1d2327) */}
        <aside className="w-48 bg-[#1d2327] text-[#f0f6fc] text-xs font-semibold flex-shrink-0 min-h-screen border-r border-slate-800 space-y-1 pt-2">
          
          <button
            onClick={() => setActiveMenu("dashboard")}
            className={`w-full text-left px-4 py-2 flex items-center gap-2.5 transition border-l-4 ${activeMenu === "dashboard" ? 'bg-[#2271b1] text-white border-white font-bold' : 'border-transparent text-slate-300 hover:bg-[#2c3338] hover:text-white'}`}
          >
            <span>📌</span> Dashboard
          </button>

          {/* WooCommerce Submenu Group */}
          <div className="pt-2">
            <div className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-wider py-1 flex items-center justify-between">
              <span>WOOCOMMERCE</span>
              <span className="bg-amber-600 text-white text-[9px] px-1.5 rounded-full font-bold">{orders.length}</span>
            </div>
            
            <button
              onClick={() => setActiveMenu("orders")}
              className={`w-full text-left pl-7 pr-3 py-1.5 flex items-center justify-between transition border-l-4 ${activeMenu === "orders" ? 'bg-[#2271b1] text-white border-white font-bold' : 'border-transparent text-slate-300 hover:bg-[#2c3338] hover:text-white'}`}
            >
              <span>Orders</span>
              <span className="bg-emerald-600 text-white text-[9px] px-1.5 rounded-full">{orders.length}</span>
            </button>
            
            <button
              onClick={() => setActiveMenu("categories")}
              className={`w-full text-left pl-7 pr-3 py-1.5 flex items-center justify-between transition border-l-4 ${activeMenu === "categories" ? 'bg-[#2271b1] text-white border-white font-bold' : 'border-transparent text-slate-300 hover:bg-[#2c3338] hover:text-white'}`}
            >
              <span>Categories</span>
            </button>
          </div>

          {/* Products Submenu Group */}
          <div className="pt-2">
            <div className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-wider py-1">
              PRODUCTS
            </div>
            
            <button
              onClick={() => setActiveMenu("products-all")}
              className={`w-full text-left pl-7 pr-3 py-1.5 flex items-center justify-between transition border-l-4 ${activeMenu === "products-all" ? 'bg-[#2271b1] text-white border-white font-bold' : 'border-transparent text-slate-300 hover:bg-[#2c3338] hover:text-white'}`}
            >
              <span>All Products</span>
              <span className="bg-slate-700 text-white text-[9px] px-1.5 rounded-full">{products.length}</span>
            </button>

            <button
              onClick={() => { resetForm(); setActiveMenu("products-add"); }}
              className={`w-full text-left pl-7 pr-3 py-1.5 flex items-center justify-between transition border-l-4 ${activeMenu === "products-add" ? 'bg-[#2271b1] text-white border-white font-bold' : 'border-transparent text-slate-300 hover:bg-[#2c3338] hover:text-white'}`}
            >
              <span>Add New</span>
            </button>
          </div>

          {/* Settings Link */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveMenu("settings")}
              className={`w-full text-left px-4 py-2 flex items-center gap-2.5 transition border-l-4 ${activeMenu === "settings" ? 'bg-[#2271b1] text-white border-white font-bold' : 'border-transparent text-slate-300 hover:bg-[#2c3338] hover:text-white'}`}
            >
              <span>⚙️</span> Settings
            </button>
          </div>

        </aside>

        {/* 3. MAIN WORDPRESS CONTENT AREA */}
        <main className="flex-1 p-6 space-y-6 overflow-x-auto">
          
          {/* VIEW A: DASHBOARD OVERVIEW */}
          {activeMenu === "dashboard" && (
            <div className="space-y-6">
              
              {/* Welcome Banner */}
              <div className="bg-white p-6 rounded shadow-sm border border-slate-200 space-y-2">
                <h1 className="text-2xl font-bold text-slate-900">Welcome to WordPress / HAAT Furniture Admin!</h1>
                <p className="text-xs text-slate-600">We&apos;ve assembled some links to get you started managing products and live WooCommerce orders.</p>
              </div>

              {/* Status Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
                <div className="bg-white p-5 rounded shadow-sm border border-slate-200 space-y-1">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Total Products</span>
                  <p className="text-3xl font-black text-[#2271b1]">{products.length}</p>
                  <button onClick={() => setActiveMenu("products-all")} className="text-[#2271b1] hover:underline font-bold">View All Products →</button>
                </div>

                <div className="bg-white p-5 rounded shadow-sm border border-slate-200 space-y-1">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Live Orders</span>
                  <p className="text-3xl font-black text-emerald-600">{orders.length}</p>
                  <button onClick={() => setActiveMenu("orders")} className="text-emerald-600 hover:underline font-bold">Manage Customer Orders →</button>
                </div>

                <div className="bg-white p-5 rounded shadow-sm border border-slate-200 space-y-1">
                  <span className="text-slate-500 uppercase tracking-wider text-[10px] font-bold">Store Domain</span>
                  <p className="text-sm font-black text-slate-800">haat.barabdonline.com</p>
                  <span className="text-emerald-600 font-bold text-[11px]">● Server VM 109 Online</span>
                </div>
              </div>

            </div>
          )}

          {/* VIEW B: ALL PRODUCTS TABLE (MATCHING WOOCOMMERCE WORDPRESS DATA TABLE) */}
          {activeMenu === "products-all" && (
            <div className="space-y-4">
              
              {/* Header Title + Add New Button */}
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-900">Products</h1>
                <button
                  onClick={() => { resetForm(); setActiveMenu("products-add"); }}
                  className="bg-[#2271b1] hover:bg-[#135e96] text-white px-3 py-1 rounded font-bold text-xs transition"
                >
                  Add New
                </button>
              </div>

              {/* Status Filter Links */}
              <div className="text-xs font-medium text-slate-600 flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900">All ({products.length})</span>
                <span>|</span>
                <span className="text-[#2271b1]">Published ({products.length})</span>
                <span>|</span>
                <span className="text-slate-400">Trash (0)</span>
              </div>

              {/* Toolbar Search & Filter */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-white p-3 rounded shadow-sm border border-slate-200">
                <div className="flex items-center gap-2">
                  <select 
                    value={selectedCategoryFilter} 
                    onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                    className="border border-slate-300 rounded p-1.5 bg-white text-slate-700 focus:outline-none"
                  >
                    <option value="all">Select a category</option>
                    <option value="home-furniture">Home Furniture</option>
                    <option value="bed-room">Bed Room</option>
                    <option value="bed">Bed</option>
                    <option value="almirah">Almirah</option>
                    <option value="dressing-table">Dressing Table</option>
                    <option value="dinning-set">Dinning Set</option>
                    <option value="sofa">Sofa</option>
                    <option value="office-furniture">Office Furniture</option>
                    <option value="door">Door</option>
                  </select>

                  <button className="bg-slate-200 hover:bg-slate-300 px-3 py-1.5 rounded font-bold text-slate-700">
                    Filter
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Search Products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border border-slate-300 rounded p-1.5 text-xs focus:outline-none focus:border-[#2271b1]"
                  />
                  <button className="bg-[#2271b1] text-white px-3 py-1.5 rounded font-bold">
                    Search
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f6f7f7] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3 w-10 text-center"><input type="checkbox" /></th>
                        <th className="p-3 w-16">Image</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">SKU</th>
                        <th className="p-3">Stock</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Categories</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {filteredProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition">
                          <td className="p-3 text-center"><input type="checkbox" /></td>
                          <td className="p-3">
                            <img src={p.image} alt={p.name} className="w-10 h-10 object-contain border border-slate-200 p-0.5 rounded bg-white" />
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-[#2271b1] hover:underline cursor-pointer" onClick={() => startEditProduct(p)}>
                              {p.name}
                            </div>
                            <div className="text-[10px] text-slate-400 space-x-2 pt-0.5">
                              <button onClick={() => startEditProduct(p)} className="text-[#2271b1] hover:underline">Edit</button>
                              <span>|</span>
                              <button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 hover:underline">Trash</button>
                              <span>|</span>
                              <Link href={`/product/${p.id}`} className="text-[#2271b1] hover:underline" target="_blank">View</Link>
                            </div>
                          </td>
                          <td className="p-3 font-mono text-slate-500">HAAT-{p.id}</td>
                          <td className="p-3 text-emerald-600 font-bold">In stock</td>
                          <td className="p-3 font-bold text-slate-900">৳{p.price.toLocaleString()}</td>
                          <td className="p-3 text-slate-600 font-semibold">{p.categories ? p.categories.join(', ') : 'furniture'}</td>
                          <td className="p-3 text-right space-x-1">
                            <button onClick={() => startEditProduct(p)} className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-2.5 py-1 rounded font-bold text-[11px]">
                              Edit
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-2.5 py-1 rounded font-bold text-[11px]">
                              Delete
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

          {/* VIEW C: ADD / EDIT PRODUCT FORM */}
          {activeMenu === "products-add" && (
            <div className="space-y-4 max-w-4xl">
              <h1 className="text-xl font-bold text-slate-900">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Product"}
              </h1>

              <form onSubmit={handleAddOrUpdateProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                
                {/* Left Main Form Box */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="bg-white p-5 rounded shadow-sm border border-slate-200 space-y-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter product title..."
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded text-xs focus:border-[#2271b1] focus:outline-none font-semibold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Product Description</label>
                      <textarea
                        rows={6}
                        placeholder="Craftsmanship details, dimensions, 20-year warranty details..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-2.5 border border-slate-300 rounded text-xs focus:border-[#2271b1] focus:outline-none font-medium text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="bg-white p-5 rounded shadow-sm border border-slate-200 space-y-4">
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Product Data — General</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Regular Price (৳ BDT) *</label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 45000"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded text-xs focus:border-[#2271b1] focus:outline-none font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Sale Price (৳ BDT)</label>
                        <input
                          type="number"
                          placeholder="e.g. 39000"
                          value={formData.old_price}
                          onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
                          className="w-full p-2 border border-slate-300 rounded text-xs focus:border-[#2271b1] focus:outline-none font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Meta Boxes */}
                <div className="lg:col-span-4 space-y-4">
                  
                  {/* Publish Meta Box */}
                  <div className="bg-white p-4 rounded shadow-sm border border-slate-200 space-y-3">
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Publish</h3>
                    <p className="text-slate-500">Status: <strong className="text-slate-800">Published</strong></p>
                    <p className="text-slate-500">Visibility: <strong className="text-slate-800">Public</strong></p>
                    
                    <button
                      type="submit"
                      className="w-full bg-[#2271b1] hover:bg-[#135e96] text-white py-2.5 rounded font-bold text-xs shadow transition"
                    >
                      {editingProduct ? 'Update Product' : 'Publish Product'}
                    </button>
                  </div>

                  {/* Category Meta Box */}
                  <div className="bg-white p-4 rounded shadow-sm border border-slate-200 space-y-3">
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Product Categories</h3>
                    
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-bold text-slate-800"
                    >
                      <option value="home-furniture">Home Furniture</option>
                      <option value="bed-room">Bed Room</option>
                      <option value="bed">Bed</option>
                      <option value="almirah">Almirah</option>
                      <option value="dressing-table">Dressing Table</option>
                      <option value="dinning-set">Dinning Set</option>
                      <option value="sofa">Sofa</option>
                      <option value="office-furniture">Office Furniture</option>
                      <option value="door">Door</option>
                    </select>
                  </div>

                  {/* Image Meta Box */}
                  <div className="bg-white p-4 rounded shadow-sm border border-slate-200 space-y-3">
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Product Image</h3>
                    {formData.image && (
                      <img src={formData.image} alt="Preview" className="w-full h-32 object-contain border border-slate-200 rounded p-1 bg-slate-50" />
                    )}
                    <input
                      type="text"
                      placeholder="Image URL (https://haatfurniture.com/wp-content/...)"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded text-xs focus:border-[#2271b1] focus:outline-none"
                    />
                  </div>

                </div>

              </form>
            </div>
          )}

          {/* VIEW D: WOOCOMMERCE ORDERS MANAGEMENT */}
          {activeMenu === "orders" && (
            <div className="space-y-4">
              <h1 className="text-xl font-bold text-slate-900">WooCommerce Orders</h1>

              <div className="bg-white rounded shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#f6f7f7] text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Order</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Billing & Address</th>
                        <th className="p-3">Total</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-medium">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50 transition">
                          <td className="p-3">
                            <div className="font-bold text-[#2271b1]">#{o.id} {o.customer}</div>
                            <div className="text-[10px] text-slate-400">{o.items}</div>
                          </td>
                          <td className="p-3 text-slate-500">{o.date}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${o.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-slate-800">{o.phone}</div>
                            <div className="text-[10px] text-slate-500">{o.address}</div>
                          </td>
                          <td className="p-3 font-bold text-slate-900">৳{o.total.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">via {o.paymentMethod}</span></td>
                          <td className="p-3 text-right space-x-1">
                            <button onClick={() => handleUpdateOrderStatus(o.id, "Processing")} className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-1 rounded font-bold text-[10px]">
                              Processing
                            </button>
                            <button onClick={() => handleUpdateOrderStatus(o.id, "Completed")} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 px-2 py-1 rounded font-bold text-[10px]">
                              Completed
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

          {/* VIEW E: CATEGORIES */}
          {activeMenu === "categories" && (
            <div className="space-y-4">
              <h1 className="text-xl font-bold text-slate-900">Product Categories</h1>
              <div className="bg-white p-5 rounded shadow-sm border border-slate-200 text-xs space-y-2">
                <p><strong className="text-slate-800">Home Furniture:</strong> Bed Room, Dinning Room, Living Room, Kitchen</p>
                <p><strong className="text-slate-800">Office Furniture:</strong> Work Station, Executive Desk, Chairs</p>
                <p><strong className="text-slate-800">Doors:</strong> Flash Door, Solid Teak Carved Entrance Gate</p>
              </div>
            </div>
          )}

          {/* VIEW F: SETTINGS */}
          {activeMenu === "settings" && (
            <div className="space-y-4 max-w-2xl bg-white p-6 rounded shadow-sm border border-slate-200 text-xs">
              <h1 className="text-xl font-bold text-slate-900 mb-4">Store Settings</h1>
              <p><strong className="text-slate-800">Store Name:</strong> HAAT Furniture Limited</p>
              <p><strong className="text-slate-800">Store Domain:</strong> https://haat.barabdonline.com</p>
              <p><strong className="text-slate-800">Hotline Phone:</strong> +8809617333990</p>
              <p><strong className="text-slate-800">Showroom Addresses:</strong> Badda & Mirpur, Dhaka</p>
            </div>
          )}

        </main>

      </div>
    </div>
  );
}
