"use client";
import React, { useState, useEffect } from "react";

const Icons = {
  Home: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  History: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  Customers: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
  Settings: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>,
  Power: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
  Lock: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>,
  Download: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>,
  Whatsapp: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.48 2 2 6.48 2 12c0 1.74.45 3.37 1.22 4.8L2 22l5.37-1.14A9.97 9.97 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.38 14.16c-.23.65-1.34 1.25-1.93 1.34-.54.08-1.2-.02-3.87-1.12-3.21-1.33-5.28-4.66-5.44-4.87-.16-.21-1.3-1.73-1.3-3.3 0-1.57.82-2.35 1.11-2.65.29-.31.64-.38.85-.38.22 0 .44 0 .63.01.21.01.5-.08.77.58.29.7.99 2.42 1.08 2.6.09.18.15.4.02.66-.12.26-.18.42-.36.63-.18.21-.38.45-.55.62-.19.18-.39.37-.18.73.21.36.95 1.56 2.03 2.53 1.39 1.25 2.56 1.63 2.92 1.81.36.18.57.15.79-.11.21-.26.92-1.07 1.17-1.44.25-.37.5-.31.83-.18.33.13 2.1.99 2.46 1.17.36.18.6.27.69.42.09.15.09.87-.14 1.52z"/></svg>
};

