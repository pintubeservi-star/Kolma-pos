"use client";
import React, { useState, useMemo } from "react";

export default function POSPage() {
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Datos de prueba (Aquí conectarás tu API luego)
  const products = [
    { id: 1, name: "Queso de Freír", price: 250, category: "Lácteos", image: "🧀" },
    { id: 2, name: "Salami Especial", price: 180, category: "Embutidos", image: "🍖" },
    { id: 3, name: "Arroz Selecto 5lb", price: 175, category: "Granos", image: "🍚" },
    { id: 4, name: "Aceite 1L", price: 210, category: "Abarrotes", image: "🧴" },
  ];

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="flex flex-col h-screen bg-gray-50 lg:flex-row overflow-hidden font-sans">
      
      {/* --- SECCIÓN IZQUIERDA: PRODUCTOS --- */}
      <main className="flex-1 flex flex-col min-w-0 bg-white shadow-xl z-10">
        {/* Header con Buscador */}
        <header className="p-4 md:p-6 border-b flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-black tracking-tighter text-blue-600 italic">KOLMA POS</h1>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="lg:hidden p-2 bg-gray-100 rounded-full relative"
            >
              🛒 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{cart.length}</span>
            </button>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              className="w-full p-3 pl-10 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute left-3 top-3.5 opacity-40">🔍</span>
          </div>
        </header>

        {/* Grid de Productos */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(p => (
            <button 
              key={p.id}
              onClick={() => addToCart(p)}
              className="group flex flex-col items-center p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all text-center active:scale-95"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{p.image}</div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{p.category}</span>
              <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">{p.name}</h3>
              <p className="text-blue-600 font-black mt-2">RD${p.price}</p>
            </button>
          ))}
        </div>
      </main>

      {/* --- SECCIÓN DERECHA: CARRITO (SIDEBAR) --- */}
      <aside className={`
        fixed inset-y-0 right-0 w-full md:w-[400px] bg-gray-50 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${isCartOpen ? "translate-x-0" : "translate-x-full"}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold uppercase tracking-tight">Orden Actual</h2>
            <button onClick={() => setIsCartOpen(false)} className="lg:hidden text-2xl">✕</button>
          </div>

          {/* Lista de Items */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-20 opacity-30 italic">Carrito vacío</div>
            ) : cart.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{item.name}</span>
                  <span className="text-xs text-gray-400">RD${item.price} x {item.qty}</span>
                </div>
                <span className="font-black text-blue-600">RD${item.price * item.qty}</span>
              </div>
            ))}
          </div>

          {/* Total y Botón de Cobro */}
          <div className="mt-6 p-6 bg-white rounded-3xl shadow-inner border border-gray-100">
            <div className="flex justify-between items-end mb-4">
              <span className="text-gray-400 font-bold uppercase text-xs">Total</span>
              <span className="text-3xl font-black tracking-tighter text-gray-900">RD${total.toLocaleString()}</span>
            </div>
            <button 
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
              disabled={cart.length === 0}
            >
              Finalizar Venta
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
                }
