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
      if (exist) return prev.map((p) => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(p => p.id === id ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p));
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
        alert(`Venta registrada: Orden #${data.orderNumber} ✅`);
        setCart([]);
        setIsMobileCartOpen(false);
      } else {
        alert("Error de Shopify: " + data.error);
      }
    } catch (e) {
      alert("Error de conexión");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-100 text-slate-900 font-sans overflow-hidden">
      
      {/* SECCIÓN IZQUIERDA: CATÁLOGO */}
      <div className="flex-1 flex flex-col h-full bg-white lg:rounded-r-[3rem] shadow-sm z-10 overflow-hidden">
        <header className="p-6 md:p-8 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-black uppercase italic tracking-tighter text-black">Kolma POS</h1>
            <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Modo Administrador</div>
          </div>
          
          <div className="relative group">
            <input 
              type="text"
              placeholder="Buscar producto o marca..."
              className="w-full h-12 md:h-14 bg-slate-100 rounded-2xl pl-12 pr-6 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="absolute left-4 top-3.5 md:top-4 text-slate-400 group-focus-within:text-blue-600" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setCategory(cat)} 
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase whitespace-nowrap transition-all border ${category === cat ? 'bg-black text-white border-black shadow-lg' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:px-8 pb-24 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 custom-scrollbar">
          {loading ? (
             <div className="col-span-full text-center py-20 font-black opacity-20 uppercase tracking-widest">Sincronizando inventario...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-20 text-slate-300 font-bold uppercase text-xs">No se encontraron productos</div>
          ) : filteredProducts.map((p) => (
            <button 
              key={p.id} 
              onClick={() => addToCart(p)} 
              className="group bg-slate-50 p-5 rounded-[40px] border-2 border-transparent hover:border-blue-600 hover:bg-white hover:shadow-xl transition-all text-left flex flex-col justify-between h-48 md:h-56 relative overflow-hidden"
            >
              <div>
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{p.vendor}</span>
                <h3 className="font-bold text-xs md:text-sm leading-tight mt-1 line-clamp-2 text-slate-800">{p.title}</h3>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-lg md:text-xl font-black text-black">RD${parseFloat(p.price).toLocaleString()}</span>
                <div className="bg-white p-2 rounded-xl shadow-sm border group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SECCIÓN DERECHA: CARRITO */}
      <aside className={`fixed inset-0 lg:relative lg:inset-auto z-50 flex flex-col bg-slate-100 h-full w-full lg:w-[450px] transition-transform duration-300 ${isMobileCartOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsMobileCartOpen(false)} className="lg:hidden p-2 bg-white rounded-full shadow-sm border">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <h2 className="text-2xl font-[1000] uppercase italic tracking-tighter">Orden</h2>
            </div>
            <span className="bg-black text-white px-3 py-1 rounded-lg text-[10px] font-black tracking-widest">{cart.length} ARTÍCULOS</span>
          </div>
          
          <div className="space-y-3">
            {cart.length === 0 ? (
              <div className="py-24 text-center opacity-10 flex flex-col items-center gap-4">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                <p className="text-xs font-black uppercase tracking-widest">Esperando Productos</p>
              </div>
            ) : cart.map(item => (
              <div key={item.id} className="bg-white p-4 md:p-5 rounded-[2.5rem] shadow-sm flex flex-col gap-4 border border-white animate-in slide-in-from-right-4 duration-200">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-sm flex-1 pr-4 line-clamp-2 uppercase italic leading-tight">{item.title}</p>
                  <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-slate-200 hover:text-red-500 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex bg-slate-50 rounded-2xl p-1 border border-slate-100">
                    <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 flex items-center justify-center font-black text-slate-400 hover:text-black">-</button>
                    <span className="w-10 text-center text-xs font-black">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 flex items-center justify-center font-black text-slate-400 hover:text-black">+</button>
                  </div>
                  <div className="text-right">
                    <span className="font-[1000] text-xl text-blue-600">RD${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-white lg:rounded-tl-[4rem] shadow-2xl shadow-slate-200 border-t lg:border-none">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-black uppercase italic tracking-tighter text-slate-400">Total a Cobrar</span>
            <span className="text-4xl font-[1000] tracking-tighter text-black">RD${total.toLocaleString()}</span>
          </div>
          <button 
            onClick={handleCheckout} 
            disabled={cart.length === 0 || processing} 
            className={`w-full py-6 rounded-[30px] font-black text-2xl uppercase tracking-widest shadow-xl transition-all ${
              cart.length > 0 && !processing ? 'bg-blue-600 text-white hover:bg-black active:scale-95 shadow-blue-100' : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
          >
            {processing ? 'Registrando...' : 'Finalizar Venta'}
          </button>
        </div>
      </aside>

      {/* BARRA INFERIOR MOBILE */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex items-center justify-between z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col pl-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter italic">RD${total.toLocaleString()}</span>
          <span className="text-2xl font-black italic tracking-tighter leading-tight">Total</span>
        </div>
        <button onClick={() => setIsMobileCartOpen(true)} className="bg-black text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg">
          Ver Orden ({cart.length})
        </button>
      </div>

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