export default function KolmaPOSPremium() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // action: 'cierre' | 'reinicio' | 'historial'
  const [authModal, setAuthModal] = useState({ isOpen: false, action: null }); 
  const [modalPassInput, setModalPassInput] = useState("");
  const [modalPassError, setModalPassError] = useState(false);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [ticket, setTicket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pos");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  
  const [salesHistory, setSalesHistory] = useState([]);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("kolma_auth");
    if (sessionAuth === "true") setIsAuthenticated(true);
    setIsAuthChecked(true);

    const savedHistory = localStorage.getItem("kolma_sales_history");
    if (savedHistory) {
      try { setSalesHistory(JSON.parse(savedHistory)); } 
      catch (e) { console.error("Error al cargar historial", e); }
    }

    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error("Fallo de conexión con Shopify");
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
    if (typeof window !== "undefined" && window.innerWidth > 1024) setIsSidebarOpen(true);
  }, []);

  const shiftTotalSales = salesHistory.reduce((acc, sale) => acc + sale.total, 0);
  const shiftTotalItems = salesHistory.reduce((acc, sale) => acc + sale.qty, 0);
  
  const shiftSoldProducts = {};
  salesHistory.forEach(sale => {
    sale.items.forEach(item => {
      if (shiftSoldProducts[item.id]) {
        shiftSoldProducts[item.id].qty += item.qty;
        shiftSoldProducts[item.id].total += (item.price * item.qty);
      } else {
        shiftSoldProducts[item.id] = { name: item.name, qty: item.qty, total: item.price * item.qty };
      }
    });
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === "1221") {
      setIsAuthenticated(true);
      sessionStorage.setItem("kolma_auth", "true");
      setPasswordError(false);
    } else {
      setPasswordError(true);
      setPasswordInput("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("kolma_auth");
  };

  const handleModalAuth = (e) => {
    e.preventDefault();
    if (modalPassInput === "1221") {
      setModalPassError(false);
      setModalPassInput("");
      
      if (authModal.action === "cierre") {
        setShowShiftModal(true);
      } else if (authModal.action === "reinicio") {
        resetShift();
      } else if (authModal.action === "historial") {
        setActiveTab("historial");
      }
      setAuthModal({ isOpen: false, action: null });
    } else {
      setModalPassError(true);
      setModalPassInput("");
    }
  };

  const addToTicket = (p) => {
    setTicket(prev => {
      const exists = prev.find(i => i.id === p.id);
      if (exists) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...p, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setTicket(prev => prev.map(i => 
      i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i
    ).filter(i => i.qty > 0));
  };

  const currentTotalMoney = ticket.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const currentTotalItems = ticket.reduce((acc, item) => acc + item.qty, 0);
  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  const handleCheckout = () => {
    if (ticket.length === 0) return;
    
    const newSale = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: ticket,
      total: currentTotalMoney,
      qty: currentTotalItems
    };

    const newHistory = [newSale, ...salesHistory];
    setSalesHistory(newHistory);
    localStorage.setItem("kolma_sales_history", JSON.stringify(newHistory));

    setTicket([]);
    setIsTicketOpen(false);
  };

  const deleteSale = (id) => {
    if(confirm("¿Estás seguro de eliminar esta venta del registro?")) {
      const newHistory = salesHistory.filter(sale => sale.id !== id);
      setSalesHistory(newHistory);
      localStorage.setItem("kolma_sales_history", JSON.stringify(newHistory));
    }
  };

  const resetShift = () => {
    setSalesHistory([]);
    localStorage.removeItem("kolma_sales_history");
    setShowShiftModal(false);
    setActiveTab("pos");
    alert("Caja reiniciada a cero con éxito.");
  };

  const generateReportText = () => {
    const sortedProducts = Object.values(shiftSoldProducts).sort((a, b) => b.qty - a.qty);
    let report = `🧾 CIERRE DE CAJA - KOLMA POS\n📅 Fecha: ${new Date().toLocaleString()}\n--------------------------------\n💰 Venta Total: RD$${shiftTotalSales.toLocaleString()}\n📦 Piezas Vendidas: ${shiftTotalItems}\n--------------------------------\n📊 DETALLE DE VENTAS:\n\n`;
    if (sortedProducts.length === 0) report += `Sin ventas.\n`;
    else sortedProducts.forEach(p => { report += `• ${p.name}\n  Cant: ${p.qty} | Total: RD$${p.total.toLocaleString()}\n\n`; });
    return report;
  };

  const handleDownloadReport = () => {
    const blob = new Blob([generateReportText()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Cierre_KolmaPOS_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendWhatsapp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(generateReportText())}`, '_blank');
  };

  if (!isAuthChecked || loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F6F6F7]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#008060] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#008060] font-black tracking-widest uppercase text-xs">Cargando...</p>
      </div>
    </div>
  );

  if (!isAuthenticated) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#1A1C1D] text-white font-sans">
      <div className="w-full max-w-sm p-8 bg-[#202223] rounded-3xl shadow-2xl border border-gray-800 animate-in zoom-in-95">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#008060] rounded-2xl flex items-center justify-center font-black italic text-3xl shadow-lg">K</div>
        </div>
        <h1 className="text-center text-2xl font-black uppercase tracking-widest italic mb-2">Kolma<span className="text-[#008060]">POS</span></h1>
        <p className="text-center text-gray-400 text-[10px] uppercase tracking-widest mb-8">Acceso Restringido</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"><Icons.Lock /></span>
            <input type="password" autoFocus placeholder="Código de acceso" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} className={`w-full bg-[#1A1C1D] border ${passwordError ? 'border-red-500 text-red-500' : 'border-gray-700 text-white'} rounded-xl py-4 pl-12 pr-4 text-center font-black tracking-[0.5em] focus:outline-none focus:border-[#008060]`} />
          </div>
          {passwordError && <p className="text-red-500 text-center text-xs font-bold uppercase tracking-widest animate-pulse">Incorrecto</p>}
          <button type="submit" className="w-full py-4 bg-[#008060] text-white rounded-xl font-black uppercase tracking-widest active:scale-95">Desbloquear</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F6F6F7] text-[#202223] font-sans overflow-hidden relative">
      <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { width: 5px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #E1E3E5; border-radius: 10px; } .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #008060; }`}} />
      
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50] lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed lg:static inset-y-0 left-0 bg-[#1A1C1D] text-white z-[60] flex flex-col transition-transform duration-300 transform ${isSidebarOpen ? "w-64 translate-x-0" : "w-0 lg:w-20 -translate-x-full lg:translate-x-0 overflow-hidden"}`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#008060] rounded-xl flex items-center justify-center font-black italic text-lg shadow-lg">K</div>
            {isSidebarOpen && <span className="font-black tracking-tighter text-xl uppercase italic">Kolma<span className="text-[#008060]">POS</span></span>}
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          <MenuBtn active={activeTab === "pos"} onClick={() => { setActiveTab("pos"); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} label="Ventas POS" open={isSidebarOpen} icon={<Icons.Home />} />
          <MenuBtn active={activeTab === "historial"} onClick={() => { 
            if(activeTab !== "historial"){
              setAuthModal({ isOpen: true, action: 'historial' });
              if (window.innerWidth < 1024) setIsSidebarOpen(false);
            }
          }} label="Historial" open={isSidebarOpen} icon={<Icons.History />} />
          <MenuBtn active={activeTab === "clientes"} onClick={() => { setActiveTab("clientes"); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} label="Clientes" open={isSidebarOpen} icon={<Icons.Customers />} />
          <MenuBtn active={activeTab === "config"} onClick={() => { setActiveTab("config"); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} label="Ajustes" open={isSidebarOpen} icon={<Icons.Settings />} />
        </nav>

        <div className="p-4 border-t border-gray-800 shrink-0 space-y-2">
          <button onClick={() => { setAuthModal({ isOpen: true, action: 'cierre' }); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} className="flex items-center gap-4 w-full p-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest text-orange-500 hover:bg-orange-600 hover:text-white">
            <Icons.Power />{isSidebarOpen && <span>Corte de Caja</span>}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-4 w-full p-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest text-gray-500 hover:bg-gray-800 hover:text-white">
            <Icons.Lock />{isSidebarOpen && <span>Bloquear</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#E1E3E5] flex items-center px-4 md:px-6 gap-3 md:gap-4 shadow-sm sticky top-0 z-40 shrink-0">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Icons.Menu /></button>
          
          <div className="flex flex-col md:flex-row md:items-center bg-emerald-50 text-[#008060] px-3 md:px-4 py-1.5 md:py-2 rounded-xl border border-emerald-100 whitespace-nowrap shadow-sm">
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest md:mr-2">Ventas de Hoy</span>
            <span className="text-xs md:text-sm font-black tracking-tight">RD${shiftTotalSales.toLocaleString()}</span>
          </div>
          
          <div className="flex-1 relative">
            {activeTab === "pos" && (
              <>
                <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 scale-75 md:scale-100"><Icons.Search /></span>
                <input type="text" placeholder="Buscar productos..." className="w-full h-10 md:h-11 pl-10 md:pl-12 pr-4 bg-[#F1F2F3] border-none rounded-lg focus:ring-2 focus:ring-[#008060] font-medium outline-none text-sm" onChange={(e) => setSearch(e.target.value)} />
              </>
            )}
          </div>
          
          {activeTab === "pos" && (
            <button onClick={() => setIsTicketOpen(true)} className="xl:hidden relative p-2.5 bg-[#008060] text-white rounded-xl shadow-md active:scale-90">
              🛒 {currentTotalItems > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-bold ring-2 ring-white">{currentTotalItems}</span>}
            </button>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {error ? (
            <div className="bg-red-50 text-red-600 p-8 rounded-3xl text-center border border-red-100 max-w-lg mx-auto mt-10"><h2 className="font-black text-xl mb-2">Error de Conexión</h2><p className="text-sm font-medium">{error}</p></div>
          ) : activeTab === "pos" ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase italic tracking-tighter">Panel POS</h2>
              </div>
              {/* Ajuste de columnas para que los productos se vean más pequeños */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 md:gap-3 pb-20 xl:pb-0">
                {filteredProducts.map(p => (
                  <button key={p.id} onClick={() => addToTicket(p)} className="flex flex-col bg-white border border-[#E1E3E5] rounded-xl overflow-hidden hover:shadow-lg hover:border-[#008060] transition-all group active:scale-[0.97]">
                    <div className="aspect-square w-full bg-[#F9FAFB] p-2 flex items-center justify-center relative"><img src={p.image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" alt="" /></div>
                    <div className="p-2 md:p-3 border-t border-[#F1F2F3] text-left w-full">
                      <h3 className="font-bold text-[9px] md:text-[10px] text-gray-500 uppercase tracking-tight truncate mb-0.5">{p.name}</h3>
                      <p className="text-sm md:text-base font-black text-gray-900">RD${p.price.toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : activeTab === "historial" ? (
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase italic tracking-tighter mb-6">Historial de Ventas</h2>
              {salesHistory.length === 0 ? (
                <div className="text-center py-20 opacity-40 font-black uppercase tracking-widest text-gray-500">No hay ventas hoy</div>
              ) : (
                <div className="space-y-4">
                  {salesHistory.map(sale => (
                    <div key={sale.id} className="bg-white p-5 rounded-2xl border border-[#E1E3E5] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{sale.date}</p>
                        <p className="text-lg font-black text-gray-900">RD${sale.total.toLocaleString()} <span className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded ml-2">{sale.qty} piezas</span></p>
                      </div>
                      <div className="flex-1 flex flex-wrap gap-2">
                        {sale.items.map((i, idx) => (
                           <span key={idx} className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-100">{i.qty}x {i.name}</span>
                        ))}
                      </div>
                      <button onClick={() => deleteSale(sale.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0 flex items-center justify-center self-end md:self-auto"><Icons.Trash /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </main>

      {/* CARRITO POS DERECHO */}
      {activeTab === "pos" && (
        <>
          {isTicketOpen && <div onClick={() => setIsTicketOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] xl:hidden" />}
          <aside className={`fixed inset-y-0 right-0 w-full sm:w-[400px] lg:w-[420px] xl:static bg-white border-l border-[#E1E3E5] flex flex-col z-[80] xl:z-10 transition-transform duration-300 ease-in-out transform ${isTicketOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0"} shadow-2xl xl:shadow-none`}>
            <div className="h-16 px-6 border-b flex items-center justify-between bg-white shrink-0">
              <h2 className="text-lg font-black uppercase italic">Ticket</h2>
              <span className="bg-[#F1F2F3] text-gray-700 text-[10px] px-2.5 py-1 rounded-md font-black">{currentTotalItems} PZS</span>
              <button onClick={() => setIsTicketOpen(false)} className="xl:hidden p-2 text-gray-400"><Icons.Close /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar">
              {ticket.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-30 text-center scale-90"><div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-4xl border">🧾</div></div>
              ) : ticket.map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-white border p-3 rounded-2xl shadow-sm">
                  <img src={item.image} className="w-10 h-10 object-contain rounded-lg" alt="" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[11px] truncate uppercase mb-1">{item.name}</h4>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center bg-[#F1F2F3] rounded-lg overflow-hidden border">
                        <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 font-black text-gray-700 hover:bg-[#E1E3E5]">-</button>
                        <span className="w-7 text-center text-xs font-black bg-white border-x h-7 flex items-center justify-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 font-black text-gray-700 hover:bg-[#E1E3E5]">+</button>
                      </div>
                      <span className="font-black text-[#008060]">RD${(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  </div>
                  <button onClick={() => updateQty(item.id, -999)} className="text-gray-300 hover:text-red-500 p-2"><Icons.Trash /></button>
                </div>
              ))}
            </div>
            <div className="p-6 bg-[#F9FAFB] border-t shrink-0">
              <div className="mb-4">
                <p className="text-[10px] font-black uppercase text-gray-400">Total a Cobrar</p>
                <h3 className="text-4xl font-black italic">RD${currentTotalMoney.toLocaleString()}</h3>
              </div>
              <button disabled={currentTotalMoney === 0} onClick={handleCheckout} className={`w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest active:scale-95 ${currentTotalMoney > 0 ? "bg-[#008060] text-white shadow-[0_10px_20px_rgba(0,128,96,0.3)]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>Cerrar Venta</button>
            </div>
          </aside>
        </>
      )}

      {/* MODAL DE CONTRASEÑA */}
      {authModal.isOpen && (
        <div className="fixed inset-0 bg-[#1A1C1D]/90 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-[#202223] w-full max-w-sm rounded-[2rem] p-8 shadow-2xl border border-gray-800 animate-in zoom-in-95">
            <h2 className="text-xl font-black text-white uppercase italic text-center mb-6">
              {authModal.action === "cierre" ? "Autorizar Cierre" : authModal.action === "historial" ? "Autorizar Historial" : "Autorizar Reinicio"}
            </h2>
            <form onSubmit={handleModalAuth} className="space-y-4">
              <input type="password" autoFocus placeholder="Contraseña" value={modalPassInput} onChange={(e) => setModalPassInput(e.target.value)} className={`w-full bg-[#1A1C1D] border ${modalPassError ? 'border-red-500 text-red-500' : 'border-gray-700 text-white'} rounded-xl py-4 text-center font-black tracking-[0.5em] focus:outline-none focus:border-[#008060]`} />
              {modalPassError && <p className="text-red-500 text-center text-xs font-bold uppercase">Clave Inválida</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => setAuthModal({isOpen:false, action:null})} className="w-1/3 py-4 bg-gray-800 text-gray-400 rounded-xl font-black uppercase text-xs">Cancelar</button>
                <button type="submit" className="flex-1 py-4 bg-[#008060] text-white rounded-xl font-black uppercase text-xs">Confirmar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CORTE DE CAJA DETALLADO */}
      {showShiftModal && (
        <div className="fixed inset-0 bg-[#1A1C1D]/95 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="p-6 md:p-8 pb-4 text-center border-b shrink-0">
              <h2 className="text-2xl font-black uppercase italic mb-1">Corte de Caja</h2>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#F9FAFB] p-5 rounded-3xl border relative overflow-hidden">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Venta Total</p>
                  <p className="text-2xl font-black text-[#008060] tracking-tighter">RD${shiftTotalSales.toLocaleString()}</p>
                </div>
                <div className="bg-[#F9FAFB] p-5 rounded-3xl border relative overflow-hidden">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Total Piezas</p>
                  <p className="text-2xl font-black tracking-tighter">{shiftTotalItems}</p>
                </div>
              </div>
              <div className="mb-6">
                <h3 className="text-xs font-black uppercase text-gray-500 border-b pb-2 mb-3">Top Productos Vendidos</h3>
                <div className="space-y-2">
                  {Object.values(shiftSoldProducts).length === 0 ? <p className="text-sm text-gray-400">Sin ventas.</p> : 
                    Object.values(shiftSoldProducts).sort((a,b) => b.qty - a.qty).map((p, i) => (
                      <div key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border">
                        <div><p className="font-bold text-xs uppercase">{p.name}</p><p className="text-[10px] text-gray-500 uppercase">{p.qty} piezas</p></div>
                        <p className="font-black text-[#008060] text-sm">RD${p.total.toLocaleString()}</p>
                      </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={handleDownloadReport} disabled={shiftTotalSales === 0} className="p-4 bg-gray-100 hover:bg-gray-200 rounded-2xl font-black text-[10px] uppercase flex flex-col items-center gap-2"><Icons.Download />Descargar</button>
                <button onClick={handleSendWhatsapp} disabled={shiftTotalSales === 0} className="p-4 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-2xl font-black text-[10px] uppercase flex flex-col items-center gap-2"><Icons.Whatsapp />WhatsApp</button>
              </div>
              <div className="space-y-2">
                <button onClick={() => setAuthModal({ isOpen: true, action: 'reinicio' })} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95">Reiniciar Caja a Cero</button>
                <button onClick={() => setShowShiftModal(false)} className="w-full py-4 bg-white border-2 text-gray-600 rounded-2xl font-black text-sm uppercase tracking-widest active:scale-95">Volver al POS</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuBtn({ active, onClick, label, open, icon }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-3.5 py-3.5 rounded-xl transition-all ${active ? "bg-[#008060] text-white shadow-lg translate-x-1" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
      <div className="flex-shrink-0">{icon}</div>
      {open && <span className="font-black text-xs uppercase tracking-widest">{label}</span>}
    </button>
  );
}
