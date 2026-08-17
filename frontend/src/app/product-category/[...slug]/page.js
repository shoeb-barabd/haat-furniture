'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import productsData from '../../products_128_data.json';

// Category taxonomy definitions matching WooCommerce DB
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

export default function CategoryPage() {
  const params = useParams();
  const slugArray = params?.slug ? (Array.isArray(params.slug) ? params.slug : [params.slug]) : ['home-furniture'];
  const currentSlug = slugArray[slugArray.length - 1];

  // State for filters & layout
  const [maxPrice, setMaxPrice] = useState(150000);
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

    // Fallback format title
    const formattedTitle = currentSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return { title: formattedTitle, breadcrumbs: breadcrumbPath };
  }, [currentSlug]);

  // Filter products by category slug & price & search
  const filteredProducts = useMemo(() => {
    return productsData.filter(p => {
      // Category match
      const pCats = p.categories || [];
      const matchesCategory = pCats.includes(currentSlug) || currentSlug === 'all';
      
      // Price match
      const matchesPrice = p.price <= maxPrice;

      // Search match
      const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [currentSlug, maxPrice, searchQuery]);

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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* 1. Official Brand Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        {/* Top Helpline Bar */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="https://haatfurniture.com/wp-content/uploads/2023/02/haalogo.jpg" 
              alt="HAAT FURNITURE LIMITED" 
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Search Box */}
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-slate-300 rounded-full text-sm focus:outline-none focus:border-amber-700"
              />
              <span className="absolute right-3 top-2.5 text-slate-400">🔍</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-9 h-9 rounded-full bg-lime-600 text-white flex items-center justify-center text-base font-bold">📞</span>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Hotline</p>
                <p className="text-xs font-bold text-slate-800">+8809617333990</p>
              </div>
            </div>

            <Link href="/checkout" className="flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white px-4 py-2 rounded-full font-bold text-xs shadow transition">
              <span>🛍️</span>
              <span>৳188,000</span>
            </Link>
          </div>
        </div>

        {/* Top Category Navigation Bar */}
        <nav className="bg-[#1e1b4b] text-white">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 overflow-x-auto">
            {CATEGORIES_TREE.map((rootCat) => (
              <div key={rootCat.slug} className="group relative py-3 px-4 text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-indigo-900 transition flex items-center gap-1 whitespace-nowrap">
                <Link href={`/product-category/${rootCat.slug}`} className="text-white hover:text-amber-300">
                  {rootCat.name}
                </Link>
                {rootCat.children && rootCat.children.length > 0 && <span className="text-[10px]">⌄</span>}

                {/* Sub-menu Dropdown */}
                {rootCat.children && rootCat.children.length > 0 && (
                  <div className="absolute left-0 top-full hidden group-hover:flex bg-white text-slate-800 shadow-2xl rounded-b-lg border border-slate-200 min-w-[240px] z-50 p-2">
                    <div className="w-full">
                      {rootCat.children.map((childCat) => (
                        <div key={childCat.slug} className="group/child relative">
                          <Link 
                            href={`/product-category/${rootCat.slug}/${childCat.slug}`}
                            className="flex items-center justify-between px-3 py-2 text-xs font-medium hover:bg-slate-100 hover:text-amber-700 rounded transition"
                          >
                            <span>{childCat.name}</span>
                            {childCat.children && childCat.children.length > 0 && <span className="text-[10px] text-slate-400">›</span>}
                          </Link>

                          {/* Nested Sub-Sub Menu (Hover Flyout) */}
                          {childCat.children && childCat.children.length > 0 && (
                            <div className="absolute left-full top-0 hidden group-hover/child:block bg-white text-slate-800 shadow-2xl rounded-lg border border-slate-200 min-w-[200px] p-2 z-50">
                              {childCat.children.map((subChild) => (
                                <Link
                                  key={subChild.slug}
                                  href={`/product-category/${rootCat.slug}/${childCat.slug}/${subChild.slug}`}
                                  className="block px-3 py-1.5 text-xs text-slate-600 hover:text-amber-700 hover:bg-slate-50 rounded transition"
                                >
                                  {subChild.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Link href="/about-us" className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-white hover:text-amber-300 hover:bg-indigo-900 transition whitespace-nowrap">
              ABOUT US
            </Link>
          </div>
        </nav>
      </header>

      {/* 2. Hero Category Title & Breadcrumb Header */}
      <div className="bg-[#0f172a] text-white py-12 px-4 shadow-inner relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-medium">
            {categoryInfo.breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.url + idx}>
                {idx > 0 && <span>/</span>}
                <Link href={crumb.url} className="hover:text-amber-400 transition">
                  {crumb.name}
                </Link>
              </React.Fragment>
            ))}
          </div>

          {/* Category Title */}
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            {categoryInfo.title}
          </h1>
          <p className="text-xs text-slate-400">
            Showing {filteredProducts.length} high-quality solid Segun teak wood products
          </p>
        </div>
      </div>

      {/* 3. Main Content Grid (Sidebar + Products) */}
      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
          
          {/* Filter By Price Widget */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Filter By Price
            </h3>
            
            <div className="space-y-4">
              <input 
                type="range" 
                min="5000" 
                max="150000" 
                step="2500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-lime-600 cursor-pointer"
              />
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Price: ৳5,000 — ৳{maxPrice.toLocaleString()}</span>
                <button className="bg-slate-900 text-white px-3 py-1.5 rounded text-[11px] font-bold tracking-wider hover:bg-amber-700 transition">
                  FILTER
                </button>
              </div>
            </div>
          </div>

          {/* Category Hierarchy Accordion Widget */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Product Categories
            </h3>
            <div className="space-y-2 text-xs font-medium">
              {CATEGORIES_TREE.map((root) => (
                <div key={root.slug} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Link 
                      href={`/product-category/${root.slug}`}
                      className={`hover:text-amber-700 transition ${currentSlug === root.slug ? 'font-bold text-amber-700' : 'text-slate-700'}`}
                    >
                      {root.name}
                    </Link>
                  </div>
                  
                  {root.children && root.children.length > 0 && (
                    <div className="pl-4 border-l-2 border-slate-100 space-y-1.5 mt-1">
                      {root.children.map((child) => (
                        <div key={child.slug}>
                          <Link 
                            href={`/product-category/${root.slug}/${child.slug}`}
                            className={`block hover:text-amber-700 transition ${currentSlug === child.slug ? 'font-bold text-amber-700' : 'text-slate-500'}`}
                          >
                            {child.name}
                          </Link>

                          {child.children && child.children.length > 0 && (
                            <div className="pl-3 space-y-1 mt-1">
                              {child.children.map((sub) => (
                                <Link 
                                  key={sub.slug}
                                  href={`/product-category/${root.slug}/${child.slug}/${sub.slug}`}
                                  className={`block text-[11px] hover:text-amber-700 transition ${currentSlug === sub.slug ? 'font-bold text-amber-700' : 'text-slate-400'}`}
                                >
                                  • {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Top Rated Products Widget */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Top Rated Products
            </h3>
            <div className="space-y-4">
              {productsData.slice(0, 4).map((topP) => (
                <div key={topP.id} className="flex items-center gap-3">
                  <img 
                    src={topP.image} 
                    alt={topP.name} 
                    className="w-14 h-14 object-cover rounded border border-slate-100"
                  />
                  <div>
                    <Link href={`/product/${topP.id}`} className="text-xs font-bold text-slate-800 hover:text-amber-700 transition line-clamp-1">
                      {topP.name}
                    </Link>
                    <div className="text-[10px] text-amber-500 font-bold mt-0.5">
                      ★★★★★ <span className="text-slate-400 font-normal">({topP.reviews || 10})</span>
                    </div>
                    <p className="text-xs font-extrabold text-amber-700 mt-0.5">
                      ৳{topP.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </aside>

        {/* Right Main Product Grid Area */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* Top Control Toolbar (Grid options & Sorting) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            
            {/* Show count selector */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span>Show :</span>
              {[9, 12, 18, 24].map((num) => (
                <button
                  key={num}
                  onClick={() => setItemsPerPage(num)}
                  className={`px-2.5 py-1 rounded text-xs transition ${itemsPerPage === num ? 'bg-slate-900 text-white font-bold' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  {num}
                </button>
              ))}
            </div>

            {/* View Mode Controls & Sort Dropdown */}
            <div className="flex items-center gap-4">
              {/* Grid Column Toggles */}
              <div className="hidden sm:flex items-center gap-1 text-xs border border-slate-200 rounded p-0.5">
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

              {/* Sorting Dropdown */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="text-xs font-semibold border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:border-amber-700"
              >
                <option value="default">Default sorting</option>
                <option value="price-low">Sort by price: low to high</option>
                <option value="price-high">Sort by price: high to low</option>
                <option value="rating">Sort by popularity & rating</option>
              </select>
            </div>

          </div>

          {/* Product Grid */}
          {displayedProducts.length > 0 ? (
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${gridCols} gap-6`}>
              {displayedProducts.map((product) => (
                <div 
                  key={product.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition group flex flex-col justify-between"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-slate-100">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      {product.badge && (
                        <span className="absolute top-3 left-3 bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <p className="text-[10px] uppercase font-bold text-amber-700 tracking-wider mb-1">
                        {product.category_names ? product.category_names[0] : 'Solid Segun'}
                      </p>

                      <Link href={`/product/${product.id}`} className="font-bold text-sm text-slate-800 hover:text-amber-700 transition line-clamp-2 mb-2">
                        {product.name}
                      </Link>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-amber-700 font-extrabold text-base">
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

                  {/* Card Footer Actions */}
                  <div className="p-4 pt-0">
                    <Link 
                      href={`/product/${product.id}`}
                      className="w-full block text-center bg-slate-900 hover:bg-amber-700 text-white py-2 rounded-lg font-bold text-xs transition shadow"
                    >
                      View Options & Order →
                    </Link>
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-4">
              <span className="text-4xl">🪵</span>
              <h3 className="text-lg font-bold text-slate-800">No products found in this category</h3>
              <p className="text-xs text-slate-500">Try adjusting your price filter or select another category from the sidebar.</p>
              <Link href="/product-category/home-furniture" className="inline-block bg-amber-700 text-white px-6 py-2 rounded-lg font-bold text-xs hover:bg-amber-800 transition">
                Browse All Home Furniture
              </Link>
            </div>
          )}

        </section>

      </main>
    </div>
  );
}
