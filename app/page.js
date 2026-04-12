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
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
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

  const subtotal = cart.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);

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
        alert("¡Venta completada! Orden Shopify generada: " + data.orderNumber);
        setCart([]);
        setShowCartMobile(false);
      }
    } catch (e) {
      alert("Error en la conexión con Shopify");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-100 text-slate-900 overflow-hidden font-sans">
      
      {/* BOTÓN AYUDA FLOTANTE */}
      <button 
        onClick={() => setShowHelp(true)}
        className="fixed bottom-24 right-6 lg:bottom-10 lg:left-10 z-50 bg-white shadow-xl border border-slate-200 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform text-blue-600"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </button>

      {/* PANEL IZQUIERDO: PRODUCTOS */}
      <main className="flex-1 flex flex-col min-w-0 bg-white lg:rounded-r-[40px] shadow-sm z-10 overflow-hidden">
        <header className="p-4 md:p-8 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl md:text-3xl font-[900] tracking-tighter uppercase italic text-black">Kolma POS</h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Punto de Venta Profesional</p>
            </div>
            <div className="flex gap-2">
               <div className="hidden md:flex bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black items-center gap-1 border border-green-100">
                 <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> SHOPIFY SYNC
               </div>
            </div>
          </div>

          <div className="relative group w-full">
            <input 
              type="text" 
              placeholder="Buscar producto, marca o código..." 
              className="w-full h-12 md:h-14 pl-12 pr-6 rounded-2xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-slate-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="absolute left-4 top-3.5 md:top-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
        </header>

        {/* CATEGORÍAS */}
        <div className="px-4 md:px-8 pb-4 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap border ${category === cat ? 'bg-black text-white border-black shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-black'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* GRID DE PRODUCTOS */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-4 custom-scrollbar">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sincronizando inventario...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="col-span-full text-center py-20 text-slate-300 font-bold uppercase text-xs">No se encontraron resultados</div>
          ) : filteredItems.map(p => (
            <button 
              key={p.id}
              onClick={() => addToCart(p)}
              className="group bg-slate-50 p-4 md:p-5 rounded-[25px] md:rounded-[35px] border-2 border-transparent hover:border-blue-600 hover:bg-white hover:shadow-xl transition-all text-left flex flex-col justify-between h-44 md:h-52"
            >
              <div>
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block mb-1">{p.vendor}</span>
                <h3 className="font-bold text-xs md:text-sm leading-tight line-clamp-2 text-slate-800">{p.title}</h3>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-base md:text-xl font-black text-black">RD${parseFloat(p.price).toLocaleString()}</span>
                <div className="bg-white p-2 rounded-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 5v14M5 12h14"/></svg>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* PANEL DERECHO: CARRITO (PC Y MOBILE SLIDE) */}
      <aside className={`fixed inset-0 lg:relative lg:inset-auto z-40 flex flex-col bg-slate-100 h-full w-full lg:w-[450px] transition-transform duration-300 ${showCartMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
                <button onClick={() => setShowCartMobile(false)} className="lg:hidden p-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                <h2 className="text-xl font-black uppercase italic">Orden Actual</h2>
            </div>
            <span className="bg-white px-3 py-1 rounded-lg border-2 text-[10px] font-black shadow-sm">{cart.length} ARTÍCULOS</span>
          </div>

          <div className="space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-24 px-10">
                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                    <svg className="text-slate-200" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                </div>
                <h3 className="font-black text-sm uppercase mb-2">Punto de Venta Listo</h3>
                <p className="text-slate-400 text-xs leading-relaxed">Selecciona productos del catálogo a la izquierda para armar la cuenta del cliente.</p>
              </div>
            ) : cart.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-3xl shadow-sm border border-white hover:border-blue-100 flex flex-col gap-3 transition-colors animate-in fade-in slide-in-from-right-4">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-sm line-clamp-1 flex-1 pr-2">{item.title}</p>
                  <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center bg-slate-50 rounded-2xl border border-slate-100 p-1">
                    <button onClick={() => updateQty(item.id, -1)} className="w-9 h-9 flex items-center justify-center font-black text-slate-400 hover:text-black">-</button>
                    <span className="w-10 text-center text-xs font-black">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-9 h-9 flex items-center justify-center font-black text-slate-400 hover:text-black">+</button>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 font-bold">RD${parseFloat(item.price).toLocaleString()} c/u</p>
                    <span className="font-black text-blue-600 text-base">RD${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RESUMEN Y PAGO */}
        <div className="p-6 md:p-8 bg-white lg:rounded-tl-[60px] shadow-[0_-15px_60px_rgba(0,0,0,0.08)]">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>Subtotal</span>
              <span>RD${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-black uppercase italic tracking-tighter">Total a Cobrar</span>
              <span className="text-3xl md:text-4xl font-[1000] text-black tracking-tighter">RD${subtotal.toLocaleString()}</span>
            </div>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || processing}
            className={`w-full py-5 rounded-[28px] font-black text-xl uppercase tracking-tighter transition-all shadow-xl shadow-blue-100 ${
              cart.length > 0 && !processing 
              ? 'bg-blue-600 text-white hover:bg-black active:scale-95' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {processing ? 'Sincronizando...' : 'Finalizar y Cobrar'}
          </button>
        </div>
      </aside>

      {/* FOOTER MOBILE (Solo visible en celular) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t flex items-center justify-between z-30 shadow-2xl">
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Cuenta</p>
            <p className="text-xl font-black">RD${subtotal.toLocaleString()}</p>
        </div>
        <button 
            onClick={() => setShowCartMobile(true)}
            className="bg-black text-white px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-tighter flex items-center gap-2"
        >
            Ver Carrito ({cart.length})
        </button>
      </div>

      {/* MODAL DE AYUDA / INSTRUCTIVO */}
      {showHelp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[40px] w-full max-w-md p-8 shadow-2xl relative">
            <button onClick={() => setShowHelp(false)} className="absolute top-6 right-6 text-slate-300 hover:text-black">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
            <h2 className="text-2xl font-black uppercase italic mb-6">Guía Rápida POS</h2>
            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black flex-shrink-0">1</div>
                    <p className="text-sm text-slate-600"><span className="font-bold text-black">Buscar:</span> Usa la barra superior o las categorías para encontrar productos rápidamente.</p>
                </div>
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black flex-shrink-0">2</div>
                    <p className="text-sm text-slate-600"><span className="font-bold text-black">Agregar:</span> Haz clic en cualquier tarjeta de producto para sumarlo a la cuenta del cliente.</p>
                </div>
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black flex-shrink-0">3</div>
                    <p className="text-sm text-slate-600"><span className="font-bold text-black">Cobrar:</span> Presiona el botón azul para registrar la venta en Shopify de forma automática.</p>
                </div>
            </div>
            <button 
                onClick={() => setShowHelp(false)}
                className="w-full mt-8 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs"
            >
                Entendido
            </button>
          </div>
        </div>
      )}

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
