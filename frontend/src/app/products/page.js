'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import productsData from '../products_128_data.json';

const CATEGORIES_LIST = [
  { name: 'All Categories', slug: 'all' },
  { name: 'Home Furniture', slug: 'home-furniture' },
  { name: 'Bed Room', slug: 'bed-room' },
  { name: 'Bed', slug: 'bed' },
  { name: 'Almirah', slug: 'almirah' },
  { name: 'Dressing Table', slug: 'dressing-table' },
  { name: 'Wardrobe', slug: 'wardrobe' },
  { name: 'Dinning Room', slug: 'dinning-room' },
  { name: 'Dinning Set', slug: 'dinning-set' },
  { name: 'Showcase', slug: 'showcase' },
  { name: 'Living Room', slug: 'living-room' },
  { name: 'Sofa', slug: 'sofa' },
  { name: 'Center Table', slug: 'center-table' },
  { name: 'Office Furniture', slug: 'office-furniture' },
  { name: 'Work Station', slug: 'work-station' },
  { name: 'Door', slug: 'door' },
  { name: 'Mattress', slug: 'mattress' }
];

export default function ProductsCatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(150000);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [gridCols, setGridCols] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter products
  const filteredProducts = useMemo(() => {
    return productsData.filter((p) => {
      const pCats = p.categories || [];
      const matchesCategory = selectedCategory === 'all' || pCats.includes(selectedCategory);
      const matchesPrice = p.price <= maxPrice;
      const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [selectedCategory, maxPrice, searchQuery]);

  // Sorted products
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortOption === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return list;
  }, [filteredProducts, sortOption]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const displayedProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Top Header Ribbon */}
      <div className="bg-slate-900 text-white text-xs py-3 px-6 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-amber-400 hover:underline flex items-center gap-1">
          <span>← Back to Storefront / স্টোরে ফিরে যান</span>
        </Link>
        <span className="text-slate-400 hidden sm:inline">📞 Hotline: +8809617333990</span>
      </div>

      {/* Hero Banner */}
      <div className="bg-[#0b0c10] text-white py-12 px-4 text-center border-b border-slate-800">
        <div className="max-w-7xl mx-auto space-y-2">
          <h1 className="text-4xl font-black tracking-tight">Full Products Catalog</h1>
          <p className="text-xs text-slate-400">Showing 100% genuine Chittagong Segun teak wood products from WooCommerce database</p>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
          
          {/* Search Widget */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 pb-2 border-b border-slate-100">
              SEARCH PRODUCTS
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="Type model or keyword..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-3 pr-8 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-amber-700"
              />
              <span className="absolute right-2.5 top-2 text-slate-400 text-xs">🔍</span>
            </div>
          </div>

          {/* Price Filter Widget */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100">
              FILTER BY PRICE
            </h3>
            <div className="space-y-4">
              <input 
                type="range" 
                min="5000" 
                max="150000" 
                step="2500"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(Number(e.target.value)); setCurrentPage(1); }}
                className="w-full accent-lime-600 cursor-pointer"
              />
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Max: ৳{maxPrice.toLocaleString()}</span>
                <button 
                  onClick={() => setCurrentPage(1)}
                  className="bg-slate-900 text-white px-3 py-1 rounded text-[11px] font-bold hover:bg-amber-700 transition"
                >
                  FILTER
                </button>
              </div>
            </div>
          </div>

          {/* Categories List Widget */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100">
              CATEGORIES
            </h3>
            <div className="space-y-1.5 text-xs font-medium">
              {CATEGORIES_LIST.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => { setSelectedCategory(cat.slug); setCurrentPage(1); }}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition flex items-center justify-between ${selectedCategory === cat.slug ? 'bg-amber-700 text-white font-bold' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] opacity-70">›</span>
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* Right Main Grid */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-600">
            <div>
              Showing {displayedProducts.length} of {sortedProducts.length} products
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1">
                {[2, 3, 4].map((cols) => (
                  <button
                    key={cols}
                    onClick={() => setGridCols(cols)}
                    className={`px-2 py-1 rounded transition ${gridCols === cols ? 'bg-slate-900 text-white font-bold' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    {cols} Col
                  </button>
                ))}
              </div>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none"
              >
                <option value="default">Default sorting</option>
                <option value="price-low">Sort by price: low to high</option>
                <option value="price-high">Sort by price: high to low</option>
                <option value="rating">Sort by popularity</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {displayedProducts.length > 0 ? (
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${gridCols} gap-6`}>
              {displayedProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      {product.badge && (
                        <span className="absolute top-3 left-3 bg-amber-800 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <p className="text-[10px] uppercase font-bold text-amber-700 tracking-wider mb-1">
                        {product.category_names ? product.category_names[0] : 'Solid Segun'}
                      </p>

                      <Link href={`/product/${product.id}`} className="font-bold text-sm text-slate-800 hover:text-amber-700 transition line-clamp-2 mb-2">
                        {product.name}
                      </Link>

                      <div className="flex items-center gap-2">
                        <span className="text-amber-800 font-extrabold text-base">
                          ৳{product.price.toLocaleString()}
                        </span>
                        {product.oldPrice && (
                          <span className="text-slate-400 text-xs line-through font-medium">
                            ৳{product.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <Link 
                      href={`/product/${product.id}`}
                      className="w-full block text-center bg-slate-900 hover:bg-amber-800 text-white py-2 rounded-lg font-bold text-xs transition"
                    >
                      View Options →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-4">
              <span className="text-4xl">🔎</span>
              <h3 className="text-lg font-bold text-slate-800">No products found matching your filter</h3>
              <button 
                onClick={() => { setSelectedCategory('all'); setMaxPrice(150000); setSearchQuery(''); }}
                className="bg-amber-800 text-white px-6 py-2 rounded-lg font-bold text-xs hover:bg-amber-900 transition"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-9 h-9 rounded-lg font-bold text-xs transition ${currentPage === pg ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                >
                  {pg}
                </button>
              ))}
            </div>
          )}

        </section>

      </main>
    </div>
  );
}
