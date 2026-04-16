'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react';

// ==========================================
// ÍCONOS SVG
// ==========================================
const Svg = ({ children, size=24, className='', strokeWidth=2, ...props }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>{children}</svg>;
const Search = p => <Svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Svg>;
const Plus = p => <Svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
const Minus = p => <Svg {...p}><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
const Trash = p => <Svg {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Svg>;
const X = p => <Svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>;
const LayoutDashboard = p => <Svg {...p}><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></Svg>;
const Receipt = p => <Svg {...p}><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17V7"/></Svg>;
const ShoppingCart = p => <Svg {...p}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></Svg>;
const Scale = p => <Svg {...p}><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m3-4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/><circle cx="15" cy="11" r="2"/><path d="M15 9V3"/><path d="M15 13v6"/></Svg>;
const Loader = ({ className='', ...p }) => <Svg {...p} className={`animate-spin ${className}`}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></Svg>;
const Download = p => <Svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Svg>;
const Users = p => <Svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Svg>;
const History = p => <Svg {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Svg>;
const CheckCircle = p => <Svg {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></Svg>;
const AlertCircle = p => <Svg {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Svg>;

// --- CONFIGURACIÓN Y SEGURIDAD ---
const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "";
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || ""; 

export default function KolmaPOS() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeView, setActiveView] = useState('pos');
  
  // Datos y Estados
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [localSales, setLocalSales] = useState([]);
  
  // UI States
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [weightModal, setWeightModal] = useState({ isOpen: false, product: null, weight: '' });
  const [creditModal, setCreditModal] = useState(false);
  const [customerData, setCustomerData] = useState({ name: '', phone: '' });
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, type: null });
  const [successToast, setSuccessToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Security States
  const [authModal, setAuthModal] = useState({ isOpen: false, targetView: null, pinCode: '' });
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  const searchInputRef = useRef(null);

  // --- INICIALIZACIÓN ---
  useEffect(() => {
    const session = localStorage.getItem('kolma_pos_session');
    const savedSales = JSON.parse(localStorage.getItem('kolma_daily_sales') || '[]');
    
    if (session === 'active') setIsAuthenticated(true);
    setLocalSales(savedSales);
    setIsInitializing(false);
    fetchShopifyProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('kolma_daily_sales', JSON.stringify(localSales));
  }, [localSales]);

  const fetchShopifyProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch(`https://${DOMAIN}/api/2024-04/graphql.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN },
        body: JSON.stringify({ query: `{ products(first: 250) { edges { node { id title images(first: 1) { edges { node { url } } } variants(first: 1) { edges { node { id price { amount } barcode } } } } } } }`})
      });
      const { data } = await res.json();
      if (data?.products?.edges) {
        const shopifyProds = data.products.edges.map(p => ({
          id: p.node.id, name: p.node.title,
          price: parseFloat(p.node.variants.edges[0].node.price.amount),
          image: p.node.images.edges[0]?.node.url || null,
          variantId: p.node.variants.edges[0].node.id,
          barcode: p.node.variants.edges[0].node.barcode || ''
        }));
        setProducts(shopifyProds.filter(p => p.price > 0));
      }
    } catch (e) {
      console.error("Error catálogo", e);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // --- SEGURIDAD Y NAVEGACIÓN ---
  const handleAuthPinInput = (num) => {
    const newPin = authModal.pinCode + num;
    setAuthModal(prev => ({ ...prev, pinCode: newPin }));
    
    if (newPin === ADMIN_PIN) {
      setTimeout(() => { 
        if(!isAuthenticated) {
            localStorage.setItem('kolma_pos_session', 'active');
            setIsAuthenticated(true);
        } else {
            setIsAdminUnlocked(true);
            setActiveView(authModal.targetView);
        }
        setAuthModal({ isOpen: false, targetView: null, pinCode: '' });
      }, 200);
    } else if (newPin.length === 4) {
      setTimeout(() => setAuthModal(prev => ({ ...prev, pinCode: '' })), 400);
    }
  };

  const requestAdminAccess = (view) => {
    if (isAdminUnlocked) {
      setActiveView(view);
    } else {
      setAuthModal({ isOpen: true, targetView: view, pinCode: '' });
    }
  };

  // --- CARRITO ---
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const term = searchTerm.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(term) || p.barcode === term);
  }, [products, searchTerm]);

  const handleProductClick = (product) => {
    if (product.name.toLowerCase().includes('libra') || product.name.toLowerCase().includes('lobra')) {
      setWeightModal({ isOpen: true, product, weight: '' });
    } else {
      addToCart(product, 1, false);
    }
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm) {
      e.preventDefault();
      const exactMatch = products.find(p => p.barcode === searchTerm);
      if (exactMatch) return handleProductClick(exactMatch);
      if (filteredProducts.length === 1) return handleProductClick(filteredProducts[0]);
    }
  };

  const confirmWeight = () => {
    const w = parseFloat(weightModal.weight);
    if (w > 0) addToCart(weightModal.product, w, true);
    setWeightModal({ isOpen: false, product: null, weight: '' });
    searchInputRef.current?.focus();
  };

  const addToCart = (product, quantity, isWeighed) => {
    setCart(prev => {
      let newCart;
      if (isWeighed) {
        newCart = [...prev, { ...product, cartId: Date.now(), qty: quantity, isWeighed: true, finalPrice: product.price * quantity }];
      } else {
        const existing = prev.find(item => item.variantId === product.variantId && !item.isWeighed);
        if (existing) {
          newCart = prev.map(item => item.variantId === product.variantId && !item.isWeighed ? { ...item, qty: item.qty + quantity, finalPrice: item.price * (item.qty + quantity) } : item);
        } else {
          newCart = [...prev, { ...product, cartId: Date.now(), qty: quantity, isWeighed: false, finalPrice: product.price * quantity }];
        }
      }
      return newCart;
    });
  };

  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.variantId === id && !i.isWeighed ? { ...i, qty: i.qty + delta, finalPrice: i.price * (i.qty + delta) } : i).filter(i => i.qty > 0));
  const removeCartItem = (cartId) => setCart(prev => prev.filter(i => i.cartId !== cartId));
  const total = cart.reduce((acc, item) => acc + item.finalPrice, 0);

  // --- PROCESAR VENTA ---
  const triggerPaymentConfirmation = (type) => {
    if (type === 'credit' && (!customerData.name.trim() || !customerData.phone.trim())) {
      alert("Nombre y teléfono son obligatorios para crédito.");
      return;
    }
    setConfirmModal({ isOpen: true, type });
  };

  const ejecutarVenta = async () => {
    const type = confirmModal.type;
    setIsProcessing(true);

    const line_items = cart.map(item => ({
      title: item.isWeighed ? `${item.name} (${item.qty} lbs)` : item.name,
      price: item.isWeighed ? item.finalPrice.toString() : item.price.toString(),
      quantity: item.isWeighed ? 1 : item.qty,
      variant_id: item.variantId
    }));

    const orderPayload = {
      order: {
        line_items,
        financial_status: type === 'cash' ? "paid" : "pending",
        customer: type === 'credit' ? { first_name: customerData.name, phone: customerData.phone } : { first_name: "Venta", last_name: "Directa" },
        note: type === 'credit' ? `CRÉDITO - Tel: ${customerData.phone}` : "EFECTIVO",
        source_name: "Kolma POS"
      }
    };

    try {
      fetch('/api/shopify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'create_order', payload: orderPayload }) }).catch(e => console.log("Shopify Error:", e));

      const newSale = {
        id: Date.now(),
        type: type,
        customer: type === 'credit' ? customerData.name : 'Venta Directa',
        total: total,
        items: [...cart],
        date: new Date().toISOString(),
        status: 'completed'
      };
      
      setLocalSales(prev => [newSale, ...prev]);
      
      // Reset y Alerta de Éxito
      setCart([]);
      setCreditModal(false);
      setConfirmModal({ isOpen: false, type: null });
      setCustomerData({ name: '', phone: '' });
      setIsCartDrawerOpen(false);
      
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
      searchInputRef.current?.focus();
      
    } finally {
      setIsProcessing(false);
    }
  };

  // --- HISTORIAL Y ANULACIONES ---
  const anularVenta = (id) => {
    if(window.confirm("¿Estás seguro de anular esta venta? Esto la descontará de la caja.")) {
      setLocalSales(prev => prev.map(s => s.id === id ? { ...s, status: 'voided' } : s));
    }
  };

  // --- CIERRE DE CAJA ---
  const stats = useMemo(() => {
    let cash = 0, credit = 0;
    const validSales = localSales.filter(s => s.status === 'completed');
    validSales.forEach(s => { if (s.type === 'cash') cash += s.total; else credit += s.total; });
    return { cash, credit, total: cash + credit, count: validSales.length };
  }, [localSales]);

  const generarCierre = () => {
    const validSales = localSales.filter(s => s.status === 'completed');
    if (validSales.length === 0) return alert("No hay ventas válidas registradas hoy.");

    const prodMap = {};
    validSales.forEach(sale => {
      sale.items.forEach(item => {
        if (!prodMap[item.name]) prodMap[item.name] = { qty: 0, revenue: 0 };
        prodMap[item.name].qty += item.qty;
        prodMap[item.name].revenue += item.finalPrice;
      });
    });

    const sortedProducts = Object.entries(prodMap).sort((a, b) => b[1].qty - a[1].qty);

    let txt = `======================================\n`;
    txt += `       KOLMA RD - CIERRE DE CAJA      \n`;
    txt += `======================================\n`;
    txt += `Fecha: ${new Date().toLocaleString('es-DO')}\n\n`;
    txt += `--- RESUMEN FINANCIERO ---\n`;
    txt += `Transacciones: ${stats.count}\n`;
    txt += `Total Efectivo: RD$ ${stats.cash.toFixed(2)}\n`;
    txt += `Total Crédito:  RD$ ${stats.credit.toFixed(2)}\n`;
    txt += `TOTAL VENTAS:   RD$ ${stats.total.toFixed(2)}\n\n`;

    txt += `--- PRODUCTOS VENDIDOS (Mayor a Menor) ---\n`;
    txt += `CANT | PRODUCTO | TOTAL RD$\n`;
    txt += `--------------------------------------\n`;
    sortedProducts.forEach(([name, data]) => {
      txt += `${data.qty.toString().padEnd(4)} | ${name.substring(0, 20).padEnd(20)} | $${data.revenue.toFixed(2)}\n`;
    });
    
    txt += `\n--- DETALLE DE CRÉDITOS ---\n`;
    const credits = validSales.filter(s => s.type === 'credit');
    if(credits.length === 0) txt += "Sin créditos hoy.\n";
    credits.forEach(c => txt += `Cliente: ${c.customer} - Monto: RD$${c.total.toFixed(2)}\n`);

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Cierre_Kolma_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();

    localStorage.removeItem('kolma_daily_sales');
    localStorage.removeItem('kolma_pos_session');
    setLocalSales([]);
    setIsAuthenticated(false);
    setIsAdminUnlocked(false);
    setActiveView('pos');
  };

  // ==========================================
  // RENDER MODALES GLOBALES
  // ==========================================
  const renderAuthModal = () => {
    if (!authModal.isOpen && isAuthenticated) return null;
    const isLogin = !isAuthenticated;
    return (
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center font-sans text-slate-200">
        <div className="bg-[#1e293b] border border-slate-700 p-8 rounded-2xl shadow-2xl text-center w-[360px]">
          {isLogin ? (
            <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-2xl mx-auto mb-4">K</div>
          ) : (
            <div className="w-14 h-14 bg-slate-800 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4"><Lock size={28}/></div>
          )}
          <h2 className="text-xl font-bold text-white mb-1">{isLogin ? 'Kolma POS' : 'Bóveda de Seguridad'}</h2>
          <p className="text-slate-400 text-xs mb-6">{isLogin ? 'Inicia sesión para continuar' : 'Ingresa el PIN de administrador'}</p>
          
          <div className="flex justify-center gap-3 mb-8">
            {[0, 1, 2, 3].map(i => <div key={i} className={`w-3 h-3 rounded-full ${authModal.pinCode.length > i ? 'bg-blue-500' : 'bg-slate-600'}`} />)}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button key={num} onClick={() => handleAuthPinInput(num.toString())} className="h-14 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl active:scale-95">{num}</button>
            ))}
            {!isLogin && <button onClick={() => setAuthModal({isOpen: false, targetView: null, pinCode: ''})} className="col-start-1 h-14 rounded-xl flex items-center justify-center text-slate-400 hover:text-white active:scale-95"><X size={24}/></button>}
            <button onClick={() => handleAuthPinInput('0')} className={`${isLogin ? 'col-start-2' : ''} w-full h-14 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl active:scale-95`}>0</button>
            <button onClick={() => setAuthModal(prev => ({...prev, pinCode: prev.pinCode.slice(0, -1)}))} className="w-full h-14 rounded-xl flex items-center justify-center text-slate-400 hover:text-white active:scale-95"><Minus size={24}/></button>
          </div>
        </div>
      </div>
    );
  };

  if (isInitializing) return <div className="h-screen bg-slate-900 flex items-center justify-center"><Loader size={48} className="text-slate-400" /></div>;
  if (!isAuthenticated) return renderAuthModal();

  // ==========================================
  // RENDER INTERFAZ PRINCIPAL
  // ==========================================
  return (
    <div className="flex h-screen bg-[#0f172a] font-sans text-slate-200 overflow-hidden relative">
      
      {/* TOAST DE ÉXITO */}
      {successToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold animate-in slide-in-from-top-10">
          <CheckCircle size={20}/> Venta registrada exitosamente
        </div>
      )}

      {/* PIN MODAL (INTERNO) */}
      {renderAuthModal()}

      {/* MODALES SECUNDARIOS */}
      {weightModal.isOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#1e293b] border border-slate-700 p-8 rounded-2xl shadow-2xl w-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Pesaje en Libras</h3>
              <button onClick={() => { setWeightModal({ isOpen: false, product: null, weight: '' }); searchInputRef.current?.focus(); }} className="text-slate-400 hover:text-white"><X size={24}/></button>
            </div>
            <p className="text-slate-400 mb-2">{weightModal.product?.name}</p>
            <div className="bg-[#0f172a] border border-blue-500/50 rounded-xl p-4 flex items-center mb-6">
              <input type="number" step="0.01" autoFocus value={weightModal.weight} onChange={e => setWeightModal({...weightModal, weight: e.target.value})} onKeyDown={e => e.key === 'Enter' && confirmWeight()} placeholder="0.00" className="w-full bg-transparent text-right text-4xl font-black text-white outline-none"/>
              <span className="font-bold text-slate-500 ml-3">lbs</span>
            </div>
            <button onClick={confirmWeight} disabled={!weightModal.weight || weightModal.weight <= 0} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-500 disabled:opacity-50">Registrar Peso</button>
          </div>
        </div>
      )}

      {creditModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#1e293b] border border-slate-700 p-8 rounded-2xl shadow-2xl w-[400px]">
            <h3 className="text-xl font-bold text-white mb-2">Datos de Crédito</h3>
            <p className="text-sm text-slate-400 mb-6">Completa para continuar con el pago.</p>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Nombre del Cliente *</label>
                <input type="text" autoFocus value={customerData.name} onChange={e=>setCustomerData({...customerData, name: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500" placeholder="Ej. Juan Pérez"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Teléfono *</label>
                <input type="tel" value={customerData.phone} onChange={e=>setCustomerData({...customerData, phone: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500" placeholder="Ej. 809-555-5555"/>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setCreditModal(false)} className="flex-1 py-3 bg-slate-700 rounded-lg font-bold hover:bg-slate-600">Volver</button>
              <button onClick={() => { if(customerData.name && customerData.phone) triggerPaymentConfirmation('credit'); else alert('Llene los campos'); }} className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-500">Continuar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN DE PAGO */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#1e293b] border border-slate-700 p-8 rounded-2xl shadow-2xl w-[350px] text-center">
            <div className="w-16 h-16 bg-slate-800 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle size={32}/></div>
            <h3 className="text-xl font-bold text-white mb-2">Confirmar Pago</h3>
            <p className="text-slate-400 mb-6">Vas a procesar un cobro en <b className="text-white">{confirmModal.type === 'cash' ? 'Efectivo' : 'Crédito'}</b> por un total de <b className="text-white">RD${total.toFixed(2)}</b>.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal({isOpen: false, type: null})} disabled={isProcessing} className="flex-1 py-3 bg-slate-700 rounded-lg font-bold hover:bg-slate-600 disabled:opacity-50">Cancelar</button>
              <button onClick={ejecutarVenta} disabled={isProcessing} className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 flex items-center justify-center disabled:opacity-50">
                {isProcessing ? <Loader size={20}/> : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER DEL TICKET */}
      {isCartDrawerOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsCartDrawerOpen(false)}></div>}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[380px] bg-[#1e293b] border-l border-slate-700 z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${isCartDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-[70px] border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><ShoppingCart size={20}/> Ticket de Compra</h2>
          <button onClick={() => setIsCartDrawerOpen(false)} className="text-slate-400 hover:text-white p-2 bg-slate-800 rounded-full"><X size={18}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
          {cart.map(item => (
            <div key={item.cartId} className="bg-[#0f172a] border border-slate-700 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-xs text-slate-300 pr-2 line-clamp-2">{item.name}</h4>
                <button onClick={() => removeCartItem(item.cartId)} className="text-slate-500 hover:text-red-400"><X size={14}/></button>
              </div>
              <div className="flex items-center justify-between">
                {item.isWeighed ? <span className="text-xs font-bold text-blue-400">{item.qty} LBS</span> : (
                  <div className="flex items-center gap-2 bg-[#1e293b] rounded py-1 px-2 border border-slate-700">
                    <button onClick={() => updateQty(item.variantId, -1)} className="text-slate-400"><Minus size={12} /></button>
                    <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.variantId, 1)} className="text-slate-400"><Plus size={12}/></button>
                  </div>
                )}
                <span className="font-bold text-sm text-white">${item.finalPrice.toFixed(2)}</span>
              </div>
            </div>
          ))}
          {cart.length === 0 && <div className="text-center flex flex-col items-center text-slate-500 mt-20"><ShoppingCart size={40} className="mb-4 opacity-50"/><span className="text-sm font-bold">Carrito vacío</span></div>}
        </div>

        <div className="p-6 bg-[#1e293b] border-t border-slate-800">
          <div className="flex justify-between items-end mb-4">
            <span className="text-slate-400 text-sm font-bold">Total a Cobrar</span>
            <span className="text-3xl font-black text-white">RD$ {total.toFixed(0)}</span>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => triggerPaymentConfirmation('cash')} disabled={cart.length === 0} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50">
               Cobrar Efectivo
            </button>
            <button onClick={() => setCreditModal(true)} disabled={cart.length === 0} className="w-full py-3 bg-transparent border border-slate-600 hover:border-amber-500 hover:text-amber-500 text-slate-300 rounded-xl font-bold text-sm flex justify-center items-center gap-2 disabled:opacity-50 transition-colors">
              <Users size={16}/> Vender a Crédito
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ LATERAL IZQUIERDO */}
      <div className="w-[80px] bg-[#1e293b] border-r border-slate-800 flex flex-col items-center py-6 z-20 shrink-0 hidden md:flex">
        <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-xl mb-8">K</div>
        <div className="flex flex-col gap-6 w-full">
          <button onClick={() => setActiveView('pos')} className={`flex flex-col items-center gap-1 ${activeView === 'pos' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}><LayoutDashboard size={24} /><span className="text-[10px] font-bold">Caja</span></button>
          <button onClick={() => requestAdminAccess('history')} className={`flex flex-col items-center gap-1 ${activeView === 'history' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}><History size={24} /><span className="text-[10px] font-bold">Ventas</span></button>
          <button onClick={() => requestAdminAccess('cierre')} className={`flex flex-col items-center gap-1 ${activeView === 'cierre' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'}`}><Receipt size={24} /><span className="text-[10px] font-bold">Cierre</span></button>
        </div>
      </div>

      {/* ÁREA CENTRAL */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* HEADER */}
        <div className="h-[70px] border-b border-slate-800 flex items-center justify-between px-4 md:px-6 bg-[#0f172a] shrink-0">
          <div className="relative w-full max-w-[250px] md:max-w-md">
            {activeView === 'pos' && (
              <>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input ref={searchInputRef} type="text" placeholder="Buscar producto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={handleSearchKeyDown} className="w-full bg-[#1e293b] border border-slate-700 focus:border-blue-500 rounded-lg py-2 pl-10 pr-4 text-white outline-none text-sm transition-colors"/>
              </>
            )}
            {activeView === 'history' && <h2 className="text-xl font-bold">Historial de Ventas</h2>}
            {activeView === 'cierre' && <h2 className="text-xl font-bold">Cierre de Caja</h2>}
          </div>
          
          <div className="flex items-center gap-4 hidden sm:flex">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Total en Caja</p>
              <p className="font-black text-lg text-emerald-400 leading-none">RD$ {stats.total.toFixed(0)}</p>
            </div>
            {isAdminUnlocked && <button onClick={() => setIsAdminUnlocked(false)} className="ml-4 text-slate-500 hover:text-amber-500 flex items-center gap-1 text-xs font-bold"><Lock size={14}/> Bloquear Admin</button>}
          </div>
        </div>

        {/* VISTAS */}
        {activeView === 'pos' && (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar pb-[100px]">
            {isLoadingProducts ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500"><Loader size={40} /><p className="mt-4 font-bold">Cargando Shopify...</p></div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 md:gap-4">
                {filteredProducts.map(p => {
                  const isWeighed = p.name.toLowerCase().includes('libra') || p.name.toLowerCase().includes('lobra');
                  return (
                    <div key={p.id} onClick={() => handleProductClick(p)} className="bg-[#1e293b] rounded-xl overflow-hidden border border-slate-700/60 hover:border-blue-500 cursor-pointer flex flex-col group transition-all active:scale-95 shadow-sm">
                      <div className="aspect-square bg-[#0f172a] relative overflow-hidden">
                        {p.image ? <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy"/> : <span className="absolute inset-0 flex items-center justify-center text-slate-600 font-bold text-xs">Sin Foto</span>}
                        {isWeighed && <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-0.5 rounded text-[9px] font-bold tracking-wider">PESO</div>}
                      </div>
                      <div className="p-3 md:p-4 flex flex-col flex-1 bg-[#1e293b]">
                        <h3 className="font-semibold text-xs text-slate-300 leading-tight mb-2 line-clamp-2">{p.name}</h3>
                        <p className="font-black text-sm text-white mt-auto">RD${p.price.toFixed(0)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* BARRA FLOTANTE DE PAGO (Solo en POS) */}
        {activeView === 'pos' && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#1e293b] border-t border-slate-700 p-4 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.5)] md:pb-4 pb-20">
            <div className="flex flex-col">
               <span className="text-xs font-bold text-slate-400 uppercase">{cart.length} Artículos en Ticket</span>
               <span className="text-2xl font-black text-white">RD$ {total.toFixed(0)}</span>
            </div>
            <button onClick={() => setIsCartDrawerOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all">
               Ir a Pago <ShoppingCart size={20}/>
            </button>
          </div>
        )}

        {activeView === 'history' && (
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-4 pb-20">
              {localSales.length === 0 ? (
                 <div className="text-center flex flex-col items-center text-slate-500 mt-20"><History size={48} className="mb-4 opacity-50"/><p className="text-lg font-bold">No hay ventas registradas hoy</p></div>
              ) : (
                localSales.map(sale => (
                  <div key={sale.id} className={`bg-[#1e293b] border rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors ${sale.status === 'voided' ? 'border-red-900/50 opacity-50' : 'border-slate-700'}`}>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${sale.type === 'cash' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-amber-900/50 text-amber-400'}`}>{sale.type === 'cash' ? 'Efectivo' : 'Crédito'}</span>
                        {sale.status === 'voided' && <span className="px-2 py-1 rounded bg-red-900/50 text-red-400 text-[10px] font-black uppercase">Anulada</span>}
                        <span className="text-xs text-slate-400">{new Date(sale.date).toLocaleTimeString('es-DO')}</span>
                      </div>
                      <p className="font-bold text-white text-sm">{sale.customer} • {sale.items.length} artículos</p>
                    </div>
                    <div className="flex items-center gap-6 justify-between sm:justify-end">
                      <p className={`font-black text-xl ${sale.status === 'voided' ? 'text-slate-500 line-through' : 'text-white'}`}>RD${sale.total.toFixed(2)}</p>
                      {sale.status !== 'voided' && (
                        <button onClick={() => anularVenta(sale.id)} className="text-xs font-bold text-red-400 hover:text-red-300 border border-red-900/50 px-3 py-2 rounded-lg bg-red-900/20 transition-colors">
                          Anular
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeView === 'cierre' && (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center pb-20">
            <div className="bg-[#1e293b] border border-slate-700 p-6 md:p-8 rounded-2xl w-full max-w-2xl mt-4">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-700">
                <h2 className="text-xl md:text-2xl font-bold text-white">Resumen del Día</h2>
                <span className="text-slate-400 text-sm">{new Date().toLocaleDateString('es-DO')}</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-800">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Efectivo Recibido</p>
                  <p className="text-3xl font-black text-emerald-400">RD${stats.cash.toFixed(2)}</p>
                </div>
                <div className="bg-[#0f172a] p-6 rounded-xl border border-slate-800">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Créditos Otorgados</p>
                  <p className="text-3xl font-black text-amber-500">RD${stats.credit.toFixed(2)}</p>
                </div>
              </div>

              <button onClick={generarCierre} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                <Download size={20}/> Cerrar Turno y Descargar Reporte
              </button>
            </div>
          </div>
        )}
      </div>

      {/* NAVEGACIÓN MÓVIL INFERIOR */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#1e293b] border-t border-slate-800 flex justify-around p-3 z-[10] pb-safe">
        <button onClick={() => setActiveView('pos')} className={`flex flex-col items-center gap-1 ${activeView === 'pos' ? 'text-blue-500' : 'text-slate-500'}`}><LayoutDashboard size={24} /><span className="text-[10px] font-bold">Caja</span></button>
        <button onClick={() => requestAdminAccess('history')} className={`flex flex-col items-center gap-1 ${activeView === 'history' ? 'text-blue-500' : 'text-slate-500'}`}><History size={24} /><span className="text-[10px] font-bold">Ventas</span></button>
        <button onClick={() => requestAdminAccess('cierre')} className={`flex flex-col items-center gap-1 ${activeView === 'cierre' ? 'text-blue-500' : 'text-slate-500'}`}><Receipt size={24} /><span className="text-[10px] font-bold">Cierre</span></button>
      </nav>

    </div>
  );
}
