'use client';

import Link from 'next/link';

export default function RefundReturnsPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f7f3ec] text-slate-800">
      <section className="relative overflow-hidden bg-[#1a110d]">
        <img src="/images/hero_slide_2.jpg" alt="Refund policy background" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a110d]/85 via-[#1a110d]/60 to-[#1a110d]/35"></div>
        <div className="relative max-w-[1100px] mx-auto px-4 sm:px-8 py-14 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#e6c875]">Home » Refund and Returns Policy</p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black">Return & Refund Policy</h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#eadcc8]">Simple, transparent return and refund rules so customers can order with confidence.</p>
        </div>
      </section>

      <section className="border-b border-[#e8dcc8] bg-[#f6efe3]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-4 flex flex-wrap gap-2">
          <Link href="/about-us" className="px-4 py-2 rounded-full bg-white border border-[#e4d8c4] text-[#6d5a3f] text-xs font-bold uppercase tracking-[0.12em]">About Us</Link>
          <Link href="/terms-conditions" className="px-4 py-2 rounded-full bg-white border border-[#e4d8c4] text-[#6d5a3f] text-xs font-bold uppercase tracking-[0.12em]">Terms & Conditions</Link>
          <Link href="/privacy-policy" className="px-4 py-2 rounded-full bg-white border border-[#e4d8c4] text-[#6d5a3f] text-xs font-bold uppercase tracking-[0.12em]">Privacy Policy</Link>
          <Link href="/refund-returns-policy" className="px-4 py-2 rounded-full bg-[#a07c32] text-white text-xs font-bold uppercase tracking-[0.12em]">Refund & Returns</Link>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-4 sm:px-8 py-12">
        <div className="bg-white rounded-2xl border border-[#e4d8c4] p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-black text-[#5c4a32]">Return Eligibility</h2>
          <p className="mt-3 text-sm text-slate-600 leading-7">Furniture can be returned in good condition within 3 days.</p>
          <p className="mt-2 text-sm text-slate-600 leading-7">Refund will be processed with a 30% service charge deduction.</p>
          <p className="mt-2 text-sm text-slate-600 leading-7">This policy is not applicable for customized, set broken and fabric product.</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#f2f9f1] border border-[#d7ead3] p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3f7f3b]">Eligible</p>
              <p className="mt-1 text-sm text-slate-600">Good-condition furniture returned within 3 days.</p>
            </div>
            <div className="rounded-xl bg-[#faf3f0] border border-[#edd8cd] p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#a04f35]">Not Eligible</p>
              <p className="mt-1 text-sm text-slate-600">Customized items, set broken orders, and fabric products.</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link href="/about-us" className="inline-flex px-5 py-2.5 rounded-full bg-[#a07c32] text-white text-sm font-bold">
            Back to About Us
          </Link>
        </div>
      </section>
    </div>
  );
}
