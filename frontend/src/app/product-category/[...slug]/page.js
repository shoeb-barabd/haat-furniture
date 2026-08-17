'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import productsData from '../../products_128_data.json';

const CATEGORIES_TREE = [
  {
    name: 'Home Furniture',
    slug: 'home-furniture',
    children: [
      {
        name: 'Bed Room',
        slug: 'bed-room',
        children: [
          { name: 'Bed', slug: 'bed' },
          { name: 'Almirah', slug: 'almirah' },
          { name: 'Bed Room Chair', slug: 'bed-room-chair' },
          { name: 'Bed Side Table', slug: 'bed-side-table' },
          { name: 'Chest of Drawer', slug: 'chest-of-drawer' },
          { name: 'Dressing Table', slug: 'dressing-table' },
          { name: 'Showpiece Stand', slug: 'showpiece-stand' },
          { name: 'Wardrobe', slug: 'wardrobe' }
        ]
      },
      {
        name: 'Dinning Room',
        slug: 'dinning-room',
        children: [
          { name: 'Dinning Set', slug: 'dinning-set' },
          { name: 'Showcase', slug: 'showcase' },
          { name: 'Corner Showcase', slug: 'corner-showcase' },
          { name: 'Side Table', slug: 'side-table' }
        ]
      },
      {
        name: 'Kitchen',
        slug: 'kitchen',
        children: [
          { name: 'Mini Cabinet', slug: 'mini-cabinet' },
          { name: 'Oven Stand', slug: 'oven-stand' }
        ]
      },
      {
        name: 'Living room',
        slug: 'living-room',
        children: [
          { name: 'Sofa', slug: 'sofa' },
          { name: 'Center Table', slug: 'center-table' },
          { name: 'Coffee Table', slug: 'coffee-table' },
          { name: 'Book Shelf', slug: 'book-shelf' },
          { name: 'Shoe Rack', slug: 'shoe-rack' },
          { name: 'TV Trolley', slug: 'tv-trolley' }
        ]
      }
    ]
  },
  {
    name: 'Office Furniture',
    slug: 'office-furniture',
    children: [
      { name: 'Work Station', slug: 'work-station' },
      { name: 'Chair', slug: 'chair' },
      { name: 'Office Sofa', slug: 'office-sofa' },
      { name: 'Table', slug: 'table' }
    ]
  },
  {
    name: 'Mattress',
    slug: 'mattress',
    children: []
  },
  {
    name: 'Door',
    slug: 'door',
    children: [
      { name: 'Flash Door', slug: 'flash-door' },
      { name: 'Frame', slug: 'frame' },
      { name: 'Wooden Door', slug: 'wooden-door' }
    ]
  },
  {
    name: 'Miscellaneous',
    slug: 'miscellaneous',
    children: [
      { name: 'Iron Stand', slug: 'iron-stand' },
      { name: 'TV Cabinet', slug: 'tv-cabinet' }
    ]
  }
];

const ROOT_CAT_COUNTS = [
  { name: 'ACCESSORIES', count: '0 Products', slug: 'accessories' },
  { name: 'DOOR', count: '0 Products', slug: 'door' },
  { name: 'HOME FURNITURE', count: '126 Products', slug: 'home-furniture' },
  { name: 'MATTRESS', count: '1 Product', slug: 'mattress' },
  { name: 'MISCELLANEOUS', count: '1 Product', slug: 'miscellaneous' },
  { name: 'OFFICE FURNITURE', count: '2 Products', slug: 'office-furniture' }
];

