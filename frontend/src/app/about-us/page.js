'use client';
import Link from 'next/link';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#f7f3ec] text-slate-800 font-sans">
      <div className="bg-[#f8f6f0] text-xs py-2.5 px-4 sm:px-8 flex flex-wrap items-center justify-between border-b border-slate-200/80">
        <span className="font-extrabold text-[#a07c32] tracking-wide">HAAT FURNITURE LIMITED — Official 100% Solid Chittagong Segun Wood Outlet</span>
        <a href="tel:+8809617333990" className="font-extrabold text-amber-700">Hotline +8809617333990</a>
      </div>

      <header className="sticky top-0 z-[60] bg-[#fbf9f5]/95 backdrop-blur-xl border-b border-[#e4d8c4] shadow-[0_10px_28px_-20px_rgba(26,17,13,0.4)] w-full">
        <div className="h-[3px] bg-gradient-to-r from-[#c59b27] via-[#e6c875] to-[#c59b27]"></div>
        <div className="w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-[82px] grid grid-cols-[auto_1fr_auto] items-center gap-5">
          <Link href="/" className="flex items-center flex-shrink-0">
            <span className="inline-flex items-center bg-white rounded-2xl border border-[#e4d8c4] px-3 py-1.5 shadow-sm min-w-[160px] min-h-[48px]">
              <img src="/images/logo.jpg" alt="HAAT FURNITURE LIMITED" className="h-10 sm:h-11 w-auto max-w-[240px] object-contain object-left" />
            </span>
          </Link>

          <nav className="hidden lg:flex items-center justify-center gap-1">
            {[
              { name: "HOME FURNITURE", href: "/product-category/home-furniture", megaMenu: true, groups: [
                { title: "Bed Room", href: "/product-category/home-furniture/bed-room", items: [
                  { name: "Bed", href: "/product-category/home-furniture/bed-room/bed" },
                  { name: "Almirah", href: "/product-category/home-furniture/bed-room/almirah" },
                  { name: "Dressing Table", href: "/product-category/home-furniture/bed-room/dressing-table" },
                  { name: "Wardrobe", href: "/product-category/home-furniture/bed-room/wardrobe" },
                  { name: "Bed Side Table", href: "/product-category/home-furniture/bed-room/bed-side-table" },
                  { name: "Chest of Drawer", href: "/product-category/home-furniture/bed-room/chest-of-drawer" }
                ]},
                { title: "Dinning Room", href: "/product-category/home-furniture/dinning-room", items: [
                  { name: "Dinning Set", href: "/product-category/home-furniture/dinning-room/dinning-set" },
                  { name: "Showcase", href: "/product-category/home-furniture/dinning-room/showcase" },
                  { name: "Corner Showcase", href: "/product-category/home-furniture/dinning-room/corner-showcase" },
                  { name: "Side Table", href: "/product-category/home-furniture/dinning-room/side-table" }
                ]},
                { title: "Living Room", href: "/product-category/home-furniture/living-room", items: [
                  { name: "Sofa", href: "/product-category/home-furniture/living-room/sofa" },
                  { name: "Center Table", href: "/product-category/home-furniture/living-room/center-table" },
                  { name: "Coffee Table", href: "/product-category/home-furniture/living-room/coffee-table" },
                  { name: "Shoe Rack", href: "/product-category/home-furniture/living-room/shoe-rack" },
                  { name: "Book Shelf", href: "/product-category/home-furniture/living-room/book-shelf" }
                ]},
                { title: "Kitchen", href: "/product-category/home-furniture/kitchen", items: [
                  { name: "Mini Cabinet", href: "/product-category/home-furniture/kitchen/mini-cabinet" },
                  { name: "Oven Stand", href: "/product-category/home-furniture/kitchen/oven-stand" }
                ]}
              ]},
              { name: "OFFICE FURNITURE", href: "/product-category/office-furniture", items: [
                { name: "Work Station", href: "/product-category/office-furniture/work-station" },
                { name: "Chair", href: "/product-category/office-furniture/chair" },
                { name: "Office Sofa", href: "/product-category/office-furniture/office-sofa" },
                { name: "Table", href: "/product-category/office-furniture/table" }
              ]},
              { name: "MATTRESS", href: "/product-category/mattress" },
              { name: "DOOR", href: "/product-category/door", items: [
                { name: "Flash Door", href: "/product-category/door/flash-door" },
                { name: "Frame", href: "/product-category/door/frame" },
                { name: "Wooden Door", href: "/product-category/door/wooden-door" }
              ]},
              { name: "MISCELLANEOUS", href: "/product-category/miscellaneous", items: [
                { name: "Iron Stand", href: "/product-category/miscellaneous/iron-stand" },
                { name: "TV Cabinet", href: "/product-category/miscellaneous/tv-cabinet" }
              ]},
              { name: "ABOUT US", href: "/about-us", items: [
                { name: "Terms & Conditions", href: "/terms-conditions" },
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Refund and Returns Policy", href: "/refund-returns-policy" }
              ] }
            ].map((menu, idx) => (
              <div key={idx} className="relative h-[82px] flex items-center group">
                <Link
                  href={menu.href}
                  className={`relative flex items-center gap-1 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] whitespace-nowrap transition-colors ${
                    menu.name === "ABOUT US" ? 'text-[#a07c32]' : 'text-slate-800 hover:text-[#a07c32]'
                  }`}
                >
                  <span>{menu.name}</span>
                  {(menu.groups || menu.items) && <span className="text-[8px] opacity-70">▾</span>}
                  <span className={`absolute left-3 right-3 -bottom-px h-[2px] rounded-full bg-[#c59b27] ${menu.name === "ABOUT US" ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></span>
                </Link>

                {menu.megaMenu && menu.groups && (
                  <div className="nav-glass absolute top-full left-1/2 -translate-x-1/2 min-w-[760px] text-slate-900 shadow-2xl rounded-2xl border border-white/70 p-6 z-[70] grid-cols-4 gap-6 overflow-hidden hidden group-hover:grid">
                    {menu.groups.map((group, gIdx) => (
                      <div key={gIdx} className="space-y-3">
                        <Link href={group.href} className="block text-xs font-bold text-[#a07c32] uppercase tracking-wider pb-2 border-b border-white/40">{group.title}</Link>
                        <div className="space-y-1.5">
                          {group.items.map((item, iIdx) => (
                            <Link key={iIdx} href={item.href} className="block text-[13px] font-medium text-slate-600 hover:text-[#a07c32]">{item.name}</Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!menu.megaMenu && menu.items && (
                  <div className="nav-glass absolute top-full left-0 w-56 text-slate-900 shadow-2xl rounded-2xl border border-white/70 p-3 space-y-1 z-[70] overflow-hidden hidden group-hover:block">
                    {menu.items.map((sub, sIdx) => (
                      <Link key={sIdx} href={sub.href} className="block px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-white/50 hover:text-[#a07c32] rounded-xl">{sub.name}</Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 justify-end">
            <a href="https://wa.me/8809617333990" target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center h-11 px-4 rounded-full bg-[#25D366] hover:bg-[#1fb857] text-white text-sm font-bold shadow-md">
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      <section className="relative min-h-[58vh] flex items-center overflow-hidden bg-[#1a110d]">
        <img
          src="/images/hero_slide_1.jpg"
          alt="HAAT Furniture showroom interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a110d]/80 via-[#1a110d]/45 to-transparent"></div>
        <div className="relative z-10 max-w-[1320px] mx-auto px-4 sm:px-8 py-20 w-full text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#e6c875]">Since Dhaka · Solid Segun Heritage</p>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
            About HAAT Furniture Limited
          </h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-[#eadcc8] leading-relaxed">
            Premium handcrafted 100% solid Chittagong Segun teak furniture for homes and offices — with a 5-year service warranty for manufacturing fault.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/product-category/home-furniture" className="px-6 py-3 rounded-full bg-white text-slate-900 text-sm font-bold">
              Browse collection
            </Link>
            <a href="#about-story" className="px-6 py-3 rounded-full border border-white/70 text-sm font-bold">
              Read our story
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-[#e8dcc8] bg-[#f6efe3]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-4">
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/about-us" className="px-4 py-2 rounded-full bg-[#a07c32] text-white text-xs font-bold uppercase tracking-[0.12em]">
              About Us
            </Link>
            <Link href="/terms-conditions" className="px-4 py-2 rounded-full bg-white border border-[#e4d8c4] text-[#6d5a3f] hover:text-[#a07c32] text-xs font-bold uppercase tracking-[0.12em]">
              Terms & Conditions
            </Link>
            <Link href="/privacy-policy" className="px-4 py-2 rounded-full bg-white border border-[#e4d8c4] text-[#6d5a3f] hover:text-[#a07c32] text-xs font-bold uppercase tracking-[0.12em]">
              Privacy Policy
            </Link>
            <Link href="/refund-returns-policy" className="px-4 py-2 rounded-full bg-white border border-[#e4d8c4] text-[#6d5a3f] hover:text-[#a07c32] text-xs font-bold uppercase tracking-[0.12em]">
              Refund & Returns
            </Link>
          </div>
        </div>
      </section>

      <section id="about-story" className="relative overflow-hidden py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-[#ead4a4]/40 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-[#d8c0a0]/30 blur-3xl"></div>
        </div>

        <div className="relative max-w-[1100px] mx-auto px-4 sm:px-8 space-y-8">
          <div className="bg-white/85 backdrop-blur-sm rounded-[1.6rem] border border-[#e4d8c4] p-6 sm:p-8 shadow-[0_20px_45px_-30px_rgba(26,17,13,0.45)]">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a07c32]">WELCOME TO HAAT FURNITURE</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-black text-slate-900 leading-tight">About Us</h2>
            <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-4 text-sm text-slate-600 leading-7">
                <p>Haat Furniture Ltd is a name synonymous with quality modern production. Our professionals carry more than three decades of combined furniture manufacturing experience across local and international markets.</p>
                <p>Our sales and decorating team works with one clear mission: helping every customer become fully satisfied through expert guidance in fabric coordination, finish selection, and product choice.</p>
                <p>Production coordinators ensure every item is built with care and delivered on time. In the unlikely event of a defect, we stand behind our quality and workmanship with full commitment.</p>
                <p>Growing demand for our home furniture, office furniture, doors, mattress and hospital items has helped us expand and export. This global exposure supports our international quality standard.</p>
              </div>
              <div className="lg:col-span-4 bg-[#f8f3ea] rounded-2xl border border-[#eadcc7] p-5 space-y-3">
                <h3 className="text-lg font-black text-[#5c4a32]">Why customers trust HAAT</h3>
                <p className="text-xs text-slate-600 leading-6"><span className="font-bold text-slate-800">30+ years expertise:</span> Experienced team with deep craftsmanship knowledge.</p>
                <p className="text-xs text-slate-600 leading-6"><span className="font-bold text-slate-800">International standard:</span> Export-focused production quality.</p>
                <p className="text-xs text-slate-600 leading-6"><span className="font-bold text-slate-800">Fair pricing:</span> Competitive value on genuine solid wood furniture.</p>
                <p className="text-xs text-slate-600 leading-6"><span className="font-bold text-slate-800">Satisfaction guarantee:</span> Strong after-sales support on workmanship quality.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: "30+", label: "Years of Expertise" },
              { value: "100%", label: "Solid Segun Focus" },
              { value: "64", label: "District Delivery Reach" },
              { value: "Export", label: "International Exposure" }
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-[#e8dcc8] p-4 text-center shadow-sm">
                <p className="text-2xl sm:text-3xl font-black text-[#5c4a32]">{stat.value}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a6a3a]">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-[1.4rem] border border-[#e4d8c4] p-7 shadow-sm hover:shadow-[0_18px_36px_-26px_rgba(26,17,13,0.45)] transition-all">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a07c32]">Our Mission</p>
              <h3 className="mt-2 text-2xl font-black text-[#5c4a32]">Purpose-driven craftsmanship</h3>
              <p className="mt-4 text-sm text-slate-600 leading-7">Our goal at Haat Furniture Company is to satisfy each of our clients' unique needs with high-quality furniture. To provide each and every customer with a pleasurable shopping experience, we aspire to be the best source for fashionable and reasonably priced furniture.</p>
            </div>

            <div className="bg-white rounded-[1.4rem] border border-[#e4d8c4] p-7 shadow-sm hover:shadow-[0_18px_36px_-26px_rgba(26,17,13,0.45)] transition-all">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#a07c32]">Our Vision</p>
              <h3 className="mt-2 text-2xl font-black text-[#5c4a32]">Global trust, beautiful spaces</h3>
              <p className="mt-4 text-sm text-slate-600 leading-7">Haat Furniture's vision is to become the world's most trusted home furnishing and decorating company, offering beautiful and affordable pieces that make living spaces look and feel extraordinary. We want to inspire people to use our products to build their dream home.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#efe6d8] border-t border-[#e0d2bc] py-8">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-[#6d5a3f]">
          <p>© {new Date().getFullYear()} HAAT Furniture Limited · 100% Solid Chittagong Segun</p>
          <Link href="/" className="font-bold hover:text-slate-900">Back to homepage</Link>
        </div>
      </footer>
    </div>
  );
}
