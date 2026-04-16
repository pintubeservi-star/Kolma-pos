'use client'
import React, { useState, useEffect, useMemo } from 'react';

// ==========================================
// ÍCONOS SVG NATIVOS (0 dependencias)
// ==========================================
const Svg = ({ children, size=24, className='', strokeWidth=2, fill="none", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>{children}</svg>
);
const Search = p => <Svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Svg>;
const Plus = p => <Svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
const Minus = p => <Svg {...p}><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
const Trash = p => <Svg {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Svg>;
const CheckCircle = p => <Svg {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></Svg>;
const X = p => <Svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>;
const Lock = p => <Svg {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Svg>;
const LayoutDashboard = p => <Svg {...p}><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></Svg>;
const Receipt = p => <Svg {...p}><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17V7"/></Svg>;
const LogOut = p => <Svg {...p}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Svg>;
const Scale = p => <Svg {...p}><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m3-4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/><circle cx="15" cy="11" r="2"/><path d="M15 9V3"/><path d="M15 13v6"/></Svg>;
const ServerCrash = p => <Svg {...p}><path d="M6 4H18A2 2 0 0 1 20 6V10A2 2 0 0 1 18 12H6A2 2 0 0 1 4 10V6A2 2 0 0 1 6 4z"/><path d="M6 14H18A2 2 0 0 1 20 16V20A2 2 0 0 1 18 22H6A2 2 0 0 1 4 20V16A2 2 0 0 1 6 14z"/><path d="M12 22V12"/><path d="M8 8H8.01"/><path d="M8 18H8.01"/></Svg>;
const Loader = p => <Svg {...p} className={`animate-spin ${className}`}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></Svg>;
const ShoppingCart = p => <Svg {...p}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></Svg>;

// --- CREDENCIALES EXACTAS ---
const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "q0q09e-cp.myshopify.com";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || "c9bda45020488455d7fe2d8b7e22f352";

export default function KolmaPOS() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [activeView, setActiveView] = useState('pos');
  
  // --- ESTADOS DEL POS (100% REALES) ---
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  
  // Responsive: Controlar panel lateral en móviles
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [weightModal, setWeightModal] = useState({ isOpen: false, product: null, weight: '' });
  const [dailySales, setDailySales] = useState(0);
  const [dailyTransactions, setDailyTransactions] = useState(0);

  // --- 1. CONEXIÓN EXCLUSIVA A SHOPIFY ---
  const fetchShopifyProducts = async () => {
    setIsLoadingProducts(true);
    setFetchError(null);
    try {
      const res = await fetch(`https://${DOMAIN}/api/2024-04/graphql.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN },
        body: JSON.stringify({ query: `{ products(first: 250) { edges { node { id title images(first: 1) { edges { node { url } } } variants(first: 1) { edges { node { id price { amount } barcode } } } } } } }`})
      });
      
      const { data, errors } = await res.json();
      if (errors) throw new Error("Error en la consulta de Shopify");
      
      if (data?.products?.edges?.length > 0) {
        const shopifyProds = data.products.edges.map(p => ({
          id: p.node.id, 
          name: p.node.title, 
          price: parseFloat(p.node.variants.edges[0].node.price.amount),
          image: p.node.images.edges[0]?.node.url || 'https://via.placeholder.com/300?text=Kolma',
          variantId: p.node.variants.edges[0].node.id,
          barcode: p.node.variants.edges[0].node.barcode || ''
        }));
        setProducts(shopifyProds);
      } else {
        setProducts([]); // NO MÁS SIMULACIONES. Si no hay, es un array vacío.
      }
    } catch (e) {
      console.error("Error conectando a Shopify:", e);
      setFetchError("No se pudo conectar con Shopify. Verifica tu internet o el token.");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => { fetchShopifyProducts(); }, []);

  // --- 2. LÓGICA PIN (1221) ---
  const handlePinInput = (num) => {
    if (pinCode.length < 4) {
      const newPin = pinCode + num;
      setPinCode(newPin);
      if (newPin === '1221') setTimeout(() => { setIsAuthenticated(true); setPinCode(''); }, 200);
      else if (newPin.length === 4) setTimeout(() => setPinCode(''), 400);
    }
  };

  const handleLogout = () => { setIsAuthenticated(false); setActiveView('pos'); setCart([]); setIsMobileCartOpen(false); };

  // --- 3. LÓGICA DE CARRITO Y BÁSCULA ---
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const term = searchTerm.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(term) || p.barcode === term);
  }, [products, searchTerm]);

  const handleProductClick = (product) => {
    const isWeighedItem = product.name.toLowerCase().includes('libra') || product.name.toLowerCase().includes('lobra');
    if (isWeighedItem) setWeightModal({ isOpen: true, product, weight: '' });
    else addToCart(product, 1, false);
    setSearchTerm('');
  };

  const confirmWeight = () => {
    const w = parseFloat(weightModal.weight);
    if (w > 0) {
      addToCart(weightModal.product, w, true);
      setWeightModal({ isOpen: false, product: null, weight: '' });
    }
  };

  const addToCart = (product, quantity, isWeighed) => {
    setCart(prev => {
      if (isWeighed) return [...prev, { ...product, cartId: Date.now(), qty: quantity, isWeighed: true, finalPrice: product.price * quantity }];
      const existing = prev.find(item => item.variantId === product.variantId && !item.isWeighed);
      if (existing) return prev.map(item => item.variantId === product.variantId && !item.isWeighed ? { ...item, qty: item.qty + quantity, finalPrice: item.price * (item.qty + quantity) } : item);
      return [...prev, { ...product, cartId: Date.now(), qty: quantity, isWeighed: false, finalPrice: product.price * quantity }];
    });
  };

  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.variantId === id && !i.isWeighed ? { ...i, qty: i.qty + delta, finalPrice: i.price * (i.qty + delta) } : i).filter(i => i.qty > 0));
  const removeCartItem = (cartId) => setCart(prev => prev.filter(i => i.cartId !== cartId));
  const clearCart = () => setCart([]);
  const total = cart.reduce((acc, item) => acc + item.finalPrice, 0);

  // --- 4. INTEGRACIÓN SHOPIFY ESTRICTA ---
  const procesarVenta = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    const line_items = cart.map(item => ({
      title: item.isWeighed ? `${item.name} (${item.qty} lbs)` : item.name,
      price: item.isWeighed ? item.finalPrice.toString() : item.price.toString(),
      quantity: item.isWeighed ? 1 : item.qty
    }));

    const orderData = {
      order: {
        line_items,
        financial_status: "paid", // Siempre pagado
        customer: { first_name: "Ventas", last_name: "Directa" }, // Único cliente
        source_name: "Kolma POS"
      }
    };

    try {
      const res = await fetch(`https://${DOMAIN}/admin/api/2024-04/orders.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': ACCESS_TOKEN },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        setDailySales(prev => prev + total);
        setDailyTransactions(prev => prev + 1);
        setSuccessMsg(true);
        setTimeout(() => {
          setSuccessMsg(false);
          clearCart();
          setIsMobileCartOpen(false); // Cierra modal en celular
        }, 2000);
      } else {
        alert("Error Shopify. Revisa si el Token tiene permisos de 'Escribir Órdenes'.");
      }
    } catch (e) {
      alert("Error crítico de red.");
    } finally { setIsProcessing(false); }
  };

  const cerrarTurno = () => {
    if (window.confirm('¿Cerrar el turno de hoy? Las métricas volverán a cero.')) {
      setDailySales(0); setDailyTransactions(0); handleLogout();
    }
  };

  // ==========================================
  // PANTALLA PIN RESPONSIVA
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[100dvh] bg-slate-900 items-center justify-center font-sans p-4">
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-8 md:p-12 rounded-[48px] shadow-2xl text-center w-full max-w-[400px]">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF3D00] to-[#FF9100] text-white rounded-[24px] flex items-center justify-center font-black text-4xl mx-auto mb-6">K</div>
          <h2 className="text-white text-3xl font-black tracking-tighter mb-2">Kolma POS</h2>
          <p className="text-slate-400 font-bold mb-8">Ingresa PIN (1221)</p>
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map(i => <div key={i} className={`w-4 h-4 rounded-full transition-all ${pinCode.length > i ? 'bg-[#FF3D00] scale-110 shadow-[0_0_15px_rgba(255,61,0,0.5)]' : 'bg-white/20'}`} />)}
          </div>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button key={num} onClick={() => handlePinInput(num.toString())} className="h-16 rounded-[20px] bg-white/5 hover:bg-white/20 text-white font-black text-2xl active:scale-95 border border-white/5">{num}</button>
            ))}
            <div className="col-start-2"><button onClick={() => handlePinInput('0')} className="w-full h-16 rounded-[20px] bg-white/5 hover:bg-white/20 text-white font-black text-2xl active:scale-95 border border-white/5">0</button></div>
            <div className="col-start-3"><button onClick={() => setPinCode(pinCode.slice(0, -1))} className="w-full h-16 rounded-[20px] flex items-center justify-center text-slate-400 hover:text-red-400 active:scale-95"><X size={28} strokeWidth={3}/></button></div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // POS PRINCIPAL (RESPONSIVO)
  // ==========================================
  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-[#F8FAFC] font-sans text-slate-900 selection:bg-orange-200">
      
      {/* MODAL BÁSCULA RESPONSIVO */}
      {weightModal.isOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 md:p-8 rounded-[40px] shadow-2xl w-full max-w-[400px] animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <div className="w-14 h-14 bg-orange-50 text-[#FF3D00] rounded-[20px] flex items-center justify-center"><Scale size={28} /></div>
              <button onClick={() => setWeightModal({ isOpen: false, product: null, weight: '' })} className="p-2 bg-slate-100 rounded-full"><X size={20} /></button>
            </div>
            <h3 className="text-2xl font-black tracking-tighter mb-2">{weightModal.product?.name}</h3>
            <p className="text-slate-500 font-bold mb-6">Precio base: RD${weightModal.product?.price} / lb</p>
            <div className="bg-slate-50 border-2 border-slate-200 rounded-[24px] p-2 flex items-center mb-8 focus-within:border-[#FF3D00] focus-within:bg-white">
              <input type="number" step="0.01" autoFocus value={weightModal.weight} onChange={e => setWeightModal({...weightModal, weight: e.target.value})} onKeyDown={e => e.key === 'Enter' && confirmWeight()} placeholder="0.00" className="w-full bg-transparent text-right text-4xl font-black outline-none px-4"/>
              <span className="font-black text-xl text-slate-400 pr-4">lbs</span>
            </div>
            <button onClick={confirmWeight} disabled={!weightModal.weight || weightModal.weight <= 0} className="w-full bg-[#111] text-white py-5 rounded-[20px] font-black text-xl hover:bg-[#FF3D00] transition-colors disabled:opacity-50">Registrar Peso</button>
          </div>
        </div>
      )}

      {/* NAVEGACIÓN (Lateral PC, Inferior Móvil) */}
      <div className="hidden md:flex w-[100px] bg-white border-r border-slate-200 flex-col items-center py-8 z-20">
        <div className="w-14 h-14 bg-gradient-to-br from-[#FF3D00] to-[#FF9100] text-white rounded-[20px] flex items-center justify-center font-black text-2xl shadow-xl shadow-orange-200 mb-8">K</div>
        <div className="flex-1 flex flex-col gap-6 w-full px-4">
          <button onClick={() => setActiveView('pos')} className={`w-full aspect-square flex flex-col items-center justify-center gap-2 rounded-[24px] ${activeView === 'pos' ? 'bg-[#111] text-white' : 'text-slate-400 hover:bg-slate-100'}`}><LayoutDashboard size={24} /><span className="text-[10px] font-black uppercase">POS</span></button>
          <button onClick={() => setActiveView('cierre')} className={`w-full aspect-square flex flex-col items-center justify-center gap-2 rounded-[24px] ${activeView === 'cierre' ? 'bg-[#111] text-white' : 'text-slate-400 hover:bg-slate-100'}`}><Receipt size={24} /><span className="text-[10px] font-black uppercase">Cierre</span></button>
        </div>
        <button onClick={handleLogout} className="w-14 h-14 rounded-[20px] flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 mt-auto"><LogOut size={24}/></button>
      </div>

      {/* ÁREA CENTRAL */}
      <div className="flex-1 flex flex-col min-w-0 pb-[70px] md:pb-0">
        
        {/* Header */}
        <div className="h-[80px] md:h-[90px] bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="relative w-full max-w-[200px] sm:max-w-md">
            {activeView === 'pos' && (
              <>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF3D00]" size={18} />
                <input type="text" placeholder="Buscar producto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-200 focus:bg-white rounded-[20px] py-3 pl-12 pr-4 font-bold outline-none text-sm md:text-base"/>
              </>
            )}
          </div>
          <div className="flex items-center gap-4 md:gap-8 ml-2">
            <div className="text-right border-r border-slate-200 pr-4 md:pr-8 hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Ventas del Día</p>
              <p className="font-black text-xl md:text-2xl text-[#111] leading-none">RD$ {dailySales.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500"><Lock size={18} /></div>
              <div className="hidden sm:block">
                <p className="font-black text-sm">Caja 01</p>
                <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">En Línea</p>
              </div>
            </div>
          </div>
        </div>

        {/* Listado Productos / Cierre */}
        {activeView === 'pos' ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 no-scrollbar">
            {isLoadingProducts ? (
              <div className="h-full flex flex-col items-center justify-center text-[#FF3D00]"><Loader size={48} /><p className="mt-4 font-black">Conectando a Shopify...</p></div>
            ) : fetchError ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center"><ServerCrash size={64} className="text-red-400 mb-4" /><p className="font-black text-xl mb-2">Error de conexión</p><p className="font-bold mb-4 text-sm px-4">{fetchError}</p><button onClick={fetchShopifyProducts} className="bg-[#111] text-white px-6 py-3 rounded-2xl font-black">Reintentar</button></div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-5 pb-20 md:pb-0">
                {filteredProducts.map(p => {
                  const isWeighed = p.name.toLowerCase().includes('libra') || p.name.toLowerCase().includes('lobra');
                  return (
                    <div key={p.id} onClick={() => handleProductClick(p)} className="bg-white rounded-[24px] p-3 md:p-4 border border-slate-100 shadow-sm active:scale-95 flex flex-col cursor-pointer">
                      <div className="aspect-square bg-slate-50 rounded-[16px] md:rounded-[24px] mb-3 md:mb-4 overflow-hidden relative border border-slate-50">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply" loading="lazy"/>
                        {isWeighed && <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded-[8px] text-[9px] font-black text-[#FF3D00] flex items-center gap-1 border border-red-50"><Scale size={10} strokeWidth={3}/> PESO</div>}
                      </div>
                      <h3 className="font-bold text-xs md:text-sm leading-tight mb-2 text-slate-800 line-clamp-2">{p.name}</h3>
                      <p className="font-black text-lg md:text-xl text-[#FF3D00] mt-auto">RD${p.price.toFixed(0)}</p>
                    </div>
                  )
                })}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-10 text-center text-slate-400 bg-white rounded-[24px] border border-dashed border-slate-200">
                    <p className="font-black text-lg text-slate-800">Producto no encontrado</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center bg-slate-50">
            <div className="bg-white p-6 md:p-12 rounded-[32px] shadow-xl w-full max-w-lg text-center">
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><Receipt size={40} /></div>
              <h2 className="text-3xl md:text-4xl font-black mb-2">Corte de Caja</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 mt-8">
                <div className="bg-slate-50 p-6 rounded-[24px]"><p className="text-xs font-black uppercase text-slate-400 mb-1">Ventas</p><p className="text-4xl font-black">{dailyTransactions}</p></div>
                <div className="bg-orange-50 p-6 rounded-[24px]"><p className="text-xs font-black uppercase text-[#FF3D00] mb-1">Total</p><p className="text-3xl font-black text-[#FF3D00]">RD${dailySales.toFixed(0)}</p></div>
              </div>
              <button onClick={cerrarTurno} className="w-full bg-[#111] text-white py-5 rounded-[20px] font-black text-xl active:scale-95">Confirmar Cierre</button>
            </div>
          </div>
        )}
      </div>

      {/* --- PANEL DE COBRO (CHECKOUT) --- */}
      {/* Desktop: Siempre visible a la derecha si hay items. Móvil: Modal o Fullscreen según isMobileCartOpen */}
      {(cart.length > 0 && activeView === 'pos') && (
        <>
          {/* Botón Flotante Móvil (Solo visible en pantallas pequeñas) */}
          <button onClick={() => setIsMobileCartOpen(true)} className="md:hidden fixed bottom-24 right-4 bg-[#FF3D00] text-white w-16 h-16 rounded-[20px] shadow-2xl flex items-center justify-center active:scale-95 z-40 border-2 border-white">
            <ShoppingCart size={28} />
            <span className="absolute -top-2 -right-2 bg-[#111] text-white w-6 h-6 rounded-full text-xs font-black flex items-center justify-center border-2 border-white">{cart.length}</span>
          </button>

          {/* Panel Lateral Desktop / Modal Móvil */}
          <div className={`fixed inset-0 z-50 md:static md:w-[450px] bg-white flex flex-col md:border-l border-slate-200 transition-transform duration-300 md:translate-y-0 ${isMobileCartOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}`}>
            <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <span className="text-[10px] font-black uppercase text-[#FF9100] bg-orange-100 px-3 py-1 rounded-xl mb-2 inline-block">Checkout</span>
                <h2 className="text-2xl md:text-3xl font-black text-[#111]">Ticket</h2>
              </div>
              <div className="flex gap-2">
                <button onClick={clearCart} className="text-red-500 bg-white shadow-sm p-3 rounded-xl"><Trash size={18} /></button>
                <button onClick={() => setIsMobileCartOpen(false)} className="md:hidden bg-slate-200 text-slate-600 p-3 rounded-xl"><X size={18}/></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 no-scrollbar">
              {cart.map(item => (
                <div key={item.cartId} className="bg-white border border-slate-100 rounded-[20px] p-4 flex flex-col gap-2 shadow-sm">
                  <div className="flex items-start justify-between">
                    <h4 className="font-bold text-sm text-slate-800 pr-2">{item.name}</h4>
                    <p className="font-black text-[#FF3D00]">RD${item.price.toFixed(0)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    {item.isWeighed ? (
                       <span className="bg-orange-50 text-[#FF3D00] px-2 py-1 rounded-[8px] text-[10px] font-black border border-orange-100">{item.qty} LBS</span>
                    ) : (
                      <div className="flex items-center bg-slate-50 rounded-[12px] p-1 border border-slate-200">
                        <button onClick={() => updateQty(item.variantId, -1)} className="w-8 h-8 flex items-center justify-center text-slate-600 rounded-lg">{item.qty === 1 ? <Trash size={14} className="text-red-500" /> : <Minus size={14} />}</button>
                        <span className="w-6 text-center font-black text-sm">{item.qty}</span>
                        <button onClick={() => updateQty(item.variantId, 1)} className="w-8 h-8 flex items-center justify-center bg-[#111] text-white rounded-lg"><Plus size={14}/></button>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="font-black text-lg text-[#111]">${item.finalPrice.toFixed(0)}</span>
                      <button onClick={() => removeCartItem(item.cartId)} className="text-slate-400 p-1"><X size={16}/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 md:p-8 bg-white border-t border-slate-100 pb-10 md:pb-8">
              <div className="flex justify-between items-end mb-6">
                <span className="font-black text-slate-800 uppercase text-sm">Total a Cobrar</span>
                <span className="text-4xl md:text-5xl font-black text-[#111]">RD$ {total.toFixed(0)}</span>
              </div>
              {successMsg ? (
                <div className="w-full bg-green-500 text-white py-5 rounded-[20px] font-black text-xl flex justify-center gap-2"><CheckCircle size={28}/> ¡Pagado!</div>
              ) : (
                <button onClick={procesarVenta} disabled={isProcessing} className="w-full py-5 md:py-6 rounded-[20px] font-black text-xl md:text-2xl flex justify-center items-center gap-2 bg-[#FF3D00] text-white active:scale-95 shadow-lg shadow-orange-200">
                  {isProcessing ? <Loader size={24} className="text-white"/> : 'Cobrar Exacto'}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Navegación Móvil (App Style) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 flex justify-around p-3 pb-safe z-30">
        <button onClick={() => setActiveView('pos')} className={`flex flex-col items-center gap-1 ${activeView === 'pos' ? 'text-[#FF3D00]' : 'text-slate-400'}`}><LayoutDashboard size={24} /><span className="text-[10px] font-black">POS</span></button>
        <button onClick={() => setActiveView('cierre')} className={`flex flex-col items-center gap-1 ${activeView === 'cierre' ? 'text-[#FF3D00]' : 'text-slate-400'}`}><Receipt size={24} /><span className="text-[10px] font-black">Cierre</span></button>
        <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-slate-400"><LogOut size={24} /><span className="text-[10px] font-black">Salir</span></button>
      </nav>
      
    </div>
  );
}
