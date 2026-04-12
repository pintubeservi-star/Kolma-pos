```react
"use client";
import React, { useState, useEffect, useMemo } from "react";

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [showHelp, setShowHelp] = useState(false);
  const [showCartMobile, setShowCartMobile] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ["Todos", ...new Set(products.map((p) => p.vendor))], [products]);

  const filteredItems = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                            p.vendor.toLowerCase().includes(search.toLowerCase());
      const matchesCat = category === "Todos" || p.vendor === category;
      return matchesSearch && matchesCat;
    });
  }, [products, search, category]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart((prev) => prev.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeItem = (id) => setCart((prev) => prev.filter((item) => item.id !== id));

  const total = cart.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0 || processing) return;
    setProcessing(true);
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ line_items: cart.map(i => ({ variant_id: i.variantId, quantity: i.quantity })) }),
      });
      const data = await res.json();
      if (data.success) {
        alert("¡Venta completada! Orden: " + data.orderNumber);
        setCart([]);
        setShowCartMobile(false);
      } else {
        alert("Error de Shopify: " + data.error);
      }
    } catch (e) {
      alert("Error en la conexión");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-100 text-slate-900 overflow-hidden font-sans">
      
      {/* Botón Ayuda */}
      <button 
        onClick={() => setShowHelp(true)}
        className="fixed bottom-24 right-6 lg:bottom-10 lg:left-10 z-50 bg-white shadow-xl border border-slate-200 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform text-blue-600"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </button>

      {/* Panel de Productos */}
      <main className="flex-1 flex flex-col min-w-0 bg-white lg:rounded-r-[50px] shadow-sm z-10 overflow-hidden">
        <header className="p-4 md:p-8 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-4xl font-[1000] tracking-tighter uppercase italic text-black">Kolma POS</h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Punto de Venta Shopify</p>
            </div>
          </div>

          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar productos o marcas..." 
              className="w-full h-12 md:h-16 pl-14 pr-6 rounded-3xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="absolute left-5 top-3.5 md:top-5 text-slate-400" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </header>

        {/* Categorías */}
        <div className="px-4 md:px-8 pb-4 flex gap-2 overflow-x-auto no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase transition-all whitespace-nowrap border ${category === cat ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-black'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Listado */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 custom-scrollbar">
          {loading ? (
            <div className="col-span-full py-20 text-center font-bold text-slate-300 uppercase animate-pulse">Sincronizando Shopify...</div>
          ) : filteredItems.map(p => (
            <button 
              key={p.id}
              onClick={() => addToCart(p)}
              className="group bg-slate-50 p-5 rounded-[40px] border-2 border-transparent hover:border-blue-600 hover:bg-white hover:shadow-2xl transition-all text-left flex flex-col justify-between h-52 relative overflow-hidden"
            >
              <div className="relative z-10">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{p.vendor}</span>
                <h3 className="font-bold text-sm leading-tight mt-1 line-clamp-2">{p.title}</h3>
              </div>
              <div className="flex justify-between items-end relative z-10">
                <span className="text-xl font-[1000] text-black">RD${parseFloat(p.price).toLocaleString()}</span>
                <div className="bg-white p-2 rounded-2xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Carrito Lateral (Desktop) / Slide-up (Mobile) */}
      <aside className={`fixed inset-0 lg:relative lg:inset-auto z-40 flex flex-col bg-slate-100 h-full w-full lg:w-[450px] transition-transform duration-300 ${showCartMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowCartMobile(false)} className="lg:hidden p-2 bg-white rounded-full shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter">Orden</h2>
            </div>
            <span className="bg-black text-white px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest">{cart.length} ITEMS</span>
          </div>

          <div className="space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-24 opacity-20">
                <svg className="mx-auto" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <p className="font-bold mt-4 text-xs uppercase">Esperando Productos</p>
              </div>
            ) : cart.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-[30px] shadow-sm border border-white flex flex-col gap-4 animate-in slide-in-from-right-4">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-sm line-clamp-2 flex-1 pr-2 uppercase italic">{item.title}</p>
                  <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-100 p-1">
                    <button onClick={() => updateQty(item.id, -1)} className="w-10 h-10 flex items-center justify-center font-black text-slate-400 hover:text-black">-</button>
                    <span className="w-10 text-center text-xs font-[1000]">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-10 h-10 flex items-center justify-center font-black text-slate-400 hover:text-black">+</button>
                  </div>
                  <div className="text-right">
                    <span className="font-[1000] text-xl text-blue-600">RD${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resumen y Pago */}
        <div className="p-8 bg-white lg:rounded-tl-[60px] shadow-[0_-20px_60px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-black uppercase italic tracking-tighter">Total a Cobrar</span>
            <span className="text-4xl font-[1000] text-black tracking-tighter">RD${total.toLocaleString()}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || processing}
            className={`w-full py-6 rounded-[30px] font-black text-2xl uppercase tracking-tighter transition-all shadow-xl ${
              cart.length > 0 && !processing 
              ? 'bg-blue-600 text-white hover:bg-black active:scale-95 shadow-blue-100' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {processing ? 'Sincronizando...' : 'Completar Venta'}
          </button>
        </div>
      </aside>

      {/* Footer Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex items-center justify-between z-30 shadow-2xl">
        <div className="pl-2">
            <p className="text-2xl font-[1000] italic tracking-tighter">RD${total.toLocaleString()}</p>
        </div>
        <button 
            onClick={() => setShowCartMobile(true)}
            className="bg-black text-white px-10 py-4 rounded-2xl font-[1000] text-sm uppercase italic tracking-tighter"
        >
            REVISAR ({cart.length})
        </button>
      </div>

      {/* Modal Ayuda */}
      {showHelp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[40px] w-full max-w-md p-10 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowHelp(false)} className="absolute top-8 right-8 text-slate-300 hover:text-black">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
            <h2 className="text-3xl font-[1000] uppercase italic mb-8 tracking-tighter">Manual POS</h2>
            <div className="space-y-8">
                <div className="flex gap-5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-slate-600 font-bold leading-snug">Busca productos por nombre o usa las categorías de marca arriba.</p>
                </div>
                <div className="flex gap-5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-slate-600 font-bold leading-snug">Toca cualquier producto para agregarlo a la cuenta.</p>
                </div>
                <div className="flex gap-5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-slate-600 font-bold leading-snug">Presiona "Completar Venta" para registrarla en Shopify.</p>
                </div>
            </div>
            <button 
                onClick={() => setShowHelp(false)}
                className="w-full mt-10 bg-black text-white py-5 rounded-2xl font-black uppercase italic tracking-widest text-xs"
            >
                Entendido
            </button>
          </div>
        </div>
      )}

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

```
