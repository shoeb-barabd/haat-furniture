'use client';

import Link from 'next/link';

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-[#f7f3ec] text-slate-800">
      <section className="relative overflow-hidden bg-[#1a110d]">
        <img src="/images/hero_slide_2.jpg" alt="Terms and conditions background" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a110d]/85 via-[#1a110d]/60 to-[#1a110d]/35"></div>
        <div className="relative max-w-[1100px] mx-auto px-4 sm:px-8 py-14 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#e6c875]">Home » Terms & Conditions</p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black">Terms & Conditions</h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#eadcc8]">All order, delivery, payment, and warranty policies are clearly listed for transparent customer support.</p>
        </div>
      </section>

      <section className="border-b border-[#e8dcc8] bg-[#f6efe3]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-4 flex flex-wrap gap-2">
          <Link href="/about-us" className="px-4 py-2 rounded-full bg-white border border-[#e4d8c4] text-[#6d5a3f] text-xs font-bold uppercase tracking-[0.12em]">About Us</Link>
          <Link href="/terms-conditions" className="px-4 py-2 rounded-full bg-[#a07c32] text-white text-xs font-bold uppercase tracking-[0.12em]">Terms & Conditions</Link>
          <Link href="/privacy-policy" className="px-4 py-2 rounded-full bg-white border border-[#e4d8c4] text-[#6d5a3f] text-xs font-bold uppercase tracking-[0.12em]">Privacy Policy</Link>
          <Link href="/refund-returns-policy" className="px-4 py-2 rounded-full bg-white border border-[#e4d8c4] text-[#6d5a3f] text-xs font-bold uppercase tracking-[0.12em]">Refund & Returns</Link>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-[#e4d8c4] p-6 shadow-sm">
            <h2 className="text-lg font-black text-[#5c4a32]">Exchange</h2>
            <p className="mt-2 text-sm text-slate-600 leading-7">Furniture can be exchanged in good condition within 3 days with 15% service charge. It is not applicable for customized, set broken and fabric product.</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#e4d8c4] p-6 shadow-sm">
            <h2 className="text-lg font-black text-[#5c4a32]">Order Change</h2>
            <p className="mt-2 text-sm text-slate-600 leading-7">Set Order can be changed within 3 days but set broken or customized order cannot be changed.</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#e4d8c4] p-6 shadow-sm">
            <h2 className="text-lg font-black text-[#5c4a32]">Order Cancellation</h2>
            <p className="mt-2 text-sm text-slate-600 leading-7">Goods once ordered cannot be cancelled by customer; if cancelled, 20% cancellation fee is applicable. Customer gets 80% refund within 7 working days. Customized order cannot be cancelled.</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#e4d8c4] p-6 shadow-sm">
            <h2 className="text-lg font-black text-[#5c4a32]">Mode of Payment</h2>
            <p className="mt-2 text-sm text-slate-600 leading-7">Please make payment using your Credit/Debit Card or direct account transfer of the banks we have partnered with. Please check before you pay.</p>
          </div>
        </div>

        <div className="mt-5 bg-white rounded-2xl border border-[#e4d8c4] p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-lg font-black text-[#5c4a32]">Delivery Schedule</h2>
            <p className="mt-2 text-sm text-slate-600 leading-7">Haat Furniture Ltd. will deliver stocked product inside Dhaka within 7 working days; non-stock product may take 15-20 working days. Delivery is completed after communication and customer confirmation.</p>
            <p className="mt-2 text-sm text-slate-600 leading-7">For outside Dhaka, product may be delivered by Haat Furniture Ltd. or third-party logistics after customer communication. Customer will pay third-party delivery fee. Haat Furniture Ltd. will not be liable for any damage during third-party delivery. Delivery timing is confirmed after negotiation with customer.</p>
            <p className="mt-2 text-sm text-slate-600 leading-7">Delivery charge varies by district and order amount. If customer changes shipping method or address, extra expenses will be invoiced separately.</p>
            <p className="mt-2 text-sm text-slate-600 leading-7">Product will be delivered after 7 working days (inside Dhaka) or 15-20 working days (outside Dhaka) after full payment encashment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#faf6ef] border border-[#ece1ce] p-4">
              <h3 className="font-bold text-[#5c4a32]">Delivery Delay</h3>
              <p className="mt-1 text-sm text-slate-600">Delivery date may change due to unavoidable circumstances or lockdown.</p>
            </div>
            <div className="rounded-xl bg-[#faf6ef] border border-[#ece1ce] p-4">
              <h3 className="font-bold text-[#5c4a32]">Product Development</h3>
              <p className="mt-1 text-sm text-slate-600">Product development is a continuous process and minor changes may exist across versions. This does not affect functional utility.</p>
            </div>
            <div className="rounded-xl bg-[#faf6ef] border border-[#ece1ce] p-4">
              <h3 className="font-bold text-[#5c4a32]">Color</h3>
              <p className="mt-1 text-sm text-slate-600">Product color can be different from photo.</p>
            </div>
            <div className="rounded-xl bg-[#faf6ef] border border-[#ece1ce] p-4">
              <h3 className="font-bold text-[#5c4a32]">Delay Penalty</h3>
              <p className="mt-1 text-sm text-slate-600">1% per week of goods value if delivery misses deadline, with a 15-day buffer before penalty starts.</p>
            </div>
          </div>
          <div className="rounded-xl bg-[#faf6ef] border border-[#ece1ce] p-4">
            <h3 className="font-bold text-[#5c4a32]">Inventory Holding Cost</h3>
            <p className="mt-1 text-sm text-slate-600">Customer will pay inventory holding cost valuing 1% of goods value per week if completed goods are not received on time. There is a 15-day buffer before this cost is due.</p>
          </div>
          <div className="rounded-xl bg-[#f3eadb] border border-[#e4d8c4] p-4">
            <h3 className="font-bold text-[#5c4a32]">Warranty</h3>
            <p className="mt-1 text-sm text-slate-600">5 years free service warranty for manufacturing fault. No warranty/guarantee for glass, fabric, rexin, lock, light, handle and knob.</p>
            <p className="mt-1 text-sm text-slate-600">Customer is requested to bring purchase voucher and warranty card to avail service.</p>
            <p className="mt-1 text-sm text-slate-600">To ensure better service, damaged product may be taken to HAAT service center. Customer will bear transportation charge.</p>
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
