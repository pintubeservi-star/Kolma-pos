"use client";
import React, { useState, useEffect } from "react";

export default function KolmaPOS() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [ticket, setTicket] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTicketOpen, setIsTicketOpen] = useState(false); // Para control en móviles

  // Carga los productos desde tu API interna (que ya tiene los tokens seguros)
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-900 text-white font-black animate-pulse uppercase tracking-widest">
      Iniciando Kolma POS...
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-100 overflow-hidden font-sans">
      
      {/* --- SECCIÓN IZQUIERDA: CATÁLOGO DE PRODUCTOS --- */}
      <main className="flex-[2] flex flex-col min-w-0 bg-white shadow-xl">
        {/* Header con Buscador */}
        <header className="p-4 md:p-6 border-b flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-black italic text-slate-900 tracking-tighter">
              KOLMA<span className="text-blue-600">POS</span>
            </h1>
            {/* Botón flotante para ver ticket en móviles */}
            <button 
              onClick={() => setIsTicketOpen(true)}
              className="lg:hidden relative p-3 bg-blue-600 text-white rounded-2xl shadow-lg active:scale-95"
            >
              🛒 <span className="absolute -top-2 -right-2 bg-red-500 text-[10px] w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                {ticket.length}
              </span>
            </button>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar por nombre..." 
              className="w-full p-4 pl-12 bg-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 font-bold transition-all text-lg"
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute left-4 top-4.5 text-xl opacity-30">🔍</span>
          </div>
        </header>

        {/* Grid de Productos - Ajustado para dedos en móvil */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
          {filtered.map(p => (
            <button 
              key={p.id} 
              onClick={() => addToTicket(p)}
              className="bg-white border border-slate-200 p-3 md:p-4 rounded-[2rem] hover:border-blue-600 hover:shadow-xl transition-all text-left active:scale-95 group"
            >
              <div className="w-full h-24 md:h-32 mb-3 overflow-hidden rounded-2xl bg-slate-50">
                <img src={p.image} className="w-full h-full object-contain group-hover:scale-110 transition-transform" alt={p.name} />
              </div>
              <h3 className="font-bold text-slate-800 text-xs md:text-sm h-10 overflow-hidden uppercase leading-tight">
                {p.name}
              </h3>
              <p className="text-blue-600 font-black text-lg md:text-xl mt-2 italic">RD${p.price.toLocaleString()}</p>
            </button>
          ))}
        </div>
      </main>

      {/* --- SECCIÓN DERECHA: TICKET / CAJA REGISTRADORA --- */}
      {/* En móvil es un panel lateral que sale desde la derecha */}
      <aside className={`
        fixed inset-0 lg:relative lg:inset-auto lg:flex-1 bg-slate-900 text-white z-50 transform transition-transform duration-300
        ${isTicketOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex flex-col h-full p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black uppercase italic tracking-tighter">Orden Actual</h2>
            <button onClick={() => setIsTicketOpen(false)} className="lg:hidden text-slate-400 font-bold">CERRAR ✕</button>
          </div>

          {/* Lista de productos en el ticket */}
          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            {ticket.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <span className="text-6xl mb-4">📝</span>
                <p className="font-bold text-xs uppercase tracking-widest">Esperando venta...</p>
              </div>
            ) : ticket.map(item => (
              <div key={item.id} className="flex items-center gap-3 bg-slate-800 p-4 rounded-2xl border border-slate-700">
                <div className="flex-1">
                  <p className="font-bold text-xs uppercase leading-tight line-clamp-1">{item.name}</p>
                  <p className="text-blue-400 font-black text-sm">RD${(item.price * item.qty).toLocaleString()}</p>
                </div>
                <div className="flex items-center bg-slate-700 rounded-xl p-1 scale-90 md:scale-100">
                  <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 font-black text-xl hover:text-blue-400">-</button>
                  <span className="w-8 text-center font-bold text-sm">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 font-black text-xl hover:text-blue-400">+</button>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL Y BOTÓN DE COBRO --- */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <div className="flex justify-between items-end mb-6">
              <span className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Total Final</span>
              <span className="text-5xl font-black text-white tracking-tighter italic">RD${total.toLocaleString()}</span>
            </div>
            
            <button 
              onClick={() => { alert('¡VENTA EXITOSA!'); setTicket([]); setIsTicketOpen(false); }}
              className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-2xl uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-900/40 disabled:bg-slate-800 disabled:text-slate-600"
              disabled={total === 0}
            >
              COBRAR AHORA
            </button>
            <button 
              onClick={() => setTicket([])}
              className="w-full mt-4 text-slate-500 font-bold text-xs uppercase hover:text-red-400 transition-colors"
            >
              Cancelar Todo
            </button>
          </div>
        </div>
      </aside>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
                }
        
