'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#f7f3ec] text-slate-800">
      <section className="relative overflow-hidden bg-[#1a110d]">
        <img src="/images/hero_slide_1.jpg" alt="Privacy policy background" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a110d]/85 via-[#1a110d]/60 to-[#1a110d]/35"></div>
        <div className="relative max-w-[1100px] mx-auto px-4 sm:px-8 py-14 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#e6c875]">Home » Privacy Policy</p>
          <h1 className="mt-3 text-3xl sm:text-5xl font-black">Privacy Policy</h1>
          <p className="mt-4 max-w-2xl text-sm sm:text-base text-[#eadcc8]">How we collect, use, store, and protect customer information across website and service interactions.</p>
        </div>
      </section>

      <section className="border-b border-[#e8dcc8] bg-[#f6efe3]">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-8 py-4 flex flex-wrap gap-2">
          <Link href="/about-us" className="px-4 py-2 rounded-full bg-white border border-[#e4d8c4] text-[#6d5a3f] text-xs font-bold uppercase tracking-[0.12em]">About Us</Link>
          <Link href="/terms-conditions" className="px-4 py-2 rounded-full bg-white border border-[#e4d8c4] text-[#6d5a3f] text-xs font-bold uppercase tracking-[0.12em]">Terms & Conditions</Link>
          <Link href="/privacy-policy" className="px-4 py-2 rounded-full bg-[#a07c32] text-white text-xs font-bold uppercase tracking-[0.12em]">Privacy Policy</Link>
          <Link href="/refund-returns-policy" className="px-4 py-2 rounded-full bg-white border border-[#e4d8c4] text-[#6d5a3f] text-xs font-bold uppercase tracking-[0.12em]">Refund & Returns</Link>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-[#e4d8c4] p-6 shadow-sm">
            <h2 className="text-lg font-black text-[#5c4a32]">Who we are</h2>
            <p className="mt-2 text-sm text-slate-600 leading-7">Our website address is: https://haat.barabdonline.com</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#e4d8c4] p-6 shadow-sm">
            <h2 className="text-lg font-black text-[#5c4a32]">Who we share your data with</h2>
            <p className="mt-2 text-sm text-slate-600 leading-7">If you request password reset, your IP address may be included in the reset email.</p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {[
            {
              title: "Comments",
              body: [
                "When visitors leave comments we collect data shown in comment forms, including visitor IP address and browser user agent string to help spam detection.",
                "An anonymized string created from your email address (hash) may be provided to the Gravatar service. Gravatar privacy policy: https://automattic.com/privacy/. After approval, your profile picture is visible publicly in the context of your comment."
              ]
            },
            {
              title: "Media",
              body: ["If you upload images to the website, avoid uploading images with embedded location data (EXIF GPS). Visitors can download and extract location data from images."]
            },
            {
              title: "Cookies",
              body: [
                "If you leave a comment, you may opt in to saving your name, email address, and website in cookies for convenience. These cookies last one year.",
                "If you visit login page, a temporary cookie checks browser cookie support and is discarded when browser is closed.",
                "When you log in, cookies store login information and screen display choices. Login cookies last two days; screen options cookies last one year. If \"Remember Me\" is selected, login persists for two weeks.",
                "If you edit/publish an article, an additional cookie is saved indicating post ID and expires after one day."
              ]
            },
            {
              title: "Embedded content from other websites",
              body: [
                "Articles on this site may include embedded content (videos, images, articles, etc.). Embedded content behaves exactly as if visitor has visited the other website directly.",
                "These websites may collect your data, use cookies, embed third-party tracking, and monitor your interaction with that embedded content."
              ]
            },
            {
              title: "How long we retain your data",
              body: [
                "If you leave a comment, the comment and metadata are retained indefinitely for automatic follow-up comment approvals.",
                "For users that register on website (if any), personal information provided in user profile is stored. Users can view, edit, or delete personal information (except username). Administrators can also view and edit that information."
              ]
            },
            {
              title: "What rights you have over your data",
              body: [
                "If you have an account or have left comments, you can request an exported file of personal data we hold. You can also request erasure of personal data, except data required for administrative, legal, or security purposes."
              ]
            },
            {
              title: "Where we send your data",
              body: ["Visitor comments may be checked through an automated spam detection service."]
            }
          ].map((section) => (
            <div key={section.title} className="bg-white rounded-2xl border border-[#e4d8c4] p-6 shadow-sm">
              <h2 className="text-lg font-black text-[#5c4a32]">{section.title}</h2>
              <div className="mt-2 space-y-2">
                {section.body.map((line) => (
                  <p key={line} className="text-sm text-slate-600 leading-7">{line}</p>
                ))}
              </div>
            </div>
          ))}
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
