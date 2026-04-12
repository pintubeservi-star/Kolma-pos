```react
"use client";
import React, { useState, useEffect, useMemo } from "react";

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Cargar productos desde tu API de Shopify
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Categorías basadas en el "Vendor" de Shopify
  const categories = useMemo(() => {
    return ["Todos", ...new Set(products.map((p) => p.vendor))];
  }, [products]);

  // Buscador y Filtro
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.vendor.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "Todos" || p.vendor === category;
      return matchSearch && matchCat;
    });
  }, [products, search, category]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === product.id);
      if (exist) {
        return prev.map((p) => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(p => 
      p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
    ));
  };

  const total = cart.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0 || processing) return;
    setProcessing(true);
    
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          line_items: cart.map(item => ({
            variant_id: item.variantId,
            quantity: item.quantity
          }))
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(`Orden #${data.orderNumber} creada en Shopify ✅`);
        setCart([]);
        setIsMobileCartOpen(false);
      } else {
        alert("Error: " + data.error);
      }
    } catch (e) {
      alert("Error de conexión");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 text-slate-900 font-sans overflow-hidden">
      
      {/* SECCIÓN IZQUIERDA: PRODUCTOS */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-white lg:rounded-r-[40px] shadow-sm z-10 overflow-hidden">
        <header className="p-4 md:p-8 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter">Kolma POS</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Shopify Integrated</p>
            </div>
            <div className="hidden md:block bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200">
               <span className="text-xs font-black text-slate-500 uppercase tracking-tighter">Caja Registradora</span>
            </div>
          </div>

          {/* Buscador Profesional */}
          <div className="relative group">
            <input 
              type="text"
              placeholder="Buscar por nombre, código o marca..."
              className="w-full h-12 md:h-14 bg-slate-100 rounded-2xl pl-12 pr-6 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="absolute left-4 top-3.5 md:top-4 text-slate-400 group-focus-within:text-blue-600" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>

          {/* Categorías */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${category === cat ? 'bg-black text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        {/* Listado de Productos */}
        <div className="flex-1 overflow-y-auto p-4 md:px-8 pb-24 md:pb-8 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 custom-scrollbar">
          {loading ? (
            Array(8).fill(0).map((_, i) => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-[30px]"></div>)
          ) : filteredProducts.map((p) => (
            <button
              key={p.id}
              onClick={() => addToCart(p)}
              className="group bg-slate-50 p-4 md:p-5 rounded-[30px] border-2 border-transparent hover:border-blue-600 hover:bg-white hover:shadow-xl transition-all text-left flex flex-col justify-between h-48 md:h-56 overflow-hidden"
            >
              <div>
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{p.vendor}</span>
                <h3 className="font-bold text-xs md:text-sm leading-tight mt-1 line-clamp-2">{p.title}</h3>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-base md:text-xl font-black">RD${parseFloat(p.price).toLocaleString()}</span>
                <div className="bg-white p-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SECCIÓN DERECHA: CARRITO (Lógica para Desktop y Mobile) */}
      <aside className={`fixed inset-0 lg:relative lg:inset-auto z-50 flex flex-col bg-gray-100 h-full w-full lg:w-[450px] transition-transform duration-300 ${isMobileCartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsMobileCartOpen(false)} className="lg:hidden p-2 bg-white rounded-full shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <h2 className="text-xl font-black uppercase italic tracking-tighter">Cuenta Actual</h2>
            </div>
            <span className="bg-black text-white px-3 py-1 rounded-lg text-[10px] font-black tracking-widest">{cart.length} ITEMS</span>
          </div>

          <div className="space-y-3">
            {cart.length === 0 ? (
              <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <p className="text-xs font-black uppercase tracking-widest">Esperando productos...</p>
              </div>
            ) : cart.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-3 animate-in slide-in-from-right-4 duration-200">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-sm flex-1 pr-4 line-clamp-2">{item.title}</p>
                  <button onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} className="text-slate-300 hover:text-red-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center bg-slate-100 rounded-xl p-1">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 flex items-center justify-center font-black text-slate-500">-</button>
                    <span className="w-10 text-center text-xs font-black">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 flex items-center justify-center font-black text-slate-500">+</button>
                  </div>
                  <span className="font-black text-blue-600">RD${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer de Checkout */}
        <div className="p-6 md:p-8 bg-white lg:rounded-tl-[50px] shadow-[0_-15px_60px_rgba(0,0,0,0.08)]">
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Total Bruto</span>
              <span className="text-xs font-bold text-slate-400">RD${total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-black uppercase italic tracking-tighter">Total a Cobrar</span>
              <span className="text-3xl md:text-4xl font-[1000] tracking-tighter">RD${total.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || processing}
            className={`w-full py-5 rounded-[28px] font-black text-xl uppercase tracking-tighter shadow-2xl transition-all ${
              cart.length > 0 && !processing ? 'bg-blue-600 text-white hover:bg-black active:scale-95 shadow-blue-100' : 'bg-slate-200 text-slate-400'
            }`}
          >
            {processing ? 'Sincronizando...' : 'Finalizar Venta'}
          </button>
        </div>
      </aside>

      {/* BARRA INFERIOR MOBILE */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between z-30 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-slate-400 uppercase">Total en Carrito</span>
          <span className="text-xl font-black tracking-tighter italic">RD${total.toLocaleString()}</span>
        </div>
        <button 
          onClick={() => setIsMobileCartOpen(true)}
          className="bg-black text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-tighter flex items-center gap-2"
        >
          Ver Orden ({cart.length})
        </button>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}

```
