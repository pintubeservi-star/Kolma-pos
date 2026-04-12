"use client";
import React, { useState, useMemo } from "react";

export default function KolmaPOS() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Inventario Premium de ejemplo
  const products = [
    { id: 1, name: "Queso de Freír Premium", price: 320, category: "Lácteos", icon: "🧀", color: "bg-yellow-100" },
    { id: 2, name: "Salami Super Especial", price: 210, category: "Embutidos", icon: "🍖", color: "bg-red-100" },
    { id: 3, name: "Arroz Selecto (10lb)", price: 350, category: "Granos", icon: "🍚", color: "bg-blue-100" },
    { id: 4, name: "Aceite de Oliva 500ml", price: 480, category: "Abarrotes", icon: "🫒", color: "bg-green-100" },
    { id: 5, name: "Café Santo Domingo 1lb", price: 295, category: "Abarrotes", icon: "☕", color: "bg-amber-100" },
    { id: 6, name: "Leche Entera Pack", price: 540, category: "Lácteos", icon: "🥛", color: "bg-sky-100" },
  ];

  const categories = ["Todos", "Lácteos", "Embutidos", "Granos", "Abarrotes"];

  const filteredProducts = products.filter(p => 
    (category === "Todos" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
    ).filter(item => item.qty > 0));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      
      {/* SECCIÓN IZQUIERDA: CATÁLOGO */}
      <main className="flex-1 flex flex-col min-w-0 bg-white shadow-2xl z-10 lg:rounded-r-[2.5rem] overflow-hidden">
        
        {/* Header Premium */}
        <header className="p-6 md:p-8 space-y-6 border-b border-slate-100">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase italic">Kolma<span className="text-blue-600">POS</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Terminal de Ventas Profesional</p>
            </div>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="lg:hidden relative p-3 bg-slate-100 rounded-2xl active:scale-90 transition-all"
            >
              <span className="text-xl">🛒</span>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full shadow-lg ring-4 ring-white">
                  {cart.length}
                </span>
              )}
            </button>
          </div>

          {/* Buscador y Filtros */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Buscar por nombre o categoría..." 
                className="w-full p-4 pl-12 bg-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white border-2 border-transparent focus:border-blue-600 transition-all font-medium"
                onChange={(e) => setSearch(e.target.value)}
              />
              <span className="absolute left-4 top-4.5 text-xl opacity-30">🔍</span>
            </div>
            
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    category === cat 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 translate-y-[-2px]" 
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Grid de Productos */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 custom-scrollbar">
          {filteredProducts.map(p => (
            <button 
              key={p.id}
              onClick={() => addToCart(p)}
              className="group relative flex flex-col p-6 bg-white rounded-[2rem] border-2 border-slate-50 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-100 transition-all text-left active:scale-95 overflow-hidden"
            >
              <div className={`w-14 h-14 ${p.color} rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                {p.icon}
              </div>
              <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1">{p.name}</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase mb-4 tracking-tighter">{p.category}</p>
              <div className="mt-auto flex justify-between items-center">
                <span className="text-xl font-black text-slate-900">RD${p.price}</span>
                <div className="bg-slate-900 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M12 5v14M5 12h14"/></svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* SECCIÓN DERECHA: CARRITO (MODERNO) */}
      <aside className={`
        fixed inset-y-0 right-0 w-full md:w-[450px] bg-slate-50 z-50 transform transition-all duration-500 ease-in-out lg:relative lg:translate-x-0
        ${isCartOpen ? "translate-x-0 shadow-[-50px_0_100px_rgba(0,0,0,0.1)]" : "translate-x-full lg:translate-x-0"}
      `}>
        <div className="h-full flex flex-col p-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-black uppercase italic tracking-tighter">Tu Orden</h2>
              <p className="text-[10px] font-black text-blue-600 tracking-[0.3em] uppercase">{cart.length} Artículos</p>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="lg:hidden p-4 bg-white rounded-full shadow-sm text-xs font-black">CERRAR</button>
          </div>

          {/* Lista del Carrito */}
          <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 grayscale">
                <span className="text-6xl mb-4">📦</span>
                <p className="font-black uppercase text-xs tracking-[0.2em]">Esperando Selección</p>
              </div>
            ) : cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 animate-in slide-in-from-right-10">
                <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-xl`}>{item.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{item.name}</h4>
                  <p className="text-xs font-black text-blue-600">RD${(item.price * item.qty).toLocaleString()}</p>
                </div>
                <div className="flex items-center bg-slate-100 rounded-xl p-1">
                  <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 font-black hover:text-blue-600">-</button>
                  <span className="w-8 text-center text-xs font-black">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 font-black hover:text-blue-600">+</button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer del Carrito: Checkout */}
          <div className="mt-8 pt-8 border-t-2 border-dashed border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Total a pagar</span>
              <span className="text-4xl font-black tracking-tighter text-slate-900">RD${total.toLocaleString()}</span>
            </div>
            
            <button 
              disabled={cart.length === 0}
              className={`w-full py-6 rounded-3xl font-black text-xl uppercase tracking-[0.2em] transition-all shadow-2xl ${
                cart.length > 0 
                ? "bg-blue-600 text-white hover:bg-slate-900 shadow-blue-200 active:scale-95" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }`}
            >
              Finalizar Venta
            </button>
          </div>
        </div>
      </aside>

      {/* CSS para scrollbars limpios */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
                }
                    
