"use client";
import React, { useState, useEffect } from "react";

// Iconos SVG (Mantenidos iguales, añadimos uno de descarga y whatsapp)
const Icons = {
  Home: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  Inventory: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>,
  Customers: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
  Settings: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>,
  Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>,
  Power: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
  Download: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>,
  Whatsapp: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.48 2 2 6.48 2 12c0 1.74.45 3.37 1.22 4.8L2 22l5.37-1.14A9.97 9.97 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.38 14.16c-.23.65-1.34 1.25-1.93 1.34-.54.08-1.2-.02-3.87-1.12-3.21-1.33-5.28-4.66-5.44-4.87-.16-.21-1.3-1.73-1.3-3.3 0-1.57.82-2.35 1.11-2.65.29-.31.64-.38.85-.38.22 0 .44 0 .63.01.21.01.5-.08.77.58.29.7.99 2.42 1.08 2.6.09.18.15.4.02.66-.12.26-.18.42-.36.63-.18.21-.38.45-.55.62-.19.18-.39.37-.18.73.21.36.95 1.56 2.03 2.53 1.39 1.25 2.56 1.63 2.92 1.81.36.18.57.15.79-.11.21-.26.92-1.07 1.17-1.44.25-.37.5-.31.83-.18.33.13 2.1.99 2.46 1.17.36.18.6.27.69.42.09.15.09.87-.14 1.52z"/></svg>
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
  
  // Novedad: Registro detallado de ventas
  const [shiftStats, setShiftStats] = useState({ 
    totalSales: 0, 
    itemsSold: 0,
    soldProductsList: {} // Aquí guardaremos { "id_producto": { name: "Cerveza", qty: 2, total: 500 } }
  });
  
  const [showShiftModal, setShowShiftModal] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error(`Error ${res.status}: Fallo de conexión con Shopify`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
    if (typeof window !== "undefined" && window.innerWidth > 1024) {
      setIsSidebarOpen(true);
    }
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

  const currentTotalMoney = ticket.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const currentTotalItems = ticket.reduce((acc, item) => acc + item.qty, 0);

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckout = () => {
    if (ticket.length === 0) return;
    
    // 1. Actualizar el registro detallado de productos vendidos
    const newSoldList = { ...shiftStats.soldProductsList };
    
    ticket.forEach(item => {
      if (newSoldList[item.id]) {
        newSoldList[item.id].qty += item.qty;
        newSoldList[item.id].total += (item.price * item.qty);
      } else {
        newSoldList[item.id] = {
          name: item.name,
          qty: item.qty,
          total: item.price * item.qty
        };
      }
    });

    // 2. Guardar en el estado del turno
    setShiftStats(prev => ({
      totalSales: prev.totalSales + currentTotalMoney,
      itemsSold: prev.itemsSold + currentTotalItems,
      soldProductsList: newSoldList
    }));

    setTicket([]);
    setIsTicketOpen(false);
    alert("Venta registrada y sumada al corte de caja correctamente.");
  };

  // Funciones para Exportar Reporte
  const generateReportText = () => {
    // Ordenar productos de mayor a menor cantidad vendida
    const sortedProducts = Object.values(shiftStats.soldProductsList).sort((a, b) => b.qty - a.qty);
    
    let report = `🧾 CIERRE DE CAJA - KOLMA POS\n`;
    report += `📅 Fecha: ${new Date().toLocaleString()}\n`;
    report += `--------------------------------\n`;
    report += `💰 Venta Total: RD$${shiftStats.totalSales.toLocaleString()}\n`;
    report += `📦 Piezas Vendidas: ${shiftStats.itemsSold}\n`;
    report += `--------------------------------\n`;
    report += `📊 DETALLE DE PRODUCTOS VENDIDOS (Mayor a Menor):\n\n`;
    
    if (sortedProducts.length === 0) {
      report += `No hubo ventas en este turno.\n`;
    } else {
      sortedProducts.forEach(p => {
        report += `• ${p.name}\n`;
        report += `  Cantidad: ${p.qty} | Ingreso: RD$${p.total.toLocaleString()}\n\n`;
      });
    }
    
    return report;
  };

  const handleDownloadReport = () => {
    const reportText = generateReportText();
    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Cierre_Caja_KolmaPOS_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSendWhatsapp = () => {
    const reportText = generateReportText();
    const encodedText = encodeURIComponent(reportText);
    // Cambia el número abajo si quieres enviarlo siempre a un número fijo, ej: "18091234567"
    // Si lo dejas vacío, abrirá WhatsApp Web/App para que elijas a quién enviarlo.
    const phoneNumber = ""; 
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  const resetShift = () => {
    if(confirm("¿Estás seguro de que deseas reiniciar la caja? El reporte actual se borrará si no lo has exportado.")){
      setShiftStats({ totalSales: 0, itemsSold: 0, soldProductsList: {} });
      setShowShiftModal(false);
      alert("Caja reiniciada a cero.");
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#F6F6F7]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#008060] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#008060] font-black tracking-widest uppercase text-xs">Conectando con Kolma POS</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F6F6F7] text-[#202223] font-sans overflow-hidden relative">
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E1E3E5; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #008060; }
      `}} />
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[50] lg:hidden transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 bg-[#1A1C1D] text-white z-[60] flex flex-col transition-transform duration-300 transform ${isSidebarOpen ? "w-64 translate-x-0" : "w-0 lg:w-20 -translate-x-full lg:translate-x-0 overflow-hidden"}`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#008060] rounded-xl flex items-center justify-center font-black italic text-lg shadow-lg">K</div>
            {isSidebarOpen && <span className="font-black tracking-tighter text-xl uppercase italic">Kolma<span className="text-[#008060]">POS</span></span>}
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          <MenuBtn active={activeTab === "ventas"} onClick={() => { setActiveTab("ventas"); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} label="Ventas" open={isSidebarOpen} icon={<Icons.Home />} />
          <MenuBtn active={activeTab === "inventario"} onClick={() => { setActiveTab("inventario"); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} label="Inventario" open={isSidebarOpen} icon={<Icons.Inventory />} />
          <MenuBtn active={activeTab === "clientes"} onClick={() => { setActiveTab("clientes"); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} label="Clientes" open={isSidebarOpen} icon={<Icons.Customers />} />
          <MenuBtn active={activeTab === "config"} onClick={() => { setActiveTab("config"); if (window.innerWidth < 1024) setIsSidebarOpen(false); }} label="Ajustes" open={isSidebarOpen} icon={<Icons.Settings />} />
        </nav>

        <div className="p-4 border-t border-gray-800 shrink-0">
          <button 
            onClick={() => { setShowShiftModal(true); if (window.innerWidth < 1024) setIsSidebarOpen(false); }}
            className={`flex items-center gap-4 w-full p-3 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest text-orange-500 hover:bg-orange-600 hover:text-white`}
          >
            <Icons.Power />
            {isSidebarOpen && <span>Corte de Caja</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#E1E3E5] flex items-center px-4 md:px-6 gap-4 shadow-sm sticky top-0 z-40 shrink-0">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Icons.Menu />
          </button>
          
          <div className="flex-1 relative">
            <span className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 scale-75 md:scale-100"><Icons.Search /></span>
            <input 
              type="text" 
              placeholder="Buscar productos en sistema..." 
              className="w-full h-10 md:h-11 pl-10 md:pl-12 pr-4 bg-[#F1F2F3] border-none rounded-lg focus:ring-2 focus:ring-[#008060] font-medium transition-all outline-none text-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <button 
            onClick={() => setIsTicketOpen(true)}
            className="xl:hidden relative p-2.5 bg-[#008060] text-white rounded-xl shadow-md active:scale-90 transition-transform"
          >
            🛒 {currentTotalItems > 0 && <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-bold ring-2 ring-white">{currentTotalItems}</span>}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          {error ? (
            <div className="bg-red-50 text-red-600 p-8 rounded-3xl text-center border border-red-100 max-w-lg mx-auto mt-10">
              <h2 className="font-black text-xl mb-2">Error de Sincronización</h2>
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase italic tracking-tighter">Panel de Ventas</h2>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-emerald-100 text-[#008060] rounded-full border border-emerald-200 shadow-sm">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[10px] font-black uppercase tracking-widest">Shopify En Línea</span>
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 opacity-40 font-black uppercase tracking-widest">
                  No hay productos disponibles
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-5 pb-20 xl:pb-0">
                  {filteredProducts.map(p => (
                    <button 
                      key={p.id} 
                      onClick={() => addToTicket(p)}
                      className="flex flex-col bg-white border border-[#E1E3E5] rounded-2xl overflow-hidden hover:shadow-xl hover:border-[#008060] transition-all group active:scale-[0.97]"
                    >
                      <div className="aspect-square w-full bg-[#F9FAFB] p-3 md:p-4 flex items-center justify-center relative overflow-hidden">
                        <img src={p.image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" alt={p.name} />
                      </div>
                      <div className="p-3 md:p-4 border-t border-[#F1F2F3] text-left w-full">
                        <h3 className="font-bold text-[10px] md:text-xs text-gray-500 uppercase tracking-tight truncate mb-1">{p.name}</h3>
                        <p className="text-base md:text-lg font-black text-gray-900">RD${p.price.toLocaleString()}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {isTicketOpen && (
        <div 
          onClick={() => setIsTicketOpen(false)} 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] xl:hidden transition-opacity" 
        />
      )}
      
      <aside className={`fixed inset-y-0 right-0 w-full sm:w-[400px] lg:w-[420px] xl:static bg-white border-l border-[#E1E3E5] flex flex-col z-[80] xl:z-10 transition-transform duration-300 ease-in-out transform ${isTicketOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0"} shadow-2xl xl:shadow-none`}>
        <div className="h-16 px-6 border-b border-[#E1E3E5] flex items-center justify-between bg-white sticky top-0 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black uppercase tracking-tighter italic">Venta Actual</h2>
            <span className="bg-[#F1F2F3] text-gray-700 text-[10px] px-2.5 py-1 rounded-md font-black tracking-widest">{currentTotalItems} PIEZAS</span>
          </div>
          <button onClick={() => setIsTicketOpen(false)} className="xl:hidden p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"><Icons.Close /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar">
          {ticket.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 text-center scale-90">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-4xl shadow-inner border border-gray-100">🧾</div>
              <p className="font-black text-[10px] uppercase tracking-widest text-gray-500 leading-relaxed">Selecciona productos<br/>para armar la venta</p>
            </div>
          ) : ticket.map(item => (
            <div key={item.id} className="flex items-center gap-3 md:gap-4 bg-white border border-[#E1E3E5] p-3 rounded-2xl shadow-sm hover:border-[#008060] transition-colors group">
              <div className="w-12 h-12 bg-[#F9FAFB] rounded-xl p-1 shrink-0 overflow-hidden">
                <img src={item.image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" alt={item.name} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[11px] truncate uppercase text-gray-800 mb-1.5">{item.name}</h4>
                <div className="flex items-center justify-between">
                   <div className="flex items-center bg-[#F1F2F3] rounded-lg overflow-hidden border border-[#E1E3E5]">
                    <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 flex items-center justify-center hover:bg-[#E1E3E5] text-gray-700 font-black transition-colors">-</button>
                    <span className="w-7 text-center text-xs font-black text-gray-900 bg-white border-x border-[#E1E3E5] h-7 flex items-center justify-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 flex items-center justify-center hover:bg-[#E1E3E5] text-gray-700 font-black transition-colors">+</button>
                  </div>
                  <span className="font-black text-sm text-[#008060]">RD${(item.price * item.qty).toLocaleString()}</span>
                </div>
              </div>
              <button onClick={() => updateQty(item.id, -999)} className="text-gray-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"><Icons.Trash /></button>
            </div>
          ))}
        </div>

        <div className="p-6 bg-[#F9FAFB] border-t border-[#E1E3E5] shrink-0">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em] mb-1">Total a Cobrar</p>
              <h3 className="text-4xl font-black text-gray-900 tracking-tighter italic">RD${currentTotalMoney.toLocaleString()}</h3>
            </div>
          </div>
          
          <button 
            disabled={currentTotalMoney === 0}
            onClick={handleCheckout}
            className={`w-full py-5 rounded-2xl font-black text-xl uppercase tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-2 ${
              currentTotalMoney > 0 
              ? "bg-[#008060] text-white hover:bg-[#006e52] shadow-[0_10px_20px_rgba(0,128,96,0.3)]" 
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Cerrar Venta
          </button>
        </div>
      </aside>

      {/* MODAL CORTE DE CAJA (RESUMEN DETALLADO Y EXPORTACIÓN) */}
      {showShiftModal && (
        <div className="fixed inset-0 bg-[#1A1C1D]/95 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-8 md:p-10 pb-6 text-center border-b border-gray-100 shrink-0">
              <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-gray-900 mb-2">Corte de Caja</h2>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Resumen y Exportación de Turno</p>
            </div>
            
            <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar flex-1">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#F9FAFB] p-5 rounded-3xl border border-[#E1E3E5] flex flex-col items-start relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -z-10"></div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Venta Total</p>
                  <p className="text-2xl font-black text-[#008060] tracking-tighter">RD${shiftStats.totalSales.toLocaleString()}</p>
                </div>
                <div className="bg-[#F9FAFB] p-5 rounded-3xl border border-[#E1E3E5] flex flex-col items-start relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -z-10"></div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Piezas</p>
                  <p className="text-2xl font-black text-gray-900 tracking-tighter">{shiftStats.itemsSold}</p>
                </div>
              </div>

              {/* LISTA DE PRODUCTOS VENDIDOS ORDENADOS */}
              <div className="mb-8">
                <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest mb-4 border-b pb-2">Top Productos Vendidos</h3>
                <div className="space-y-3">
                  {Object.values(shiftStats.soldProductsList).length === 0 ? (
                    <p className="text-sm text-gray-400 italic">No se han registrado ventas en este turno.</p>
                  ) : (
                    Object.values(shiftStats.soldProductsList)
                      .sort((a, b) => b.qty - a.qty)
                      .map((p, index) => (
                        <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                          <div className="flex-1 min-w-0 pr-4">
                            <p className="font-bold text-xs text-gray-800 truncate uppercase">{p.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{p.qty} piezas vendidas</p>
                          </div>
                          <p className="font-black text-[#008060] text-sm">RD${p.total.toLocaleString()}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* BOTONES DE EXPORTACIÓN */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <button 
                  onClick={handleDownloadReport}
                  disabled={shiftStats.totalSales === 0}
                  className="flex flex-col items-center justify-center p-4 bg-[#F1F2F3] hover:bg-gray-200 text-gray-800 rounded-2xl transition-colors disabled:opacity-50"
                >
                  <Icons.Download />
                  <span className="text-[10px] font-black uppercase mt-2">Descargar PC</span>
                </button>
                <button 
                  onClick={handleSendWhatsapp}
                  disabled={shiftStats.totalSales === 0}
                  className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-2xl transition-colors disabled:opacity-50"
                >
                  <Icons.Whatsapp />
                  <span className="text-[10px] font-black uppercase mt-2">Enviar a Móvil</span>
                </button>
              </div>

              {/* BOTONES DE ACCIÓN DEL MODAL */}
              <div className="space-y-3">
                <button 
                  onClick={resetShift}
                  className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-orange-700 transition-all shadow-[0_10px_20px_rgba(234,88,12,0.3)] active:scale-95"
                >
                  Reiniciar Caja a Cero
                </button>
                <button 
                  onClick={() => setShowShiftModal(false)}
                  className="w-full py-4 bg-white border-2 border-[#E1E3E5] text-gray-600 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-95"
                >
                  Volver al POS
                </button>
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
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-3.5 py-3.5 rounded-xl transition-all ${
        active 
        ? "bg-[#008060] text-white shadow-[0_8px_16px_rgba(0,128,96,0.25)] translate-x-1" 
        : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >
      <div className="flex-shrink-0">{icon}</div>
      {open && <span className="font-black text-xs uppercase tracking-widest">{label}</span>}
    </button>
  );
}
