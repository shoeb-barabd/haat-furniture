'use client';
import Link from 'next/link';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Top Ribbon */}
      <div className="bg-slate-900 text-white text-xs py-3 px-6 border-b border-slate-800 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-amber-400 hover:underline flex items-center gap-1">
          <span>← Back to Storefront / স্টোরে ফিরে যান</span>
        </Link>
        <span className="text-slate-400">📞 Hotline: +8809617333990</span>
      </div>

      {/* Hero Header */}
      <div className="bg-[#0b0c10] text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <span className="text-amber-500 font-extrabold text-xs uppercase tracking-widest bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/20">
            About HAAT Furniture Limited
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            100% Solid Chittagong Segun Teak Wood Heritage
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Leading manufacturer of premium handcrafted solid Chittagong Segun teak wood furniture in Bangladesh with 20-Year Anti-Borer & Termite Guarantee.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12 space-y-12">
        
        {/* Core Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <span className="text-4xl inline-block">🪵</span>
            <h3 className="font-extrabold text-base text-slate-900">100% Genuine Chittagong Segun</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We exclusively use seasoned Chittagong Segun teak wood sourced directly from sustainable forests, ensuring unmatched durability and natural grain beauty.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <span className="text-4xl inline-block">🛡️</span>
            <h3 className="font-extrabold text-base text-slate-900">20 Years Guarantee</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every piece comes with an official 20-year anti-borer and termite-proof warranty card for complete peace of mind.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <span className="text-4xl inline-block">🚚</span>
            <h3 className="font-extrabold text-base text-slate-900">Safe Home Delivery</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Free delivery and expert installation in Dhaka City, plus safe protective foam-crated transport across all 64 districts of Bangladesh.
            </p>
          </div>
        </div>

        {/* Showroom & Contact Info */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
            Visit Our Showrooms & Factory
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-slate-600">
            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm">🏬 Badda Showroom:</h4>
              <p>Cha-90/2, Pragati Sarani, Middle Badda (Beside Merul Badda Bridge), Dhaka - 1212.</p>
              <p><strong className="text-slate-800">Phone:</strong> +8809617333990 / +8801711223344</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm">🏬 Mirpur Showroom:</h4>
              <p>Plot-12, Main Road, Section-10 (Near Mirpur 10 Goal Chottor), Mirpur, Dhaka.</p>
              <p><strong className="text-slate-800">Phone:</strong> +8809617333990 / +8801811223344</p>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}
