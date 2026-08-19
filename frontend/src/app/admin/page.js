'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import productsData from "../products_128_data.json";

const ROLE_PERMISSIONS = {
  sudo: {
    tabs: ["products", "add-product", "orders", "categories", "analytics", "bulk-discount", "banners", "inquiries", "audit-log"],
    editProducts: true,
    deleteProducts: true,
    publishProducts: true,
    manageCategories: true,
    applyBulkDiscount: true,
    publishBanners: true,
    orderActions: true
  },
  admin: {
    tabs: ["products", "add-product", "orders", "categories", "analytics", "banners", "inquiries", "audit-log"],
    editProducts: true,
    deleteProducts: true,
    publishProducts: true,
    manageCategories: true,
    applyBulkDiscount: false,
    publishBanners: true,
    orderActions: true
  },
  view: {
    tabs: ["products", "orders", "analytics", "inquiries"],
    editProducts: false,
    deleteProducts: false,
    publishProducts: false,
    manageCategories: false,
    applyBulkDiscount: false,
    publishBanners: false,
    orderActions: false
  }
};

const adminHeaders = (extra = {}) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("haat_admin_token") : "";
  return {
    ...extra,
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

const adminFetch = (url, options = {}) => {
  const extra = { ...(options.headers || {}) };
  if (typeof FormData !== "undefined" && options.body instanceof FormData) {
    delete extra["Content-Type"];
    delete extra["content-type"];
  }
  const headers = adminHeaders(extra);
  if (typeof FormData !== "undefined" && options.body instanceof FormData) {
    delete headers["Content-Type"];
    delete headers["content-type"];
  }
  return fetch(url, { ...options, headers });
};

export default function AdminDashboard() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [products, setProducts] = useState(productsData);
  const [categories, setCategories] = useState([
    { id: 1, name: "Home Furniture", slug: "home-furniture", icon: "🏠", count: "126 Products" },
    { id: 2, name: "Bed Room", slug: "bed-room", icon: "🛏️", count: "54 Products" },
    { id: 3, name: "Dinning Room", slug: "dinning-room", icon: "🍽️", count: "28 Products" },
    { id: 4, name: "Living Room", slug: "living-room", icon: "🛋️", count: "32 Products" },
    { id: 5, name: "Office Furniture", slug: "office-furniture", icon: "🏢", count: "2 Products" },
    { id: 6, name: "Door Collection", slug: "door", icon: "🚪", count: "10 Products" }
  ]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("products"); // products | add-product | categories | orders | analytics | bulk-discount | banners | inquiries | audit-log
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState("");
  const [uploading, setUploading] = useState(false);
  const [auditLogs, setAuditLogs] = useState([]);

  // FEATURE: DIRECT PC IMAGE FILE UPLOAD HANDLER FOR MAIN IMAGE
  const handleMainFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await adminFetch('/api/v1/upload', {
        method: 'POST',
        body: body
      });
      const data = await res.json();
      if (data.success) {
        setFormData({ ...formData, image: data.url });
        showToast("Main product image uploaded from PC successfully!");
      } else {
        // Local File Reader Fallback
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData({ ...formData, image: event.target.result });
          showToast("Main image selected from PC!");
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, image: event.target.result });
        showToast("Main image selected from PC!");
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  // FEATURE: DIRECT PC MULTI-FILE UPLOAD HANDLER FOR GALLERY ANGLES
  const handleGalleryFilesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setUploading(true);
    const newGalleryUrls = [...formData.gallery_images];

    for (const file of files) {
      const body = new FormData();
      body.append('file', file);

      try {
        const res = await adminFetch('/api/v1/upload', {
          method: 'POST',
          body: body
        });
        const data = await res.json();
        if (data.success) {
          newGalleryUrls.push(data.url);
        } else {
          const reader = new FileReader();
          reader.onload = (event) => {
            newGalleryUrls.push(event.target.result);
            setFormData(prev => ({ ...prev, gallery_images: [...prev.gallery_images, event.target.result] }));
          };
          reader.readAsDataURL(file);
        }
      } catch (err) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData(prev => ({ ...prev, gallery_images: [...prev.gallery_images, event.target.result] }));
        };
        reader.readAsDataURL(file);
      }
    }

    setFormData(prev => ({ ...prev, gallery_images: newGalleryUrls }));
    setUploading(false);
    showToast(`Uploaded ${files.length} angle image(s) from PC!`);
  };

  const [editingProduct, setEditingProduct] = useState(null);

  // Modal States
  const [printableInvoice, setPrintableInvoice] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showCatModal, setShowCatModal] = useState(false);

  // Bulk Discount Form State
  const [bulkDiscountCat, setBulkDiscountCat] = useState("all");
  const [bulkDiscountPercent, setBulkDiscountPercent] = useState(10);

  // Customer Inquiries
  const [inquiries, setInquiries] = useState([
    { id: 1, name: "Dr. Rakib Hasan", phone: "01799887766", message: "Want custom 8-chair Teak Dining Table with marble top size 7ft x 3.5ft.", date: "2026-08-17", status: "New" },
    { id: 2, name: "Engr. Farhana Islam", phone: "01811223344", message: "Is delivery to Sylhet Sadar included with wooden crating protection?", date: "2026-08-16", status: "Replied" }
  ]);

  // Category Form State
  const [catFormData, setCatFormData] = useState({ name: "", slug: "", icon: "🪑", count: "0 Products" });

  // Live Customer Orders
  const [orders, setOrders] = useState([]);

  // Form State for Add / Edit Product
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    old_price: "",
    category: "Home Furniture",
    category_slug: "home-furniture",
    image: "",
    gallery_images: [],
    wood_type: "100% Solid Chittagong Teak Wood",
    warranty: "5 Years Service Warranty",
    badge: "New Arrival",
    description: ""
  });

  const defaultBannerForm = {
    enabled: true,
    image: "",
    kicker: "Limited offer",
    title: "Free home delivery",
    subtitle: "inside Dhaka",
    note: "5-year service warranty · Badda & Mirpur showrooms",
    cta: "Claim offer →",
    link: "https://wa.me/8809617333990?text=Assalamu%20Alaikum!%20I%20want%20to%20know%20about%20the%20current%20HAAT%20Furniture%20offer.",
    hotline: "09617 333990"
  };
  const [bannerForm, setBannerForm] = useState(defaultBannerForm);
  const [heroSlideBanners, setHeroSlideBanners] = useState([
    { image: "", title: "", subtitle: "", cta: "", badge: "" },
    { image: "", title: "", subtitle: "", cta: "", badge: "" },
    { image: "", title: "", subtitle: "", cta: "", badge: "" }
  ]);
  const [savingBanner, setSavingBanner] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("haat_admin_token");
    if (!token) {
      localStorage.removeItem("haat_admin_session");
      return;
    }
    fetch("/api/v1/admin/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json().then((payload) => ({ ok: res.ok, payload })))
      .then(({ ok, payload }) => {
        if (!ok || !payload?.success || !payload?.data?.role || !ROLE_PERMISSIONS[payload.data.role]) {
          localStorage.removeItem("haat_admin_token");
          localStorage.removeItem("haat_admin_session");
          return;
        }
        setCurrentRole(payload.data.role);
        setCurrentUser(payload.data.username || "");
        setIsAuthenticated(true);
        localStorage.setItem(
          "haat_admin_session",
          JSON.stringify({ authenticated: true, username: payload.data.username, role: payload.data.role })
        );
      })
      .catch(() => {
        localStorage.removeItem("haat_admin_token");
        localStorage.removeItem("haat_admin_session");
      });
  }, []);

  const canAccessTab = (tab) => {
    const roleAccess = ROLE_PERMISSIONS[currentRole];
    return !!roleAccess && roleAccess.tabs.includes(tab);
  };

  const canPerform = (action) => {
    const roleAccess = ROLE_PERMISSIONS[currentRole];
    return !!roleAccess && !!roleAccess[action];
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!canAccessTab(activeTab)) {
      const firstTab = ROLE_PERMISSIONS[currentRole]?.tabs?.[0] || "products";
      setActiveTab(firstTab);
    }
  }, [isAuthenticated, currentRole, activeTab]);

  useEffect(() => {
    const savedLogs = localStorage.getItem("haat_admin_audit_logs");
    if (!savedLogs) return;
    try {
      const parsed = JSON.parse(savedLogs);
      if (Array.isArray(parsed)) {
        setAuditLogs(parsed);
      }
    } catch (_) {
      localStorage.removeItem("haat_admin_audit_logs");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("haat_admin_audit_logs", JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    fetch('/api/v1/products')
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.success && Array.isArray(payload.data) && payload.data.length) {
          setProducts(payload.data);
        }
      })
      .catch(() => {});
    fetch('/api/v1/categories')
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.success && Array.isArray(payload.data) && payload.data.length) {
          setCategories(payload.data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch('/api/v1/banners')
      .then((res) => res.json())
      .then((payload) => {
        if (!payload?.success || !payload.data) return;
        if (payload.data.heroOffer) {
          setBannerForm({ ...defaultBannerForm, ...payload.data.heroOffer });
        }
        if (Array.isArray(payload.data.heroSlides) && payload.data.heroSlides.length) {
          setHeroSlideBanners(payload.data.heroSlides);
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const loadOrders = () => {
      adminFetch('/api/v1/orders')
        .then((res) => res.json())
        .then((payload) => {
          if (payload?.success && Array.isArray(payload.data)) {
            setOrders(payload.data);
          }
        })
        .catch(() => {});
    };
    loadOrders();
    const timer = setInterval(loadOrders, 8000);
    return () => clearInterval(timer);
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    const username = loginUser.trim().toLowerCase();
    try {
      const res = await fetch("/api/v1/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: loginPass })
      });
      const payload = await res.json();
      if (!res.ok || !payload?.success || !payload?.data?.token) {
        recordAudit("LOGIN_FAILED", "Invalid username or password attempt.");
        setLoginError(payload?.message || "Invalid Username or Password! Please try again.");
        return;
      }
      const matchedUser = payload.data;
      localStorage.setItem("haat_admin_token", matchedUser.token);
      localStorage.setItem(
        "haat_admin_session",
        JSON.stringify({
          authenticated: true,
          username: matchedUser.username,
          role: matchedUser.role
        })
      );
      localStorage.removeItem("haat_admin_auth");
      setCurrentRole(matchedUser.role);
      setCurrentUser(matchedUser.username);
      setIsAuthenticated(true);
      setActiveTab(ROLE_PERMISSIONS[matchedUser.role]?.tabs?.[0] || "products");
      recordAudit("LOGIN_SUCCESS", `User logged in as ${matchedUser.role.toUpperCase()}.`);
      showToast(`Welcome ${matchedUser.role.toUpperCase()} user!`);
    } catch (_) {
      setLoginError("Login server-e connect kora jayni. Try again.");
    }
  };

  const uploadBannerFile = async (file, onUrl) => {
    if (!file) return;
    setUploading(true);
    const body = new FormData();
    body.append('file', file);
    try {
      const res = await adminFetch('/api/v1/upload', { method: 'POST', body });
      const data = await res.json();
      if (data.success) {
        onUrl(data.url);
        showToast('Image uploaded. Click Publish to show it on homepage.');
      } else {
        showToast(data.message || 'Upload failed');
      }
    } catch (err) {
      showToast('Upload failed. Try again.');
    } finally {
      setUploading(false);
    }
  };

  const handlePublishBanners = async () => {
    if (!canPerform("publishBanners")) {
      recordAudit("BANNER_PUBLISH_DENIED", "Blocked banner publish due to role restriction.");
      showToast("You do not have permission to publish banners.");
      return;
    }
    setSavingBanner(true);
    try {
      const res = await adminFetch('/api/v1/banners', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroOffer: bannerForm,
          heroSlides: heroSlideBanners
        })
      });
      const data = await res.json();
      if (data.success) {
        recordAudit("BANNER_PUBLISHED", "Homepage banner settings published.");
        showToast('Banner published to homepage!');
      } else {
        showToast(data.message || 'Could not save banner');
      }
    } catch (err) {
      showToast('Could not save banner');
    } finally {
      setSavingBanner(false);
    }
  };

  const handleLogout = () => {
    recordAudit("LOGOUT", "User logged out from admin panel.");
    localStorage.removeItem("haat_admin_session");
    localStorage.removeItem("haat_admin_auth");
    localStorage.removeItem("haat_admin_token");
    setIsAuthenticated(false);
    setCurrentRole("");
    setCurrentUser("");
    setLoginUser("");
    setLoginPass("");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const recordAudit = (action, details) => {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      at: new Date().toISOString(),
      actor: currentUser || loginUser.trim().toLowerCase() || "unknown",
      role: currentRole || "guest",
      action,
      details
    };
    setAuditLogs((prev) => [entry, ...prev].slice(0, 500));
  };

  // FEATURE 1: 1-CLICK OFFICIAL INVOICE GENERATOR & PRINT
  const handlePrintInvoice = (order) => {
    if (!canPerform("orderActions")) {
      recordAudit("PRINT_INVOICE_DENIED", `Blocked invoice print for order ${order.id}.`);
      showToast("View role cannot perform order actions.");
      return;
    }
    recordAudit("PRINT_INVOICE", `Printed invoice for order ${order.id}.`);
    setPrintableInvoice(order);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // FEATURE 2: 1-CLICK WHATSAPP DISPATCHER
  const handleSendWhatsAppOrder = (order) => {
    if (!canPerform("orderActions")) {
      recordAudit("WHATSAPP_ORDER_DENIED", `Blocked WhatsApp dispatch for order ${order.id}.`);
      showToast("View role cannot perform order actions.");
      return;
    }
    const cleanPhone = order.phone.replace(/[^0-9]/g, '');
    const formattedPhone = cleanPhone.startsWith('880') ? cleanPhone : `880${cleanPhone.replace(/^0/, '')}`;
    const message = `Assalamu Alaikum ${order.customer}! 🌟\n\nYour HAAT Furniture Limited Order #${order.id} for "${order.items}" (Total: ৳${order.total.toLocaleString()} BDT) has been confirmed and dispatched for home delivery!\n\n🛡️ Includes 5-Year Service Warranty Card (manufacturing fault).\n📞 Hotline: +8809617333990\n🏬 Showrooms: Badda & Mirpur, Dhaka.`;
    
    const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
    recordAudit("WHATSAPP_ORDER_SENT", `Sent WhatsApp dispatch for order ${order.id}.`);
    showToast(`WhatsApp Order Dispatch sent to ${order.customer}!`);
  };

  // FEATURE 4: BULK DISCOUNT & PRICE MANAGER
  const handleApplyBulkDiscount = async (e) => {
    e.preventDefault();
    if (!canPerform("applyBulkDiscount")) {
      recordAudit("BULK_DISCOUNT_DENIED", "Blocked bulk discount due to role restriction.");
      showToast("You do not have permission to apply bulk discount.");
      return;
    }
    if (!confirm(`Are you sure you want to apply a ${bulkDiscountPercent}% discount across selected products?`)) return;

    try {
      const res = await adminFetch("/api/v1/products/bulk-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ percent: bulkDiscountPercent, category: bulkDiscountCat })
      });
      const payload = await res.json();
      if (!payload?.success) {
        showToast(payload?.message || "Bulk discount failed");
        return;
      }
      const productsRes = await fetch("/api/v1/products");
      const productsPayload = await productsRes.json();
      if (productsPayload?.success && Array.isArray(productsPayload.data)) {
        setProducts(productsPayload.data);
      }
      recordAudit("BULK_DISCOUNT_APPLIED", `Applied ${bulkDiscountPercent}% discount on ${bulkDiscountCat}.`);
      showToast(payload.message || `Applied ${bulkDiscountPercent}% discount`);
    } catch (_) {
      showToast("Bulk discount save failed");
    }
  };

  // FEATURE 5: DRAG & DROP MULTI-ANGLE GALLERY UPLOADER
  const handleAddGalleryImageUrl = () => {
    const url = prompt("Enter additional angle image URL (e.g. https://haatfurniture.com/wp-content/uploads/...)");
    if (url) {
      setFormData({ ...formData, gallery_images: [...formData.gallery_images, url] });
      showToast("Added gallery image!");
    }
  };

  // CATEGORY CRUD
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!canPerform("manageCategories")) {
      recordAudit("CATEGORY_SAVE_DENIED", "Blocked category save due to role restriction.");
      showToast("You do not have permission to manage categories.");
      return;
    }
    if (!catFormData.name) return;
    const slug = catFormData.slug ? catFormData.slug.toLowerCase().replace(/\s+/g, '-') : catFormData.name.toLowerCase().replace(/\s+/g, '-');

    try {
      const res = await adminFetch("/api/v1/categories", {
        method: editingCategory ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCategory?.id,
          name: catFormData.name,
          slug,
          icon: catFormData.icon || "🪑"
        })
      });
      const payload = await res.json();
      if (!payload?.success) {
        showToast(payload?.message || "Category save failed");
        return;
      }
      const listRes = await fetch("/api/v1/categories");
      const listPayload = await listRes.json();
      if (listPayload?.success && Array.isArray(listPayload.data)) {
        setCategories(listPayload.data);
      }
      recordAudit(editingCategory ? "CATEGORY_UPDATED" : "CATEGORY_CREATED", `${editingCategory ? "Updated" : "Created"} category: ${catFormData.name}.`);
      showToast(editingCategory ? `Updated Category: "${catFormData.name}"` : `Created Category: "${catFormData.name}"`);
      setShowCatModal(false);
    } catch (_) {
      showToast("Category save failed");
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!canPerform("manageCategories")) {
      recordAudit("CATEGORY_DELETE_DENIED", `Blocked category delete attempt for ID ${catId}.`);
      showToast("You do not have permission to manage categories.");
      return;
    }
    if (!confirm("Delete this category?")) return;
    try {
      const res = await adminFetch(`/api/v1/categories?id=${catId}`, { method: "DELETE" });
      const payload = await res.json();
      if (!payload?.success) {
        showToast(payload?.message || "Delete failed");
        return;
      }
      setCategories(categories.filter((c) => c.id !== catId));
      recordAudit("CATEGORY_DELETED", `Deleted category ID: ${catId}.`);
      showToast("Category removed!");
    } catch (_) {
      showToast("Category delete failed");
    }
  };

  const handleOrderStatus = async (order, status) => {
    if (!canPerform("orderActions")) return;
    try {
      const res = await adminFetch("/api/v1/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status })
      });
      const payload = await res.json();
      if (!payload?.success) {
        showToast(payload?.message || "Status update failed");
        return;
      }
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)));
      recordAudit("ORDER_STATUS", `Order ${order.id} → ${status}`);
      showToast(`Order ${order.id}: ${status}`);
    } catch (_) {
      showToast("Status update failed");
    }
  };

  // PRODUCT CRUD
  // LIVE BACKEND API HANDLERS: CONNECTS ADMIN DIRECTLY TO STOREFRONT
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!canPerform("publishProducts")) {
      recordAudit("PRODUCT_SAVE_DENIED", "Blocked product save due to role restriction.");
      showToast("You do not have permission to publish products.");
      return;
    }
    if (!formData.name || !formData.price) return;

    if (editingProduct) {
      const payload = {
        id: editingProduct.id,
        name: formData.name,
        price: parseFloat(formData.price),
        oldPrice: formData.old_price ? parseFloat(formData.old_price) : null,
        image: formData.image,
        gallery: formData.gallery_images,
        description: formData.description
      };

      try {
        const res = await adminFetch('/api/v1/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const resData = await res.json();
        if (resData.success) {
          setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...payload } : p));
          recordAudit("PRODUCT_UPDATED", `Updated product: ${formData.name}.`);
          showToast(`✅ Storefront Updated Live: "${formData.name}"`);
        }
      } catch (err) {
        showToast(`Updated locally: "${formData.name}"`);
      }
    } else {
      const payload = {
        id: Date.now(),
        name: formData.name,
        price: parseFloat(formData.price),
        oldPrice: formData.old_price ? parseFloat(formData.old_price) : null,
        category: formData.category,
        category_slug: formData.category_slug || 'home-furniture',
        categories: [formData.category_slug || 'home-furniture'],
        category_names: [formData.category],
        image: formData.image || "https://haatfurniture.com/wp-content/uploads/2023/02/1-2.jpg",
        gallery: formData.gallery_images.length > 0 ? formData.gallery_images : [formData.image],
        description: formData.description || "Solid Chittagong Segun Teak Wood."
      };

      try {
        const res = await adminFetch('/api/v1/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const resData = await res.json();
        if (resData.success) {
          setProducts([payload, ...products]);
          recordAudit("PRODUCT_CREATED", `Created product: ${payload.name}.`);
          showToast(`🚀 Published Live to Storefront: "${payload.name}"`);
        }
      } catch (err) {
        setProducts([payload, ...products]);
        showToast(`Published: "${payload.name}"`);
      }
    }

    setActiveTab("products");
    resetForm();
  };

  const handleDeleteProduct = async (id) => {
    if (!canPerform("deleteProducts")) {
      recordAudit("PRODUCT_DELETE_DENIED", `Blocked delete attempt for product ID ${id}.`);
      showToast("You do not have permission to delete products.");
      return;
    }
    if (confirm("Are you sure you want to delete this product from the live storefront?")) {
      try {
        const res = await adminFetch(`/api/v1/products?id=${id}`, { method: 'DELETE' });
        const resData = await res.json();
        if (resData.success) {
          setProducts(products.filter(p => p.id !== id));
          recordAudit("PRODUCT_DELETED", `Deleted product ID: ${id}.`);
          showToast("🗑️ Product deleted from live storefront!");
        }
      } catch (err) {
        setProducts(products.filter(p => p.id !== id));
        showToast("Product deleted!");
      }
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      price: "",
      old_price: "",
      category: "Home Furniture",
      category_slug: "home-furniture",
      image: "",
      gallery_images: [],
      wood_type: "100% Solid Chittagong Teak Wood",
      warranty: "5 Years Service Warranty",
      badge: "New Arrival",
      description: ""
    });
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      price: product.price ?? "",
      old_price: product.oldPrice ?? product.old_price ?? "",
      category: product.category || product.category_names?.[0] || "Home Furniture",
      category_slug: product.category_slug || product.categories?.[0] || "home-furniture",
      image: product.image || "",
      gallery_images: product.gallery || product.gallery_images || [],
      wood_type: product.wood_type || "100% Solid Chittagong Teak Wood",
      warranty: product.warranty || "5 Years Service Warranty",
      badge: product.badge || "New Arrival",
      description: product.description || ""
    });
    setActiveTab("add-product");
    recordAudit("PRODUCT_EDIT_OPENED", `Opened edit mode for product: ${product.name || product.id}.`);
  };

  const filteredProducts = products.filter(p => (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()));
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // ----------------------------------------------------
  // LOGIN RENDER
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <img src="/images/logo.jpg" alt="HAAT Furniture LTD" className="h-12 w-auto mx-auto bg-white p-1 rounded-xl" />
            <h2 className="text-xl font-black text-white">HAAT Furniture LTD</h2>
            <p className="text-xs text-amber-500 font-bold uppercase tracking-widest">Admin Security Portal</p>
            <p className="text-[11px] text-slate-400">Users: sudoadmin / adminmanager / viewonly</p>
          </div>

          {loginError && <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold text-center">{loginError}</div>}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Username</label>
              <input type="text" required value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">Password</label>
              <input type={showPass ? "text" : "password"} required value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white" />
            </div>

            <button type="submit" className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider">
              Secure Admin Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // AUTHENTICATED DASHBOARD RENDER
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-100 to-slate-200/70 text-slate-800 font-sans flex flex-col antialiased print:bg-white print:p-0">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl font-bold text-xs border border-slate-700 animate-bounce flex items-center gap-2 print:hidden">
          <span>✨</span><span>{toast}</span>
        </div>
      )}

      {/* TOP NAVBAR (HIDDEN IN PRINT) */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/images/logo.jpg" alt="HAAT Furniture LTD" className="h-10 w-auto object-contain" />
            <div className="border-l border-slate-200 pl-3 min-w-0">
              <p className="text-sm sm:text-base font-black tracking-tight text-slate-900 leading-none">HAAT Furniture LTD</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">Admin Control Center</p>
            </div>
            <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black uppercase text-slate-700">
              {currentRole} · {currentUser}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-black">Storefront</Link>
            <button onClick={handleLogout} className="px-3 py-1.5 rounded-xl bg-red-600 text-white text-xs font-black">Logout</button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-3">
          <nav className="flex flex-wrap items-center gap-1.5 text-[11px] font-black uppercase tracking-[0.06em]">
            {canAccessTab("products") && <button onClick={() => setActiveTab("products")} className={`px-3.5 py-2 rounded-xl border transition-colors ${activeTab === "products" ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
              Products ({products.length})
            </button>}
            {canAccessTab("add-product") && <button onClick={() => { resetForm(); setActiveTab("add-product"); }} className={`px-3.5 py-2 rounded-xl border transition-colors ${activeTab === "add-product" ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
              Add Product
            </button>}
            {canAccessTab("orders") && <button onClick={() => setActiveTab("orders")} className={`px-3.5 py-2 rounded-xl border transition-colors ${activeTab === "orders" ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
              Orders ({orders.length})
            </button>}
            {canAccessTab("categories") && <button onClick={() => setActiveTab("categories")} className={`px-3.5 py-2 rounded-xl border transition-colors ${activeTab === "categories" ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
              Categories ({categories.length})
            </button>}
            {canAccessTab("analytics") && <button onClick={() => setActiveTab("analytics")} className={`px-3.5 py-2 rounded-xl border transition-colors ${activeTab === "analytics" ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
              Analytics
            </button>}
            {canAccessTab("bulk-discount") && <button onClick={() => setActiveTab("bulk-discount")} className={`px-3.5 py-2 rounded-xl border transition-colors ${activeTab === "bulk-discount" ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
              Bulk Discount
            </button>}
            {canAccessTab("banners") && <button onClick={() => setActiveTab("banners")} className={`px-3.5 py-2 rounded-xl border transition-colors ${activeTab === "banners" ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
              Banners
            </button>}
            {canAccessTab("inquiries") && <button onClick={() => setActiveTab("inquiries")} className={`px-3.5 py-2 rounded-xl border transition-colors ${activeTab === "inquiries" ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
              Inquiries ({inquiries.length})
            </button>}
            {canAccessTab("audit-log") && <button onClick={() => setActiveTab("audit-log")} className={`px-3.5 py-2 rounded-xl border transition-colors ${activeTab === "audit-log" ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}>
              Audit Log ({auditLogs.length})
            </button>}
          </nav>
        </div>
      </header>

      {/* PRINTABLE INVOICE / CHALLAN MODAL (VISIBLE WHEN PRINTING) */}
      {printableInvoice && (
        <div className="hidden print:block fixed inset-0 bg-white p-8 text-black font-sans leading-relaxed">
          <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight">HAAT FURNITURE LIMITED</h1>
              <p className="text-xs font-bold">100% Solid Chittagong Segun Teak Wood Heritage</p>
              <p className="text-[10px]">Showrooms: Merul Badda & Mirpur 10, Dhaka | Hotline: +8809617333990</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold uppercase">OFFICIAL CASH MEMO & CHALLAN</h2>
              <p className="text-xs">Invoice #: <strong>{printableInvoice.id}</strong></p>
              <p className="text-xs">Date: {printableInvoice.date}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-xs mb-6 border p-4 rounded">
            <div>
              <h3 className="font-bold border-b pb-1 mb-1">CUSTOMER BILLING ADDRESS:</h3>
              <p><strong>Name:</strong> {printableInvoice.customer}</p>
              <p><strong>Phone:</strong> {printableInvoice.phone}</p>
              <p><strong>Address:</strong> {printableInvoice.address}</p>
            </div>
            <div>
              <h3 className="font-bold border-b pb-1 mb-1">WARRANTY & DELIVERY TERMS:</h3>
              <p>✔ 5-Year Service Warranty Card (manufacturing fault) Included</p>
              <p>✔ Free Assembly & Fitting Services</p>
              <p>✔ Status: {printableInvoice.status}</p>
            </div>
          </div>

          <table className="w-full text-left text-xs border-collapse mb-6">
            <thead>
              <tr className="border-y-2 border-black font-bold bg-slate-100">
                <th className="p-2">Item Description</th>
                <th className="p-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-bold">{printableInvoice.items}</td>
                <td className="p-2 text-right font-bold">৳{printableInvoice.subtotal.toLocaleString()} BDT</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Delivery / Home Transport Fee</td>
                <td className="p-2 text-right">৳{printableInvoice.shipping} BDT</td>
              </tr>
              <tr className="border-t-2 border-black font-black text-sm">
                <td className="p-2">GRAND TOTAL AMOUNT:</td>
                <td className="p-2 text-right text-emerald-700">৳{printableInvoice.total.toLocaleString()} BDT</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-12 pt-8 border-t flex justify-between text-xs font-bold">
            <div className="text-center">
              <div className="w-36 border-b border-black mb-1"></div>
              <span>Customer Signature</span>
            </div>
            <div className="text-center">
              <div className="w-36 border-b border-black mb-1"></div>
              <span>Authorized Signature (HAAT Furniture Ltd)</span>
            </div>
          </div>
        </div>
      )}

      {/* MAIN BODY AREA (HIDDEN WHEN PRINTING) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8 print:hidden">
        
        {/* Analytics Top Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[10px] font-black text-slate-500 uppercase">Live Products</span>
            <p className="text-2xl font-black text-slate-900">{products.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[10px] font-black text-slate-500 uppercase">Total Categories</span>
            <p className="text-2xl font-black text-amber-600">{categories.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[10px] font-black text-slate-500 uppercase">Revenue Tracked</span>
            <p className="text-2xl font-black text-emerald-600">৳ {totalRevenue.toLocaleString()}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[10px] font-black text-slate-500 uppercase">Pending Inquiries</span>
            <p className="text-2xl font-black text-purple-600">{inquiries.length}</p>
          </div>
        </div>

        {/* TAB 1: ALL PRODUCTS DATA TABLE */}
        {activeTab === "products" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900">Products Catalog ({products.length})</h2>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs w-64 focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase text-[10px] font-black border-b">
                  <tr>
                    <th className="p-3">Image</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredProducts.slice(0, 15).map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3"><img src={p.image} alt={p.name} className="w-10 h-10 object-contain rounded bg-slate-50 border p-0.5" /></td>
                      <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{p.name}</td>
                      <td className="p-3 font-black text-emerald-600">৳ {p.price?.toLocaleString()}</td>
                      <td className="p-3 text-slate-500 font-bold">{p.category || 'Solid Segun'}</td>
                      <td className="p-3 text-right space-x-2">
                        {canPerform("editProducts") && <button onClick={() => startEditProduct(p)} className="px-2.5 py-1 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 font-bold text-[11px] hover:bg-amber-100">Edit</button>}
                        {canPerform("deleteProducts") && <button onClick={() => handleDeleteProduct(p.id)} className="px-2.5 py-1 rounded-lg border border-red-200 bg-red-50 text-red-600 font-bold text-[11px] hover:bg-red-100">Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ADD / EDIT PRODUCT WITH FEATURE 5: MULTI-ANGLE GALLERY UPLOADER */}
        {activeTab === "add-product" && (
          <div className="max-w-3xl bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mx-auto space-y-4">
            <h3 className="text-xl font-black text-slate-900">{editingProduct ? `Edit Product (#${editingProduct.id})` : "Publish New Product"}</h3>
            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border bg-slate-50" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (BDT) *</label>
                  <input type="number" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border bg-slate-50" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Main Image URL</label>
                  <input type="text" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border bg-slate-50" />
                </div>
              </div>

              {/* FEATURE: DIRECT PC IMAGE FILE UPLOAD FOR MAIN IMAGE & GALLERY ANGLES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                
                {/* Main Image File Input */}
                <div className="space-y-2">
                  <label className="block font-black text-slate-800 text-xs">Main Image (from PC or URL)</label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white text-xs font-black py-2.5 px-3 rounded-xl text-center shadow transition flex items-center justify-center gap-2">
                      <span>Choose PC File</span>
                      <input type="file" accept="image/*" onChange={handleMainFileUpload} className="hidden" />
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="Or paste image URL (https://haatfurniture.com/...)"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl bg-white text-xs font-medium"
                  />
                  {formData.image && (
                    <div className="w-16 h-16 rounded-xl border bg-white p-1">
                      <img src={formData.image} alt="Main Preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                </div>

                {/* Multi-Angle Gallery Files Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-black text-slate-800 text-xs">Multi-Angle Gallery ({formData.gallery_images.length})</label>
                    <button type="button" onClick={handleAddGalleryImageUrl} className="text-[10px] font-bold text-amber-700 hover:underline">
                      + Add URL
                    </button>
                  </div>
                  
                  <label className="w-full cursor-pointer bg-amber-600 hover:bg-amber-700 text-white text-xs font-black py-2.5 px-3 rounded-xl text-center shadow transition flex items-center justify-center gap-2">
                    <span>Upload Angle Files from PC (Select Multiple)</span>
                    <input type="file" accept="image/*" multiple onChange={handleGalleryFilesUpload} className="hidden" />
                  </label>

                  {/* Gallery Thumbnails */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {formData.gallery_images.map((gUrl, gIdx) => (
                      <div key={gIdx} className="w-12 h-12 rounded-lg border bg-white p-0.5 relative group">
                        <img src={gUrl} alt={`Angle ${gIdx}`} className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, gallery_images: formData.gallery_images.filter((_, i) => i !== gIdx) })}
                          className="absolute -top-1.5 -right-1.5 bg-red-600 text-white w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center shadow"
                          title="Remove Image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <button type="submit" className="w-full py-3.5 rounded-2xl bg-slate-900 text-white font-black uppercase">
                {editingProduct ? 'Save Product Changes' : 'Publish Product'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: LIVE ORDERS WITH FEATURE 1 (PDF INVOICE) & FEATURE 2 (WHATSAPP DISPATCH) */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Customer Orders</h2>
            <p className="text-xs text-slate-500">Storefront-e confirm howa order ekhane ashe. New orders refresh automatically.</p>
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase text-[10px] font-black border-b">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Ordered Items</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3 text-right">Actions & Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">No orders yet</td>
                    </tr>
                  )}
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">
                        <div>{o.id}</div>
                        {o.source === 'storefront' && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-black uppercase">Live</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{o.customer}</div>
                        <div className="text-[10px] text-slate-500">{o.phone} • {o.address}</div>
                      </td>
                      <td className="p-3 font-bold text-slate-800 max-w-xs">{o.items}</td>
                      <td className="p-3">
                        <div className="uppercase font-black text-slate-700">{o.payment || 'cod'}</div>
                        <div className="text-[10px] text-slate-500">{o.status}</div>
                        {canPerform("orderActions") && (
                          <select
                            value={o.status || "Processing"}
                            onChange={(e) => handleOrderStatus(o, e.target.value)}
                            className="mt-1 text-[10px] font-bold border border-slate-200 rounded-lg px-1 py-0.5"
                          >
                            {["Processing", "Pending", "Dispatched", "Delivered", "Cancelled"].map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td className="p-3 font-black text-emerald-600">৳ {(o.total || 0).toLocaleString()}</td>
                      <td className="p-3 text-right space-x-2">
                        {canPerform("orderActions") && <button
                          onClick={() => handlePrintInvoice(o)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-[11px] hover:bg-blue-700 shadow"
                        >
                          Print Invoice
                        </button>}
                        
                        {canPerform("orderActions") && <button
                          onClick={() => handleSendWhatsAppOrder(o)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 shadow"
                        >
                          WhatsApp Order
                        </button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CATEGORIES WITH EDIT & ADD MODAL */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">Categories</h3>
              {canPerform("manageCategories") && <button onClick={() => { setEditingCategory(null); setCatFormData({ name: "", slug: "", icon: "🪑", count: "0 Products" }); setShowCatModal(true); }} className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-black">
                + Add Category
              </button>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div key={cat.id || cat.slug} className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
                  <div className="text-3xl">{cat.icon || '🪑'}</div>
                  <h4 className="text-lg font-black text-slate-900">{cat.name}</h4>
                  <div className="flex gap-2">
                    {canPerform("manageCategories") && <button onClick={() => { setEditingCategory(cat); setCatFormData({ name: cat.name, slug: cat.slug, icon: cat.icon, count: cat.count }); setShowCatModal(true); }} className="flex-1 py-1.5 rounded bg-amber-50 text-amber-900 font-bold text-xs">✏️ Edit</button>}
                    {canPerform("manageCategories") && <button onClick={() => handleDeleteCategory(cat.id)} className="px-3 py-1.5 rounded bg-red-50 text-red-600 font-bold text-xs">🗑️</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FEATURE 3: TAB 5: SALES & REVENUE ANALYTICS REPORT */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <h2 className="text-xl font-black text-slate-900">Sales & Revenue Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Top Category Sales</span>
                <h3 className="text-2xl font-black text-slate-900">Bed Room Furniture</h3>
                <p className="text-xs text-emerald-600 font-bold">45% of Total Sales Revenue</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Average Order Value</span>
                <h3 className="text-2xl font-black text-amber-600">৳ 38,420 BDT</h3>
                <p className="text-xs text-amber-700 font-bold">Solid Chittagong Segun Teak</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Completed Delivery Rate</span>
                <h3 className="text-2xl font-black text-emerald-600">98.5% Success</h3>
                <p className="text-xs text-slate-500 font-bold">Dhaka & 64 Districts</p>
              </div>
            </div>
          </div>
        )}

        {/* FEATURE 4: TAB 6: BULK DISCOUNT & PRICE MANAGER */}
        {activeTab === "bulk-discount" && (
          <div className="max-w-2xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Bulk Discount & Price Manager</h2>
              <p className="text-xs text-slate-500 font-medium">Apply percentage discount across selected category items at once</p>
            </div>

            <form onSubmit={handleApplyBulkDiscount} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Category</label>
                <select value={bulkDiscountCat} onChange={(e) => setBulkDiscountCat(e.target.value)} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border text-xs font-bold">
                  <option value="all">All Categories (128 Products)</option>
                  <option value="home-furniture">Home Furniture</option>
                  <option value="bed-room">Bed Room</option>
                  <option value="dinning-room">Dinning Room</option>
                  <option value="living-room">Living Room</option>
                  <option value="sofa">Sofa</option>
                  <option value="almirah">Almirah</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Discount Percentage (%)</label>
                <input type="number" min="1" max="50" value={bulkDiscountPercent} onChange={(e) => setBulkDiscountPercent(Number(e.target.value))} className="w-full px-4 py-3 rounded-2xl bg-slate-50 border text-xs font-bold text-amber-600" />
              </div>

              <button type="submit" className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black uppercase text-xs shadow-lg">
                Apply Bulk Discount
              </button>
            </form>
          </div>
        )}

        {activeTab === "banners" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900">Homepage Banners</h2>
                <p className="text-xs text-slate-500 mt-1">Upload a picture here, then Publish — it will show on the homepage offer card.</p>
              </div>
              <button
                onClick={handlePublishBanners}
                disabled={savingBanner}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black uppercase disabled:opacity-60"
              >
                {savingBanner ? 'Publishing...' : 'Publish to homepage'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-4 shadow-sm">
                <h3 className="text-sm font-black text-slate-900">Hero offer banner (right side)</h3>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <input
                    type="checkbox"
                    checked={!!bannerForm.enabled}
                    onChange={(e) => setBannerForm({ ...bannerForm, enabled: e.target.checked })}
                  />
                  Show this banner on homepage
                </label>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Banner picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => uploadBannerFile(e.target.files?.[0], (url) => setBannerForm({ ...bannerForm, image: url }))}
                    className="block w-full text-xs"
                  />
                  {uploading && <p className="text-[10px] text-amber-600 mt-1">Uploading...</p>}
                  {bannerForm.image && (
                    <img src={bannerForm.image} alt="Offer banner preview" className="mt-3 w-full h-40 object-cover rounded-xl border border-slate-200" />
                  )}
                </div>

                <input value={bannerForm.kicker} onChange={(e) => setBannerForm({ ...bannerForm, kicker: e.target.value })} placeholder="Small label" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-bold" />
                <input value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} placeholder="Title" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-bold" />
                <input value={bannerForm.subtitle} onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })} placeholder="Subtitle" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-bold" />
                <input value={bannerForm.note} onChange={(e) => setBannerForm({ ...bannerForm, note: e.target.value })} placeholder="Note" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-bold" />
                <input value={bannerForm.cta} onChange={(e) => setBannerForm({ ...bannerForm, cta: e.target.value })} placeholder="Button text" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-bold" />
                <input value={bannerForm.link} onChange={(e) => setBannerForm({ ...bannerForm, link: e.target.value })} placeholder="Link / WhatsApp URL" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border text-xs font-bold" />
              </div>

              <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-5 shadow-sm">
                <h3 className="text-sm font-black text-slate-900">Hero background pictures (optional)</h3>
                <p className="text-[11px] text-slate-500">Upload 1–3 photos to replace the big homepage slider images.</p>
                {heroSlideBanners.map((slide, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-100 p-3 space-y-2">
                    <p className="text-[10px] font-black uppercase text-slate-500">Slide {idx + 1}</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => uploadBannerFile(e.target.files?.[0], (url) => {
                        const next = [...heroSlideBanners];
                        next[idx] = { ...next[idx], image: url };
                        setHeroSlideBanners(next);
                      })}
                      className="block w-full text-xs"
                    />
                    {slide.image && (
                      <img src={slide.image} alt={`Hero slide ${idx + 1}`} className="w-full h-28 object-cover rounded-lg" />
                    )}
                    <input
                      value={slide.title || ''}
                      onChange={(e) => {
                        const next = [...heroSlideBanners];
                        next[idx] = { ...next[idx], title: e.target.value };
                        setHeroSlideBanners(next);
                      }}
                      placeholder="Optional title"
                      className="w-full px-3 py-2 rounded-lg bg-slate-50 border text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FEATURE 6: TAB 7: CUSTOMER INQUIRIES & MESSAGES MANAGER */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-900">Customer Inquiries ({inquiries.length})</h2>
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase text-[10px] font-black border-b">
                  <tr>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Message</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {inquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{inq.name} <br/><span className="text-[10px] text-slate-500 font-normal">{inq.phone}</span></td>
                      <td className="p-3 max-w-md text-slate-800">{inq.message}</td>
                      <td className="p-3 text-slate-500">{inq.date}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px] uppercase">{inq.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "audit-log" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">Audit Log</h2>
              <button
                onClick={() => {
                  setAuditLogs([]);
                  recordAudit("AUDIT_LOG_CLEARED", "Cleared all audit log entries.");
                  showToast("Audit log cleared.");
                }}
                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 font-bold text-xs"
              >
                Clear Log
              </button>
            </div>
            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 uppercase text-[10px] font-black border-b">
                  <tr>
                    <th className="p-3">Time</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Action</th>
                    <th className="p-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {auditLogs.length === 0 && (
                    <tr>
                      <td className="p-4 text-slate-500" colSpan={5}>No audit logs yet.</td>
                    </tr>
                  )}
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-3 text-slate-500 whitespace-nowrap">{new Date(log.at).toLocaleString()}</td>
                      <td className="p-3 font-bold text-slate-900">{log.actor}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">{log.role}</span></td>
                      <td className="p-3 font-black text-slate-800">{log.action}</td>
                      <td className="p-3 text-slate-600">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
