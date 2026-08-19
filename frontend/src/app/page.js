"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Reusable Scroll-Triggered Reveal Component for Every Homepage Section
function ScrollReveal({ children, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0, rootMargin: "0px 0px -12% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`scroll-reveal ${isVisible ? "is-revealed" : ""} ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Active Dropdown Menu State
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Interactive Modals & Drawers
  const [cart, setCart] = useState([]);
  const [cartReady, setCartReady] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroOffer, setHeroOffer] = useState(null);
  const [heroSlideOverrides, setHeroSlideOverrides] = useState([]);

  useEffect(() => {
    fetch('/api/v1/banners')
      .then((res) => res.json())
      .then((payload) => {
        if (!payload?.success || !payload.data) return;
        setHeroOffer(payload.data.heroOffer || null);
        setHeroSlideOverrides(payload.data.heroSlides || []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("haat_cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch (e) {}
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (!cartReady) return;
    localStorage.setItem("haat_cart", JSON.stringify(cart));
  }, [cart, cartReady]);

  const [toastMessage, setToastMessage] = useState("");
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
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);
    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, []);

  const nearTop = pageScrollY < 120;
  const nearBottom = pageHeight > 0 && pageScrollY + viewHeight >= pageHeight - 140;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
  };

  // INTERACTIVE FEATURED MOTION SLIDESHOW BANNER STATES
  const [banner1Slide, setBanner1Slide] = useState(0);
  const [banner2Slide, setBanner2Slide] = useState(0);
  const [flagshipSlide, setFlagshipSlide] = useState(0);

  // Intersection Observer State for Scroll-Triggered Creations Animation
  const [isCreationsVisible, setIsCreationsVisible] = useState(false);
  const creationsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsCreationsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );

    const currentRef = creationsRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const banner1Items = [
    {
      title: "Designed to enhance your personification",
      name: "Purley Segun King Bed",
      price: "৳ 23,000 BDT",
      badge: "Master Bedroom",
      image: "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg",
      query: "bed"
    },
    {
      title: "Aesthetically Crafted Royal Dining",
      name: "Beijing Dining 4 Chair Set",
      price: "৳ 40,000 BDT",
      badge: "Royal Dining",
      image: "https://haatfurniture.com/wp-content/uploads/2023/02/T1.jpg",
      query: "dining"
    },
    {
      title: "Handcrafted Luxury Living Suite",
      name: "Cream L-Shape Sofa Set",
      price: "৳ 65,000 BDT",
      badge: "Living Luxury",
      image: "https://haatfurniture.com/wp-content/uploads/2023/02/S1-1.jpg",
      query: "sofa"
    }
  ];

  const banner2Items = [
    {
      title: "Innovative enough to stylize according to convenience",
      name: "Wheel Solid Teak Bed",
      price: "৳ 24,500 BDT",
      badge: "Solid Teak Wood",
      image: "https://haatfurniture.com/wp-content/uploads/2023/03/Wheel-Bed-Angle.jpg",
      query: "bed"
    },
    {
      title: "Executive Workplace Elegance",
      name: "Executive Segun Desk",
      price: "৳ 45,000 BDT",
      badge: "Executive Suite",
      image: "https://haatfurniture.com/wp-content/uploads/2023/09/office-desk-haat-furniture.jpg",
      query: "desk"
    },
    {
      title: "Architectural Teak Entrance",
      name: "Solid Teak Carved Door",
      price: "৳ 28,500 BDT",
      badge: "Teak Door",
      image: "https://haatfurniture.com/wp-content/uploads/2023/09/door-haat-furniture.jpg",
      query: "door"
    }
  ];

  // ALL PRODUCT ITEMS FOR THE MASTER VISUALIZER SLIDESHOW CARD (WITH DYNAMIC COLOR MORPHING)
  const flagshipItems = [
    {
      name: "Pentagon Royal Segun Bed",
      image: "https://haatfurniture.com/wp-content/uploads/2023/03/Pentagon-Bed-Angle.jpg",
      query: "bed",
      bgColor: "bg-[#f5ebd9]"
    },
    {
      name: "Segun Dinner Wagon",
      image: "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
      query: "wagon",
      bgColor: "bg-[#e6f2ed]"
    },
    {
      name: "Cream & Brown L-Shape Sofa Set",
      image: "https://haatfurniture.com/wp-content/uploads/2023/02/S1-1.jpg",
      query: "sofa",
      bgColor: "bg-[#eaeff5]"
    },
    {
      name: "Beijing Dining 4 Chair Set",
      image: "https://haatfurniture.com/wp-content/uploads/2023/02/T1.jpg",
      query: "dining",
      bgColor: "bg-[#f7ebe8]"
    },
    {
      name: "Bridge Dining 6 Chair Set",
      image: "https://haatfurniture.com/wp-content/uploads/2023/02/18.jpg",
      query: "dining",
      bgColor: "bg-[#f2edf7]"
    },
    {
      name: "Boxer Solid Teak King Bed",
      image: "https://haatfurniture.com/wp-content/uploads/2023/03/Boxer-Bed-Angle.jpg",
      query: "bed",
      bgColor: "bg-[#fbf4e6]"
    },
    {
      name: "Purley Segun Bedroom Set",
      image: "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg",
      query: "bed",
      bgColor: "bg-[#faf0e6]"
    },
    {
      name: "Wheel Solid Teak Bed",
      image: "https://haatfurniture.com/wp-content/uploads/2023/03/Wheel-Bed-Angle.jpg",
      query: "bed",
      bgColor: "bg-[#f7e8ee]"
    },
    {
      name: "Galaxy Modern Teak Bed",
      image: "https://haatfurniture.com/wp-content/uploads/2023/03/Galaxy-Bed-Angle-3.jpg",
      query: "bed",
      bgColor: "bg-[#e6f4f5]"
    },
    {
      name: "Solid Segun Shoe Cabinet",
      image: "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
      query: "shoe",
      bgColor: "bg-[#f4efe8]"
    },
    {
      name: "Leatherette Upholstered Center Table",
      image: "https://haatfurniture.com/wp-content/uploads/2023/11/sofa.jpg",
      query: "sofa",
      bgColor: "bg-[#edf2f7]"
    },
    {
      name: "Geometric Glass Top Coffee Table",
      image: "https://haatfurniture.com/wp-content/uploads/2023/09/sofa-set-haat-furniture.jpg",
      query: "sofa",
      bgColor: "bg-[#f5e6f3]"
    },
    {
      name: "Segun Royal Showcase",
      image: "https://haatfurniture.com/wp-content/uploads/2023/09/dining-table-6-chair-haat-furniture.jpg",
      query: "dining",
      bgColor: "bg-[#f5f0e6]"
    },
    {
      name: "Executive Solid Teak Desk",
      image: "https://haatfurniture.com/wp-content/uploads/2023/09/office-desk-haat-furniture.jpg",
      query: "desk",
      bgColor: "bg-[#e6edf5]"
    },
    {
      name: "Solid Teak Carved Door",
      image: "https://haatfurniture.com/wp-content/uploads/2023/09/door-haat-furniture.jpg",
      query: "door",
      bgColor: "bg-[#f2e6db]"
    },
    {
      name: "Executive Office School Bench",
      image: "https://haatfurniture.com/wp-content/uploads/2023/11/school-bench.jpg",
      query: "office",
      bgColor: "bg-[#eaf5e6]"
    },
    {
      name: "Segun Wood Suite Door",
      image: "https://haatfurniture.com/wp-content/uploads/2023/03/Door-2.jpg",
      query: "door",
      bgColor: "bg-[#f5efe6]"
    },
    {
      name: "Abalone 4 Door Wardrobe",
      image: "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
      query: "wardrobe",
      bgColor: "bg-[#e8f5f4]"
    }
  ];

  // Auto-slide effect for featured visualizer banners (Cinematic Slow Motion 5.5s)
  useEffect(() => {
    const timer = setInterval(() => {
      setBanner1Slide((prev) => (prev + 1) % banner1Items.length);
      setBanner2Slide((prev) => (prev + 1) % banner2Items.length);
      setFlagshipSlide((prev) => (prev + 1) % flagshipItems.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [flagshipItems.length]);

  // INTERACTIVE CATEGORY HIGHLIGHT STATE
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  // DYNAMIC PARALLAX WAVE SCROLL STATE FOR EACH CARD
  const [scrollPos, setScrollPos] = useState(0);
  const [centerActiveIndex, setCenterActiveIndex] = useState(0);

  // ACTIVE CATEGORY TAB STATE FOR "OUR LATEST COLLECTION"
  const [activeLatestTab, setActiveLatestTab] = useState("all");

  // CATEGORY SLIDER REFS FOR EXACT HAATFURNITURE.COM CAROUSELS
  const diningRef = useRef(null);
  const livingRef = useRef(null);
  const bedroomRef = useRef(null);
  const officeRef = useRef(null);

  // Interactive Image Zoom & Lightbox State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, show: false });
  const [isFullscreenZoom, setIsFullscreenZoom] = useState(false);

  // MOUSE CURSOR DRAG & MOVE CONTROL STATE FOR LATEST COLLECTION
  const latestScrollRef = useRef(null);
  const creationsScrollRef = useRef(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [creationsScrollPos, setCreationsScrollPos] = useState(0);
  const [isCreationsMouseDown, setIsCreationsMouseDown] = useState(false);
  const creationsDragRef = useRef({ startX: 0, startLeft: 0 });
  const latestHoverRef = useRef(false);
  const latestDragRef = useRef(false);
  const creationsHoverRef = useRef(false);
  const creationsDragActiveRef = useRef(false);
  const latestItemCountRef = useRef(1);

  // TOP HERO BANNER: ULTRA-HD CINEMATIC BACKGROUND SLIDER IMAGES
  const slides = [
    {
      title: "Luxury Modern Living Interior",
      subtitle: "Aesthetically handcrafted 100% solid Chittagong Segun wood furniture tailored for your home.",
      cta: "EXPLORE LIVING COLLECTION",
      badge: "Nordic Minimalist Segun 2026",
      bgImage: "/images/hero_slide_1.jpg"
    },
    {
      title: "Elegant Segun Sectional Lounge",
      subtitle: "Crafted for timeless comfort — borer-proof teak wood living sofa sets with premium finish.",
      cta: "EXPLORE SOFA COLLECTION",
      badge: "Contemporary Living Luxury",
      bgImage: "/images/hero_slide_2.jpg"
    },
    {
      title: "Crafting Teak Masterpieces",
      subtitle: "Sets your home as a trend — aesthetically handcrafted 100% solid Chittagong Teak wood dining sets.",
      cta: "EXPLORE DINING COLLECTION",
      badge: "Royal Dining Collection 2026",
      bgImage: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=1600&auto=format&fit=crop&q=80"
    },
    {
      title: "Luxury Segun Master Bedroom",
      subtitle: "Crafted for peaceful living — solid borer-proof teak bed with premium lacquer finish.",
      cta: "EXPLORE BEDROOM SETS",
      badge: "5 Years Service Warranty",
      bgImage: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1600&auto=format&fit=crop&q=80"
    },
    {
      title: "Architectural Teak Entrance Doors",
      subtitle: "25-year wood guarantee 1.5-inch solid teak carved main entrance doors for elegant homes.",
      cta: "VIEW DOOR COLLECTION",
      badge: "Solid Teak Doors",
      bgImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&auto=format&fit=crop&q=80"
    }
  ];

  const customHeroSlides = (heroSlideOverrides || []).filter((s) => s.image);
  const displaySlides = customHeroSlides.length
    ? customHeroSlides.map((s, i) => ({
        title: s.title || slides[i % slides.length].title,
        subtitle: s.subtitle || slides[i % slides.length].subtitle,
        cta: s.cta || slides[i % slides.length].cta,
        badge: s.badge || slides[i % slides.length].badge,
        bgImage: s.image
      }))
    : slides;
  const activeHero = displaySlides.length ? heroSlide % displaySlides.length : 0;
  const nextHero = displaySlides.length ? (activeHero + 1) % displaySlides.length : 0;

  useEffect(() => {
    [displaySlides[activeHero]?.bgImage, displaySlides[nextHero]?.bgImage]
      .filter(Boolean)
      .forEach((href) => {
        const img = new Image();
        img.src = href;
      });
  }, [activeHero, nextHero, displaySlides]);

  const offerBanner = {
    enabled: heroOffer?.enabled !== false,
    image: heroOffer?.image || '',
    kicker: heroOffer?.kicker || 'Limited offer',
    title: heroOffer?.title || 'Free home delivery',
    subtitle: heroOffer?.subtitle || 'inside Dhaka',
    note: heroOffer?.note || '5-year service warranty · Badda & Mirpur showrooms',
    cta: heroOffer?.cta || 'Claim offer →',
    link: heroOffer?.link || 'https://wa.me/8809617333990?text=Assalamu%20Alaikum!%20I%20want%20to%20know%20about%20the%20current%20HAAT%20Furniture%20offer.',
    hotline: heroOffer?.hotline || '09617 333990'
  };

  // Navigation Menu matching HATIL layout
  const navMenus = [
    {
      name: "HOME FURNITURE",
      slug: "home-furniture",
      href: "/product-category/home-furniture",
      megaMenu: true,
      groups: [
        {
          title: "Bed Room",
          href: "/product-category/home-furniture/bed-room",
          items: [
            { name: "Bed", href: "/product-category/home-furniture/bed-room/bed" },
            { name: "Almirah", href: "/product-category/home-furniture/bed-room/almirah" },
            { name: "Dressing Table", href: "/product-category/home-furniture/bed-room/dressing-table" },
            { name: "Wardrobe", href: "/product-category/home-furniture/bed-room/wardrobe" },
            { name: "Bed Side Table", href: "/product-category/home-furniture/bed-room/bed-side-table" },
            { name: "Chest of Drawer", href: "/product-category/home-furniture/bed-room/chest-of-drawer" }
          ]
        },
        {
          title: "Dinning Room",
          href: "/product-category/home-furniture/dinning-room",
          items: [
            { name: "Dinning Set", href: "/product-category/home-furniture/dinning-room/dinning-set" },
            { name: "Showcase", href: "/product-category/home-furniture/dinning-room/showcase" },
            { name: "Corner Showcase", href: "/product-category/home-furniture/dinning-room/corner-showcase" },
            { name: "Side Table", href: "/product-category/home-furniture/dinning-room/side-table" }
          ]
        },
        {
          title: "Living Room",
          href: "/product-category/home-furniture/living-room",
          items: [
            { name: "Sofa", href: "/product-category/home-furniture/living-room/sofa" },
            { name: "Center Table", href: "/product-category/home-furniture/living-room/center-table" },
            { name: "Coffee Table", href: "/product-category/home-furniture/living-room/coffee-table" },
            { name: "Shoe Rack", href: "/product-category/home-furniture/living-room/shoe-rack" },
            { name: "Book Shelf", href: "/product-category/home-furniture/living-room/book-shelf" }
          ]
        },
        {
          title: "Kitchen",
          href: "/product-category/home-furniture/kitchen",
          items: [
            { name: "Mini Cabinet", href: "/product-category/home-furniture/kitchen/mini-cabinet" },
            { name: "Oven Stand", href: "/product-category/home-furniture/kitchen/oven-stand" }
          ]
        }
      ]
    },
    {
      name: "OFFICE FURNITURE",
      slug: "office-furniture",
      href: "/product-category/office-furniture",
      megaMenu: false,
      items: [
        { name: "Work Station", href: "/product-category/office-furniture/work-station" },
        { name: "Chair", href: "/product-category/office-furniture/chair" },
        { name: "Office Sofa", href: "/product-category/office-furniture/office-sofa" },
        { name: "Table", href: "/product-category/office-furniture/table" }
      ]
    },
    {
      name: "MATTRESS",
      slug: "mattress",
      href: "/product-category/mattress"
    },
    {
      name: "DOOR",
      slug: "door",
      href: "/product-category/door",
      megaMenu: false,
      items: [
        { name: "Flash Door", href: "/product-category/door/flash-door" },
        { name: "Frame", href: "/product-category/door/frame" },
        { name: "Wooden Door", href: "/product-category/door/wooden-door" }
      ]
    },
    {
      name: "MISCELLANEOUS",
      slug: "miscellaneous",
      href: "/product-category/miscellaneous",
      megaMenu: false,
      items: [
        { name: "Iron Stand", href: "/product-category/miscellaneous/iron-stand" },
        { name: "TV Cabinet", href: "/product-category/miscellaneous/tv-cabinet" }
      ]
    },
    {
      name: "ABOUT US",
      href: "/about-us",
      megaMenu: false,
      items: [
        { name: "Terms & Conditions", href: "/terms-conditions" },
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Refund and Returns Policy", href: "/refund-returns-policy" }
      ]
    }
  ];

  // OUR LATEST COLLECTION ITEMS WITH CATEGORY GROUPS (MATCHING HAATFURNITURE.COM)
  const latestCollectionItems = [
    // Bedroom Furnitures Collection
    {
      name: "Boxer Solid Teak Bed",
      price: 21000,
      image: "https://haatfurniture.com/wp-content/uploads/2023/03/Boxer-Bed-Angle.jpg",
      category: "Bed",
      tabGroup: "Bed",
      bgColor: "bg-[#fbf2f4]"
    },
    {
      name: "Purley Teak King Bed",
      price: 23000,
      image: "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg",
      category: "Bed",
      tabGroup: "Bed",
      bgColor: "bg-[#f8f2f8]"
    },
    {
      name: "Abalone Teak Wardrobe",
      price: 30000,
      image: "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
      category: "Wardrobe",
      tabGroup: "Bed",
      bgColor: "bg-[#f9f6f0]"
    },
    {
      name: "Wheel Teak Master Bed",
      price: 24500,
      image: "https://haatfurniture.com/wp-content/uploads/2023/03/Wheel-Bed-Angle.jpg",
      category: "Bed",
      tabGroup: "Bed",
      bgColor: "bg-[#fbf2f4]"
    },

    // Dining Collections
    {
      name: "Beijing Dining 4 Chair Set",
      price: 40000,
      image: "https://haatfurniture.com/wp-content/uploads/2023/02/T1.jpg",
      category: "Dining",
      tabGroup: "Dining",
      bgColor: "bg-[#edf6f2]"
    },
    {
      name: "Bridge Dining 6 Chair Set",
      price: 55000,
      image: "https://haatfurniture.com/wp-content/uploads/2023/02/18.jpg",
      category: "Dining",
      tabGroup: "Dining",
      bgColor: "bg-[#f2f0f8]"
    },
    {
      name: "Royal 6 Chair Segun Dining",
      price: 68000,
      image: "https://haatfurniture.com/wp-content/uploads/2023/09/dining-table-6-chair-haat-furniture.jpg",
      category: "Dining",
      tabGroup: "Dining",
      bgColor: "bg-[#fbf9f2]"
    },

    // Living Room Furnitures
    {
      name: "Abalone Teak Sofa",
      price: 50000,
      image: "https://haatfurniture.com/wp-content/uploads/2023/02/S1-1.jpg",
      category: "Living Room",
      tabGroup: "Living Room",
      bgColor: "bg-[#f0f4f8]"
    },
    {
      name: "Luxury Teak Sofa Set",
      price: 65000,
      image: "https://haatfurniture.com/wp-content/uploads/2023/11/sofa.jpg",
      category: "Living Room",
      tabGroup: "Living Room",
      bgColor: "bg-[#f0f8f4]"
    },
    {
      name: "Teak Living Room Suite",
      price: 58000,
      image: "https://haatfurniture.com/wp-content/uploads/2023/09/sofa-set-haat-furniture.jpg",
      category: "Living Room",
      tabGroup: "Living Room",
      bgColor: "bg-[#f8f0f8]"
    }
  ];

  // Filter items by selected category tab
  const filteredLatestItems = activeLatestTab === "all"
    ? latestCollectionItems
    : latestCollectionItems.filter((item) => item.tabGroup === activeLatestTab);
  latestItemCountRef.current = filteredLatestItems.length;

  // Helper to scroll category slider ref
  const scrollCategorySlider = (ref, amount) => {
    if (ref.current) {
      ref.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  // Latest Collection: continuous scroll + center-focus wave (own ref, not shared)
  useEffect(() => {
    let animationFrameId = 0;
    const copies = 4;

    const smoothScroll = () => {
      const slider = latestScrollRef.current;
      if (slider) {
        if (!latestDragRef.current) {
          slider.scrollLeft += 0.75;
          const loopWidth = slider.scrollWidth / copies;
          if (loopWidth > 1 && slider.scrollLeft >= loopWidth) {
            slider.scrollLeft -= loopWidth;
          }
        }

        setScrollPos(slider.scrollLeft);
        const stride = 352;
        const itemCount = Math.max(latestItemCountRef.current, 1);
        const centerPos = slider.scrollLeft + slider.clientWidth / 2;
        const index = Math.floor(centerPos / stride) % itemCount;
        setCenterActiveIndex(index >= 0 ? index : 0);
      }
      animationFrameId = requestAnimationFrame(smoothScroll);
    };

    animationFrameId = requestAnimationFrame(smoothScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // MOUSE CURSOR DRAG HANDLERS (Latest Collection only)
  const handleMouseDown = (e) => {
    if (!latestScrollRef.current) return;
    latestDragRef.current = true;
    setIsMouseDown(true);
    setStartX(e.pageX - latestScrollRef.current.offsetLeft);
    setScrollLeftState(latestScrollRef.current.scrollLeft);
  };

  const handleMouseLeaveSlider = () => {
    latestHoverRef.current = false;
    latestDragRef.current = false;
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    latestDragRef.current = false;
    setIsMouseDown(false);
  };

  const handleMouseEnterSlider = () => {
    latestHoverRef.current = true;
  };

  const handleMouseMoveSlider = (e) => {
    if (!isMouseDown || !latestScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - latestScrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    latestScrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const scrollByAmount = (amount) => {
    if (latestScrollRef.current) {
      latestScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const scrollCreationsByAmount = (amount) => {
    if (creationsScrollRef.current) {
      creationsScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  const creationsItems = [
    { name: "Purley Teak King Bed", category: "Bed Room", space: "Master suite", price: "৳ 23,000", image: "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg", badge: "5 Yrs" },
    { name: "Wheel Solid Teak Bed", category: "Master Bedroom", space: "Rest & retreat", price: "৳ 24,500", image: "https://haatfurniture.com/wp-content/uploads/2023/03/Wheel-Bed-Angle.jpg", badge: "5 Yrs" },
    { name: "Pentagon Teak Bed", category: "Royal Collection", space: "Heritage chamber", price: "৳ 26,000", image: "https://haatfurniture.com/wp-content/uploads/2023/03/Pentagon-Bed-Angle.jpg", badge: "5 Yrs" },
    { name: "Galaxy Teak Bed", category: "Modern Teak", space: "Urban bedroom", price: "৳ 22,000", image: "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg", badge: "5 Yrs" },
    { name: "Segun Master Bedroom", category: "Full Bedroom Set", space: "Complete suite", price: "৳ 85,000", image: "https://haatfurniture.com/wp-content/uploads/2023/03/HFSB-230403.jpg", badge: "5 Yrs" },
    { name: "Executive School Bench", category: "Office & School", space: "Study workspace", price: "৳ 14,500", image: "https://haatfurniture.com/wp-content/uploads/2023/11/school-bench.jpg", badge: "5 Yrs" },
    { name: "Beijing Dining Set", category: "Royal Dining", space: "Family table", price: "৳ 40,000", image: "https://haatfurniture.com/wp-content/uploads/2023/02/T1.jpg", badge: "5 Yrs" },
    { name: "Abalone Teak Sofa", category: "Living Room", space: "Lounge living", price: "৳ 50,000", image: "https://haatfurniture.com/wp-content/uploads/2023/02/S1-1.jpg", badge: "5 Yrs" }
  ];

  // Creations carousel: slow continuous move + center focus (own ref)
  useEffect(() => {
    let animationFrameId = 0;
    const copies = 3;

    const tick = () => {
      const slider = creationsScrollRef.current;
      if (slider) {
        if (!creationsDragActiveRef.current) {
          slider.scrollLeft += 0.7;
          const loopWidth = slider.scrollWidth / copies;
          if (loopWidth > 1 && slider.scrollLeft >= loopWidth) {
            slider.scrollLeft -= loopWidth;
          }
        }
        setCreationsScrollPos(slider.scrollLeft);
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleCreationsMouseDown = (e) => {
    if (!creationsScrollRef.current) return;
    creationsDragActiveRef.current = true;
    setIsCreationsMouseDown(true);
    creationsDragRef.current = {
      startX: e.pageX - creationsScrollRef.current.offsetLeft,
      startLeft: creationsScrollRef.current.scrollLeft
    };
  };

  const handleCreationsMouseMove = (e) => {
    if (!isCreationsMouseDown || !creationsScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - creationsScrollRef.current.offsetLeft;
    creationsScrollRef.current.scrollLeft = creationsDragRef.current.startLeft - (x - creationsDragRef.current.startX) * 1.6;
  };

  const handleCreationsMouseEnter = () => {
    creationsHoverRef.current = true;
  };

  const handleCreationsMouseUp = () => {
    creationsDragActiveRef.current = false;
    setIsCreationsMouseDown(false);
  };

  const handleCreationsMouseLeave = () => {
    creationsHoverRef.current = false;
    creationsDragActiveRef.current = false;
    setIsCreationsMouseDown(false);
  };

  // EXACT USER SCREENSHOT CATEGORY SHOWCASE ITEMS
  const categoryShowcaseItems = [
    {
      name: "Home Furniture",
      price: 68500,
      image: "https://haatfurniture.com/wp-content/uploads/2023/03/Home-Furniture.jpg",
      colorTag: "Classic Segun Wood",
      bgColor: "bg-[#e2dad5]",
      query: "home"
    },
    {
      name: "Office Furniture",
      price: 45000,
      image: "https://haatfurniture.com/wp-content/uploads/2023/03/Office-Furniture.jpg",
      colorTag: "Executive Modern Suite",
      bgColor: "bg-[#d6cbbf]",
      query: "desk"
    },
    {
      name: "Kitchen Furniture",
      price: 52000,
      image: "https://haatfurniture.com/wp-content/uploads/2023/03/Kitchen-Furniture.jpg",
      colorTag: "Luxury Modular Cabinet",
      bgColor: "bg-[#b8c9c5]",
      query: "kitchen"
    },
    {
      name: "Door",
      price: 28500,
      image: "https://haatfurniture.com/wp-content/uploads/2023/03/Door-2.jpg",
      colorTag: "Solid Teak Wood Door",
      bgColor: "bg-[#c6a099]",
      query: "door"
    }
  ];

  // REAL HAAT FURNITURE Popular Furniture Thumbnails
  const popularThumbnails = [
    { title: "Segun Bed", image: "https://haatfurniture.com/wp-content/uploads/2023/11/Sb1.jpg", query: "bed" },
    { title: "Dining Table", image: "https://haatfurniture.com/wp-content/uploads/2023/09/dining-table-6-chair-haat-furniture.jpg", query: "dining" },
    { title: "Teak Sofa", image: "https://haatfurniture.com/wp-content/uploads/2023/11/sofa.jpg", query: "sofa" },
    { title: "Segun Door", image: "https://haatfurniture.com/wp-content/uploads/2023/09/door-haat-furniture.jpg", query: "door" },
    { title: "Office Desk", image: "https://haatfurniture.com/wp-content/uploads/2023/09/office-desk-haat-furniture.jpg", query: "desk" },
    { title: "Luxury Sofa", image: "https://haatfurniture.com/wp-content/uploads/2023/09/sofa-set-haat-furniture.jpg", query: "sofa" },
    { title: "Solid Wood Suite", image: "https://haatfurniture.com/wp-content/uploads/2023/11/Sb1.jpg", query: "suite" }
  ];

  // Hero: slow 10s cinematic zoom, then a 2s crossfade into the next image
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % displaySlides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [displaySlides.length]);

  // Fetch Products & Categories from Laravel API
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let url = "/api/v1/products";
        const resProducts = await fetch(url);
        const resCat = await fetch("/api/v1/categories");

        if (resProducts.ok && resCat.ok) {
          const dataProducts = await resProducts.json();
          const dataCat = await resCat.json();
          setProducts(dataProducts.data || []);
          setCategories(dataCat.data || []);
        }
      } catch (err) {
        console.error("API error", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // DYNAMIC DATABASE PRODUCT CATEGORY FILTERING FOR HOMEPAGE SLIDERS
  const getCategoryDbProducts = (catKeywords, fallbackList) => {
    if (!products || products.length === 0) return fallbackList;

    const dbFiltered = products.filter((p) => {
      const cat = (p.category || "").toLowerCase();
      const name = (p.name || "").toLowerCase();
      return catKeywords.some((kw) => cat.includes(kw.toLowerCase()) || name.includes(kw.toLowerCase()));
    });

    return dbFiltered.length > 0 ? dbFiltered : fallbackList;
  };

  // Toast Notification Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Cart Helper
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Added "${product.name.slice(0, 25)}..." to Cart!`);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const totalCartPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Mouse Move Handler for Magnifier Zoom Lens
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y, show: true });
  };

  const handleMouseLeave = () => {
    setZoomPos((prev) => ({ ...prev, show: false }));
  };

  // Handle Sub-Category Select with Auto-Scroll to Catalog
  const handleSelectSubCategory = (subName, query) => {
    setSelectedCategory("all");
    setSearchQuery(query);
    setSelectedSubCategory(subName);
    setActiveDropdown(null);
    showToast(`Filtering by ${subName}...`);

    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const nextSlide = () => setHeroSlide((prev) => (prev + 1) % displaySlides.length);
  const prevSlide = () => setHeroSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);

  const displayedProducts = products;

  const currentCenterObj = filteredLatestItems[centerActiveIndex % filteredLatestItems.length] || filteredLatestItems[0] || latestCollectionItems[0];

  const creationsStride = 274;
  const creationsViewWidth = creationsScrollRef.current ? creationsScrollRef.current.clientWidth : 800;
  const creationsFocusRaw = Math.round((creationsScrollPos + creationsViewWidth / 2 - 32 - 125) / creationsStride);
  const creationsFocusIndex = ((creationsFocusRaw % creationsItems.length) + creationsItems.length) % creationsItems.length;
  const focusedCreation = creationsItems[creationsFocusIndex] || creationsItems[0];

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased selection:bg-[#0b0c10] selection:text-white relative overflow-x-hidden">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0b0c10] text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce font-semibold text-sm">
          <span className="text-lg">✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

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
            {navMenus.map((menu, idx) => (
              <div
                key={idx}
                className="relative h-[82px] flex items-center group"
                onMouseEnter={() => setActiveDropdown(menu.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={menu.href || '#'}
                  className={`relative flex items-center gap-1 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] whitespace-nowrap transition-colors ${
                    selectedCategory === menu.slug
                      ? 'text-[#a07c32]'
                      : 'text-slate-800 hover:text-[#a07c32]'
                  }`}
                >
                  <span>{menu.name}</span>
                  {(menu.groups || menu.items) && <span className="text-[8px] opacity-70">▾</span>}
                  <span className={`absolute left-3 right-3 -bottom-px h-[2px] rounded-full transition-opacity ${
                    selectedCategory === menu.slug || activeDropdown === menu.name ? 'bg-[#c59b27] opacity-100' : 'opacity-0 group-hover:opacity-100 bg-[#c59b27]'
                  }`}></span>
                </Link>

                {menu.megaMenu && menu.groups && activeDropdown === menu.name && (
                  <div className="nav-glass absolute top-full left-1/2 -translate-x-1/2 min-w-[760px] text-slate-900 shadow-2xl rounded-2xl border border-white/70 p-6 z-[70] grid grid-cols-4 gap-6 overflow-hidden">
                    {menu.groups.map((group, gIdx) => (
                      <div key={gIdx} className="space-y-3">
                        <Link
                          href={group.href}
                          className="block text-xs font-bold text-[#a07c32] uppercase tracking-wider pb-2 border-b border-white/40"
                        >
                          {group.title}
                        </Link>
                        <div className="space-y-1.5">
                          {group.items.map((item, iIdx) => (
                            <Link
                              key={iIdx}
                              href={item.href}
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

                {!menu.megaMenu && menu.items && activeDropdown === menu.name && (
                  <div className="nav-glass absolute top-full left-0 w-56 text-slate-900 shadow-2xl rounded-2xl border border-white/70 p-3 space-y-1 z-[70] overflow-hidden">
                    {menu.items.map((sub, sIdx) => (
                      <Link
                        key={sIdx}
                        href={sub.href}
                        className="block px-3 py-2 text-[13px] font-medium text-slate-700 hover:bg-white/50 hover:text-[#a07c32] rounded-xl"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
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

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative h-11 px-4 rounded-full bg-white border border-[#e4d8c4] hover:border-[#c59b27] text-slate-800 text-sm font-bold flex items-center gap-2 shadow-sm"
            >
              <span>🛒</span>
              <span className="hidden sm:inline">Cart</span>
              <span className="min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-[11px] flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </button>

            <a
              href="https://wa.me/8809617333990"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 h-11 px-4 rounded-full bg-[#25D366] hover:bg-[#1fb857] text-white text-sm font-bold shadow-md"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.031 0C5.393 0 0 5.393 0 12.031c0 2.124.553 4.197 1.604 6.014L.071 23.929l6.046-1.585A11.968 11.968 0 0 0 12.031 24c6.638 0 12.031-5.393 12.031-12.031C24.062 5.393 18.669 0 12.031 0zm0 22.016a9.92 9.92 0 0 1-5.06-1.39l-.363-.216-3.754.984.1-3.659-.237-.377a9.927 9.927 0 0 1-1.528-5.332c0-5.485 4.463-9.948 9.948-9.948 5.485 0 9.948 4.463 9.948 9.948 0 5.485-4.463 9.948-9.948 9.948zm5.452-7.447c-.299-.149-1.768-.873-2.042-.972-.274-.099-.474-.149-.673.149-.199.299-.773.972-.947 1.171-.174.199-.349.224-.648.075-1.768-.883-2.924-1.579-4.091-3.578-.313-.537.313-.498.897-1.666.099-.199.05-.373-.025-.523-.075-.149-.673-1.62-.922-2.217-.242-.583-.488-.504-.673-.513l-.573-.01c-.199 0-.523.075-.797.373-.274.299-1.046 1.021-1.046 2.49 0 1.47 1.071 2.89 1.22 3.089.149.199 2.107 3.218 5.105 4.512 2.138.924 2.977.925 4.02.775 1.127-.162 2.463-1.008 2.808-1.982.348-.974.348-1.808.244-1.982-.099-.174-.299-.273-.598-.423z"/>
              </svg>
              WhatsApp
            </a>

            <Link
              href="/admin"
              className="text-[10px] font-semibold text-slate-500 hover:text-[#a07c32] underline-offset-2 hover:underline px-1"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* FULL-BLEED ULTRA-HD CINEMATIC HERO SLIDER */}
      <section id="hero" className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-slate-950 border-b border-slate-800">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {displaySlides.map((slide, i) => {
            const isActive = i === activeHero;
            const shouldLoadImage = i === activeHero || i === nextHero || i === 0;
            return (
              <div
                key={`${slide.bgImage}-${i}`}
                className={`hero-slide-fade absolute inset-0 overflow-hidden ${
                  isActive ? "opacity-100 z-[1]" : "opacity-0 z-0"
                }`}
              >
                {shouldLoadImage ? (
                  <img
                    key={isActive ? `hero-in-${i}-${heroSlide}` : `hero-out-${i}`}
                    src={slide.bgImage}
                    alt={slide.title}
                    className={`hero-img-crystal w-full h-full object-cover object-center ${
                      isActive ? "hero-kenburns-zoom" : "hero-kenburns-hold"
                    }`}
                    decoding={i === 0 ? "sync" : "async"}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : "low"}
                  />
                ) : null}
              </div>
            );
          })}
          <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-r from-slate-950/55 via-slate-950/12 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-16 sm:py-20 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-end lg:items-center">
            <div key={activeHero} className="lg:col-span-7 max-w-2xl space-y-6 hero-caption-fade">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-extrabold shadow-lg">
                ✨ {displaySlides[activeHero]?.badge}
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight">
                {displaySlides[activeHero]?.title}
              </h1>

              <p className="text-slate-200 text-base sm:text-xl font-medium leading-relaxed max-w-xl">
                {displaySlides[activeHero]?.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start pt-4">
                <a
                  href="#products"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm transition-all shadow-2xl text-center hover:scale-105"
                >
                  {displaySlides[activeHero]?.cta}
                </a>
                <a
                  href="#trust"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-transparent hover:bg-white/10 text-white font-bold text-sm border-2 border-white transition-all text-center backdrop-blur-sm hover:scale-105"
                >
                  5 YEARS SERVICE WARRANTY
                </a>
              </div>
            </div>

            <aside className="lg:col-span-5 flex lg:justify-end">
              {offerBanner.enabled && (
                <a
                  href={offerBanner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full max-w-[340px] rounded-3xl overflow-hidden bg-white/95 backdrop-blur-md border border-white shadow-[0_20px_40px_-18px_rgba(26,17,13,0.35)] hover:-translate-y-0.5 transition-all"
                >
                  {offerBanner.image ? (
                    <img src={offerBanner.image} alt={offerBanner.title} className="w-full h-44 object-cover" />
                  ) : null}
                  <div className="p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700">{offerBanner.kicker}</p>
                    <h3 className="mt-2 text-xl font-black leading-snug text-slate-900">
                      {offerBanner.title}
                      {offerBanner.subtitle ? (
                        <span className="block font-serif-luxury italic font-medium text-amber-700 text-lg">{offerBanner.subtitle}</span>
                      ) : null}
                    </h3>
                    {offerBanner.note ? (
                      <p className="mt-2 text-xs text-slate-600 leading-relaxed">{offerBanner.note}</p>
                    ) : null}
                    <div className="mt-4 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center px-3.5 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-black uppercase tracking-wider">
                        {offerBanner.cta}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500">{offerBanner.hotline}</span>
                    </div>
                  </div>
                </a>
              )}
            </aside>
          </div>
        </div>
      </section>

      {/* DEDICATED CATEGORY SHOWCASE SECTION ("CHOOSE WHAT RESONATES WITH YOUR UNIQUENESS") */}
      <ScrollReveal>
        <section className={`py-20 ${categoryShowcaseItems[activeCategoryIndex].bgColor} text-slate-900 transition-colors duration-700 border-b border-stone-300 relative`}>
        
        {/* Decorative Hanging Pendant Light */}
        <div className="absolute top-0 left-1/3 z-20 pointer-events-none hidden sm:block">
          <div className="w-0.5 h-16 bg-[#0b0c10] mx-auto"></div>
          <div className="w-16 h-10 bg-[#0b0c10] rounded-t-full shadow-2xl border-b-2 border-amber-400"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Headline */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#efe6d8] text-[#8a6a3a] text-xs font-black uppercase tracking-wider shadow-md">
                ✨ {categoryShowcaseItems[activeCategoryIndex].colorTag}
              </span>

              <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-[#5c4a32]">
                Crafting Elegance<br />for Your Living<br />Spaces
              </h2>

              <p className="text-slate-800 text-base font-medium max-w-md">
                Handcrafted 100% solid Chittagong Segun wood furniture designed for timeless comfort
              </p>

              <div>
                <button
                  onClick={() => handleSelectSubCategory(categoryShowcaseItems[activeCategoryIndex].name, categoryShowcaseItems[activeCategoryIndex].query)}
                  className="inline-block text-sm font-bold text-[#a07c32] border-b-2 border-[#c59b27] pb-1 hover:text-[#8a6a3a] hover:border-[#8a6a3a] transition-all"
                >
                  Explore Now
                </button>
              </div>
            </div>

            {/* Right Featured Main Display & 4 Category Cards */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Main Display Box */}
              <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border border-white/40 relative group bg-[#0b0c10]/10">
                <img
                  key={activeCategoryIndex}
                  src={categoryShowcaseItems[activeCategoryIndex].image}
                  alt={categoryShowcaseItems[activeCategoryIndex].name}
                  className="w-full h-full object-cover animate-entrance group-hover:scale-105 transition-transform duration-700 filter drop-shadow-xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80";
                  }}
                />
              </div>

              {/* 4 CATEGORY CARDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {categoryShowcaseItems.map((item, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setActiveCategoryIndex(idx)}
                    onClick={() => setActiveCategoryIndex(idx)}
                    className={`rounded-2xl p-3 border transition-all duration-300 space-y-2 text-center cursor-pointer backdrop-blur-md ${activeCategoryIndex === idx ? 'bg-white text-slate-900 border-slate-900 shadow-2xl scale-105 ring-2 ring-slate-900 font-extrabold' : 'bg-white/50 text-slate-800 border-white/60 shadow-sm hover:bg-white/80 hover:scale-102'}`}
                  >
                    <div className="h-24 rounded-xl overflow-hidden bg-white/70 flex items-center justify-center p-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&auto=format&fit=crop&q=80";
                        }}
                      />
                    </div>

                    <h5 className="text-xs font-bold truncate">{item.name}</h5>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* OUR LATEST COLLECTION WITH EXACT HAATFURNITURE.COM CATEGORY TABS & BORDER-FREE PARALLAX WAVE SLIDER */}
      <ScrollReveal>
        <section className={`py-24 ${currentCenterObj.bgColor} transition-colors duration-1000 border-b border-slate-200/80 relative overflow-hidden`}>
        
        {/* Soft Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-white/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 relative z-10">
          
          {/* Header & Category Selection Tabs */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-3">
              <span className="inline-block px-4 py-1.5 rounded-full bg-[#efe6d8] text-[#8a6a3a] text-xs font-black uppercase tracking-widest shadow-md">
                ✨ Featured: {currentCenterObj.name}
              </span>

              <h2 className="text-4xl sm:text-5xl font-black text-[#5c4a32] tracking-tight">
                Our Latest Collection
              </h2>

              <p className="text-slate-600 text-base font-medium max-w-xl">
                Furniture is a way of expressing yourself and your style in a room
              </p>

              {/* EXACT HAATFURNITURE.COM CATEGORY TABS */}
              <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                {[
                  { name: "Home Furniture", slug: "all" },
                  { name: "Dining Collections", slug: "Dining" },
                  { name: "Living Room Furnitures", slug: "Living Room" },
                  { name: "Bedroom Furnitures Collection", slug: "Bed" }
                ].map((tab, tIdx) => (
                  <button
                    key={tIdx}
                    onClick={() => {
                      setActiveLatestTab(tab.slug);
                      if (latestScrollRef.current) latestScrollRef.current.scrollLeft = 0;
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-black transition-all hover:scale-105 shadow-sm ${
                      activeLatestTab === tab.slug
                        ? 'bg-[#a07c32] text-white shadow-md ring-2 ring-[#e6c875]'
                        : 'bg-white/80 text-[#8a6a3a] hover:bg-white border border-[#e4d8c4]'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Arrow Move Controls */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => scrollByAmount(-340)}
                className="w-12 h-12 rounded-2xl bg-white hover:bg-[#0b0c10] hover:text-white text-slate-900 flex items-center justify-center text-2xl font-bold border border-slate-200 shadow-lg transition-all hover:scale-110 active:scale-95"
                title="Scroll Left"
              >
                ‹
              </button>
              <button
                onClick={() => scrollByAmount(340)}
                className="w-12 h-12 rounded-2xl bg-white hover:bg-[#0b0c10] hover:text-white text-slate-900 flex items-center justify-center text-2xl font-bold border border-slate-200 shadow-lg transition-all hover:scale-110 active:scale-95"
                title="Scroll Right"
              >
                ›
              </button>
            </div>
          </div>

          {/* Border-Free Clean Glassmorphic Container with Dynamic Parallax Wave Scale */}
          <div className="bg-white/40 backdrop-blur-2xl rounded-3xl border border-white/80 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            
            <div
              ref={latestScrollRef}
              onMouseEnter={handleMouseEnterSlider}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeaveSlider}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMoveSlider}
              className={`auto-scroll-track flex items-end gap-8 py-14 px-4 select-none ${isMouseDown ? 'cursor-grabbing' : 'cursor-grab'}`}
            >
              {[...filteredLatestItems, ...filteredLatestItems, ...filteredLatestItems, ...filteredLatestItems].map((item, idx) => {
                const cardWidth = 320;
                const gap = 32;
                const pad = 16;
                const stride = cardWidth + gap;
                const containerWidth = latestScrollRef.current ? latestScrollRef.current.clientWidth : 1200;
                const cardCenter = pad + idx * stride + cardWidth / 2;
                const containerCenter = scrollPos + containerWidth / 2;
                const distFromCenter = Math.abs(cardCenter - containerCenter);

                const proximityRatio = Math.max(0, 1 - distFromCenter / (containerWidth / 1.75));
                const dynamicScale = 0.82 + proximityRatio * 0.34;
                const waveY = (1 - proximityRatio) * 28;
                const dynamicOpacity = 0.45 + proximityRatio * 0.55;
                const dynamicZIndex = Math.round(proximityRatio * 40);
                const isCenterFocused = proximityRatio > 0.72;

                // Dynamic Smooth Box Shadow without any lines or borders
                const dynamicBoxShadow = isCenterFocused
                  ? `0 25px 35px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.03)';

                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectSubCategory(item.name, item.category)}
                    style={{
                      transform: `translateY(${waveY}px) scale(${dynamicScale})`,
                      transformOrigin: "center bottom",
                      opacity: dynamicOpacity,
                      zIndex: dynamicZIndex,
                      boxShadow: dynamicBoxShadow,
                      willChange: "transform, opacity"
                    }}
                    className="w-72 sm:w-80 flex-shrink-0 rounded-3xl p-6 border-0 cursor-pointer flex flex-col justify-between space-y-5 pointer-events-auto relative bg-white"
                  >
                    {/* Category & Badge */}
                    <div className="flex items-center justify-between text-xs w-full pointer-events-none">
                      <span className={`px-3 py-1 rounded-full font-black uppercase text-[10px] tracking-wider transition-colors duration-300 ${isCenterFocused ? 'bg-[#0b0c10] text-white' : 'bg-slate-100 text-slate-700'}`}>
                        {item.category}
                      </span>
                      {isCenterFocused && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[9px] uppercase tracking-wider animate-pulse shadow-sm">
                          ★ CENTER
                        </span>
                      )}
                    </div>

                    {/* Image Container */}
                    <div className={`w-full h-52 sm:h-56 flex items-center justify-center overflow-hidden rounded-2xl p-4 transition-all duration-300 pointer-events-none ${isCenterFocused ? 'bg-slate-50' : 'bg-slate-100/50'}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          transform: `scale(${0.92 + proximityRatio * 0.18})`
                        }}
                        className="max-h-full max-w-full object-contain filter drop-shadow-xl"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80";
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="space-y-2 pointer-events-none w-full border-t border-slate-100 pt-3">
                      <h4 className={`text-base tracking-tight truncate transition-colors duration-300 ${isCenterFocused ? 'font-black text-slate-900 text-lg' : 'font-bold text-slate-700'}`}>
                        {item.name}
                      </h4>

                      <div className="flex items-center justify-between pt-1">
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price</span>
                          <span className={`block font-black transition-all ${isCenterFocused ? 'text-lg text-emerald-600' : 'text-sm text-emerald-700'}`}>
                            ৳ {item.price.toLocaleString()} BDT
                          </span>
                        </div>

                        {isCenterFocused && (
                          <span className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase shadow-md hover:bg-blue-700 transition-colors">
                            Explore
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-200/80 text-xs font-semibold text-slate-500">
              <span>🌊 Category-Wise Dynamic Wave Slider • Filtered by "{activeLatestTab === 'all' ? 'Home Furniture' : activeLatestTab}"</span>
              <span>🎨 Dynamic Theme Palette Active</span>
            </div>

          </div>

        </div>
      </section>
      </ScrollReveal>

      {/* CREATIONS ATELIER — 3D SHOWROOM COVERFLOW */}
      <section ref={creationsRef} className="relative overflow-hidden border-y border-[#2a1b12]">
        <div className="grid grid-cols-1 lg:grid-cols-12">

          <div className="lg:col-span-4 creations-teak relative px-8 sm:px-10 lg:px-12 py-10 flex flex-col justify-between text-[#f6edd8] overflow-hidden">
            <div className="creations-grain absolute inset-0 pointer-events-none opacity-70"></div>
            <div className="absolute -right-16 top-10 w-48 h-48 rounded-full border border-[#c59b27]/25 pointer-events-none"></div>
            <div className="absolute -right-8 top-16 w-32 h-32 rounded-full border border-[#c59b27]/15 pointer-events-none"></div>

            <div className="relative z-10 space-y-7">
              <div className="flex items-center gap-3">
                <span className="creations-stamp inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#c59b27] text-[#c59b27] text-[10px] font-black tracking-widest">
                  HF
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#e6c875]">
                  Atelier Collection
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-[0.95]">
                Creations with
                <span className="block mt-2 font-serif-luxury italic font-medium text-[#e6c875] text-5xl sm:text-[3.4rem]">
                  purpose
                </span>
              </h2>

              <p className="text-[#d9cbb8] text-sm sm:text-[15px] leading-relaxed max-w-sm">
                Many choices based on your space — handcrafted with 100% solid Chittagong Segun wood for generations.
              </p>

              <div className="grid grid-cols-3 gap-3 pt-1 max-w-sm">
                {[
                  ["5 Yrs", "Warranty"],
                  ["100%", "Solid Segun"],
                  ["Hand", "Crafted"]
                ].map(([top, bottom]) => (
                  <div key={bottom} className="border border-[#c59b27]/20 rounded-2xl px-3 py-3 bg-black/20">
                    <div className="text-[#e6c875] text-sm font-black">{top}</div>
                    <div className="text-[10px] uppercase tracking-wider text-[#cbbba6]">{bottom}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-6 space-y-4">
              <div className="border-t border-[#c59b27]/20 pt-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#c59b27] font-bold mb-1.5">Now on stage</p>
                <p className="text-lg font-black leading-tight">{focusedCreation.name}</p>
                <p className="text-xs text-[#d4c4ae] mt-1">{focusedCreation.space} · {focusedCreation.category}</p>
                <p className="text-[#e6c875] font-black mt-2">{focusedCreation.price}</p>
              </div>

              <a
                href="#products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#c59b27] hover:bg-[#e6c875] text-[#1a110d] font-black text-xs tracking-wide transition-all hover:scale-[1.03]"
              >
                Explore All Creations
                <span>→</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-8 relative bg-[#efe6d8] creations-stage min-h-full flex items-center overflow-hidden py-8">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#efe6d8] to-transparent z-20"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#efe6d8] to-transparent z-20"></div>

            <div
              ref={creationsScrollRef}
              onMouseEnter={handleCreationsMouseEnter}
              onMouseDown={handleCreationsMouseDown}
              onMouseLeave={handleCreationsMouseLeave}
              onMouseUp={handleCreationsMouseUp}
              onMouseMove={handleCreationsMouseMove}
              className={`creations-track w-full flex items-center gap-6 px-12 py-4 select-none ${isCreationsMouseDown ? "cursor-grabbing" : "cursor-grab"}`}
            >
              {[...creationsItems, ...creationsItems, ...creationsItems].map((item, idx) => {
                const cardWidth = 250;
                const gap = 24;
                const pad = 32;
                const stride = cardWidth + gap;
                const containerWidth = creationsScrollRef.current ? creationsScrollRef.current.clientWidth : 800;
                const cardCenter = pad + idx * stride + cardWidth / 2;
                const containerCenter = creationsScrollPos + containerWidth / 2;
                const signed = (cardCenter - containerCenter) / (containerWidth / 2);
                const proximity = Math.max(0, 1 - Math.abs(cardCenter - containerCenter) / (containerWidth / 1.35));
                const rotateY = Math.max(-42, Math.min(42, -signed * 38));
                const scale = 0.82 + proximity * 0.22;
                const isFocused = proximity > 0.72;

                return (
                  <article
                    key={`${item.name}-${idx}`}
                    style={{
                      transform: `rotateY(${rotateY}deg) scale(${scale})`,
                      transformOrigin: "center center",
                      opacity: 0.42 + proximity * 0.58,
                      zIndex: Math.round(proximity * 50),
                      willChange: "transform, opacity"
                    }}
                    className={`relative flex-shrink-0 w-[230px] sm:w-[250px] rounded-[1.6rem] overflow-hidden bg-[#f7f1e6] ${
                      isFocused
                        ? "shadow-[0_18px_40px_-22px_rgba(42,24,16,0.28)]"
                        : "shadow-[0_8px_24px_-18px_rgba(42,24,16,0.16)]"
                    }`}
                  >
                    <div className="absolute top-3 left-3 z-10 text-[10px] font-black tracking-[0.18em] text-[#c59b27]">
                      {String((idx % creationsItems.length) + 1).padStart(2, "0")}
                    </div>
                    <div className={`absolute top-3 right-3 z-10 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${
                      isFocused ? "bg-[#1a110d] text-[#e6c875]" : "bg-white/80 text-slate-600"
                    }`}>
                      {item.badge}
                    </div>

                    <div className="h-56 sm:h-64 flex items-center justify-center p-5 bg-[radial-gradient(circle_at_50%_70%,#efe6d8,#e7d8c4_72%)]">
                      <img
                        src={item.image}
                        alt={item.name}
                        draggable="false"
                        className="max-h-full max-w-full object-contain drop-shadow-[0_18px_20px_rgba(26,17,13,0.22)]"
                        style={{ transform: `scale(${0.9 + proximity * 0.16})` }}
                      />
                    </div>

                    <div className="px-4 pb-4 pt-1">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-[#a1845c] font-bold truncate">{item.space}</p>
                      <h3 className={`font-black truncate ${isFocused ? "text-[15px] text-[#1a110d]" : "text-xs text-slate-700"}`}>
                        {item.name}
                      </h3>
                      <p className="text-sm font-black text-[#1f7a4d] mt-1">{item.price}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => scrollCreationsByAmount(-280)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-[#1a110d]/20 bg-white/90 hover:bg-[#1a110d] hover:text-[#e6c875] text-[#1a110d] font-black flex items-center justify-center transition-all shadow-md"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => scrollCreationsByAmount(280)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full border border-[#1a110d]/20 bg-white/90 hover:bg-[#1a110d] hover:text-[#e6c875] text-[#1a110d] font-black flex items-center justify-center transition-all shadow-md"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* DEDICATED CATEGORY SLIDERS MATCHING EXACT HAATFURNITURE.COM HOMEPAGE LAYOUT */}
      <section id="products" className="py-24 bg-[#f8f7f4] border-t border-slate-200/80 space-y-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          
          {/* SECTION 1: DINING COLLECTIONS SLIDER */}
          <ScrollReveal>
          <div className="space-y-8">
            <div className="reveal-head flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-[#efe6d8] text-[#8a6a3a] text-[10px] font-black uppercase tracking-widest">
                  ✨ Handcrafted Dining Sets
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-[#5c4a32] tracking-tight">
                  Dining Collections
                </h3>
              </div>

              {/* Slider Controls & View All */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSelectSubCategory("Dining", "dining")}
                  className="hidden sm:inline-block text-xs font-extrabold text-[#a07c32] hover:text-[#8a6a3a] border-b-2 border-[#c59b27] hover:border-[#8a6a3a] pb-0.5 transition-all mr-2"
                >
                  View All Dining →
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollCategorySlider(diningRef, -340)}
                    className="w-10 h-10 rounded-full bg-white hover:bg-[#a07c32] hover:text-white text-[#8a6a3a] flex items-center justify-center text-lg font-bold border border-[#e4d8c4] shadow-md transition-all hover:scale-110 active:scale-95"
                    title="Previous"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => scrollCategorySlider(diningRef, 340)}
                    className="w-10 h-10 rounded-full bg-white hover:bg-[#a07c32] hover:text-white text-[#8a6a3a] flex items-center justify-center text-lg font-bold border border-[#e4d8c4] shadow-md transition-all hover:scale-110 active:scale-95"
                    title="Next"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            <div
              ref={diningRef}
              className="reveal-stagger flex items-center gap-6 overflow-x-auto scrollbar-none py-6 px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {getCategoryDbProducts(["dinning", "dining", "wagon"], [
                {
                  name: "Beijing Dining 4 Chair Set",
                  price: 40000,
                  old_price: 52000,
                  image: "https://haatfurniture.com/wp-content/uploads/2023/02/T1.jpg",
                  category: "Dinning Room"
                },
                {
                  name: "Bridge Dining 6 Chair Set",
                  price: 55000,
                  old_price: 68000,
                  image: "https://haatfurniture.com/wp-content/uploads/2023/02/18.jpg",
                  category: "Dinning Room"
                },
                {
                  name: "Dinner Wagon 3 Door Segun",
                  price: 78000,
                  old_price: 95000,
                  image: "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
                  category: "Dinning Room"
                },
                {
                  name: "Segun Royal Showcase",
                  price: 85000,
                  old_price: 105000,
                  image: "https://haatfurniture.com/wp-content/uploads/2023/09/dining-table-6-chair-haat-furniture.jpg",
                  category: "Dinning Room"
                }
              ]).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="w-72 sm:w-80 flex-shrink-0 bg-white border border-slate-200/90 rounded-3xl p-5 flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative group cursor-pointer"
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-[#f7f1e6] text-[#8a6a3a] font-extrabold text-[9px] uppercase tracking-wider group-hover:bg-[#a07c32] group-hover:text-white transition-colors duration-300">
                      100% Solid Segun
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      5 Yrs Guarantee
                    </span>
                  </div>

                  {/* Image Container with Quick Action Overlay */}
                  <div className="h-56 bg-slate-50/80 rounded-2xl overflow-hidden p-3 flex items-center justify-center relative my-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80";
                      }}
                    />

                    {/* Hover Quick Action Buttons */}
                    <div className="absolute inset-0 bg-[#0b0c10]/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center gap-2 p-4">
                      <button
                        onClick={() => { addToCart(item); }}
                        className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                      >
                        ⚡ Order Now
                      </button>
                      <button
                        onClick={() => setQuickViewProduct(item)}
                        className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg transition-all hover:scale-105"
                        title="Quick View"
                      >
                        🔍 View
                      </button>
                    </div>
                  </div>

                  {/* Bottom Product Info */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <h4 className="text-sm font-extrabold text-[#5c4a32] truncate group-hover:text-[#a07c32] transition-colors">
                      {item.name}
                    </h4>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-black text-emerald-600">৳ {item.price?.toLocaleString()} BDT</span>
                        {item.old_price && (
                          <span className="block text-[10px] text-slate-400 line-through">৳ {item.old_price?.toLocaleString()} BDT</span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 rounded-full bg-[#f7f1e6] hover:bg-[#a07c32] hover:text-white text-[#8a6a3a] flex items-center justify-center text-xs font-bold transition-all shadow-sm"
                        title="Add to Cart"
                      >
                        🛒
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Pagination dots like haatfurniture.com */}
            <div className="flex justify-center items-center gap-2 pt-2">
              <span className="w-3 h-3 rounded-full bg-[#a07c32]"></span>
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            </div>
          </div>
          </ScrollReveal>

          {/* SECTION 2: LIVING ROOM FURNITURES SLIDER */}
          <ScrollReveal>
          <div className="space-y-8">
            <div className="reveal-head flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-[#efe6d8] text-[#8a6a3a] text-[10px] font-black uppercase tracking-widest">
                  ✨ Living Luxury
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-[#5c4a32] tracking-tight">
                  Living Room Furnitures
                </h3>
              </div>

              {/* Slider Controls & View All */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSelectSubCategory("Living Room", "sofa")}
                  className="hidden sm:inline-block text-xs font-extrabold text-[#a07c32] hover:text-[#8a6a3a] border-b-2 border-[#c59b27] hover:border-[#8a6a3a] pb-0.5 transition-all mr-2"
                >
                  View All Living →
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollCategorySlider(livingRef, -340)}
                    className="w-10 h-10 rounded-full bg-white hover:bg-[#a07c32] hover:text-white text-[#8a6a3a] flex items-center justify-center text-lg font-bold border border-[#e4d8c4] shadow-md transition-all hover:scale-110 active:scale-95"
                    title="Previous"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => scrollCategorySlider(livingRef, 340)}
                    className="w-10 h-10 rounded-full bg-white hover:bg-[#a07c32] hover:text-white text-[#8a6a3a] flex items-center justify-center text-lg font-bold border border-[#e4d8c4] shadow-md transition-all hover:scale-110 active:scale-95"
                    title="Next"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            <div
              ref={livingRef}
              className="reveal-stagger flex items-center gap-6 overflow-x-auto scrollbar-none py-6 px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {getCategoryDbProducts(["living", "sofa", "shoe", "cabinet", "center"], [
                {
                  name: "Solid Segun Shoe Cabinet",
                  price: 28000,
                  old_price: 35000,
                  image: "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
                  category: "Living Room"
                },
                {
                  name: "Cream & Brown L-Shape Sofa Set",
                  price: 65000,
                  old_price: 78000,
                  image: "https://haatfurniture.com/wp-content/uploads/2023/02/S1-1.jpg",
                  category: "Living Room"
                },
                {
                  name: "Leatherette Upholstered Center Table",
                  price: 22000,
                  old_price: 28000,
                  image: "https://haatfurniture.com/wp-content/uploads/2023/11/sofa.jpg",
                  category: "Living Room"
                },
                {
                  name: "Geometric Glass Top Coffee Table",
                  price: 18500,
                  old_price: 24000,
                  image: "https://haatfurniture.com/wp-content/uploads/2023/09/sofa-set-haat-furniture.jpg",
                  category: "Living Room"
                }
              ]).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="w-72 sm:w-80 flex-shrink-0 bg-white border border-slate-200/90 rounded-3xl p-5 flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative group cursor-pointer"
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-[#f7f1e6] text-[#8a6a3a] font-extrabold text-[9px] uppercase tracking-wider group-hover:bg-[#a07c32] group-hover:text-white transition-colors duration-300">
                      100% Solid Segun
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Ready Stock
                    </span>
                  </div>

                  {/* Image Container with Quick Action Overlay */}
                  <div className="h-56 bg-slate-50/80 rounded-2xl overflow-hidden p-3 flex items-center justify-center relative my-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80";
                      }}
                    />

                    {/* Hover Quick Action Buttons */}
                    <div className="absolute inset-0 bg-[#0b0c10]/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center gap-2 p-4">
                      <button
                        onClick={() => { addToCart(item); }}
                        className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                      >
                        ⚡ Order Now
                      </button>
                      <button
                        onClick={() => setQuickViewProduct(item)}
                        className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg transition-all hover:scale-105"
                        title="Quick View"
                      >
                        🔍 View
                      </button>
                    </div>
                  </div>

                  {/* Bottom Product Info */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <h4 className="text-sm font-extrabold text-[#5c4a32] truncate group-hover:text-[#a07c32] transition-colors">
                      {item.name}
                    </h4>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-black text-emerald-600">৳ {item.price?.toLocaleString()} BDT</span>
                        {item.old_price && (
                          <span className="block text-[10px] text-slate-400 line-through">৳ {item.old_price?.toLocaleString()} BDT</span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 rounded-full bg-[#f7f1e6] hover:bg-[#a07c32] hover:text-white text-[#8a6a3a] flex items-center justify-center text-xs font-bold transition-all shadow-sm"
                        title="Add to Cart"
                      >
                        🛒
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Pagination dots like haatfurniture.com */}
            <div className="flex justify-center items-center gap-2 pt-2">
              <span className="w-3 h-3 rounded-full bg-[#a07c32]"></span>
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            </div>
          </div>
          </ScrollReveal>

          {/* SECTION 3: BEDROOM FURNITURES COLLECTION SLIDER */}
          <ScrollReveal>
          <div className="space-y-8">
            <div className="reveal-head flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-[#efe6d8] text-[#8a6a3a] text-[10px] font-black uppercase tracking-widest">
                  ✨ Master Bedroom
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-[#5c4a32] tracking-tight">
                  Bedroom Furnitures Collection
                </h3>
              </div>

              {/* Slider Controls & View All */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSelectSubCategory("Bed Room", "bed")}
                  className="hidden sm:inline-block text-xs font-extrabold text-[#a07c32] hover:text-[#8a6a3a] border-b-2 border-[#c59b27] hover:border-[#8a6a3a] pb-0.5 transition-all mr-2"
                >
                  View All Bedroom →
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollCategorySlider(bedroomRef, -340)}
                    className="w-10 h-10 rounded-full bg-white hover:bg-[#a07c32] hover:text-white text-[#8a6a3a] flex items-center justify-center text-lg font-bold border border-[#e4d8c4] shadow-md transition-all hover:scale-110 active:scale-95"
                    title="Previous"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => scrollCategorySlider(bedroomRef, 340)}
                    className="w-10 h-10 rounded-full bg-white hover:bg-[#a07c32] hover:text-white text-[#8a6a3a] flex items-center justify-center text-lg font-bold border border-[#e4d8c4] shadow-md transition-all hover:scale-110 active:scale-95"
                    title="Next"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            <div
              ref={bedroomRef}
              className="reveal-stagger flex items-center gap-6 overflow-x-auto scrollbar-none py-6 px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {getCategoryDbProducts(["bed", "wardrobe", "dresser"], [
                {
                  name: "Boxer Solid Teak King Bed",
                  price: 21000,
                  old_price: 28000,
                  image: "https://haatfurniture.com/wp-content/uploads/2023/03/Boxer-Bed-Angle.jpg",
                  category: "Bed Room"
                },
                {
                  name: "Purley Segun Bedroom Set",
                  price: 23000,
                  old_price: 30000,
                  image: "https://haatfurniture.com/wp-content/uploads/2023/03/Purley-Bed-Angle-2.jpg",
                  category: "Bed Room"
                },
                {
                  name: "Wheel Solid Teak Bed",
                  price: 24500,
                  old_price: 32000,
                  image: "https://haatfurniture.com/wp-content/uploads/2023/03/Wheel-Bed-Angle.jpg",
                  category: "Bed Room"
                },
                {
                  name: "Pentagon Teak Bed",
                  price: 26000,
                  old_price: 34000,
                  image: "https://haatfurniture.com/wp-content/uploads/2023/03/Pentagon-Bed-Angle.jpg",
                  category: "Bed Room"
                },
                {
                  name: "Galaxy Modern Teak Bed",
                  price: 22000,
                  old_price: 29000,
                  image: "https://haatfurniture.com/wp-content/uploads/2023/03/Galaxy-Bed-Angle-3.jpg",
                  category: "Bed Room"
                },
                {
                  name: "Abalone 4 Door Wardrobe",
                  price: 30000,
                  old_price: 39000,
                  image: "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
                  category: "Bed Room"
                }
              ]).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="w-72 sm:w-80 flex-shrink-0 bg-white border border-slate-200/90 rounded-3xl p-5 flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative group cursor-pointer"
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-[#f7f1e6] text-[#8a6a3a] font-extrabold text-[9px] uppercase tracking-wider group-hover:bg-[#a07c32] group-hover:text-white transition-colors duration-300">
                      100% Solid Segun
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      Best Seller
                    </span>
                  </div>

                  {/* Image Container with Quick Action Overlay */}
                  <div className="h-56 bg-slate-50/80 rounded-2xl overflow-hidden p-3 flex items-center justify-center relative my-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80";
                      }}
                    />

                    {/* Hover Quick Action Buttons */}
                    <div className="absolute inset-0 bg-[#0b0c10]/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center gap-2 p-4">
                      <button
                        onClick={() => { addToCart(item); }}
                        className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                      >
                        ⚡ Order Now
                      </button>
                      <button
                        onClick={() => setQuickViewProduct(item)}
                        className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg transition-all hover:scale-105"
                        title="Quick View"
                      >
                        🔍 View
                      </button>
                    </div>
                  </div>

                  {/* Bottom Product Info */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <h4 className="text-sm font-extrabold text-[#5c4a32] truncate group-hover:text-[#a07c32] transition-colors">
                      {item.name}
                    </h4>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-black text-emerald-600">৳ {item.price?.toLocaleString()} BDT</span>
                        {item.old_price && (
                          <span className="block text-[10px] text-slate-400 line-through">৳ {item.old_price?.toLocaleString()} BDT</span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 rounded-full bg-[#f7f1e6] hover:bg-[#a07c32] hover:text-white text-[#8a6a3a] flex items-center justify-center text-xs font-bold transition-all shadow-sm"
                        title="Add to Cart"
                      >
                        🛒
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Pagination dots like haatfurniture.com */}
            <div className="flex justify-center items-center gap-2 pt-2">
              <span className="w-3 h-3 rounded-full bg-[#a07c32]"></span>
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            </div>
          </div>
          </ScrollReveal>

          {/* SECTION 4: OFFICE & DOOR COLLECTIONS SLIDER */}
          <ScrollReveal>
          <div className="space-y-8">
            <div className="reveal-head flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-[#efe6d8] text-[#8a6a3a] text-[10px] font-black uppercase tracking-widest">
                  ✨ Commercial Grade
                </span>
                <h3 className="text-3xl sm:text-4xl font-black text-[#5c4a32] tracking-tight">
                  Office & Door Collections
                </h3>
              </div>

              {/* Slider Controls & View All */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSelectSubCategory("Office", "desk")}
                  className="hidden sm:inline-block text-xs font-extrabold text-[#a07c32] hover:text-[#8a6a3a] border-b-2 border-[#c59b27] hover:border-[#8a6a3a] pb-0.5 transition-all mr-2"
                >
                  View All Office & Doors →
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollCategorySlider(officeRef, -340)}
                    className="w-10 h-10 rounded-full bg-white hover:bg-[#a07c32] hover:text-white text-[#8a6a3a] flex items-center justify-center text-lg font-bold border border-[#e4d8c4] shadow-md transition-all hover:scale-110 active:scale-95"
                    title="Previous"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => scrollCategorySlider(officeRef, 340)}
                    className="w-10 h-10 rounded-full bg-white hover:bg-[#a07c32] hover:text-white text-[#8a6a3a] flex items-center justify-center text-lg font-bold border border-[#e4d8c4] shadow-md transition-all hover:scale-110 active:scale-95"
                    title="Next"
                  >
                    ›
                  </button>
                </div>
              </div>
            </div>

            <div
              ref={officeRef}
              className="reveal-stagger flex items-center gap-6 overflow-x-auto scrollbar-none py-6 px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {getCategoryDbProducts(["office", "desk", "door", "bench", "chair"], [
                {
                  name: "Executive Solid Teak Desk",
                  price: 45000,
                  old_price: 55000,
                  image: "https://haatfurniture.com/wp-content/uploads/2023/09/office-desk-haat-furniture.jpg",
                  category: "Office Furniture"
                },
                {
                  name: "Solid Teak Carved Door",
                  price: 28500,
                  old_price: 36000,
                  image: "https://haatfurniture.com/wp-content/uploads/2023/09/door-haat-furniture.jpg",
                  category: "Door Collection"
                },
                {
                  name: "Executive Office School Bench",
                  price: 14500,
                  old_price: 18500,
                  image: "https://haatfurniture.com/wp-content/uploads/2023/11/school-bench.jpg",
                  category: "Office Furniture"
                },
                {
                  name: "Segun Wood Suite Door",
                  price: 26000,
                  old_price: 33000,
                  image: "https://haatfurniture.com/wp-content/uploads/2023/03/Door-2.jpg",
                  category: "Door Collection"
                }
              ]).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="w-72 sm:w-80 flex-shrink-0 bg-white border border-slate-200/90 rounded-3xl p-5 flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative group cursor-pointer"
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-[#f7f1e6] text-[#8a6a3a] font-extrabold text-[9px] uppercase tracking-wider group-hover:bg-[#a07c32] group-hover:text-white transition-colors duration-300">
                      100% Solid Segun
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      Teak Carved
                    </span>
                  </div>

                  {/* Image Container with Quick Action Overlay */}
                  <div className="h-56 bg-slate-50/80 rounded-2xl overflow-hidden p-3 flex items-center justify-center relative my-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80";
                      }}
                    />

                    {/* Hover Quick Action Buttons */}
                    <div className="absolute inset-0 bg-[#0b0c10]/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity duration-300 flex items-center justify-center gap-2 p-4">
                      <button
                        onClick={() => { addToCart(item); }}
                        className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                      >
                        ⚡ Order Now
                      </button>
                      <button
                        onClick={() => setQuickViewProduct(item)}
                        className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-lg transition-all hover:scale-105"
                        title="Quick View"
                      >
                        🔍 View
                      </button>
                    </div>
                  </div>

                  {/* Bottom Product Info */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <h4 className="text-sm font-extrabold text-[#5c4a32] truncate group-hover:text-[#a07c32] transition-colors">
                      {item.name}
                    </h4>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-base font-black text-emerald-600">৳ {item.price?.toLocaleString()} BDT</span>
                        {item.old_price && (
                          <span className="block text-[10px] text-slate-400 line-through">৳ {item.old_price?.toLocaleString()} BDT</span>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 rounded-full bg-[#f7f1e6] hover:bg-[#a07c32] hover:text-white text-[#8a6a3a] flex items-center justify-center text-xs font-bold transition-all shadow-sm"
                        title="Add to Cart"
                      >
                        🛒
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

            {/* Pagination dots like haatfurniture.com */}
            <div className="flex justify-center items-center gap-2 pt-2">
              <span className="w-3 h-3 rounded-full bg-[#a07c32]"></span>
              <span className="w-2 h-2 rounded-full bg-slate-300"></span>
            </div>
          </div>
          </ScrollReveal>

        </div>
      </section>

      {/* FLAGSHIP STUDIO — ONE SPECIAL IMAGE ON A SPOTLIT STAGE */}
      <ScrollReveal>
        <section className="py-10 bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          <div
            onClick={() => handleSelectSubCategory(flagshipItems[flagshipSlide].name, flagshipItems[flagshipSlide].query)}
            className="relative h-[420px] sm:h-[500px] lg:h-[540px] rounded-3xl overflow-hidden border border-[#e4d8c4] group cursor-pointer select-none shadow-xl flagship-studio-tint"
          >
            <div className="flagship-side-wash absolute inset-0 z-[2]"></div>
            <div className="absolute inset-5 sm:inset-7 rounded-[1.4rem] border border-[#c59b27]/35 pointer-events-none z-20"></div>
            <div className="absolute inset-[22px] sm:inset-[30px] rounded-[1.15rem] border border-[#c59b27]/15 pointer-events-none z-20"></div>

            <div key={flagshipSlide} className="flagship-fade-in absolute inset-0 flex items-center justify-center px-10 sm:px-16 pb-20 pt-12 bg-[#ead4a4]">
              <div className="absolute left-1/2 bottom-24 -translate-x-1/2 w-[42%] h-8 rounded-[100%] bg-[#1a110d]/12 blur-xl pointer-events-none"></div>
              <img
                src={flagshipItems[flagshipSlide].image}
                alt={flagshipItems[flagshipSlide].name}
                className="flagship-hero-zoom relative z-10 max-h-full max-w-[78%] object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1200&auto=format&fit=crop&q=80";
                }}
              />
            </div>

            <div className="absolute top-8 left-0 right-0 z-30 flex justify-center pointer-events-none">
              <span className="text-[10px] font-black uppercase tracking-[0.38em] text-[#a07c32]">
                Featured Creation
              </span>
            </div>

            <div className="absolute bottom-6 left-0 right-0 z-30 flex flex-col items-center px-6 pointer-events-none">
              <div className="h-px w-10 bg-[#c59b27] mb-2.5"></div>
              <h3 className="text-[#1a110d] text-lg sm:text-xl font-black tracking-tight text-center">
                {flagshipItems[flagshipSlide].name}
              </h3>
              <p className="text-[#a07c32] text-[10px] font-bold uppercase tracking-[0.22em] mt-1">
                100% Solid Chittagong Segun
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setFlagshipSlide((prev) => (prev - 1 + flagshipItems.length) % flagshipItems.length);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-[#1a110d] hover:text-[#e6c875] text-[#1a110d] border border-[#d9cbb4] flex items-center justify-center text-2xl font-bold opacity-0 group-hover:opacity-100 transition-all z-30 shadow-md"
              title="Previous"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFlagshipSlide((prev) => (prev + 1) % flagshipItems.length);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-[#1a110d] hover:text-[#e6c875] text-[#1a110d] border border-[#d9cbb4] flex items-center justify-center text-2xl font-bold opacity-0 group-hover:opacity-100 transition-all z-30 shadow-md"
              title="Next"
            >
              ›
            </button>
          </div>

          {/* POPULAR FURNITURE THUMBNAIL ROW WITH ULTRA-HIGHLIGHTED VIEW ALL PRODUCTS BUTTON */}
          {/* CLEAN VIEW ALL PRODUCTS ACTION BUTTON */}
          <div className="flex items-center justify-center pt-2">
            <Link
              href="/products"
              className="px-8 py-4 rounded-full bg-[#0b0c10] hover:bg-amber-600 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-slate-900/30 border border-slate-700/60 transition-all duration-300 hover:scale-105 flex items-center gap-2 group"
            >
              <span>View All Products (সব প্রোডাক্ট দেখুন)</span>
              <span className="text-sm group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

        </div>
      </section>
      </ScrollReveal>





      {/* QUICK VIEW MODAL WITH MAGNIFIER GLASS ZOOM */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b0c10]/70 backdrop-blur-md animate-entrance">
          <div className="relative w-full max-w-4xl rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl overflow-hidden text-slate-800">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-600 text-base font-bold flex items-center justify-center transition-all"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-6 space-y-4">
                <div
                  className="relative h-80 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center cursor-crosshair group shadow-inner"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => setIsFullscreenZoom(true)}
                >
                  <img
                    src={quickViewProduct.gallery ? (quickViewProduct.gallery[activeImageIndex] || quickViewProduct.image) : quickViewProduct.image}
                    alt={quickViewProduct.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-lg p-2"
                  />

                  <span className="absolute top-3 left-3 bg-blue-600/90 text-white text-[10px] font-extrabold px-3 py-1 rounded-xl backdrop-blur-sm pointer-events-none flex items-center gap-1 shadow-md">
                    🔍 Hover to Zoom Teak Detail • Click for Full HD
                  </span>

                  {zoomPos.show && (
                    <div
                      className="absolute w-44 h-44 rounded-2xl border-2 border-blue-500 bg-white shadow-2xl pointer-events-none overflow-hidden z-30"
                      style={{
                        left: `calc(${zoomPos.x}% - 88px)`,
                        top: `calc(${zoomPos.y}% - 88px)`,
                        backgroundImage: `url(${quickViewProduct.gallery ? (quickViewProduct.gallery[activeImageIndex] || quickViewProduct.image) : quickViewProduct.image})`,
                        backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        backgroundSize: '300% 300%',
                        backgroundRepeat: 'no-repeat'
                      }}
                    ></div>
                  )}
                </div>

                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {(quickViewProduct.gallery && quickViewProduct.gallery.length > 0
                    ? quickViewProduct.gallery
                    : [quickViewProduct.image, quickViewProduct.image]
                  ).map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl border-2 overflow-hidden bg-slate-50 transition-all flex-shrink-0 ${activeImageIndex === idx ? 'border-blue-600 scale-105 shadow-md' : 'border-slate-200 opacity-70 hover:opacity-100'}`}
                    >
                      <img src={imgUrl} alt={`Angle ${idx+1}`} className="w-full h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="md:col-span-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-black uppercase">
                    {quickViewProduct.category}
                  </span>
                  {quickViewProduct.badge && (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-black uppercase">
                      {quickViewProduct.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-black text-slate-900 leading-tight">{quickViewProduct.name}</h3>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-amber-500 font-bold">★ {quickViewProduct.rating || 4.9}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600 font-semibold">{quickViewProduct.reviews_count || 28} Verified Customer Reviews</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {quickViewProduct.description}
                </p>
                
                <div className="space-y-1.5 text-xs text-slate-700 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                  <p className="flex justify-between">
                    <strong className="text-slate-900">Wood Material:</strong> 
                    <span className="font-semibold text-blue-700">{quickViewProduct.wood_type || '100% Solid Segun Wood'}</span>
                  </p>
                  <p className="flex justify-between">
                    <strong className="text-slate-900">Guarantee:</strong> 
                    <span className="font-semibold text-blue-700">{quickViewProduct.warranty || '5 Years Service Warranty'}</span>
                  </p>
                  <p className="flex justify-between">
                    <strong className="text-slate-900">Availability:</strong> 
                    <span className="text-emerald-600 font-bold">In Stock (Ready at Workshop)</span>
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-3">
                  <div>
                    <span className="text-3xl font-black text-emerald-600">৳ {quickViewProduct.price?.toLocaleString()}</span>
                    <span className="block text-xs text-slate-400 font-bold">BDT (Inclusive of VAT)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/product/${quickViewProduct.id || 1}`}
                      className="px-4 py-3 rounded-2xl bg-[#0b0c10] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md"
                    >
                      🔗 Full Page Details
                    </Link>

                    <button
                      onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null); }}
                      className="px-6 py-3.5 rounded-2xl btn-shimmer text-white text-xs font-extrabold transition-all shadow-xl shadow-blue-600/30 hover:scale-105"
                    >
                      🛒 Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN HD LIGHTBOX ZOOM MODAL */}
      {isFullscreenZoom && quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-entrance">
          <button
            onClick={() => setIsFullscreenZoom(false)}
            className="absolute top-6 right-6 z-50 px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-black shadow-2xl hover:bg-red-500 hover:text-white transition-all"
          >
            ✕ Close Fullscreen HD
          </button>

          <div className="max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={quickViewProduct.gallery ? (quickViewProduct.gallery[activeImageIndex] || quickViewProduct.image) : quickViewProduct.image}
              alt={quickViewProduct.name}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}

      {/* Shopping Cart Drawer — above sticky header (z-60) so Cart/WhatsApp do not sit on top */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[90] flex justify-end">
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-[#1a110d]/35 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md bg-[#fbf9f5] border-l border-[#e4d8c4] h-full flex flex-col justify-between p-6 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#e4d8c4]">
                <div>
                  <h3 className="text-lg font-black text-[#1b120c]">Your Cart</h3>
                  <p className="text-[11px] text-[#6b5740] mt-0.5">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} item{cart.reduce((sum, item) => sum + item.quantity, 0) === 1 ? '' : 's'} added
                  </p>
                </div>
                <button type="button" onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
              </div>

              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <p className="text-sm font-bold text-slate-700">Cart is empty</p>
                  <button type="button" onClick={() => setIsCartOpen(false)} className="px-6 py-2.5 rounded-xl bg-[#1a110d] text-[#e6c875] text-xs font-extrabold">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="mt-5 space-y-3 max-h-[58vh] overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="p-3 rounded-2xl bg-white border border-[#e4d8c4] flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-contain bg-[#fbf9f5] border border-[#e4d8c4] p-1" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                        <p className="text-xs text-[#a07c32] font-bold mt-0.5">৳ {item.price?.toLocaleString()} BDT</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button type="button" onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded bg-[#fbf9f5] border border-[#e4d8c4] text-xs font-bold">-</button>
                          <span className="text-xs font-extrabold text-slate-900">{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded bg-[#fbf9f5] border border-[#e4d8c4] text-xs font-bold">+</button>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-600 text-xs p-1 font-bold">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-[#e4d8c4] space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Subtotal</span>
                  <span className="text-slate-900 font-black">৳ {totalCartPrice.toLocaleString()} BDT</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem("haat_cart", JSON.stringify(cart));
                    window.location.href = "/checkout";
                  }}
                  className="w-full py-4 rounded-2xl bg-[#c59b27] hover:bg-[#b48a1e] text-white text-xs font-black transition-all text-center block shadow-lg shadow-[#c59b27]/25 uppercase tracking-wider"
                >
                  সহজ উপায়ে অর্ডার করুন (Proceed to Checkout)
                </button>

                <a
                  href={`https://wa.me/8809617333990?text=${encodeURIComponent(`Hello Haat Furniture! I want to place an order:\n\n${cart.map(i => `- ${i.name} (Qty: ${i.quantity}) - ৳${i.price * i.quantity}`).join('\n')}\n\nTotal Price: ৳${totalCartPrice} BDT`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all text-center block"
                >
                  Checkout via WhatsApp
                </a>
                <button type="button" onClick={() => setIsCartOpen(false)} className="w-full text-[11px] font-bold text-[#8a6a3a]">
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* One-click jump: up to top / down to bottom */}
      <div className="fixed right-5 bottom-24 z-50 flex flex-col gap-2 print:hidden">
        <button
          type="button"
          onClick={scrollToTop}
          disabled={nearTop}
          aria-label="Go to top"
          title="Up"
          className={`w-11 h-11 rounded-full border shadow-lg flex items-center justify-center transition-all ${
            nearTop
              ? "bg-white/70 border-[#e4d8c4] text-slate-300 cursor-default"
              : "bg-[#1a110d] border-[#c59b27]/50 text-[#e6c875] hover:bg-[#3a2a1c] hover:scale-105"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={scrollToBottom}
          disabled={nearBottom}
          aria-label="Go to bottom"
          title="Down"
          className={`w-11 h-11 rounded-full border shadow-lg flex items-center justify-center transition-all ${
            nearBottom
              ? "bg-white/70 border-[#e4d8c4] text-slate-300 cursor-default"
              : "bg-[#1a110d] border-[#c59b27]/50 text-[#e6c875] hover:bg-[#3a2a1c] hover:scale-105"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Floating Pulsing WhatsApp Contact Button */}
      <a
        href="https://wa.me/8809617333990"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-2xl shadow-emerald-600/40 transition-all hover:scale-110 border-2 border-white animate-bounce"
        title="Chat with Haat Furniture on WhatsApp"
      >
        <svg className="w-8 h-8 fill-current text-white" viewBox="0 0 24 24">
          <path d="M12.031 0C5.393 0 0 5.393 0 12.031c0 2.124.553 4.197 1.604 6.014L.071 23.929l6.046-1.585A11.968 11.968 0 0 0 12.031 24c6.638 0 12.031-5.393 12.031-12.031C24.062 5.393 18.669 0 12.031 0zm0 22.016a9.92 9.92 0 0 1-5.06-1.39l-.363-.216-3.754.984.1-3.659-.237-.377a9.927 9.927 0 0 1-1.528-5.332c0-5.485 4.463-9.948 9.948-9.948 5.485 0 9.948 4.463 9.948 9.948 0 5.485-4.463 9.948-9.948 9.948zm5.452-7.447c-.299-.149-1.768-.873-2.042-.972-.274-.099-.474-.149-.673.149-.199.299-.773.972-.947 1.171-.174.199-.349.224-.648.075-1.768-.883-2.924-1.579-4.091-3.578-.313-.537.313-.498.897-1.666.099-.199.05-.373-.025-.523-.075-.149-.673-1.62-.922-2.217-.242-.583-.488-.504-.673-.513l-.573-.01c-.199 0-.523.075-.797.373-.274.299-1.046 1.021-1.046 2.49 0 1.47 1.071 2.89 1.22 3.089.149.199 2.107 3.218 5.105 4.512 2.138.924 2.977.925 4.02.775 1.127-.162 2.463-1.008 2.808-1.982.348-.974.348-1.808.244-1.982-.099-.174-.299-.273-.598-.423z"/>
        </svg>
      </a>

      {/* Trust & Guarantee Cards (Relocated to Bottom Footer Area) */}
      <ScrollReveal>
        <section id="trust" className="py-16 bg-[#f8f7f4] border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
                <div className="text-4xl mb-3 animate-bounce">🪵</div>
                <h4 className="text-xs sm:text-sm font-black text-[#5c4a32]">100% Solid Segun Wood</h4>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Genuine Chittagong Teak Timber</p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
                <div className="text-4xl mb-3 animate-bounce" style={{ animationDelay: '0.2s' }}>🛡️</div>
                <h4 className="text-xs sm:text-sm font-black text-[#5c4a32]">5 Years Service Warranty</h4>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Manufacturing fault · Terms policy</p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
                <div className="text-4xl mb-3 animate-bounce" style={{ animationDelay: '0.4s' }}>🚚</div>
                <h4 className="text-xs sm:text-sm font-black text-[#5c4a32]">Free Home Delivery</h4>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Safe Assembly in Dhaka City</p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer">
                <div className="text-4xl mb-3 animate-bounce" style={{ animationDelay: '0.6s' }}>💳</div>
                <h4 className="text-xs sm:text-sm font-black text-[#5c4a32]">0% EMI Available</h4>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">Up to 12 Months EMI Options</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Comprehensive Footer */}
      <footer className="bg-[#0b0c10] text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 bg-white rounded-xl shadow-sm border border-slate-200">
                  <img
                    src="/images/logo.jpg"
                    alt="HAAT FURNITURE LIMITED Logo"
                    className="h-8 w-auto object-contain"
                  />
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-400">
                Premium solid Chittagong Teak wood furniture handcrafted for luxury living dining, office, and bedroom spaces in Bangladesh.
              </p>
            </div>

            <div>
              <h5 className="text-sm font-bold text-white mb-4">Quick Links</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="#hero" className="hover:text-blue-400">Home Furniture</a></li>
                <li><a href="#products" className="hover:text-blue-400">Executive Office Desks</a></li>
                <li><a href="#products" className="hover:text-blue-400">Teak Entrance Doors</a></li>
                <li><a href="#trust" className="hover:text-blue-400">5 Years Warranty Policy</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-bold text-white mb-4">Showroom Outlets</h5>
              <p className="text-xs leading-relaxed">
                <strong>Dhaka Flagship Store:</strong><br />
                Middle Badda, Pragati Sarani & Mirpur-10, Dhaka, Bangladesh.
              </p>
            </div>

            <div>
              <h5 className="text-sm font-bold text-white mb-4">Payment Methods</h5>
              <p className="text-xs mb-3">bKash, Nagad, Visa, Mastercard, Cash on Delivery</p>
              <div className="flex gap-2 text-xl">
                💳 📱 🏦
              </div>
            </div>
          </div>

          <div className="pt-8 text-center text-[10px] text-slate-500 border-t border-slate-800/60">
            <p className="font-normal">
              © {new Date().getFullYear()} Haat Furniture Limited | All rights reserved | Design & Development By —{' '}
              <a
                href="https://shoeb-devops.github.io"
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                shoeb-devops.github.io
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
