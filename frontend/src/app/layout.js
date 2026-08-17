import "./globals.css";

export const metadata = {
  title: "HAAT Furniture Limited | 100% Solid Chittagong Segun Teak Wood",
  description: "Leading manufacturer of handcrafted 100% solid Chittagong Segun teak wood beds, sofas, dining sets, almirahs, and entrance doors with 20-year warranty.",
  keywords: ["HAAT Furniture", "Chittagong Segun Teak", "Solid Wood Bed", "Woodmart Sofa", "Segun Teak Dining Table", "Dhaka Furniture"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
