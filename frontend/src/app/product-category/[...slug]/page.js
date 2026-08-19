'use client';

import React, { useState, useMemo, useEffect } from 'react';
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

const countForSlug = (products, slug) =>
  products.filter((p) => (p.categories || []).includes(slug)).length;

export default function CategoryPage() {
  const params = useParams();
  const slugArray = params?.slug ? (Array.isArray(params.slug) ? params.slug : [params.slug]) : ['home-furniture'];
  const currentSlug = slugArray[slugArray.length - 1];

  const [products, setProducts] = useState(productsData);
  const [minPrice, setMinPrice] = useState(5000);
  const [maxPrice, setMaxPrice] = useState(64000);
  const [sortOption, setSortOption] = useState('default');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [gridCols, setGridCols] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Find category display metadata
  const categoryInfo = useMemo(() => {
    let title = 'Home Furniture';
    let breadcrumbPath = [{ name: 'Home', url: '/' }, { name: 'Home Furniture', url: '/product-category/home-furniture' }];

    const findInTree = (nodes, currentPath = [{ name: 'Home', url: '/' }], slugPrefix = '') => {
      for (const node of nodes) {
        const fullSlug = slugPrefix ? `${slugPrefix}/${node.slug}` : node.slug;
        const nextPath = [...currentPath, { name: node.name, url: `/product-category/${fullSlug}` }];
        if (node.slug === currentSlug) {
          return { title: node.name, breadcrumbs: nextPath };
        }
        if (node.children && node.children.length > 0) {
          const res = findInTree(node.children, nextPath, fullSlug);
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
    return products.filter(p => {
      const pCats = p.categories || [];
      const matchesCategory = pCats.includes(currentSlug) || currentSlug === 'all';
      const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
      const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesPrice && matchesSearch;
    });
  }, [products, currentSlug, minPrice, maxPrice, searchQuery]);

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

  const topRatedProducts = useMemo(() => {
    const source = filteredProducts.length ? filteredProducts : products;
    return [...source].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
  }, [filteredProducts]);

  const galleryChips = useMemo(() => {
    let nodes = CATEGORIES_TREE;
    const prefix = [];

    for (let i = 0; i < slugArray.length; i++) {
      const slug = slugArray[i];
      const match = nodes.find((n) => n.slug === slug);
      if (!match) break;

      if (i === slugArray.length - 1) {
        const list = match.children?.length ? match.children : nodes;
        const base = match.children?.length ? [...prefix, slug] : prefix;
        return list.map((item) => ({
          name: item.name,
          href: `/product-category/${[...base, item.slug].join('/')}`,
          active: item.slug === currentSlug || slugArray.includes(item.slug),
          count: countForSlug(products, item.slug)
        }));
      }

      prefix.push(slug);
      nodes = match.children || [];
    }

    return CATEGORIES_TREE.map((cat) => ({
      name: cat.name,
      href: `/product-category/${cat.slug}`,
      active: slugArray[0] === cat.slug,
      count: countForSlug(products, cat.slug)
    }));
  }, [products, slugArray, currentSlug]);

  const backHref = slugArray.length > 1 ? `/product-category/${slugArray.slice(0, -1).join('/')}` : '/';
  const gridClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }[gridCols];

  return (
    <div className="min-h-screen bg-[#f4efe7] text-slate-800 font-sans antialiased">
      
      <div className="bg-[#f8f6f0] text-slate-700 text-xs py-2.5 px-4 sm:px-8 flex flex-wrap items-center justify-between border-b border-slate-200/80 relative z-50">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-500"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <span className="font-extrabold text-[#a07c32] tracking-wide">
            HAAT FURNITURE LIMITED — Official 100% Solid Chittagong Segun Wood Outlet
          </span>
          <span className="hidden lg:inline-block px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-black uppercase tracking-wider">
            5 Yrs Warranty
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 text-[#8a6a3a] text-xs font-bold">
          <span className="flex items-center gap-1.5">
            <span className="text-amber-600">📍</span>
            <span>Showrooms: Badda & Mirpur, Dhaka</span>
          </span>
          <span className="text-[#d4c4ae]">•</span>
          <a href="tel:+8809617333990" className="flex items-center gap-1.5 font-extrabold text-amber-700 hover:text-amber-800 transition-colors">
            <span>📞 Hotline:</span>
            <span>+8809617333990</span>
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-[60] bg-[#fbf9f5]/95 backdrop-blur-xl border-b border-[#e4d8c4] shadow-[0_10px_28px_-20px_rgba(26,17,13,0.4)] w-full">
        <div className="h-[3px] bg-gradient-to-r from-[#c59b27] via-[#e6c875] to-[#c59b27]"></div>
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-[82px] grid grid-cols-[auto_1fr_auto] items-center gap-5">
          <Link href="/" className="flex items-center flex-shrink-0">
            <span className="inline-flex items-center bg-white rounded-2xl border border-[#e4d8c4] px-3 py-1.5 shadow-sm min-w-[160px] min-h-[48px]">
              <img
                src="/images/logo.jpg"
                alt="HAAT FURNITURE LIMITED"
                className="h-10 sm:h-11 w-auto max-w-[240px] object-contain object-left"
              />
            </span>
          </Link>

          <nav className="hidden lg:flex items-center justify-center gap-1">
            {CATEGORIES_TREE.map((rootCat) => {
              const hasMegaMenu = rootCat.slug === 'home-furniture' && rootCat.children?.some(c => c.children?.length);
              return (
              <div key={rootCat.slug} className="group relative h-[82px] flex items-center">
                <Link
                  href={`/product-category/${rootCat.slug}`}
                  className={`relative flex items-center gap-1 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] whitespace-nowrap ${
                    currentSlug === rootCat.slug ? 'text-[#a07c32]' : 'text-slate-800 hover:text-[#a07c32]'
                  }`}
                >
                  <span>{rootCat.name}</span>
                  {rootCat.children && rootCat.children.length > 0 && <span className="text-[8px] opacity-70">▾</span>}
                  <span className={`absolute left-3 right-3 -bottom-px h-[2px] rounded-full bg-[#c59b27] ${currentSlug === rootCat.slug ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></span>
                </Link>

                {hasMegaMenu && (
                  <div className="nav-glass absolute top-full left-1/2 -translate-x-1/2 min-w-[760px] text-slate-900 shadow-2xl rounded-2xl border border-white/70 p-6 z-[70] grid grid-cols-4 gap-6 overflow-hidden hidden group-hover:grid">
                    {rootCat.children.filter(c => c.children?.length).map((group) => (
                      <div key={group.slug} className="space-y-3">
                        <Link
                          href={`/product-category/${rootCat.slug}/${group.slug}`}
                          className="block text-xs font-bold text-[#a07c32] uppercase tracking-wider pb-2 border-b border-white/40"
                        >
                          {group.name}
                        </Link>
                        <div className="space-y-1.5">
                          {group.children.map((item) => (
                            <Link
                              key={item.slug}
                              href={`/product-category/${rootCat.slug}/${group.slug}/${item.slug}`}
                              className="block text-[13px] font-medium text-slate-600 hover:text-[#a07c32]"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!hasMegaMenu && rootCat.children && rootCat.children.length > 0 && (
                  <div className="nav-glass absolute left-0 top-full hidden group-hover:block text-slate-900 shadow-2xl rounded-2xl border border-white/70 min-w-[220px] z-[70] p-3 space-y-1 overflow-hidden">
                    {rootCat.children.map((childCat) => (
                      <Link
                        key={childCat.slug}
                        href={`/product-category/${rootCat.slug}/${childCat.slug}`}
                        className="block px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-white/50 hover:text-[#a07c32] rounded-xl"
                      >
                        {childCat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              );
            })}
            <div className="group relative h-[82px] flex items-center">
              <Link href="/about-us" className="relative flex items-center gap-1 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] whitespace-nowrap text-slate-800 hover:text-[#a07c32]">
                <span>About Us</span>
                <span className="text-[8px] opacity-70">▾</span>
                <span className="absolute left-3 right-3 -bottom-px h-[2px] rounded-full bg-[#c59b27] opacity-0 group-hover:opacity-100"></span>
              </Link>
              <div className="nav-glass absolute top-full left-0 w-64 text-slate-900 shadow-2xl rounded-2xl border border-white/70 p-3 space-y-1 z-[70] overflow-hidden hidden group-hover:block">
                <Link href="/terms-conditions" className="block px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-white/50 hover:text-[#a07c32] rounded-xl">
                  Terms & Conditions
                </Link>
                <Link href="/privacy-policy" className="block px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-white/50 hover:text-[#a07c32] rounded-xl">
                  Privacy Policy
                </Link>
                <Link href="/refund-returns-policy" className="block px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-white/50 hover:text-[#a07c32] rounded-xl">
                  Refund and Returns Policy
                </Link>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2.5 justify-end">
            <div className="relative hidden md:block w-52">
              <input
                type="text"
                placeholder="Search furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-full bg-white border border-[#e4d8c4] text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#c59b27] focus:ring-2 focus:ring-[#e6c875]/40"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            </div>

            <Link
              href="/checkout"
              className="h-11 px-4 rounded-full bg-white border border-[#e4d8c4] hover:border-[#c59b27] text-slate-800 text-sm font-bold flex items-center gap-2 shadow-sm"
            >
              🛒 Cart
            </Link>

            <a
              href="https://wa.me/8801957909186?text=Assalamu%20Alaikum!%20I%20want%20to%20know%20about%20HAAT%20Furniture%20products."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center h-11 px-4 rounded-full bg-[#25D366] hover:bg-[#1fb857] text-white text-sm font-bold shadow-md"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* Warm sand collection intro */}
      <div className="relative bg-[#efe6d8] py-7 px-4 border-b border-[#e0d2bc]">
        <div className="max-w-7xl mx-auto relative z-10 space-y-4">
          <Link href={backHref} className="inline-flex items-center gap-2 text-[#8a6a3a] text-xs font-bold uppercase tracking-[0.18em] hover:text-slate-800 transition">
            ← Back
          </Link>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#b4892e]">HAAT Furniture · Solid Segun</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight capitalize text-slate-800">
              {categoryInfo.title}
              <span className="ml-2 font-serif-luxury italic font-medium text-[#c59b27] text-2xl sm:text-3xl">Collection</span>
            </h1>
            <p className="text-sm text-[#6d5a3f] max-w-xl">
              {filteredProducts.length} handcrafted pieces — 100% solid Chittagong Segun teak with 5-year service warranty.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            {galleryChips.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition ${
                  cat.active
                    ? 'bg-[#e6c875] text-slate-900 border-[#e6c875] shadow-sm'
                    : 'bg-white/80 border-[#e0d2bc] text-slate-600 hover:border-[#c59b27] hover:text-[#8a6a3a]'
                }`}
              >
                {cat.name}
                <span className="ml-1.5 font-semibold normal-case tracking-normal text-slate-500">({cat.count})</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-[#e8dcc8] shadow-[0_10px_28px_-22px_rgba(80,50,20,0.45)] space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700 pb-2 border-b border-[#efe6d8]">
              Filter by price
            </h3>
            <input
              type="range"
              min="5000"
              max="100000"
              step="1000"
              value={minPrice}
              onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 1000))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <input
              type="range"
              min="5000"
              max="100000"
              step="1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 1000))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-xs font-semibold text-slate-600">
              ৳{minPrice.toLocaleString()} — ৳{maxPrice.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e8dcc8] shadow-[0_10px_28px_-22px_rgba(80,50,20,0.45)] space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700 pb-2 border-b border-[#efe6d8]">
              Top rated in this gallery
            </h3>
            <div className="space-y-3">
              {topRatedProducts.map((topP) => (
                <Link key={topP.id} href={`/product/${topP.id}`} className="flex items-center gap-3 group">
                  <img
                    src={topP.image}
                    alt={topP.name}
                    className="w-14 h-14 object-contain rounded-xl bg-slate-50 p-1"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800 group-hover:text-amber-700 transition line-clamp-1">{topP.name}</p>
                    <p className="text-xs font-black text-emerald-700 mt-0.5">৳ {topP.price.toLocaleString()} BDT</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e8dcc8] shadow-[0_10px_28px_-22px_rgba(80,50,20,0.45)] text-slate-600 space-y-3 text-xs">
            <h3 className="font-bold uppercase tracking-[0.18em] text-[10px] text-[#b4892e] border-b border-[#efe6d8] pb-2">
              Why HAAT Furniture
            </h3>
            <p>✔ 100% Solid Chittagong Segun teak</p>
            <p>✔ 5-year service warranty (manufacturing fault)</p>
            <p>✔ Free home delivery & assembly in Dhaka</p>
          </div>
        </aside>

        <section className="lg:col-span-3 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#e0d2bc] text-xs text-slate-500">
            <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-semibold flex-wrap">
              {categoryInfo.breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={crumb.url + idx}>
                  {idx > 0 && <span className="text-slate-300">/</span>}
                  <Link href={crumb.url} className="hover:text-amber-700 transition">
                    {crumb.name}
                  </Link>
                </React.Fragment>
              ))}
            </div>
            <p className="font-medium text-slate-400">
              Showing {displayedProducts.length} of {sortedProducts.length} pieces
            </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 font-medium">
                <span>Show</span>
                {[9, 12, 18, 24].map((num) => (
                  <button
                    key={num}
                    onClick={() => setItemsPerPage(num)}
                    className={`min-w-7 px-1.5 py-0.5 rounded-full text-xs transition ${itemsPerPage === num ? 'font-bold text-slate-900 bg-[#e6c875]' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center gap-1">
                {[2, 3, 4].map((cols) => (
                  <button
                    key={cols}
                    onClick={() => setGridCols(cols)}
                    className={`px-2.5 py-1 rounded-full text-xs transition ${gridCols === cols ? 'bg-[#e6c875] text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'}`}
                  >
                    {cols} Col
                  </button>
                ))}
              </div>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="text-xs font-semibold border border-[#e8dcc8] bg-white rounded-full px-3 py-1.5 text-slate-600 focus:outline-none cursor-pointer"
              >
                <option value="default">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="rating">Most popular</option>
              </select>
            </div>
          </div>

          {displayedProducts.length > 0 ? (
            <div className={`grid ${gridClass} gap-6`}>
              {displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#e8dcc8] shadow-[0_12px_32px_-24px_rgba(80,50,20,0.55)] hover:border-[#e6c875] hover:shadow-[0_16px_36px_-20px_rgba(80,50,20,0.4)] hover:-translate-y-0.5 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-square overflow-hidden bg-white p-5 flex items-center justify-center border-b border-[#efe6d8]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain group-hover:scale-[1.04] transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-[#e6c875] text-slate-900 text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                        {product.badge || '100% Solid Segun'}
                      </span>
                    </div>

                    <div className="p-5 text-center space-y-1.5">
                      <p className="text-[10px] font-bold uppercase text-amber-600 tracking-[0.16em]">
                        {product.category_names ? product.category_names[0] : 'Solid Chittagong Segun'}
                      </p>
                      <Link href={`/product/${product.id}`} className="font-bold text-sm text-slate-800 hover:text-amber-700 transition line-clamp-1">
                        {product.name}
                      </Link>
                      <p className="text-emerald-700 font-black text-base pt-1">
                        ৳ {product.price.toLocaleString()} BDT
                        {product.oldPrice && (
                          <span className="text-slate-400 text-xs line-through font-normal ml-2">
                            ৳ {product.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5">
                    <Link
                      href={`/product/${product.id}`}
                      className="w-full block text-center bg-[#e6c875] hover:bg-[#c59b27] text-slate-900 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-[#e8dcc8] shadow-[0_10px_28px_-22px_rgba(80,50,20,0.45)] text-center space-y-4">
              <span className="text-4xl">🛏️</span>
              <h3 className="text-lg font-bold text-slate-800">No {categoryInfo.title} products found</h3>
              <p className="text-xs text-slate-500">Try adjusting your price filter range.</p>
              <Link href="/product-category/home-furniture" className="inline-block bg-amber-100 text-amber-800 px-6 py-2.5 rounded-full font-bold text-xs hover:bg-amber-200 transition">
                Browse all home furniture
              </Link>
            </div>
          )}
        </section>
      </main>

      <footer className="bg-[#efe6d8] text-[#6d5a3f] py-10 mt-4 border-t border-[#e0d2bc]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} HAAT Furniture Limited · 100% Solid Chittagong Segun</p>
          <p>Showrooms: Badda & Mirpur, Dhaka · Hotline +8809617333990</p>
        </div>
      </footer>
    </div>
  );
}
