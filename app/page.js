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
const Loader = ({ className='', ...p }) => <Svg {...p} className={`animate-spin ${className}`}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></Svg>;
const Download = p => <Svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Svg>;
const Users = p => <Svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Svg>;
const History = p => <Svg {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Svg>;
const CheckCircle = p => <Svg {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></Svg>;
const AlertCircle = p => <Svg {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Svg>;
const Lock = p => <Svg {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Svg>; 

// --- CONFIGURACIÓN Y SEGURIDAD ---
const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || "1221"; 

// --- MENÚ XIAO KITCHEN ---
const CATEGORIAS = ['Todos', 'Burritos', 'Sándwiches', 'Yaroas'];
const RESTAURANT_MENU = [
  { id: 'b1s', name: 'Burrito de Pollo (Solo)', price: 185, category: 'Burritos' },
  { id: 'b1p', name: 'Burrito de Pollo (+ Papas)', price: 230, category: 'Burritos' },
  { id: 'b2s', name: 'Burrito de Res (Solo)', price: 220, category: 'Burritos' },
  { id: 'b2p', name: 'Burrito de Res (+ Papas)', price: 250, category: 'Burritos' },
  { id: 'b3s', name: 'Burrito Cheese & Tocineta (Solo)', price: 230, category: 'Burritos' },
  { id: 'b3p', name: 'Burrito Cheese & Tocineta (+ Papas)', price: 260, category: 'Burritos' },
  { id: 'b4s', name: 'Burrito Pollo y Res (Solo)', price: 220, category: 'Burritos' },
  { id: 'b4p', name: 'Burrito Pollo y Res (+ Papas)', price: 250, category: 'Burritos' },
  { id: 'b5s', name: 'Burrito Pollo y Tocineta (Solo)', price: 230, category: 'Burritos' },
  { id: 'b5p', name: 'Burrito Pollo y Tocineta (+ Papas)', price: 260, category: 'Burritos' },
  { id: 's1', name: 'Club Sándwich Tradicional', price: 150, category: 'Sándwiches' },
  { id: 's2', name: 'Club Sándwich Premium', price: 230, category: 'Sándwiches' },
  { id: 'y1', name: 'Yaroa Mediana', price: 250, category: 'Yaroas' },
  { id: 'y2', name: 'Yaroa Grande', price: 300, category: 'Yaroas' }
];

export default function XiaoKitchenPOS() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeView, setActiveView] = useState('pos');
  
  // Datos y Estados
  const [products, setProducts] = useState(RESTAURANT_MENU);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [localSales, setLocalSales] = useState([]);
  
  // UI States
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
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
    const session = localStorage.getItem('xiao_pos_session');
    const savedSales = JSON.parse(localStorage.getItem('xiao_daily_sales') || '[]');
    
    if (session === 'active') setIsAuthenticated(true);
    setLocalSales(savedSales);
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('xiao_daily_sales', JSON.stringify(localSales));
  }, [localSales]);

  // --- SEGURIDAD Y NAVEGACIÓN ---
  const handleAuthPinInput = (num) => {
    const newPin = authModal.pinCode + num;
    setAuthModal(prev => ({ ...prev, pinCode: newPin }));
    
    if (newPin === ADMIN_PIN) {
      setTimeout(() => { 
        if(!isAuthenticated) {
            localStorage.setItem('xiao_pos_session', 'active');
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
    let filtered = products;
    if (activeCategory !== 'Todos') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
    }
    return filtered;
  }, [products, searchTerm, activeCategory]);

  const handleProductClick = (product) => {
    addToCart(product, 1);
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  const addToCart = (product, quantity) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + quantity, finalPrice: item.price * (item.qty + quantity) } : item);
      } else {
        return [...prev, { ...product, cartId: Date.now(), qty: quantity, finalPrice: product.price * quantity }];
      }
    });
  };

  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta, finalPrice: i.price * (i.qty + delta) } : i).filter(i => i.qty > 0));
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

  const ejecutarVenta = () => {
    const type = confirmModal.type;
    setIsProcessing(true);

    setTimeout(() => {
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
      
      setCart([]);
      setCreditModal(false);
      setConfirmModal({ isOpen: false, type: null });
      setCustomerData({ name: '', phone: '' });
      setIsCartDrawerOpen(false);
      
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 3000);
      setIsProcessing(false);
    }, 500); // Simulando pequeño delay
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
    validSales.forEach(s => { 
      if (s.type === 'cash') cash += (s.total || 0); 
      else credit += (s.total || 0); 
    });
    return { cash, credit, total: cash + credit, count: validSales.length };
  }, [localSales]);

  const generarCierre = () => {
    const validSales = localSales.filter(s => s.status === 'completed');
    if (validSales.length === 0) return alert("No hay ventas válidas registradas hoy.");

    const prodMap = {};
    validSales.forEach(sale => {
      if(sale.items) {
        sale.items.forEach(item => {
          if (!prodMap[item.name]) prodMap[item.name] = { qty: 0, revenue: 0 };
          prodMap[item.name].qty += item.qty;
          prodMap[item.name].revenue += item.finalPrice;
        });
      }
    });

    const sortedProducts = Object.entries(prodMap).sort((a, b) => b[1].qty - a[1].qty);

    let txt = `======================================\n`;
    txt += `     XIAO KITCHEN - CIERRE DE CAJA    \n`;
    txt += `======================================\n`;
    txt += `Fecha: ${new Date().toLocaleString('es-DO')}\n\n`;
    txt += `--- RESUMEN FINANCIERO ---\n`;
    txt += `Órdenes Procesadas: ${stats.count}\n`;
    txt += `Total Efectivo: RD$ ${stats.cash.toFixed(2)}\n`;
    txt += `Total Crédito:  RD$ ${stats.credit.toFixed(2)}\n`;
    txt += `TOTAL VENTAS:   RD$ ${stats.total.toFixed(2)}\n\n`;

    txt += `--- PLATOS VENDIDOS ---\n`;
    txt += `CANT | PRODUCTO | TOTAL RD$\n`;
    txt += `--------------------------------------\n`;
    sortedProducts.forEach(([name, data]) => {
      txt += `${data.qty.toString().padEnd(4)} | ${name.substring(0, 20).padEnd(20)} | $${data.revenue.toFixed(2)}\n`;
    });
    
    txt += `\n--- DETALLE DE CRÉDITOS ---\n`;
    const credits = validSales.filter(s => s.type === 'credit');
    if(credits.length === 0) txt += "Sin créditos hoy.\n";
    credits.forEach(c => txt += `Cliente: ${c.customer} - Monto: RD$${(c.total||0).toFixed(2)}\n`);

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Cierre_Xiao_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();

    localStorage.removeItem('xiao_daily_sales');
    localStorage.removeItem('xiao_pos_session');
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
        <div className="bg-[#1e293b] border border-red-900/50 p-8 rounded-2xl shadow-2xl text-center w-[360px]">
          {isLogin ? (
            <div className="w-14 h-14 bg-red-600 text-white rounded-xl flex items-center justify-center font-black text-2xl mx-auto mb-4">XK</div>
          ) : (
            <div className="w-14 h-14 bg-slate-800 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4"><Lock size={28}/></div>
          )}
          <h2 className="text-xl font-bold text-white mb-1">{isLogin ? 'Xiao Kitchen POS' : 'Administrador'}</h2>
          <p className="text-slate-400 text-xs mb-6">{isLogin ? 'Inicia sesión para continuar' : 'Ingresa el PIN'}</p>
          
          <div className="flex justify-center gap-3 mb-8">
            {[0, 1, 2, 3].map(i => <div key={i} className={`w-3 h-3 rounded-full ${authModal.pinCode.length > i ? 'bg-red-500' : 'bg-slate-600'}`} />)}
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

  if (isInitializing) return <div className="h-screen bg-slate-900 flex items-center justify-center"><Loader size={48} className="text-red-500" /></div>;
  if (!isAuthenticated) return renderAuthModal();

  // ==========================================
  // RENDER INTERFAZ PRINCIPAL
  // ==========================================
  return (
    <div className="flex h-screen bg-[#0f172a] font-sans text-slate-200 overflow-hidden relative">
      
      {/* TOAST DE ÉXITO */}
      {successToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold animate-in slide-in-from-top-10">
          <CheckCircle size={20}/> Orden registrada exitosamente
        </div>
      )}

      {/* PIN MODAL (INTERNO) */}
      {renderAuthModal()}

      {/* MODAL CRÉDITO */}
      {creditModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#1e293b] border border-slate-700 p-8 rounded-2xl shadow-2xl w-[400px]">
            <h3 className="text-xl font-bold text-white mb-2">Datos del Cliente</h3>
            <div className="space-y-4 mb-8 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Nombre del Cliente *</label>
                <input type="text" autoFocus value={customerData.name} onChange={e=>setCustomerData({...customerData, name: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500" placeholder="Ej. Juan Pérez"/>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Teléfono *</label>
                <input type="tel" value={customerData.phone} onChange={e=>setCustomerData({...customerData, phone: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500" placeholder="Ej. 809-555-5555"/>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setCreditModal(false)} className="flex-1 py-3 bg-slate-700 rounded-lg font-bold hover:bg-slate-600">Volver</button>
              <button onClick={() => { if(customerData.name && customerData.phone) triggerPaymentConfirmation('credit'); else alert('Llene los campos'); }} className="flex-1 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-500">Continuar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CONFIRMACIÓN */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#1e293b] border border-slate-700 p-8 rounded-2xl shadow-2xl w-[350px] text-center">
            <div className="w-16 h-16 bg-slate-800 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><AlertCircle size={32}/></div>
            <h3 className="text-xl font-bold text-white mb-2">Confirmar Orden</h3>
            <p className="text-slate-400 mb-6">Procesando orden en <b className="text-white">{confirmModal.type === 'cash' ? 'Efectivo' : 'Crédito'}</b> por <b className="text-white">RD${total.toFixed(2)}</b>.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal({isOpen: false, type: null})} disabled={isProcessing} className="flex-1 py-3 bg-slate-700 rounded-lg font-bold hover:bg-slate-600 disabled:opacity-50">Cancelar</button>
              <button onClick={ejecutarVenta} disabled={isProcessing} className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 flex items-center justify-center disabled:opacity-50">
                {isProcessing ? <Loader size={20}/> : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TICKET DRAWER */}
      {isCartDrawerOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsCartDrawerOpen(false)}></div>}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[380px] bg-[#1e293b] border-l border-slate-700 z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${isCartDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-[70px] border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><ShoppingCart size={20}/> Comanda</h2>
          <button onClick={() => setIsCartDrawerOpen(false)} className="text-slate-400 hover:text-white p-2 bg-slate-800 rounded-full"><X size={18}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
          {cart.map(item => (
            <div key={item.cartId} className="bg-[#0f172a] border border-slate-700 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-sm text-slate-200 pr-2">{item.name}</h4>
                <button onClick={() => removeCartItem(item.cartId)} className="text-slate-500 hover:text-red-400"><X size={14}/></button>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2 bg-[#1e293b] rounded py-1 px-2 border border-slate-700">
                  <button onClick={() => updateQty(item.id, -1)} className="text-slate-400"><Minus size={12} /></button>
                  <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="text-slate-400"><Plus size={12}/></button>
                </div>
                <span className="font-black text-sm text-white">RD${item.finalPrice.toFixed(0)}</span>
              </div>
            </div>
          ))}
          {cart.length === 0 && <div className="text-center flex flex-col items-center text-slate-500 mt-20"><ShoppingCart size={40} className="mb-4 opacity-50"/><span className="text-sm font-bold">Sin platos agregados</span></div>}
        </div>

        <div className="p-6 bg-[#1e293b] border-t border-slate-800">
          <div className="flex justify-between items-end mb-4">
            <span className="text-slate-400 text-sm font-bold">Total a Cobrar</span>
            <span className="text-3xl font-black text-red-500">RD$ {total.toFixed(0)}</span>
          </div>
          <div className="flex flex-col gap-3">
            <button onClick={() => triggerPaymentConfirmation('cash')} disabled={cart.length === 0} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50">
               Cobrar Efectivo
            </button>
            <button onClick={() => setCreditModal(true)} disabled={cart.length === 0} className="w-full py-3 bg-transparent border border-slate-600 hover:border-red-500 hover:text-red-500 text-slate-300 rounded-xl font-bold text-sm flex justify-center items-center gap-2 disabled:opacity-50 transition-colors">
              <Users size={16}/> Vender a Crédito
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ LATERAL IZQUIERDO */}
      <div className="w-[80px] bg-[#1e293b] border-r border-slate-800 flex flex-col items-center py-6 z-20 shrink-0 hidden md:flex">
        <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center font-black text-xl mb-8">XK</div>
        <div className="flex flex-col gap-6 w-full">
          <button onClick={() => setActiveView('pos')} className={`flex flex-col items-center gap-1 ${activeView === 'pos' ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'}`}><LayoutDashboard size={24} /><span className="text-[10px] font-bold">POS</span></button>
          <button onClick={() => requestAdminAccess('history')} className={`flex flex-col items-center gap-1 ${activeView === 'history' ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'}`}><History size={24} /><span className="text-[10px] font-bold">Órdenes</span></button>
          <button onClick={() => requestAdminAccess('cierre')} className={`flex flex-col items-center gap-1 ${activeView === 'cierre' ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'}`}><Receipt size={24} /><span className="text-[10px] font-bold">Cierre</span></button>
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
                <input ref={searchInputRef} type="text" placeholder="Buscar plato..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#1e293b] border border-slate-700 focus:border-red-500 rounded-lg py-2 pl-10 pr-4 text-white outline-none text-sm transition-colors"/>
              </>
            )}
            {activeView === 'history' && <h2 className="text-xl font-bold">Historial de Órdenes</h2>}
            {activeView === 'cierre' && <h2 className="text-xl font-bold">Cierre de Caja</h2>}
          </div>
          
          <div className="flex items-center gap-4 hidden sm:flex">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Caja Actual</p>
              <p className="font-black text-lg text-emerald-400 leading-none">RD$ {stats.total.toFixed(0)}</p>
            </div>
            {isAdminUnlocked && <button onClick={() => setIsAdminUnlocked(false)} className="ml-4 text-slate-500 hover:text-amber-500 flex items-center gap-1 text-xs font-bold"><Lock size={14}/> Bloquear Admin</button>}
          </div>
        </div>

        {/* TABS DE CATEGORÍA PARA POS */}
        {activeView === 'pos' && (
          <div className="px-4 md:px-6 py-4 bg-[#0f172a] border-b border-slate-800/50 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
            {CATEGORIAS.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-red-600 text-white' : 'bg-[#1e293b] text-slate-400 hover:bg-slate-800 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* VISTAS */}
        {activeView === 'pos' && (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar pb-[100px]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filteredProducts.map(p => (
                <div key={p.id} onClick={() => handleProductClick(p)} className="bg-[#1e293b] rounded-xl p-4 border border-slate-700/60 hover:border-red-500 cursor-pointer flex flex-col transition-all active:scale-95 shadow-sm min-h-[120px]">
                  <span className="text-[10px] font-black uppercase text-red-500/70 mb-1">{p.category}</span>
                  <h3 className="font-bold text-sm text-slate-200 leading-tight mb-2 flex-1">{p.name}</h3>
                  <p className="font-black text-lg text-white mt-auto">RD${p.price.toFixed(0)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BARRA FLOTANTE */}
        {activeView === 'pos' && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#1e293b] border-t border-slate-700 p-4 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.5)] md:pb-4 pb-20">
            <div className="flex flex-col">
               <span className="text-xs font-bold text-slate-400 uppercase">{cart.length} Artículos</span>
               <span className="text-2xl font-black text-red-500">RD$ {total.toFixed(0)}</span>
            </div>
            <button onClick={() => setIsCartDrawerOpen(true)} className="bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg active:scale-95 transition-all">
               Comanda <ShoppingCart size={20}/>
            </button>
          </div>
        )}

        {activeView === 'history' && (
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-4 pb-20">
              {localSales.length === 0 ? (
                 <div className="text-center flex flex-col items-center text-slate-500 mt-20"><History size={48} className="mb-4 opacity-50"/><p className="text-lg font-bold">No hay órdenes hoy</p></div>
              ) : (
                localSales.map(sale => (
                  <div key={sale.id} className={`bg-[#1e293b] border rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors ${sale.status === 'voided' ? 'border-red-900/50 opacity-50' : 'border-slate-700'}`}>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${sale.type === 'cash' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-amber-900/50 text-amber-400'}`}>{sale.type === 'cash' ? 'Efectivo' : 'Crédito'}</span>
                        {sale.status === 'voided' && <span className="px-2 py-1 rounded bg-red-900/50 text-red-400 text-[10px] font-black uppercase">Anulada</span>}
                        <span className="text-xs text-slate-400">{new Date(sale.date).toLocaleTimeString('es-DO')}</span>
                      </div>
                      <p className="font-bold text-white text-sm">{sale.customer} • {sale.items?.length || 0} platos</p>
                    </div>
                    <div className="flex items-center gap-6 justify-between sm:justify-end">
                      <p className={`font-black text-xl ${sale.status === 'voided' ? 'text-slate-500 line-through' : 'text-white'}`}>RD${(sale.total||0).toFixed(2)}</p>
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

              <button onClick={generarCierre} className="w-full bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                <Download size={20}/> Cerrar Turno y Descargar Reporte
              </button>
            </div>
          </div>
        )}
      </div>

      {/* NAVEGACIÓN MÓVIL */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#1e293b] border-t border-slate-800 flex justify-around p-3 z-[10] pb-safe">
        <button onClick={() => setActiveView('pos')} className={`flex flex-col items-center gap-1 ${activeView === 'pos' ? 'text-red-500' : 'text-slate-500'}`}><LayoutDashboard size={24} /><span className="text-[10px] font-bold">POS</span></button>
        <button onClick={() => requestAdminAccess('history')} className={`flex flex-col items-center gap-1 ${activeView === 'history' ? 'text-red-500' : 'text-slate-500'}`}><History size={24} /><span className="text-[10px] font-bold">Órdenes</span></button>
        <button onClick={() => requestAdminAccess('cierre')} className={`flex flex-col items-center gap-1 ${activeView === 'cierre' ? 'text-red-500' : 'text-slate-500'}`}><Receipt size={24} /><span className="text-[10px] font-bold">Cierre</span></button>
      </nav>

    </div>
  );
}
