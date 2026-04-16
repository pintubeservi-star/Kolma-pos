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

// --- CONFIGURACIÓN DE ENTORNO ---
const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "q0q09e-cp.myshopify.com";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || "c9bda45020488455d7fe2d8b7e22f352";

export default function KolmaPOS() {
  // --- ESTADOS DE SEGURIDAD Y VISTAS ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [activeView, setActiveView] = useState('pos'); // 'pos' o 'cierre'

  // --- ESTADOS DEL POS ---
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // --- ESTADOS DE BÁSCULA ---
  const [weightModal, setWeightModal] = useState({ isOpen: false, product: null, weight: '' });

  // --- ESTADOS DE CIERRE DE CAJA ---
  const [dailySales, setDailySales] = useState(0);
  const [dailyTransactions, setDailyTransactions] = useState(0);

  // --- 1. CARGAR CATÁLOGO DE SHOPIFY ---
  useEffect(() => {
    const fetchShopifyProducts = async () => {
      try {
        const res = await fetch(`https://${DOMAIN}/api/2024-04/graphql.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN },
          body: JSON.stringify({ query: `{ products(first: 50) { edges { node { id title images(first: 1) { edges { node { url } } } variants(first: 1) { edges { node { id price { amount } } } } } } } }`})
        });
        const { data } = await res.json();
        if (data?.products) {
          const shopifyProds = data.products.edges.map(p => ({
            id: p.node.id, 
            name: p.node.title, 
            price: parseFloat(p.node.variants.edges[0].node.price.amount),
            image: p.node.images.edges[0]?.node.url, 
            variantId: p.node.variants.edges[0].node.id
          }));
          setProducts(shopifyProds);
          return;
        }
      } catch (e) { console.log("Usando catálogo de respaldo..."); }
      
      // Catálogo por defecto incluyendo productos por "libra" para la báscula
      setProducts([
        { id: '1', name: 'Pollo Fresco (Libra)', price: 85.0, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300', variantId: 'v1' },
        { id: '2', name: 'Queso Cheddar Libra', price: 290.0, image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=300', variantId: 'v2' },
        { id: '3', name: 'Leche Rica Entera 1L', price: 78.0, image: 'https://images.unsplash.com/photo-1563636619-e9107da5a1bb?w=300', variantId: 'v3' },
        { id: '4', name: 'Aguacate Hass', price: 45.0, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300', variantId: 'v4' },
        { id: '5', name: 'Arroz Selecto 5lb', price: 160.0, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300', variantId: 'v5' },
        { id: '6', name: 'Salami Super Especial Libra', price: 180.0, image: 'https://images.unsplash.com/photo-1585238332058-471a5c602330?w=300', variantId: 'v6' },
      ]);
    };
    fetchShopifyProducts();
  }, []);

  // --- 2. LÓGICA DE LOGIN (PIN: 1221) ---
  const handlePinInput = (num) => {
    if (pinCode.length < 4) {
      const newPin = pinCode + num;
      setPinCode(newPin);
      if (newPin === '1221') {
        setTimeout(() => { setIsAuthenticated(true); setPinCode(''); }, 200);
      } else if (newPin.length === 4) {
        setTimeout(() => setPinCode(''), 400); // Error, resetear
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView('pos');
    setCart([]);
  };

  // --- 3. LÓGICA DE CAJA Y BÁSCULA ---
  const filteredProducts = useMemo(() => 
    products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())), 
  [products, searchTerm]);

  const handleProductClick = (product) => {
    const isWeighedItem = product.name.toLowerCase().includes('libra') || product.name.toLowerCase().includes('lobra');
    if (isWeighedItem) {
      setWeightModal({ isOpen: true, product, weight: '' });
    } else {
      addToCart(product, 1, false);
    }
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
      if (isWeighed) {
        // Los productos por libra se agregan como líneas separadas para mantener precisión
        return [...prev, { ...product, cartId: Date.now(), qty: quantity, isWeighed: true, finalPrice: product.price * quantity }];
      } else {
        const existing = prev.find(item => item.variantId === product.variantId && !item.isWeighed);
        if (existing) return prev.map(item => item.variantId === product.variantId && !item.isWeighed ? { ...item, qty: item.qty + quantity, finalPrice: item.price * (item.qty + quantity) } : item);
        return [...prev, { ...product, cartId: Date.now(), qty: quantity, isWeighed: false, finalPrice: product.price * quantity }];
      }
    });
  };

  const removeCartItem = (cartId) => {
    setCart(prev => prev.filter(i => i.cartId !== cartId));
  };

  const clearCart = () => setCart([]);
  const total = cart.reduce((acc, item) => acc + item.finalPrice, 0);

  // --- 4. INTEGRACIÓN SHOPIFY (VENTAS DIRECTA) ---
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
        line_items: line_items,
        financial_status: "paid",
        customer: { first_name: "Ventas", last_name: "Directa" },
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
        clearCart();
        setTimeout(() => setSuccessMsg(false), 3000);
      } else {
        console.error("Error Shopify:", await res.text());
        alert("Error de Shopify. Revisa la consola.");
      }
    } catch (e) {
      console.error("Error de red:", e);
      alert("Error de red al procesar la venta.");
    } finally {
      setIsProcessing(false);
    }
  };

  const cerrarTurno = () => {
    if (window.confirm('¿Estás seguro de cerrar el turno de hoy? Esto pondrá las ventas a cero y bloqueará el sistema.')) {
      setDailySales(0);
      setDailyTransactions(0);
      handleLogout();
    }
  };

  // ==========================================
  // RENDER: PANTALLA DE BLOQUEO (PIN)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen bg-slate-900 items-center justify-center font-sans">
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-12 rounded-[48px] shadow-2xl text-center w-[400px]">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF3D00] to-[#FF9100] text-white rounded-[24px] flex items-center justify-center font-black text-4xl mx-auto mb-6 shadow-[0_10px_30px_rgba(255,61,0,0.3)]">K</div>
          <h2 className="text-white text-3xl font-black tracking-tighter mb-2">Kolma POS</h2>
          <p className="text-slate-400 font-bold mb-8">Ingresa el PIN de cajero</p>
          
          <div className="flex justify-center gap-4 mb-8">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className={`w-4 h-4 rounded-full transition-all duration-300 ${pinCode.length > i ? 'bg-[#FF3D00] scale-110 shadow-[0_0_15px_rgba(255,61,0,0.5)]' : 'bg-white/20'}`} />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button key={num} onClick={() => handlePinInput(num.toString())} className="h-16 rounded-[20px] bg-white/5 hover:bg-white/20 text-white font-black text-2xl transition-all active:scale-95 border border-white/5 hover:border-white/20">{num}</button>
            ))}
            <div className="col-start-2">
              <button onClick={() => handlePinInput('0')} className="w-full h-16 rounded-[20px] bg-white/5 hover:bg-white/20 text-white font-black text-2xl transition-all active:scale-95 border border-white/5 hover:border-white/20">0</button>
            </div>
            <div className="col-start-3">
              <button onClick={() => setPinCode(pinCode.slice(0, -1))} className="w-full h-16 rounded-[20px] flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-white/5 transition-all active:scale-95"><X size={28} strokeWidth={3}/></button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: POS PRINCIPAL
  // ==========================================
  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden text-slate-900 selection:bg-orange-200">
      
      {/* --- MODAL BÁSCULA --- */}
      {weightModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-8 rounded-[40px] shadow-2xl w-[400px] border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <div className="w-14 h-14 bg-orange-50 text-[#FF3D00] rounded-[20px] flex items-center justify-center"><Scale size={28} /></div>
              <button onClick={() => setWeightModal({ isOpen: false, product: null, weight: '' })} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={20} /></button>
            </div>
            <h3 className="text-2xl font-black tracking-tighter mb-2">{weightModal.product?.name}</h3>
            <p className="text-slate-500 font-bold mb-6">Precio base: RD${weightModal.product?.price} / lb</p>
            
            <div className="bg-slate-50 border-2 border-slate-200 rounded-[24px] p-2 flex items-center mb-8 focus-within:border-[#FF3D00] focus-within:bg-white transition-all">
              <input 
                type="number" 
                step="0.01"
                autoFocus
                value={weightModal.weight}
                onChange={e => setWeightModal({...weightModal, weight: e.target.value})}
                placeholder="0.00"
                className="w-full bg-transparent text-right text-4xl font-black outline-none px-4"
              />
              <span className="font-black text-xl text-slate-400 pr-4">lbs</span>
            </div>

            <button onClick={confirmWeight} disabled={!weightModal.weight || weightModal.weight <= 0} className="w-full bg-[#111] text-white py-5 rounded-[20px] font-black text-xl hover:bg-[#FF3D00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Confirmar Peso
            </button>
          </div>
        </div>
      )}

      {/* --- MENÚ LATERAL --- */}
      <div className="w-[100px] bg-white border-r border-slate-200 flex flex-col items-center py-8 z-20 shadow-[10px_0_30px_rgba(0,0,0,0.02)]">
        <div className="w-14 h-14 bg-gradient-to-br from-[#FF3D00] to-[#FF9100] text-white rounded-[20px] flex items-center justify-center font-black text-2xl shadow-xl shadow-orange-200 mb-8">K</div>
        
        <div className="flex-1 flex flex-col gap-6 w-full px-4">
          <button onClick={() => setActiveView('pos')} className={`w-full aspect-square flex flex-col items-center justify-center gap-2 rounded-[24px] transition-all ${activeView === 'pos' ? 'bg-[#111] text-white shadow-xl' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`}>
            <LayoutDashboard size={24} />
            <span className="text-[10px] font-black uppercase">POS</span>
          </button>
          <button onClick={() => setActiveView('cierre')} className={`w-full aspect-square flex flex-col items-center justify-center gap-2 rounded-[24px] transition-all ${activeView === 'cierre' ? 'bg-[#111] text-white shadow-xl' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-900'}`}>
            <Receipt size={24} />
            <span className="text-[10px] font-black uppercase">Cierre</span>
          </button>
        </div>

        <button onClick={handleLogout} className="w-14 h-14 rounded-[20px] flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all mt-auto">
          <LogOut size={24} strokeWidth={2.5}/>
        </button>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="flex-1 flex flex-col relative">
        
        {/* HEADER SUPERIOR (CONTADOR DE VENTAS) */}
        <div className="h-[90px] bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="relative w-[400px]">
            {activeView === 'pos' && (
              <>
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FF3D00]" size={20} />
                <input 
                  type="text" 
                  placeholder="Escanear producto..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-200 focus:bg-white rounded-[20px] py-3.5 pl-14 pr-4 font-bold outline-none transition-all shadow-sm"
                />
              </>
            )}
          </div>

          <div className="flex items-center gap-8">
            <div className="text-right border-r border-slate-200 pr-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Ventas del Día</p>
              <p className="font-black text-2xl text-[#111] leading-none">RD$ {dailySales.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-[16px] border border-green-100 flex items-center justify-center text-green-500"><Lock size={20} /></div>
              <div>
                <p className="font-black text-sm">Caja 01</p>
                <p className="text-xs font-bold text-green-500">Operativa</p>
              </div>
            </div>
          </div>
        </div>

        {/* ÁREA DINÁMICA: POS O CIERRE */}
        {activeView === 'pos' ? (
          <div className="flex-1 overflow-y-auto p-8 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
            <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {filteredProducts.map(p => {
                const isWeighed = p.name.toLowerCase().includes('libra') || p.name.toLowerCase().includes('lobra');
                return (
                  <div 
                    key={p.id} 
                    onClick={() => handleProductClick(p)}
                    className="group relative bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#FF3D00] cursor-pointer transition-all duration-300 active:scale-95 flex flex-col"
                  >
                    <div className="aspect-square bg-slate-50 rounded-[24px] mb-4 overflow-hidden relative border border-slate-100">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500" draggable="false"/>
                      {isWeighed && (
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur shadow-sm px-3 py-1.5 rounded-[12px] text-[10px] font-black text-[#FF3D00] uppercase flex items-center gap-1 border border-red-50">
                          <Scale size={12} strokeWidth={3}/> Pesaje
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-sm leading-tight mb-2 text-slate-800">{p.name}</h3>
                    <p className="font-black text-xl text-[#111] mt-auto">RD${p.price.toFixed(0)}</p>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50">
            <div className="bg-white p-12 rounded-[48px] shadow-xl border border-slate-100 w-full max-w-2xl text-center">
              <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><Receipt size={48} /></div>
              <h2 className="text-4xl font-black tracking-tighter mb-2">Corte de Caja</h2>
              <p className="text-slate-500 font-bold mb-10">Resumen de operaciones del turno actual.</p>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                  <p className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Transacciones</p>
                  <p className="text-5xl font-black text-[#111]">{dailyTransactions}</p>
                </div>
                <div className="bg-orange-50 p-8 rounded-[32px] border border-orange-100">
                  <p className="text-sm font-black uppercase tracking-widest text-[#FF3D00] mb-2">Total Recaudado</p>
                  <p className="text-4xl font-black text-[#FF3D00]">RD$ {dailySales.toFixed(2)}</p>
                </div>
              </div>

              <button onClick={cerrarTurno} className="w-full bg-[#111] text-white py-6 rounded-[24px] font-black text-2xl hover:bg-red-500 transition-all shadow-xl">
                Confirmar Cierre de Turno
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- PANEL DERECHO: TICKET Y COBRO (SOLO APARECE SI HAY VENTAS Y ESTAMOS EN POS) --- */}
      {(cart.length > 0 && activeView === 'pos') && (
        <div className="w-[450px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.05)] flex flex-col border-l border-slate-200 z-30 animate-in slide-in-from-right duration-300">
          
          <div className="p-8 pb-6 border-b border-slate-100 flex justify-between items-end bg-slate-50/50">
            <div>
              <h2 className="text-3xl font-black tracking-tighter text-[#111]">Ticket</h2>
              <p className="text-sm font-bold text-slate-400 mt-1">{cart.length} artículos en cola</p>
            </div>
            <button onClick={clearCart} className="text-red-500 hover:bg-red-50 transition-colors p-3 rounded-2xl font-black text-sm"><Trash size={20} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
            {cart.map(item => (
              <div key={item.cartId} className="bg-white border border-slate-100 rounded-[24px] p-4 flex items-center justify-between shadow-sm">
                <div className="flex-1 pr-4">
                  <div className="flex items-start gap-2">
                    <h4 className="font-bold text-sm leading-tight text-slate-800">{item.name}</h4>
                    {item.isWeighed && <span className="bg-orange-100 text-[#FF3D00] text-[10px] font-black px-2 py-0.5 rounded-lg">PESO</span>}
                  </div>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    {item.isWeighed ? `${item.qty} lbs x RD$${item.price}` : `RD$${item.price.toFixed(0)} c/u`}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  {!item.isWeighed && (
                    <span className="font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-[12px] text-sm">x{item.qty}</span>
                  )}
                  <div className="text-right min-w-[80px]">
                    <span className="font-black text-xl text-[#FF3D00]">RD${item.finalPrice.toFixed(0)}</span>
                  </div>
                  <button onClick={() => removeCartItem(item.cartId)} className="text-slate-300 hover:text-red-500 transition-colors p-2"><X size={20}/></button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-white border-t border-slate-100 shadow-[0_-20px_50px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-end mb-6">
              <span className="font-black text-slate-800 uppercase tracking-widest text-sm">Total a Cobrar</span>
              <span className="text-5xl font-black tracking-tighter text-[#111]">RD$ {total.toFixed(0)}</span>
            </div>

            {successMsg ? (
              <div className="w-full bg-green-500 text-white py-6 rounded-[24px] font-black text-2xl flex items-center justify-center gap-3 shadow-xl shadow-green-200">
                <CheckCircle size={32} strokeWidth={3}/> ¡Venta Exitosa!
              </div>
            ) : (
              <button 
                onClick={procesarVenta} 
                disabled={isProcessing}
                className="w-full py-6 rounded-[24px] font-black text-2xl flex items-center justify-center gap-3 transition-all shadow-xl bg-gradient-to-br from-[#FF3D00] to-[#FF9100] text-white hover:scale-[1.02] active:scale-95 shadow-orange-200/50"
              >
                {isProcessing ? 'Procesando...' : 'Cobrar Exacto'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
