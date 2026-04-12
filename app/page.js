"use client";
import React, { useState, useEffect } from "react";

// Iconos SVG Premium restaurados
const Icons = {
  Home: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  Inventory: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>,
  Customers: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
  Settings: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>,
  Power: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
};

export default function KolmaPOSPremium() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [ticket, setTicket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ventas");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [shiftStats, setShiftStats] = useState({ totalSales: 0, ordersCount: 0 });
  const [showShiftModal, setShowShiftModal] = useState(false);

  useEffect(() => {
    async function fetchShopifyProducts() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error(`Error ${res.status}: Verifica tus credenciales de Shopify`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchShopifyProducts();
    if (window.innerWidth > 1024) setIsSidebarOpen(true);
  }, []);

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

  const total = ticket.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const filteredProducts = products.filter(p => p.name?.toLowerCase().includes(search.toLowerCase()));

  const handleCheckout = () => {
    setShiftStats(prev => ({
      totalSales: prev.totalSales + total,
      ordersCount: prev.ordersCount + 1
    }));
    setTicket([]);
    setIsTicketOpen(false);
  };

  const resetShift = () => {
    setShiftStats({ totalSales: 0, ordersCount: 0 });
    setShowShiftModal(false);
    alert("Turno cerrado con éxito.");
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F6F6F7]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#008060] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#202223] font-bold tracking-widest uppercase text-[10px]">Cargando Kolma POS</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F6F6F7] text-[#202223] font-sans overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E1E3E5; border-radius: 10px; }
      `}} />
      
      {/* SIDEBAR PREMIUM */}
      <aside className={`fixed lg:static inset-y-0 left-0 bg-[#1A1C1D] text-white z-[60] flex flex-col transition-all duration-300 ${isSidebarOpen ? "w-64" : "w-0 lg:w-20 overflow-hidden"}`}>
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
          <div className="w-10 h-10 bg-[#008060] rounded-xl flex items-center justify-center font-black italic shadow-lg">K</div>
          {isSidebarOpen && <span className="font-black tracking-tighter text-xl uppercase italic">Kolma<span className="text-[#008060]">POS</span></span>}
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-2">
          <MenuBtn active={activeTab === "ventas"} onClick={() => setActiveTab("ventas")} label="Ventas" open={isSidebarOpen} icon={<Icons.Home />} />
          <MenuBtn active={activeTab === "inventario"} onClick={() => setActiveTab("inventario")} label="Inventario" open={isSidebarOpen} icon={<Icons.Inventory />} />
          <MenuBtn active={activeTab === "clientes"} onClick={() => setActiveTab("clientes")} label="Clientes" open={isSidebarOpen} icon={<Icons.Customers />} />
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button onClick={() => setShowShiftModal(true)} className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest text-orange-500 hover:bg-orange-600 hover:text-white`}>
            <Icons.Power /> {isSidebarOpen && <span>Cierre de Turno</span>}
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b flex items-center px-6 gap-4 shadow-sm sticky top-0 z-40">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600"><Icons.Menu /></button>
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icons.Search /></span>
            <input 
              type="text" placeholder="Buscar productos de Shopify..." 
              className="w-full h-11 pl-12 pr-4 bg-[#F1F2F3] border-none rounded-lg focus:ring-2 focus:ring-[#008060] font-medium outline-none text-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {error ? (
            <div className="bg-red-50 text-red-600 p-8 rounded-3xl text-center border border-red-100">
              <h2 className="font-black text-xl mb-2">Error de Sincronización</h2>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-800 uppercase italic tracking-tighter">Panel de Ventas</h2>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-100 text-[#008060] rounded-full border border-emerald-200">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Shopify Conectado</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
                {filteredProducts.map(p => (
                  <button key={p.id} onClick={() => addToTicket(p)} className="flex flex-col bg-white border border-[#E1E3E5] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#008060] transition-all group active:scale-[0.97]">
                    <div className="aspect-square w-full bg-[#F9FAFB] p-4 flex items-center justify-center">
                      <img src={p.image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" alt={p.name} />
                    </div>
                    <div className="p-4 border-t border-[#F1F2F3] text-left">
                      <h3 className="font-bold text-[10px] text-gray-500 uppercase tracking-tight truncate mb-1">{p.name}</h3>
                      <p className="text-lg font-black text-gray-900">RD${p.price.toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* PANEL DE TICKET (SIDEBAR DERECHO) */}
      <aside className="hidden xl:flex w-[400px] bg-white border-l border-[#E1E3E5] flex-col">
        <div className="h-16 px-6 border-b flex items-center justify-between">
          <h2 className="text-lg font-black uppercase tracking-tighter italic">Venta Actual</h2>
          <span className="bg-gray-100 text-gray-600 text-[10px] px-2.5 py-1 rounded-md font-bold">{ticket.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
          {ticket.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center scale-90">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-4xl">🧾</div>
              <p className="font-black text-[10px] uppercase tracking-widest">Selecciona productos</p>
            </div>
          ) : ticket.map(item => (
            <div key={item.id} className="flex items-center gap-4 bg-white border border-gray-100 p-3 rounded-2xl shadow-sm hover:border-[#008060] transition-all">
              <div className="w-12 h-12 bg-gray-50 rounded-xl p-1 shrink-0"><img src={item.image} className="w-full h-full object-contain" alt="" /></div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[11px] truncate uppercase mb-1.5">{item.name}</h4>
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-[#F1F2F3] rounded-lg border">
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 font-bold hover:bg-gray-200">-</button>
                    <span className="w-7 text-center text-xs font-black">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 font-bold hover:bg-gray-200">+</button>
                  </div>
                  <span className="font-black text-sm text-[#008060]">RD${(item.price * item.qty).toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => updateQty(item.id, -999)} className="text-gray-300 hover:text-red-500 p-1"><Icons.Trash /></button>
            </div>
          ))}
        </div>

        <div className="p-6 bg-[#F9FAFB] border-t">
          <div className="mb-6 text-left">
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Total a Cobrar</p>
            <h3 className="text-4xl font-black text-gray-900 tracking-tighter italic">RD${total.toLocaleString()}</h3>
          </div>
          <button 
            disabled={total === 0} onClick={handleCheckout}
            className={`w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-xl active:scale-95 ${total > 0 ? "bg-[#008060] text-white shadow-emerald-200" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
          >
            Cobrar Ahora
          </button>
        </div>
      </aside>

      {/* MODAL CIERRE DE TURNO */}
      {showShiftModal && (
        <div className="fixed inset-0 bg-[#1A1C1D]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl"><Icons.Power /></div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter text-gray-900 mb-8">Resumen de Turno</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#F9FAFB] p-6 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Ventas Totales</p>
                  <p className="text-xl font-black text-[#008060]">RD${shiftStats.totalSales.toLocaleString()}</p>
                </div>
                <div className="bg-[#F9FAFB] p-6 rounded-3xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Órdenes</p>
                  <p className="text-xl font-black text-gray-900">{shiftStats.ordersCount}</p>
                </div>
              </div>
              <div className="space-y-3">
                <button onClick={resetShift} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-orange-200">Confirmar y Cerrar</button>
                <button onClick={() => setShowShiftModal(false)} className="w-full py-4 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest">Seguir Vendiendo</button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuBtn({ active, onClick, label, open, icon }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-3.5 py-3 rounded-xl transition-all ${active ? "bg-[#008060] text-white shadow-lg translate-x-1" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
      <div className="flex-shrink-0">{icon}</div>
      {open && <span className="font-bold text-sm tracking-tight">{label}</span>}
    </button>
  );
}

