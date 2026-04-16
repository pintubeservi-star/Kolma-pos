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

// --- CONFIGURACIÓN DE ENTORNO (PRODUCCIÓN REAL) ---
const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "q0q09e-cp.myshopify.com";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || "c9bda45020488455d7fe2d8b7e22f352";

export default function KolmaPOS() {
  // --- ESTADOS DE SEGURIDAD Y VISTAS ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [activeView, setActiveView] = useState('pos'); // 'pos' o 'cierre'

  // --- ESTADOS DEL POS (REAL SHOPIFY DATA) ---
  const [products, setProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // --- ESTADOS DE BÁSCULA ---
  const [weightModal, setWeightModal] = useState({ isOpen: false, product: null, weight: '' });

  // --- ESTADOS DE CIERRE DE CAJA ---
  const [dailySales, setDailySales] = useState(0);
  const [dailyTransactions, setDailyTransactions] = useState(0);

  // --- 1. CARGAR CATÁLOGO REAL DE SHOPIFY (SIN SIMULACIÓN) ---
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
      
      if (errors) throw new Error("Error en la consulta GraphQL de Shopify");
      
      if (data?.products) {
        const shopifyProds = data.products.edges.map(p => ({
          id: p.node.id, 
          name: p.node.title, 
          price: parseFloat(p.node.variants.edges[0].node.price.amount),
          image: p.node.images.edges[0]?.node.url || 'https://via.placeholder.com/300?text=Kolma', // Imagen genérica si no tiene
          variantId: p.node.variants.edges[0].node.id,
          barcode: p.node.variants.edges[0].node.barcode || ''
        }));
        setProducts(shopifyProds);
      } else {
        throw new Error("No se encontraron productos en la tienda.");
      }
    } catch (e) {
      console.error("Error conectando a Shopify:", e);
      setFetchError(e.message || "Error de conexión con el servidor de Shopify.");
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
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
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    const term = searchTerm.toLowerCase();
    // Búsqueda por nombre o por código de barras escaneado
    return products.filter(p => p.name.toLowerCase().includes(term) || p.barcode === term);
  }, [products, searchTerm]);

  const handleProductClick = (product) => {
    const isWeighedItem = product.name.toLowerCase().includes('libra') || product.name.toLowerCase().includes('lobra');
    if (isWeighedItem) {
      setWeightModal({ isOpen: true, product, weight: '' });
    } else {
      addToCart(product, 1, false);
    }
    setSearchTerm(''); // Limpiar buscador tras agregar
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

  // --- 4. INTEGRACIÓN SHOPIFY (VENTAS DIRECTA) REAL ---
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
        financial_status: "paid", // Regla Estricta
        customer: { first_name: "Ventas", last_name: "Directa" }, // Regla Estricta
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
          clearCart(); // El panel se ocultará automáticamente porque cart.length será 0
        }, 2000);
      } else {
        const errorData = await res.json();
        console.error("Error Shopify:", errorData);
        alert(`Error procesando la venta en Shopify: ${JSON.stringify(errorData)}`);
      }
    } catch (e) {
      console.error("Error de red:", e);
      alert("Error crítico de red al procesar la venta. Verifica la conexión a internet.");
    } finally {
      setIsProcessing(false);
    }
  };

  const cerrarTurno = () => {
    if (window.confirm('¿Cerrar el turno de hoy? Las métricas de venta volverán a cero.')) {
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
          <p className="text-slate-400 font-bold mb-8">Ingresa el PIN (1221)</p>
          
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
              <button onClick={() => setWeightModal({ isOpen: false, product: null, weight: '' })} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"><X size={20} /></button>
            </div>
            <h3 className="text-2xl font-black tracking-tighter mb-2">{weightModal.product?.name}</h3>
            <p className="text-slate-500 font-bold mb-6">Precio base: RD${weightModal.product?.price} / lb</p>
            
            <div className="bg-slate-50 border-2 border-slate-200 rounded-[24px] p-2 flex items-center mb-8 focus-within:border-[#FF3D00] focus-within:bg-white transition-all shadow-inner">
              <input 
                type="number" 
                step="0.01"
                autoFocus
                value={weightModal.weight}
                onChange={e => setWeightModal({...weightModal, weight: e.target.value})}
                onKeyDown={e => e.key === 'Enter' && confirmWeight()}
                placeholder="0.00"
                className="w-full bg-transparent text-right text-4xl font-black outline-none px-4"
              />
              <span className="font-black text-xl text-slate-400 pr-4">lbs</span>
            </div>

            <button onClick={confirmWeight} disabled={!weightModal.weight || weightModal.weight <= 0} className="w-full bg-[#111] text-white py-5 rounded-[20px] font-black text-xl hover:bg-[#FF3D00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xl">
              Registrar Peso
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

        <button onClick={handleLogout} className="w-14 h-14 rounded-[20px] flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all mt-auto" title="Bloquear Terminal">
          <LogOut size={24} strokeWidth={2.5}/>
        </button>
      </div>

      {/* --- CONTENIDO PRINCIPAL (CATÁLOGO FULL WIDTH) --- */}
      <div className="flex-1 flex flex-col relative transition-all duration-300">
        
        {/* HEADER SUPERIOR */}
        <div className="h-[90px] bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="relative w-full max-w-xl">
            {activeView === 'pos' && (
              <>
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FF3D00]" size={20} />
                <input 
                  type="text" 
                  placeholder="Escanear producto o buscar por nombre..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-200 focus:bg-white rounded-[20px] py-3.5 pl-14 pr-4 font-bold outline-none transition-all shadow-sm text-lg"
                  autoFocus
                />
              </>
            )}
          </div>

          <div className="flex items-center gap-8 ml-4">
            <div className="text-right border-r border-slate-200 pr-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Ventas del Día</p>
              <p className="font-black text-2xl text-[#111] leading-none">RD$ {dailySales.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-[16px] border border-green-100 flex items-center justify-center text-green-500"><Lock size={20} /></div>
              <div>
                <p className="font-black text-sm">Caja 01</p>
                <p className="text-xs font-bold text-green-500">Conectada a Shopify</p>
              </div>
            </div>
          </div>
        </div>

        {/* ÁREA DINÁMICA: POS O CIERRE */}
        {activeView === 'pos' ? (
          <div className="flex-1 overflow-y-auto p-8 no-scrollbar bg-[#F8FAFC]" style={{ scrollbarWidth: 'none' }}>
            
            {/* MANEJO DE ESTADOS DE CARGA Y ERROR REALES */}
            {isLoadingProducts ? (
              <div className="h-full flex flex-col items-center justify-center text-[#FF3D00]">
                <Loader size={48} />
                <p className="mt-4 font-black text-xl text-slate-800">Sincronizando con Shopify...</p>
              </div>
            ) : fetchError ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500">
                <ServerCrash size={64} className="text-red-400 mb-4" />
                <p className="font-black text-2xl text-slate-800 mb-2">Sin conexión al catálogo</p>
                <p className="font-bold mb-6 max-w-md text-center">{fetchError}</p>
                <button onClick={fetchShopifyProducts} className="bg-[#111] text-white px-8 py-3 rounded-2xl font-black hover:bg-[#FF3D00] transition-colors shadow-lg">Reintentar Conexión</button>
              </div>
            ) : (
              <div className={`grid gap-5 transition-all duration-300 ${cart.length > 0 ? 'grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : 'grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'}`}>
                {filteredProducts.map(p => {
                  const isWeighed = p.name.toLowerCase().includes('libra') || p.name.toLowerCase().includes('lobra');
                  return (
                    <div 
                      key={p.id} 
                      onClick={() => handleProductClick(p)}
                      className="group relative bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-orange-100/50 hover:border-[#FF3D00] cursor-pointer transition-all duration-300 active:scale-95 flex flex-col"
                    >
                      <div className="aspect-square bg-slate-50 rounded-[24px] mb-4 overflow-hidden relative border border-slate-50">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500" draggable="false" loading="lazy"/>
                        {isWeighed && (
                          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur shadow-sm px-3 py-1.5 rounded-[12px] text-[10px] font-black text-[#FF3D00] uppercase flex items-center gap-1 border border-red-50">
                            <Scale size={12} strokeWidth={3}/> Pesaje
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3 bg-[#111] text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl">
                          <Plus size={18} strokeWidth={3} />
                        </div>
                      </div>
                      <h3 className="font-bold text-sm leading-tight mb-2 text-slate-800 line-clamp-2">{p.name}</h3>
                      <p className="font-black text-xl text-[#FF3D00] mt-auto">RD${p.price.toFixed(0)}</p>
                    </div>
                  )
                })}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-[40px] border-2 border-dashed border-slate-200">
                    <Search size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="font-black text-2xl text-slate-800">Producto no encontrado</p>
                    <p className="font-bold mt-1">Revisa la ortografía o escanea nuevamente.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50">
            <div className="bg-white p-12 rounded-[48px] shadow-2xl border border-slate-100 w-full max-w-2xl text-center">
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

              <button onClick={cerrarTurno} className="w-full bg-[#111] text-white py-6 rounded-[24px] font-black text-2xl hover:bg-red-500 transition-all shadow-xl active:scale-95">
                Confirmar Cierre de Turno
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- PANEL DERECHO: TICKET Y COBRO (SOLO APARECE SI HAY VENTAS Y ESTAMOS EN POS) --- */}
      {/* Usamos renderizado condicional con animación Tailwind para que el layout se adapte automáticamente */}
      {(cart.length > 0 && activeView === 'pos') && (
        <div className="w-[450px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.08)] flex flex-col border-l border-slate-200 z-30 animate-in slide-in-from-right-10 duration-300 shrink-0">
          
          <div className="p-8 pb-6 border-b border-slate-100 flex justify-between items-end bg-slate-50">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9100] bg-orange-100 px-3 py-1 rounded-xl mb-3 inline-block">Checkout Activo</span>
              <h2 className="text-3xl font-black tracking-tighter text-[#111]">Ticket</h2>
            </div>
            <button onClick={clearCart} className="text-red-500 hover:bg-red-50 transition-colors p-3 rounded-2xl font-black text-sm flex items-center gap-2 bg-white border border-slate-200 shadow-sm">
              <Trash size={16} /> Vaciar
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
            {cart.map(item => (
              <div key={item.cartId} className="bg-white border border-slate-100 rounded-[24px] p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-sm leading-tight text-slate-800 pr-2">{item.name}</h4>
                  <p className="font-black text-[#FF3D00] text-lg shrink-0">RD${item.price.toFixed(0)}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  {item.isWeighed ? (
                     <div className="bg-orange-50 text-[#FF3D00] px-3 py-1.5 rounded-[12px] text-xs font-black uppercase tracking-widest border border-orange-100">
                       PESO: {item.qty} LBS
                     </div>
                  ) : (
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-[16px] p-1">
                      <button onClick={() => updateQty(item.variantId, -1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all active:scale-95">
                        {item.qty === 1 ? <Trash size={14} className="text-red-500" /> : <Minus size={14} />}
                      </button>
                      <span className="w-8 text-center font-black">{item.qty}</span>
                      <button onClick={() => updateQty(item.variantId, 1)} className="w-8 h-8 flex items-center justify-center bg-[#111] text-white rounded-xl shadow-md transition-all active:scale-95">
                        <Plus size={14} strokeWidth={3}/>
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] font-black uppercase text-slate-400 block mb-0.5 leading-none">Subtotal</span>
                      <span className="font-black text-xl text-[#111] leading-none">${item.finalPrice.toFixed(0)}</span>
                    </div>
                    <button onClick={() => removeCartItem(item.cartId)} className="text-slate-300 hover:text-red-500 transition-colors bg-slate-50 p-2 rounded-xl"><X size={16} strokeWidth={3}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-white border-t border-slate-100 shadow-[0_-20px_50px_rgba(0,0,0,0.03)] z-10">
            <div className="flex justify-between items-end mb-6">
              <span className="font-black text-slate-800 uppercase tracking-widest text-sm">Total a Cobrar</span>
              <span className="text-5xl font-black tracking-tighter text-[#111]">RD$ {total.toFixed(0)}</span>
            </div>

            {successMsg ? (
              <div className="w-full bg-green-500 text-white py-6 rounded-[24px] font-black text-2xl flex items-center justify-center gap-3 shadow-xl shadow-green-200 animate-in zoom-in duration-300">
                <CheckCircle size={32} strokeWidth={3}/> ¡Venta Exitosa!
              </div>
            ) : (
              <button 
                onClick={procesarVenta} 
                disabled={isProcessing}
                className={`w-full py-6 rounded-[24px] font-black text-2xl flex items-center justify-center gap-3 transition-all shadow-xl ${isProcessing ? 'bg-slate-800 text-white cursor-wait' : 'bg-gradient-to-br from-[#FF3D00] to-[#FF9100] text-white hover:scale-[1.02] active:scale-95 shadow-orange-200/50'}`}
              >
                {isProcessing ? <Loader size={28} className="text-white"/> : 'Cobrar Exacto'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
