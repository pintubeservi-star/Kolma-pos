"use client";
import React, { useState, useEffect } from "react";

export default function KolmaPOS() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [ticket, setTicket] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const addToTicket = (p) => {
    setTicket(prev => {
      const exists = prev.find(i => i.id === p.id);
      if (exists) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...p, qty: 1 }];
    });
  };

  const removeFromTicket = (id) => setTicket(prev => prev.filter(i => i.id !== id));
  
  const total = ticket.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-blue-600 animate-pulse">CARGANDO SISTEMA...</div>;

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden">
      
      {/* PANEL DE PRODUCTOS */}
      <div className="flex-[2] flex flex-col bg-white">
        <header className="p-6 border-b">
          <div className="relative">
            <input 
              type="text" 
              placeholder="BUSCAR PRODUCTO..." 
              className="w-full p-5 bg-slate-100 rounded-2xl text-xl font-bold border-2 border-transparent focus:border-blue-600 outline-none transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute right-5 top-5 text-2xl">🔍</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(p => (
            <button 
              key={p.id} 
              onClick={() => addToTicket(p)}
              className="group bg-white border border-slate-200 p-4 rounded-3xl hover:shadow-2xl hover:border-blue-600 transition-all text-left active:scale-95"
            >
              <img src={p.image} className="w-full h-32 object-contain rounded-xl mb-3" alt={p.name} />
              <h3 className="font-bold text-slate-800 text-sm h-10 overflow-hidden uppercase">{p.name}</h3>
              <p className="text-blue-600 font-black text-2xl mt-2">RD${p.price.toLocaleString()}</p>
            </button>
          ))}
        </div>
      </div>

      {/* CAJA REGISTRADORA (DERECHA) */}
      <div className="flex-1 flex flex-col bg-slate-900 shadow-2xl">
        <div className="p-8 border-b border-slate-800">
          <h2 className="text-white text-3xl font-black italic">TICKET</h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Kolma RD POS</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {ticket.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-700">
              <span className="text-6xl mb-4">🛒</span>
              <p className="font-bold uppercase tracking-widest text-xs">Sin artículos</p>
            </div>
          ) : ticket.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-slate-800 p-4 rounded-2xl border border-slate-700 animate-in fade-in slide-in-from-right-5">
              <div className="flex-1">
                <p className="text-white font-bold text-sm uppercase leading-tight">{item.name}</p>
                <p className="text-blue-400 font-black text-xs">RD${item.price} x {item.qty}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-white font-black text-lg">RD${(item.price * item.qty).toLocaleString()}</p>
                <button onClick={() => removeFromTicket(item.id)} className="text-red-500 font-bold text-xl hover:scale-110">✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* TOTAL Y ACCIÓN DE PAGO */}
        <div className="p-8 bg-slate-800 rounded-t-[3rem]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-400 font-bold uppercase text-sm">Total a Cobrar</span>
            <span className="text-5xl font-black text-white tracking-tighter">RD${total.toLocaleString()}</span>
          </div>
          
          <button 
            onClick={() => { alert('VENTA REGISTRADA'); setTicket([]); }}
            className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-2xl uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-900/40 disabled:bg-slate-700 disabled:text-slate-500"
            disabled={total === 0}
          >
            REGISTRAR PAGO
          </button>
          <button onClick={() => setTicket([])} className="w-full mt-4 text-slate-500 font-bold text-xs uppercase hover:text-white transition-colors">Cancelar Orden</button>
        </div>
      </div>
    </div>
  );
          }
