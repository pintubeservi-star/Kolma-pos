'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react';

// ==========================================
// ÍCONOS SVG NATIVOS (Reemplazo exacto, 0 dependencias)
// ==========================================
const Svg = ({ children, size=24, className='', strokeWidth=2, fill="none", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>{children}</svg>
);
const Search = p => <Svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Svg>;
const ShoppingBag = p => <Svg {...p}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></Svg>;
const User = p => <Svg {...p}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Svg>;
const MapPin = p => <Svg {...p}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></Svg>;
const Plus = p => <Svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
const Minus = p => <Svg {...p}><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
const X = p => <Svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>;
const CheckCircle = p => <Svg {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></Svg>;
const TrendingUp = p => <Svg {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></Svg>;
const Flame = p => <Svg {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></Svg>;
const LogOut = p => <Svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Svg>;
const Navigation = p => <Svg {...p}><polygon points="3 11 22 2 13 21 11 13 3 11"/></Svg>;
const Zap = p => <Svg {...p}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></Svg>;
const Phone = p => <Svg {...p}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></Svg>;
const ShoppingBasket = p => <Svg {...p}><path d="m5 11 4-7"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/></Svg>;
const Cpu = p => <Svg {...p}><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></Svg>;
const ArrowRight = p => <Svg {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></Svg>;
const CreditCard = p => <Svg {...p}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></Svg>;
const Home = p => <Svg {...p}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></Svg>;
const MapIcon = p => <Svg {...p}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></Svg>;
const Trash = p => <Svg {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Svg>;

// --- CONFIGURACIÓN DE ENTORNO Y MARCA ---
const APP_ID = "kolma-rd-premium-001";
const MAP_CENTER = [19.0528, -70.1492]; // Cotuí, RD
const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "q0q09e-cp.myshopify.com";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || "c9bda45020488455d7fe2d8b7e22f352";

// ==========================================
// INTEGRACIÓN SHOPIFY (KOLMA POS SUPERMERCADO)
// ==========================================
const registrarVentaEnShopify = async (cartItems) => {
  const line_items = cartItems.map(item => ({
    title: item.name,
    price: item.price.toString(),
    quantity: item.qty
  }));

  const orderData = {
    order: {
      line_items: line_items,
      financial_status: "paid", // Registra la venta como ya cobrada en el POS
      customer: {
        first_name: "Ventas",
        last_name: "Directa"
      },
      source_name: "Kolma POS"
    }
  };

  try {
    const res = await fetch(`https://${DOMAIN}/admin/api/2024-04/orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': ACCESS_TOKEN
      },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) console.error("Error Kolma POS -> Shopify:", await res.text());
  } catch (e) {
    console.error("Error de red con Shopify:", e);
  }
};

// ==========================================
// COMPONENTE: MAPA EN VIVO SHIPDAY
// ==========================================
const LiveTrackingMap = ({ order, onClose }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const initMap = () => {
      const L = window.L;
      if (!L || mapRef.current) return;

      mapRef.current = L.map('live-map', { zoomControl: false, attributionControl: false }).setView(MAP_CENTER, 15);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(mapRef.current);

      const driverHtml = `<div class="w-12 h-12 bg-[#FF3D00] rounded-[20px] flex items-center justify-center text-white shadow-2xl shadow-red-500/50 border-4 border-white animate-pulse">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                          </div>`;
      
      const driverIcon = L.divIcon({ className: 'custom-driver-pin', html: driverHtml, iconSize: [48, 48], iconAnchor: [24, 24] });
      markerRef.current = L.marker(MAP_CENTER, { icon: driverIcon, zIndexOffset: 1000 }).addTo(mapRef.current);
    };

    if (!window.L) {
      const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = initMap; document.head.appendChild(script);
      const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
    } else { initMap(); }
  }, []);

  useEffect(() => {
    if (order?.driverLat && order?.driverLng && markerRef.current) {
      const pos = [order.driverLat, order.driverLng];
      markerRef.current.setLatLng(pos);
      if (mapRef.current) mapRef.current.panTo(pos, { animate: true, duration: 1.5 });
    }
  }, [order?.driverLat, order?.driverLng]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
      <button onClick={onClose} className="absolute top-12 left-6 z-[110] w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl text-slate-900 active:scale-95 transition-transform">
        <X size={24} strokeWidth={3} />
      </button>
      <div className="absolute inset-0 bottom-[45%] z-[100]"><div id="live-map" className="w-full h-full bg-slate-100" /></div>
      <div className="absolute bottom-0 inset-x-0 h-[50%] bg-white z-[110] rounded-t-[48px] p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.15)] flex flex-col">
        <div className="w-12 h-2 bg-slate-100 rounded-full mx-auto mb-8" />
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tighter text-slate-900">{order.eta ? `Llega en ${order.eta} min` : 'En camino'}</h2>
            <p className="text-[#FF3D00] font-black text-sm uppercase tracking-widest mt-1 flex items-center gap-2">
               <span className="w-2 h-2 bg-[#FF3D00] rounded-full animate-ping"></span> {order.shipdayMsg || 'Conectando radar...'}
            </p>
          </div>
          <div className="bg-orange-50 px-4 py-2 rounded-2xl border border-orange-100"><span className="text-[#FF9100] font-black text-sm">#{order.id.slice(-5)}</span></div>
        </div>
        <div className="flex gap-2 mb-8">
          <div className="flex-1 h-2 rounded-full bg-[#FF3D00]" />
          <div className={`flex-1 h-2 rounded-full ${order.driverName ? 'bg-[#FF3D00]' : 'bg-slate-100'}`} />
          <div className={`flex-1 h-2 rounded-full ${order.status === 'Entregado' ? 'bg-[#FF3D00]' : 'bg-slate-100'}`} />
        </div>
        {order.driverName ? (
          <div className="bg-slate-50 border border-slate-100 rounded-[32px] p-5 flex justify-between items-center mt-auto">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-slate-200 rounded-2xl bg-cover border-2 border-white shadow-md" style={{backgroundImage: 'url(https://i.pravatar.cc/150?u=kolma_driver)'}} />
              <div>
                <p className="font-black text-lg text-slate-900 leading-none mb-1">{order.driverName}</p>
                <p className="text-xs font-bold text-slate-400 flex items-center gap-1"><CheckCircle size={12} className="text-green-500" /> Repartidor Verificado</p>
              </div>
            </div>
            {order.driverPhone && (
              <a href={`tel:${order.driverPhone}`} className="w-14 h-14 bg-gradient-to-br from-[#FF3D00] to-[#FF9100] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-200 active:scale-95 transition-transform"><Phone size={24} fill="currentColor" /></a>
            )}
          </div>
        ) : (
          <div className="bg-red-50 border border-red-100 rounded-[32px] p-5 flex items-center gap-4 mt-auto">
             <div className="w-10 h-10 border-4 border-red-200 border-t-[#FF3D00] rounded-full animate-spin" />
             <div><p className="font-black text-slate-900">Empacando orden</p><p className="text-xs font-bold text-slate-500">Buscando al repartidor más cercano</p></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  // --- ESTADOS ---
  const [view, setView] = useState('home'); 
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  
  // Estados Checkout & Órdenes
  const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, auth, checkout, success
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);

  // Estados UI Extras
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authForm, setAuthForm] = useState({ name: '', email: '', phone: '', address: '', pwd: '' });
  const [showUpsell, setShowUpsell] = useState(null);
  const [toast, setToast] = useState(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // --- 1. CARGA DE CATÁLOGO (Shopify + Mock Premium) ---
  useEffect(() => {
    const fetchShopify = async () => {
      try {
        const res = await fetch(`https://${DOMAIN}/api/2024-04/graphql.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN },
          body: JSON.stringify({ query: `{ products(first: 50) { edges { node { id title collections(first: 1) { edges { node { title } } } images(first: 1) { edges { node { url } } } variants(first: 1) { edges { node { id price { amount } compareAtPrice { amount } } } } } } } }`})
        });
        const { data } = await res.json();
        if (data?.products) {
          const shopifyProds = data.products.edges.map(p => {
            const price = parseFloat(p.node.variants.edges[0].node.price.amount);
            const oldPrice = p.node.variants.edges[0].node.compareAtPrice ? parseFloat(p.node.variants.edges[0].node.compareAtPrice.amount) : price * 1.25;
            return {
              id: p.node.id, name: p.node.title, price, oldPrice,
              category: p.node.collections.edges[0]?.node.title || 'Despensa',
              image: p.node.images.edges[0]?.node.url, variantId: p.node.variants.edges[0].node.id,
              weight: 'Unidad'
            };
          });
          setProducts(shopifyProds);
          return;
        }
      } catch (e) { console.log("Usando catálogo premium de respaldo..."); }
      
      // Fallback a los datos premium del usuario
      setProducts([
        { id: '1', name: 'Leche Rica Entera 1L', price: 78.0, oldPrice: 95.0, category: 'Lácteos', image: 'https://images.unsplash.com/photo-1563636619-e9107da5a1bb?auto=format&fit=crop&w=300', variantId: 'v1', weight: '1L', upsellId: '4' },
        { id: '2', name: 'Aguacate Hass de Cotuí', price: 45.0, oldPrice: 65.0, category: 'Frutas y Verduras', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=300', variantId: 'v2', weight: 'Unidad', upsellId: '3' },
        { id: '3', name: 'Pechuga de Pollo Premium', price: 185.0, oldPrice: 230.0, category: 'Carnes', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=300', variantId: 'v3', weight: '1lb' },
        { id: '4', name: 'Pan Sobao Horneado Hoy', price: 55.0, oldPrice: 75.0, category: 'Panadería', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300', variantId: 'v4', weight: 'Funda', upsellId: '1' },
        { id: '5', name: 'Arroz Selecto Kolma 5lb', price: 160.0, oldPrice: 195.0, category: 'Despensa', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300', variantId: 'v5', weight: '5lb' },
        { id: '6', name: 'Refresco Cola 2L', price: 98.0, oldPrice: 115.0, category: 'Bebidas', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=300', variantId: 'v7', weight: '2L' },
      ]);
    };
    fetchShopify();
    
    // Cargar Sesión Local
    const savedUser = localStorage.getItem(`${APP_ID}_user`);
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedOrders = JSON.parse(localStorage.getItem(`${APP_ID}_orders`) || '[]');
    setOrders(savedOrders);
    if(savedOrders.length > 0 && savedOrders[savedOrders.length-1].status !== 'Entregado') setCurrentOrder(savedOrders[savedOrders.length-1]);
  }, []);

  // --- 2. SHIPDAY POLLING (RADAR EN VIVO) ---
  useEffect(() => {
    if (!currentOrder || ['Entregado', 'Finalizado'].includes(currentOrder.status)) return;
    const tracker = setInterval(async () => {
      try {
        const res = await fetch(`/api/status?id=${currentOrder.id}&t=${Date.now()}`);
        const data = await res.json();
        if (data.success && data.status_route) {
          const info = data.status_route;
          const statusRaw = info.status.toUpperCase();
          
          if (['ALREADY_DELIVERED', 'SUCCESSFUL', 'DELIVERED'].includes(statusRaw)) {
            clearInterval(tracker);
            updateOrder(currentOrder.id, { status: 'Entregado', shipdayMsg: 'Orden Entregada ¡Disfruta!' }, info);
            return;
          }
          let nuevoEstado = currentOrder.status;
          if (['UNASSIGNED', 'ACCEPTED', 'PENDING'].includes(statusRaw)) nuevoEstado = 'Preparando';
          if (['ASSIGNED', 'STARTED', 'PICKED_UP', 'ACTIVE', 'ON_THE_WAY'].includes(statusRaw)) nuevoEstado = 'En camino';
          
          let msg = statusRaw === 'STARTED' ? 'Repartidor va hacia Kolma' : statusRaw === 'PICKED_UP' ? '¡Tu orden va en camino!' : 'Procesando en almacén...';
          updateOrder(currentOrder.id, { status: nuevoEstado, shipdayMsg: msg }, info);
        }
      } catch(e) { console.log("Radar Shipday: Conectando..."); }
    }, 8000);
    return () => clearInterval(tracker);
  }, [currentOrder]);

  const updateOrder = (id, updates, shipdayData) => {
    const updated = { ...currentOrder, ...updates };
    if (shipdayData?.driver_location) { updated.driverLat = shipdayData.driver_location.lat; updated.driverLng = shipdayData.driver_location.lng; }
    if (shipdayData?.driver_name) updated.driverName = shipdayData.driver_name;
    if (shipdayData?.driver_phone) updated.driverPhone = shipdayData.driver_phone;
    if (shipdayData?.eta) updated.eta = shipdayData.eta;
    setCurrentOrder(updated);
    setOrders(prev => { const newO = prev.map(o => o.id === id ? updated : o); localStorage.setItem(`${APP_ID}_orders`, JSON.stringify(newO)); return newO; });
  };

  // --- 3. NOTIFICACIONES SOCIAL PROOF (NEUROMARKETING) ---
  useEffect(() => {
    const names = ['Ana', 'Roberto', 'Milagros', 'Junior', 'Carla', 'Nelson'];
    const items = ['un saco de arroz', 'leche rica', 'aguacates frescos', 'pan caliente'];
    const interval = setInterval(() => {
      setToast({ title: `${names[Math.floor(Math.random()*names.length)]} de Cotuí`, desc: `Acaba de comprar ${items[Math.floor(Math.random()*items.length)]}` });
      setTimeout(() => setToast(null), 5000);
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  // --- 4. LÓGICA DE CARRITO Y BÚSQUEDA ---
  const handleSearch = (val) => {
    setSearchTerm(val);
    if(val.length > 2) { setIsAiLoading(true); setTimeout(() => setIsAiLoading(false), 400); }
  };

  const filteredProducts = useMemo(() => products.filter(p => (activeCategory === 'Todos' || p.category === activeCategory) && (p.name.toLowerCase().includes(searchTerm.toLowerCase()))), [products, searchTerm, activeCategory]);

  const addToCart = (product, isUpsell = false) => {
    setCart(prev => {
      const existing = prev.find(item => item.variantId === product.variantId);
      if (existing) return prev.map(item => item.variantId === product.variantId ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
    
    // Motor de Upsell
    if (!isUpsell && product.upsellId) {
      const suggested = products.find(p => p.id === product.upsellId);
      if (suggested) setShowUpsell(suggested);
    } else { setShowUpsell(null); }
  };

  const updateCartQty = (id, delta) => setCart(prev => prev.map(i => i.variantId === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const totalSavings = cart.reduce((acc, item) => acc + ((item.oldPrice - item.price) * item.qty), 0);

  // --- 5. CHECKOUT Y AUTH ---
  const handleAuth = (e) => {
    e.preventDefault();
    const newUser = { name: authForm.name || authForm.email.split('@')[0], email: authForm.email, phone: authForm.phone, address: authForm.address || 'Cotuí Centro' };
    localStorage.setItem(`${APP_ID}_user`, JSON.stringify(newUser));
    setUser(newUser); setIsAuthOpen(false);
    if (view === 'cart') setCheckoutStep('checkout');
  };

  const placeOrder = () => {
    const newOrder = { id: 'KOL-' + Math.floor(Math.random()*90000 + 10000), items: [...cart], total: subtotal, status: 'Preparando', date: new Date().toLocaleTimeString(), method: paymentMethod };
    setCurrentOrder(newOrder);
    const newHistory = [...orders, newOrder];
    setOrders(newHistory); 
    localStorage.setItem(`${APP_ID}_orders`, JSON.stringify(newHistory));
    
    registrarVentaEnShopify(cart);

    setCart([]); 
    setCheckoutStep('success');
  };

  const logout = () => { localStorage.removeItem(`${APP_ID}_user`); setUser(null); setView('home'); };

  // ==========================================
  // RENDER UI PRINCIPAL
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans pb-24 md:pb-0 selection:bg-orange-200">
      
      {/* SOCIAL PROOF TOAST */}
      {toast && (
        <div className="fixed top-24 left-6 z-[80] bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl p-4 border border-orange-100 flex items-center gap-4 animate-in slide-in-from-left-10 duration-500">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF3D00] to-[#FF9100] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200"><ShoppingBasket size={24} /></div>
          <div><p className="text-xs font-black text-slate-800 leading-none mb-1">{toast.title}</p><p className="text-[11px] text-slate-500 font-bold">{toast.desc}</p></div>
        </div>
      )}

      {/* MODAL UPSELL (VENTA CRUZADA) */}
      {showUpsell && (
        <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in">
          <div className="bg-white w-full rounded-t-[48px] p-8 shadow-2xl animate-in slide-in-from-bottom-full duration-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black tracking-tighter">¡Los clientes también llevan!</h3>
              <button onClick={() => setShowUpsell(null)} className="bg-slate-100 p-2 rounded-full"><X size={20} /></button>
            </div>
            <div className="bg-orange-50 rounded-[32px] p-6 flex items-center gap-6 border border-orange-100">
              <img src={showUpsell.image} className="w-24 h-24 rounded-2xl object-cover mix-blend-multiply" />
              <div className="flex-1">
                <p className="font-black text-lg leading-tight mb-2">{showUpsell.name}</p>
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-black text-xl text-[#FF3D00]">RD$ {showUpsell.price}</span>
                  <span className="text-xs text-slate-400 line-through font-bold">RD$ {showUpsell.oldPrice}</span>
                </div>
                <button onClick={() => addToCart(showUpsell, true)} className="w-full bg-[#111] text-white py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10">
                  <Plus size={18} strokeWidth={3} /> Agregar al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

            {/* HEADER INTELIGENTE */}
      <header className="sticky top-0 z-[60] bg-white/90 backdrop-blur-xl border-b border-gray-100 px-6 py-4 flex flex-col md:flex-row items-center gap-6 shadow-sm">
        <div className="flex items-center justify-between w-full md:w-auto gap-8">
          <div onClick={() => {setView('home'); setCheckoutStep('cart');}} className="flex items-center gap-2 cursor-pointer group">
             <div className="bg-gradient-to-br from-[#FF3D00] to-[#FF9100] text-white w-12 h-12 rounded-[18px] flex items-center justify-center font-black text-2xl shadow-xl shadow-orange-200 group-hover:rotate-6 transition-transform">K</div>
             <span className="font-black text-xl tracking-tighter">Kolma<span className="text-[#FF3D00]">RD</span></span>
          </div>
          <div className="md:hidden">
             <button onClick={() => setView('cart')} className="bg-slate-900 text-white px-4 py-2.5 rounded-2xl flex items-center gap-2 font-black text-xs shadow-xl shadow-slate-200">
               <ShoppingBag size={18} /> RD$ {subtotal.toFixed(0)}
             </button>
          </div>
        </div>

        <div className="flex-1 w-full max-w-2xl relative group">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {isAiLoading ? <Cpu size={18} className="text-[#FF3D00] animate-spin" /> : <Search className="text-gray-300 group-focus-within:text-[#FF3D00] transition-colors" size={20} />}
          </div>
          <input type="text" value={searchTerm} onChange={(e) => handleSearch(e.target.value)} placeholder="¿Qué necesitas hoy en Cotuí?" className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-200 focus:bg-white rounded-[24px] py-4 pl-14 pr-4 font-bold transition-all outline-none text-sm placeholder:text-gray-400" />
          {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 bg-slate-200 rounded-full p-1"><X size={14} /></button>}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <button onClick={() => setView('cart')} className="bg-[#111] text-white px-8 py-4 rounded-[24px] flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-200">
            <div className="relative"><ShoppingBag size={22} />{cart.length > 0 && <span className="absolute -top-2 -right-2 bg-[#FF3D00] text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-black border-2 border-[#111]">{cart.length}</span>}</div>
            <span className="font-black text-lg border-l border-white/20 pl-4 tracking-tighter">RD$ {subtotal.toFixed(0)}</span>
          </button>
          <button onClick={() => user ? setView('profile') : setIsAuthOpen(true)} className="w-14 h-14 bg-white rounded-[24px] flex items-center justify-center border-2 border-gray-100 hover:border-orange-200 transition-all"><User size={22} className="text-slate-600" /></button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        
        {view === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {!searchTerm && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 relative h-72 bg-gradient-to-br from-[#111] to-slate-800 rounded-[48px] overflow-hidden p-12 flex items-center shadow-2xl group cursor-pointer">
                    <div className="z-10 text-white max-w-md">
                      <div className="flex items-center gap-2 mb-4">
                         <div className="bg-[#FF3D00] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Kolma Express</div>
                         <div className="flex items-center gap-1 text-[#FF9100] text-xs font-black"><Zap size={14} fill="currentColor"/> 25 MIN</div>
                      </div>
                      <h2 className="text-5xl font-black mb-4 tracking-tighter leading-none">Súper Fresco <br/> <span className="text-[#FF9100]">en tu puerta.</span></h2>
                      <button className="bg-white text-black px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 transition-transform">Comprar ahora <ArrowRight size={18}/></button>
                    </div>
                    <div className="absolute right-0 top-0 h-full w-1/2 opacity-40 group-hover:scale-110 transition-transform duration-1000"><img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600" className="w-full h-full object-cover" alt="Banner" /></div>
                  </div>

                  <div className="relative h-72 bg-gradient-to-br from-[#FF3D00] to-[#D32F2F] rounded-[48px] overflow-hidden p-10 shadow-2xl group cursor-pointer">
                    <div className="z-10 text-white relative h-full flex flex-col justify-between">
                       <div><h3 className="text-3xl font-black tracking-tighter leading-none mb-2">Ahorro Extremo</h3><p className="font-bold text-white/80 text-sm">Fin de semana Kolma</p></div>
                       <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20"><p className="text-[10px] font-black uppercase tracking-widest text-white/60">Cupón Activo</p><p className="font-black text-2xl">COTUÍ50</p></div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 text-[200px] opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700">🛒</div>
                  </div>
                </div>

                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-2" style={{scrollbarWidth: 'none'}}>
                  {['Todos', 'Lácteos', 'Frutas y Verduras', 'Carnes', 'Panadería', 'Despensa', 'Bebidas'].map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`flex flex-col items-center gap-3 p-5 min-w-[110px] rounded-[32px] transition-all border-2 ${activeCategory === cat ? 'bg-white border-[#FF3D00] shadow-xl shadow-red-100/50 scale-105' : 'bg-white border-transparent grayscale opacity-60 hover:opacity-100 hover:grayscale-0'}`}>
                      <span className="text-4xl">{cat === 'Lácteos' ? '🥛' : cat === 'Frutas y Verduras' ? '🥑' : cat === 'Carnes' ? '🥩' : cat === 'Panadería' ? '🥖' : cat === 'Despensa' ? '🥫' : cat === 'Bebidas' ? '🥤' : '✨'}</span>
                      <span className={`text-[11px] font-black uppercase tracking-widest ${activeCategory === cat ? 'text-[#FF3D00]' : 'text-slate-400'}`}>{cat}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div>
              <div className="flex justify-between items-end mb-8">
                <h3 className="text-3xl font-black tracking-tighter flex items-center gap-3">{searchTerm ? `Buscando "${searchTerm}"` : 'Populares hoy'} <Flame className="text-[#FF3D00]" fill="currentColor" size={28}/></h3>
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-10">
                  {filteredProducts.map(p => (
                    <div key={p.id} className="group flex flex-col relative">
                      <div className="relative aspect-square rounded-[36px] bg-white border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 mb-4 cursor-pointer">
                        <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 mix-blend-multiply" alt={p.name} loading="lazy" />
                        <div className="absolute top-4 left-4"><div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-2xl text-[10px] font-black shadow-sm flex items-center gap-1.5 text-[#FF3D00] border border-red-50"><TrendingUp size={12} /> Top Ventas</div></div>
                        <button onClick={(e) => { e.stopPropagation(); addToCart(p); }} className="absolute bottom-4 right-4 bg-[#FF3D00] text-white p-4 rounded-[20px] opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-y-4 md:group-hover:translate-y-0 transition-all shadow-xl shadow-red-200 active:scale-90">
                          <Plus size={24} strokeWidth={3} />
                        </button>
                      </div>
                      <div className="px-2">
                        <p className="text-[10px] font-black text-[#FF9100] uppercase mb-1 tracking-widest">{p.category}</p>
                        <h4 className="font-bold text-sm leading-tight line-clamp-2 mb-2 text-slate-900">{p.name}</h4>
                        <div className="flex items-end gap-2">
                          <span className="font-black text-xl tracking-tighter text-[#111]">RD${p.price.toFixed(0)}</span>
                          <span className="text-xs text-slate-400 line-through font-bold mb-1">RD${p.oldPrice.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-24 text-center bg-white rounded-[48px] border-2 border-dashed border-slate-200">
                   <div className="text-6xl mb-4">🛒</div>
                   <h4 className="text-2xl font-black text-slate-800">No encontramos resultados</h4>
                   <p className="text-slate-500 font-bold mt-2">Prueba buscando otro producto en Cotuí.</p>
                </div>
              )}
            </div>
            <div style={{ backgroundColor: '#111', padding: '40px 20px', textAlign: 'center', color: '#fff', marginTop: '20px', borderRadius: '32px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '0 0 10px 0', color: '#E31E24' }}>Llegamos a Cotuí</h2>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#9CA3AF', margin: '0 0 20px 0' }}>Kolma llegó a Cotuí. El supermercado en tu bolsillo.</p>
              <div style={{ width: '40px', height: '4px', backgroundColor: '#E31E24', margin: '0 auto', borderRadius: '2px' }}></div>
            </div>
          </div>
        )}

        {view === 'cart' && (
          <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 animate-in slide-in-from-bottom-10 duration-500">
             
             <div className="bg-white rounded-[48px] p-8 md:p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 flex-[1.5]">
                <div className="flex justify-between items-center mb-10">
                   <h2 className="text-3xl font-black tracking-tighter">Tu Canasta</h2>
                   {totalSavings > 0 && (
                     <div className="text-right">
                        <span className="text-[10px] font-black uppercase text-[#FF9100] tracking-widest">Ahorraste</span>
                        <p className="font-black text-xl text-[#FF3D00]">RD$ {totalSavings.toFixed(0)}</p>
                     </div>
                   )}
                </div>

                {checkoutStep === 'success' ? (
                  <div className="py-16 text-center animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={48} strokeWidth={3} /></div>
                    <h2 className="text-4xl font-black tracking-tighter mb-4 text-slate-900">¡Pedido Confirmado!</h2>
                    <p className="text-slate-500 font-bold text-lg mb-10">Estamos preparando tus productos para enviarlos a Cotuí.</p>
                    <button onClick={() => { setView('orders'); setIsTrackingOpen(true); }} className="bg-[#111] text-white px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform flex items-center gap-3 mx-auto">
                      <MapIcon size={20} /> Ver ruta en vivo
                    </button>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="py-20 text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300"><ShoppingBasket size={40} /></div>
                    <p className="text-slate-800 font-black text-2xl mb-8">Tu carrito está vacío</p>
                    <button onClick={() => setView('home')} className="bg-[#111] text-white px-10 py-4 rounded-[20px] font-black shadow-xl hover:bg-[#FF3D00] transition-colors">Volver a la tienda</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                     {cart.map(item => (
                       <div key={item.variantId} className="flex items-center gap-4 md:gap-6 p-4 rounded-[32px] bg-slate-50/50 hover:bg-orange-50/50 transition-all border border-transparent hover:border-orange-100">
                         <img src={item.image} className="w-20 h-20 md:w-24 md:h-24 rounded-[24px] object-cover shadow-sm bg-white" alt="Item" />
                         <div className="flex-1">
                            <h4 className="font-bold text-sm md:text-base text-slate-900 leading-tight mb-1">{item.name}</h4>
                            <p className="font-black text-lg md:text-xl text-[#FF3D00]">RD$ {item.price.toFixed(0)}</p>
                         </div>
                         <div className="flex flex-col items-center gap-3">
                            <div className="flex items-center bg-white border border-slate-200 rounded-[16px] p-1 shadow-sm">
                              <button onClick={() => updateCartQty(item.variantId, -1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-50 rounded-xl">{item.qty === 1 ? <Trash size={16} className="text-red-500"/> : <Minus size={16}/>}</button>
                              <span className="w-8 text-center font-black text-sm">{item.qty}</span>
                              <button onClick={() => updateCartQty(item.variantId, 1)} className="w-8 h-8 flex items-center justify-center bg-[#111] text-white rounded-xl shadow-md"><Plus size={16}/></button>
                            </div>
                         </div>
                       </div>
                     ))}
                  </div>
                )}
             </div>

             {cart.length > 0 && checkoutStep !== 'success' && (
               <div className="flex-1">
                 <div className="bg-white rounded-[48px] p-8 shadow-2xl shadow-slate-200 border border-slate-100 sticky top-32">
                   <h3 className="text-2xl font-black tracking-tighter mb-6">Resumen</h3>
                   
                   <div className="space-y-4 mb-8">
                     <div className="flex justify-between text-slate-500 font-bold text-sm"><span>Subtotal</span><span>RD$ {subtotal.toFixed(0)}</span></div>
                     <div className="flex justify-between text-green-500 font-bold text-sm"><span>Ahorro Ofertas</span><span>-RD$ {totalSavings.toFixed(0)}</span></div>
                     <div className="flex justify-between text-slate-500 font-bold text-sm"><span>Envío a Cotuí</span><span className="text-[#FF9100]">Gratis</span></div>
                     <div className="h-px bg-slate-100 w-full my-4" />
                     <div className="flex justify-between items-center"><span className="text-xl font-black">Total a pagar</span><span className="text-4xl font-black text-[#111]">RD$ {subtotal.toFixed(0)}</span></div>
                   </div>

                   {checkoutStep === 'cart' && (
                     <button onClick={() => user ? setCheckoutStep('checkout') : setIsAuthOpen(true)} className="w-full bg-[#FF3D00] text-white py-5 rounded-[24px] font-black text-lg shadow-xl shadow-red-200 hover:scale-105 transition-all flex items-center justify-center gap-2">
                       Proceder al Checkout <ArrowRight size={20} />
                     </button>
                   )}

                   {checkoutStep === 'checkout' && (
                     <div className="animate-in fade-in">
                       <div className="bg-slate-50 rounded-3xl p-5 mb-6 border border-slate-100">
                         <div className="flex items-center gap-3 mb-2"><MapPin size={18} className="text-[#FF3D00]" /><span className="font-black text-sm">Entrega en Cotuí</span></div>
                         <p className="text-sm text-slate-600 font-bold pl-7">{user?.address} • {user?.phone}</p>
                       </div>
                       <div className="mb-6">
                         <p className="font-black text-sm mb-3">Método de pago</p>
                         <button className="w-full flex items-center gap-4 bg-white border-2 border-[#111] p-4 rounded-2xl"><div className="w-5 h-5 rounded-full border-4 border-[#111] flex items-center justify-center"><div className="w-2 h-2 bg-[#111] rounded-full"/></div><CreditCard size={20}/><span className="font-black">Efectivo al recibir</span></button>
                       </div>
                       <button onClick={placeOrder} className="w-full bg-[#111] text-white py-5 rounded-[24px] font-black text-lg shadow-2xl hover:bg-[#FF3D00] transition-all">Confirmar Orden</button>
                     </div>
                   )}
                 </div>
               </div>
             )}
          </div>
        )}

        {(view === 'orders' || view === 'profile') && (
          <div className="max-w-3xl mx-auto animate-in fade-in">
             <h2 className="text-4xl font-black tracking-tighter mb-8">{view === 'profile' ? 'Mi Cuenta' : 'Mis Pedidos'}</h2>
             
             {view === 'profile' && user ? (
               <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-100 mb-8 flex items-center gap-6">
                 <div className="w-20 h-20 bg-[#111] text-white rounded-[24px] flex items-center justify-center text-3xl font-black shadow-lg">{user.name.charAt(0)}</div>
                 <div className="flex-1">
                   <h3 className="text-2xl font-black">{user.name}</h3>
                   <p className="text-slate-500 font-bold">{user.email} • {user.phone}</p>
                   <span className="inline-block bg-orange-100 text-[#FF3D00] px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest mt-2">Premium Member</span>
                 </div>
                 <button onClick={logout} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100"><LogOut size={24} /></button>
               </div>
             ) : view === 'profile' && !user && (
               <div className="bg-white p-10 rounded-[32px] text-center border border-slate-100">
                 <button onClick={() => setIsAuthOpen(true)} className="bg-[#111] text-white px-8 py-4 rounded-2xl font-black">Iniciar Sesión / Registro</button>
               </div>
             )}

             {view === 'orders' && (
             <div className="space-y-6">
               <h3 className="text-2xl font-black tracking-tighter">Historial de Órdenes</h3>
               {orders.length === 0 ? (
                 <div className="bg-white p-10 rounded-[32px] text-center border border-slate-100">
                    <p className="text-slate-400 font-bold">No tienes pedidos aún. ¡Anímate a pedir en Kolma!</p>
                 </div>
               ) : (
                 orders.slice().reverse().map(order => (
                   <div key={order.id} className={`bg-white p-6 md:p-8 rounded-[40px] border-2 shadow-xl ${order.status !== 'Entregado' ? 'border-[#FF3D00] shadow-red-100/50' : 'border-slate-100 shadow-slate-100/50'}`}>
                     <div className="flex justify-between items-start mb-6">
                       <div>
                         <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${order.status !== 'Entregado' ? 'bg-red-50 text-[#FF3D00]' : 'bg-green-50 text-green-600'}`}>{order.status}</span>
                         <h4 className="font-black text-xl mt-2 text-slate-900">Orden {order.id}</h4>
                         <p className="text-slate-400 text-xs font-bold">{order.date}</p>
                       </div>
                       <div className="text-right">
                         <p className="font-black text-2xl text-[#111]">RD$ {order.total.toFixed(0)}</p>
                         <p className="text-slate-500 text-xs font-bold">{order.items.length} artículos</p>
                       </div>
                     </div>
                     
                     {order.status !== 'Entregado' && (
                       <button onClick={() => { setCurrentOrder(order); setIsTrackingOpen(true); }} className="w-full bg-[#111] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-[#FF3D00] transition-colors">
                         <Navigation size={16} /> Rastrear Pedido en Vivo
                       </button>
                     )}
                   </div>
                 ))
               )}
             </div>
             )}
          </div>
        )}
      </main>

      {isAuthOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[48px] p-8 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsAuthOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"><X size={20} /></button>
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF3D00] to-[#FF9100] rounded-[24px] flex items-center justify-center text-white text-3xl font-black mb-6 shadow-xl shadow-orange-200">K</div>
            <h2 className="text-3xl font-black tracking-tighter mb-2">Ingresa a Kolma</h2>
            <p className="text-slate-500 font-bold text-sm mb-8">Guarda tu dirección en Cotuí y pide en un clic.</p>
            <form onSubmit={handleAuth} className="space-y-4">
              <input type="text" placeholder="Nombre completo" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-sm outline-none focus:border-[#FF9100] focus:bg-white transition-all" onChange={e => setAuthForm({...authForm, name: e.target.value})} />
              <input type="email" placeholder="Correo electrónico" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-sm outline-none focus:border-[#FF9100] focus:bg-white transition-all" onChange={e => setAuthForm({...authForm, email: e.target.value})} />
              <input type="tel" placeholder="Teléfono" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-sm outline-none focus:border-[#FF9100] focus:bg-white transition-all" onChange={e => setAuthForm({...authForm, phone: e.target.value})} />
              <textarea placeholder="Dirección en Cotuí (Sector, Calle...)" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-bold text-sm outline-none focus:border-[#FF9100] focus:bg-white transition-all h-24 resize-none" onChange={e => setAuthForm({...authForm, address: e.target.value})} />
              <button type="submit" className="w-full bg-[#111] text-white py-4 rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-xl mt-2">Continuar</button>
            </form>
          </div>
        </div>
      )}

      {isTrackingOpen && currentOrder && <LiveTrackingMap order={currentOrder} onClose={() => setIsTrackingOpen(false)} />}

      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-50 px-6 py-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center max-w-sm mx-auto">
          <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-[#FF3D00]' : 'text-slate-400'}`}>
            <Home size={24} strokeWidth={view === 'home' ? 3 : 2} />
            <span className="text-[10px] font-black uppercase">Inicio</span>
          </button>
          <button onClick={() => setView('orders')} className={`flex flex-col items-center gap-1 ${view === 'orders' ? 'text-[#FF3D00]' : 'text-slate-400'}`}>
            <MapIcon size={24} strokeWidth={view === 'orders' ? 3 : 2} />
            <span className="text-[10px] font-black uppercase">Rutas</span>
          </button>
          <button onClick={() => user ? setView('profile') : setIsAuthOpen(true)} className={`flex flex-col items-center gap-1 ${view === 'profile' ? 'text-[#FF3D00]' : 'text-slate-400'}`}>
            <User size={24} strokeWidth={view === 'profile' ? 3 : 2} />
            <span className="text-[10px] font-black uppercase">Perfil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
