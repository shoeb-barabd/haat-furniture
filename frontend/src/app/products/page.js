'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  const [products, setProducts] = useState(productsData);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(150000);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [gridCols, setGridCols] = useState(3);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    fetch('/api/v1/products')
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.success && Array.isArray(payload.data) && payload.data.length) {
          setProducts(payload.data);
        }
      })
      .catch(() => {});
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const pCats = p.categories || [];
      const matchesCategory = selectedCategory === 'all' || pCats.includes(selectedCategory);
      const matchesPrice = p.price <= maxPrice;
      const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [products, selectedCategory, maxPrice, searchQuery]);

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

  const [pageScrollY, setPageScrollY] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const [viewHeight, setViewHeight] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      setPageScrollY(window.scrollY);
      setPageHeight(document.documentElement.scrollHeight);
      setViewHeight(window.innerHeight);
    };
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  const nearTop = pageScrollY < 120;
  const nearBottom = pageHeight > 0 && pageScrollY + viewHeight >= pageHeight - 140;

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-slate-800 font-sans">
      <div className="bg-[#f8f6f0] text-xs py-2.5 px-4 sm:px-8 flex flex-wrap items-center justify-between border-b border-[#e4d8c4]">
        <span className="font-extrabold text-[#a07c32] tracking-wide">
          HAAT FURNITURE LIMITED — Official 100% Solid Chittagong Segun Wood Outlet
        </span>
        <a href="tel:+8809617333990" className="font-extrabold text-amber-700">
          Hotline +8809617333990
        </a>
      </div>

      <header className="sticky top-0 z-40 bg-[#fbf9f5]/95 backdrop-blur-xl border-b border-[#e4d8c4]">
        <div className="h-[3px] bg-gradient-to-r from-[#c59b27] via-[#e6c875] to-[#c59b27]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center bg-white rounded-2xl border border-[#e4d8c4] px-3 py-1.5 shadow-sm">
            <img src="/images/logo.jpg" alt="HAAT Furniture LTD" className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-bold text-[#8a6a3a] hover:text-[#a07c32]">
              ← Storefront
            </Link>
            <a
              href="https://wa.me/8809617333990"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex h-9 px-3 rounded-full bg-[#25D366] text-white text-xs font-bold items-center"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-[#e4d8c4]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f4eee4] via-[#fbf9f5] to-[#efe4d2]"></div>
        <div className="absolute inset-y-0 left-0 w-1/3 bg-[radial-gradient(ellipse_at_left,_rgba(197,155,39,0.16),_transparent_70%)]"></div>
        <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(ellipse_at_right,_rgba(61,38,22,0.08),_transparent_70%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#a07c32] mb-3">HAAT Furniture LTD</p>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold tracking-tight text-[#1b120c]">
            Full Products Catalog
          </h1>
          <div className="mx-auto mt-4 mb-5 h-px w-24 bg-gradient-to-r from-transparent via-[#c59b27] to-transparent"></div>
          <p className="max-w-2xl mx-auto text-sm text-[#6b5740] leading-relaxed">
            100% genuine Chittagong Segun teak — handcrafted beds, sofas, dining and office collections.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="px-3 py-1.5 rounded-full bg-white border border-[#e4d8c4] text-[11px] font-bold text-[#5c4a32]">
              {sortedProducts.length} Products
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-[#e4d8c4] text-[11px] font-bold text-[#5c4a32]">
              5 Years Service Warranty
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white border border-[#e4d8c4] text-[11px] font-bold text-[#5c4a32]">
              100% Solid Segun
            </span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
          
          {/* Search Widget */}
          <div className="bg-white p-5 rounded-xl border border-[#e4d8c4] shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5c4a32] mb-3 pb-2 border-b border-[#e4d8c4]">
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
          <div className="bg-white p-5 rounded-xl border border-[#e4d8c4] shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5c4a32] mb-4 pb-2 border-b border-[#e4d8c4]">
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
                className="w-full accent-amber-700 cursor-pointer"
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
          <div className="bg-white p-5 rounded-xl border border-[#e4d8c4] shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5c4a32] mb-4 pb-2 border-b border-[#e4d8c4]">
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
          <div className="bg-white p-4 rounded-xl border border-[#e4d8c4] shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-600">
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
                      View Details →
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

      <div className="fixed right-5 bottom-24 z-50 flex flex-col gap-2 print:hidden">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          disabled={nearTop}
          aria-label="Go to top"
          className={`w-11 h-11 rounded-full border shadow-lg flex items-center justify-center transition-all ${
            nearTop
              ? 'bg-white/70 border-[#e4d8c4] text-slate-300'
              : 'bg-[#1a110d] border-[#c59b27]/50 text-[#e6c875] hover:bg-[#3a2a1c] hover:scale-105'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' })}
          disabled={nearBottom}
          aria-label="Go to bottom"
          className={`w-11 h-11 rounded-full border shadow-lg flex items-center justify-center transition-all ${
            nearBottom
              ? 'bg-white/70 border-[#e4d8c4] text-slate-300'
              : 'bg-[#1a110d] border-[#c59b27]/50 text-[#e6c875] hover:bg-[#3a2a1c] hover:scale-105'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