export default function CategoryPage() {
  const params = useParams();
  const slugArray = params?.slug ? (Array.isArray(params.slug) ? params.slug : [params.slug]) : ['home-furniture'];
  const currentSlug = slugArray[slugArray.length - 1];

  const [minPrice, setMinPrice] = useState(5000);
  const [maxPrice, setMaxPrice] = useState(64000);
  const [sortOption, setSortOption] = useState('default');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [gridCols, setGridCols] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');

  // Find category display metadata
  const categoryInfo = useMemo(() => {
    let title = 'Home Furniture';
    let breadcrumbPath = [{ name: 'Home', url: '/' }, { name: 'Home Furniture', url: '/product-category/home-furniture' }];

    const findInTree = (nodes, currentPath = [{ name: 'Home', url: '/' }]) => {
      for (const node of nodes) {
        const nextPath = [...currentPath, { name: node.name, url: `/product-category/${node.slug}` }];
        if (node.slug === currentSlug) {
          return { title: node.name, breadcrumbs: nextPath };
        }
        if (node.children && node.children.length > 0) {
          const res = findInTree(node.children, nextPath);
          if (res) return res;
        }
      }
      return null;
    };

    const found = findInTree(CATEGORIES_TREE);
    if (found) return found;

    const formattedTitle = currentSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return { title: formattedTitle, breadcrumbs: breadcrumbPath };
  }, [currentSlug]);

  // Filter products by category slug
  const filteredProducts = useMemo(() => {
    return productsData.filter(p => {
      const pCats = p.categories || [];
      const matchesCategory = pCats.includes(currentSlug) || currentSlug === 'all';
      const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
      const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [currentSlug, minPrice, maxPrice, searchQuery]);

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

  const displayedProducts = sortedProducts.slice(0, itemsPerPage);

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-slate-800 font-sans antialiased">
      
      {/* TOP THIN NOTIFICATION & CONTACT RIBBON */}
      <div className="bg-[#f8f6f0] text-slate-700 text-xs py-2.5 px-4 sm:px-8 flex flex-wrap items-center justify-between border-b border-slate-200/80 relative z-50">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-500"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <span className="font-extrabold text-slate-900 tracking-wide">
            HAAT FURNITURE LIMITED — Official 100% Solid Chittagong Segun Wood Outlet
          </span>
          <span className="hidden lg:inline-block px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-black uppercase tracking-wider">
            20 Yrs Warranty
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-slate-600 text-xs font-bold">
          <span className="flex items-center gap-1.5">
            <span className="text-amber-600">📍</span>
            <span>Showrooms: Badda & Mirpur, Dhaka</span>
          </span>
          <span className="text-slate-300">•</span>
          <a href="tel:+8809617333990" className="flex items-center gap-1.5 font-extrabold text-amber-700 hover:text-amber-800 transition-colors">
            <span>📞 Hotline:</span>
            <span>+8809617333990</span>
          </a>
        </div>
      </div>

      {/* ULTRA-LUXURY SINGLE ROW HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl text-slate-900 border-b border-slate-200/90 shadow-sm transition-all w-full">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          
          {/* Official HAAT FURNITURE Logo */}
          <Link href="/" className="flex items-center cursor-pointer group flex-shrink-0">
            <div className="p-2 bg-white rounded-2xl shadow-sm border border-slate-200 group-hover:scale-102 transition-all">
              <img
                src="https://haatfurniture.com/wp-content/uploads/2023/02/haalogo.jpg"
                alt="HAAT FURNITURE LIMITED Logo"
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-4 text-xs font-black tracking-wider uppercase">
            {CATEGORIES_TREE.map((rootCat) => (
              <div key={rootCat.slug} className="group relative py-6 cursor-pointer">
                <Link 
                  href={`/product-category/${rootCat.slug}`}
                  className={`flex items-center gap-1.5 transition-all py-1 font-extrabold text-xs tracking-wider uppercase ${
                    currentSlug === rootCat.slug ? 'text-amber-600 border-b-2 border-amber-600' : 'text-slate-900 hover:text-amber-600'
                  }`}
                >
                  <span>{rootCat.name}</span>
                  {rootCat.children && rootCat.children.length > 0 && <span className="text-[9px] text-slate-400 group-hover:rotate-180 transition-transform">▼</span>}
                </Link>

                {/* Dropdown Menu */}
                {rootCat.children && rootCat.children.length > 0 && (
                  <div className="absolute left-0 top-full hidden group-hover:block bg-white text-slate-900 shadow-2xl rounded-2xl border border-slate-200 min-w-[240px] z-50 p-3 space-y-1">
                    {rootCat.children.map((childCat) => (
                      <Link 
                        key={childCat.slug}
                        href={`/product-category/${rootCat.slug}/${childCat.slug}`}
                        className="flex items-center justify-between px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-600 rounded-xl transition-all"
                      >
                        <span>{childCat.name}</span>
                        <span className="text-[10px] opacity-40">→</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/about-us" className="py-6 text-xs font-extrabold uppercase tracking-wider text-slate-900 hover:text-amber-600 transition">
              ABOUT US
            </Link>
          </nav>

          {/* Action Tools (No Right Overflow) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="relative hidden lg:block w-36 xl:w-44">
              <input
                type="text"
                placeholder="Search teak..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-6 py-2 rounded-full bg-slate-100/90 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white transition-all font-medium"
              />
              <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
            </div>

            <Link
              href="/checkout"
              className="px-3.5 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>🛒</span>
              <span className="hidden sm:inline">Cart / Checkout</span>
            </Link>

            <a
              href="https://wa.me/8801957909186?text=Assalamu%20Alaikum!%20I%20want%20to%20know%20about%20HAAT%20Furniture%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition-all flex items-center gap-1 uppercase tracking-wider whitespace-nowrap"
            >
              <span>💬</span>
              <span>WhatsApp</span>
            </a>
          </div>

        </div>
      </header>

      {/* 2. Black Woodmart Hero Header Banner */}
      <div className="bg-[#0b0c10] text-white py-12 px-4 shadow-inner text-center border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto">
          {/* Title with Back Arrow */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-2xl font-light text-amber-500">←</span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white capitalize font-serif-luxury">
              {categoryInfo.title} Collection
            </h1>
          </div>

          {/* Root Category Counters Strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] font-bold tracking-wider uppercase text-slate-300 pt-2">
            {ROOT_CAT_COUNTS.map((cat) => (
              <Link 
                key={cat.slug} 
                href={`/product-category/${cat.slug}`}
                className="hover:text-amber-400 transition text-center bg-slate-900/80 px-4 py-2 rounded-full border border-slate-800"
              >
                <span className="text-amber-400 font-black">{cat.name}</span>
                <span className="text-[10px] text-slate-400 font-normal lowercase ml-1.5">({cat.count})</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Main Product Area */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
          
          {/* Filter By Price Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
              FILTER BY PRICE
            </h3>
            
            <div className="space-y-4">
              <input 
                type="range" 
                min="5000" 
                max="100000" 
                step="1000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-lime-600 cursor-pointer"
              />

              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Price: ৳{minPrice.toLocaleString()} — ৳{maxPrice.toLocaleString()}</span>
                <button 
                  onClick={() => {}}
                  className="bg-slate-900 text-white px-3.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wider hover:bg-amber-600 transition shadow"
                >
                  FILTER
                </button>
              </div>
            </div>
          </div>

          {/* Top Rated Products Widget */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
              TOP RATED PRODUCTS
            </h3>
            <div className="space-y-4">
              {productsData.slice(0, 3).map((topP) => (
                <div key={topP.id} className="flex items-center gap-3">
                  <img 
                    src={topP.image} 
                    alt={topP.name} 
                    className="w-14 h-14 object-contain rounded-xl border border-slate-100 p-1 bg-slate-50"
                  />
                  <div>
                    <Link href={`/product/${topP.id}`} className="text-xs font-bold text-slate-900 hover:text-amber-600 transition line-clamp-1">
                      {topP.name}
                    </Link>
                    <p className="text-xs font-black text-lime-600 mt-0.5">
                      ৳ {topP.price.toLocaleString()} BDT
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Haat Furniture */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs text-slate-600">
            <h3 className="font-black text-slate-900 uppercase tracking-wider text-xs border-b pb-2">
              WHY CHOOSE HAAT FURNITURE
            </h3>
            <p>✔ 100% Solid Chittagong Segun Teak Wood</p>
            <p>✔ 20-Year Anti-Borer & Termite Proof Warranty</p>
            <p>✔ Free Home Delivery & Assembly in Dhaka</p>
          </div>

        </aside>

        {/* Right Main Grid */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 text-xs text-slate-600">
            
            {/* Breadcrumb Trail */}
            <div className="flex items-center gap-1 font-semibold">
              {categoryInfo.breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.url + idx}>
                  {idx > 0 && <span className="text-slate-300">/</span>}
                  <Link href={crumb.url} className="hover:text-amber-700 transition">
                    {crumb.name}
                  </Link>
                </React.Fragment>
              ))}
            </div>

            {/* Pagination / Grid Toggles / Sort Dropdown */}
            <div className="flex items-center gap-6">
              
              <div className="flex items-center gap-1.5 font-medium">
                <span>Show :</span>
                {[9, 12, 18, 24].map((num) => (
                  <button
                    key={num}
                    onClick={() => setItemsPerPage(num)}
                    className={`px-1.5 py-0.5 rounded text-xs transition ${itemsPerPage === num ? 'font-bold text-slate-900 bg-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              {/* Grid Column Toggles */}
              <div className="hidden sm:flex items-center gap-1">
                {[2, 3, 4].map((cols) => (
                  <button 
                    key={cols}
                    onClick={() => setGridCols(cols)}
                    className={`px-2 py-1 rounded text-xs transition ${gridCols === cols ? 'bg-slate-900 text-white font-black' : 'text-slate-500 hover:text-slate-900'}`}
                  >
                    {cols} Col
                  </button>
                ))}
              </div>

              {/* Sorting Dropdown */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="text-xs font-semibold border-0 bg-transparent text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="default">Default sorting</option>
                <option value="price-low">Sort by price: low to high</option>
                <option value="price-high">Sort by price: high to low</option>
                <option value="rating">Sort by popularity</option>
              </select>

            </div>

          </div>

          {/* Product Grid */}
          {displayedProducts.length > 0 ? (
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${gridCols} gap-6`}>
              {displayedProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-square overflow-hidden bg-slate-50/50 p-4 flex items-center justify-center">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-[#0b0c10]/90 backdrop-blur-md text-amber-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md border border-amber-500/20">
                        {product.badge || '100% Solid Segun'}
                      </span>
                    </div>

                    <div className="p-5 text-center space-y-2">
                      <p className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
                        {product.category_names ? product.category_names[0] : 'Solid Chittagong Segun'}
                      </p>

                      <Link href={`/product/${product.id}`} className="font-extrabold text-sm text-slate-900 hover:text-amber-600 transition line-clamp-1">
                        {product.name}
                      </Link>

                      <div className="flex items-center justify-center gap-2 pt-1">
                        <span className="text-lime-600 font-black text-base">
                          ৳ {product.price.toLocaleString()} BDT
                        </span>
                        {product.oldPrice && (
                          <span className="text-slate-400 text-xs line-through font-normal">
                            ৳ {product.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link 
                      href={`/product/${product.id}`}
                      className="w-full block text-center bg-slate-900 hover:bg-amber-600 text-white py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md transition-all duration-300 hover:scale-102 active:scale-95"
                    >
                      Select Options →
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
              <span className="text-4xl">🛏️</span>
              <h3 className="text-lg font-bold text-slate-800">No {categoryInfo.title} products found</h3>
              <p className="text-xs text-slate-500">Try adjusting your price filter range.</p>
              <Link href="/product-category/home-furniture" className="inline-block bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-amber-600 transition">
                Browse All Home Furniture
              </Link>
            </div>
          )}

        </section>

      </main>
    </div>
  );
}
