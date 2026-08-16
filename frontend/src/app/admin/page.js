"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products"); // products | add-product | categories | orders
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState("");

  // Form State for Add Product
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
      const resP = await fetch("http://localhost:8000/api/v1/products");
      const resC = await fetch("http://localhost:8000/api/v1/categories");
      if (resP.ok && resC.ok) {
        const dataP = await resP.json();
        const dataC = await resC.json();
        setProducts(dataP.data || []);
        setCategories(dataC.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Please fill in Product Name and Price!");
      return;
    }

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
    showToast(`Successfully Added New Product: "${newProd.name}"`);
    setActiveTab("products");
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
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
      showToast("Product deleted successfully!");
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm border border-emerald-400/30 animate-bounce">
          ✨ {toast}
        </div>
      )}

      {/* Admin Sidebar Navigation - Clean Light Theme */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between hidden md:flex shadow-sm">
        <div className="space-y-8">
          
          {/* Admin Header Official Logo */}
          <div className="flex items-center gap-3">
            <img
              src="https://haatfurniture.com/wp-content/uploads/2023/02/haalogo.jpg"
              alt="HAAT FURNITURE LIMITED Logo"
              className="h-10 w-auto object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-red-600">HAAT</span>
                <span className="text-xs font-bold text-slate-800 uppercase">FURNITURE</span>
              </div>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">Admin Control Panel</span>
            </div>
          </div>


          {/* Sidebar Menu Links */}
          <nav className="space-y-2 text-sm font-bold">
            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "products" ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <span>📦</span>
              <span>All Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("add-product")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "add-product" ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <span>➕</span>
              <span>Add New Product</span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "categories" ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <span>🗂️</span>
              <span>Categories ({categories.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "orders" ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
            >
              <span>🛒</span>
              <span>Customer Orders</span>
            </button>
          </nav>
        </div>

        {/* Back to Live Site Link */}
        <div className="pt-6 border-t border-slate-200">
          <Link href="/" className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 border border-slate-200">
            <span>🌐</span> View Storefront
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {/* Top Bar Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              {activeTab === "products" && "Product Catalog Management"}
              {activeTab === "add-product" && "Add New Product to Store"}
              {activeTab === "categories" && "Furniture Categories"}
              {activeTab === "orders" && "Live Customer Orders"}
            </h1>
            <p className="text-xs text-slate-500 mt-1">Manage prices, images, products, and categories in real-time</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20">
              🌐 Open Website
            </Link>
          </div>
        </header>

        {/* Overview Stats Cards - Light Theme */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 my-8">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase">Total Live Products</span>
            <p className="text-3xl font-black text-slate-900 mt-1">{products.length}</p>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">✓ Active in Store</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase">Product Categories</span>
            <p className="text-3xl font-black text-blue-600 mt-1">{categories.length}</p>
            <span className="text-[11px] text-blue-600 font-bold mt-1 inline-block">Teak & Home Furniture</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase">Backend API Status</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">Laravel 12 API</p>
            <span className="text-[11px] text-emerald-600 font-bold mt-1 inline-block">● Live on Port 8000</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase">Database Engine</span>
            <p className="text-2xl font-black text-purple-600 mt-1">MySQL / JSON</p>
            <span className="text-[11px] text-purple-600 font-bold mt-1 inline-block">Syncing Real-time</span>
          </div>
        </div>

        {/* TAB 1: ALL PRODUCTS DATA TABLE */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <input
                type="text"
                placeholder="Search products by title or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-80 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-sm"
              />
              <button
                onClick={() => setActiveTab("add-product")}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20"
              >
                + Add New Product
              </button>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider border-b border-slate-200 font-bold">
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
                        <td colSpan={6} className="p-8 text-center text-slate-500">Loading Product Catalog...</td>
                      </tr>
                    ) : filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                          <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100 border border-slate-200" />
                        </td>
                        <td className="p-4 font-bold text-slate-900 max-w-xs truncate">{p.name}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                            {p.category}
                          </span>
                        </td>
                        <td className="p-4 font-black text-emerald-600">৳ {p.price?.toLocaleString()}</td>
                        <td className="p-4 text-slate-500">{p.wood_type || 'Chittagong Teak'}</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold"
                          >
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

        {/* TAB 2: ADD NEW PRODUCT FORM */}
        {activeTab === "add-product" && (
          <div className="max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Create New Furniture Entry</h3>
            
            <form onSubmit={handleAddProduct} className="space-y-5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Royal Solid Segun Wood Executive Sofa Set"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Regular Price (BDT) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 85000"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Original Price (Old Price)</label>
                  <input
                    type="number"
                    placeholder="e.g. 98000"
                    value={formData.old_price}
                    onChange={(e) => setFormData({...formData, old_price: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const catName = e.target.value;
                      const catSlug = catName.toLowerCase().replace(/\s+/g, '-');
                      setFormData({...formData, category: catName, category_slug: catSlug});
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                  >
                    <option value="Home Furniture">Home Furniture</option>
                    <option value="Office Furniture">Office Furniture</option>
                    <option value="Kitchen Furniture">Kitchen Furniture</option>
                    <option value="Door Collection">Door Collection</option>
                    <option value="Mattress & Bedding">Mattress & Bedding</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5">Badge</label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-600 focus:outline-none font-medium"
                  >
                    <option value="New Arrival">New Arrival</option>
                    <option value="Top Seller">Top Seller</option>
                    <option value="Best Deal">Best Deal</option>
                    <option value="Featured">Featured</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Image URL</label>
                <input
                  type="text"
                  placeholder="https://haatfurniture.com/wp-content/uploads/..."
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Wood Type & Guarantee</label>
                <input
                  type="text"
                  value={formData.wood_type}
                  onChange={(e) => setFormData({...formData, wood_type: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Product Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the furniture craftsmanship, wood finish, and dimensions..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:outline-none"
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="submit" className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-md shadow-blue-600/30">
                  Publish Product to Store
                </button>
                <button type="button" onClick={() => setActiveTab("products")} className="px-6 py-3.5 rounded-xl bg-slate-100 text-slate-700 font-bold">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: CATEGORIES */}
        {activeTab === "categories" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <div key={cat.id || cat.slug} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
                <div className="text-4xl">{cat.icon || '🪑'}</div>
                <h4 className="text-lg font-bold text-slate-900">{cat.name}</h4>
                <p className="text-xs text-blue-600 font-bold">{cat.count || 'Active Collection'}</p>
                <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-mono border border-slate-200">
                  slug: {cat.slug}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: ORDERS */}
        {activeTab === "orders" && (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
            <span className="text-4xl">💬</span>
            <h3 className="text-lg font-bold text-slate-900">Live WhatsApp Orders Active</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              All customer orders placed on the frontend are directly transmitted with full product items, quantities, and totals to your official WhatsApp hotline: <strong>+8809617333990</strong>.
            </p>
          </div>
        )}

      </main>

    </div>
  );
}
