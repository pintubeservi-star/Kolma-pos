'use client'
import React, { useState, useEffect, useMemo } from 'react';

// ==========================================
// ÍCONOS SVG NATIVOS (0 dependencias)
// ==========================================
const Svg = ({ children, size=24, className='', strokeWidth=2, fill="none", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>{children}</svg>
);
const Search = p => <Svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Svg>;
const Plus = p => <Svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
const Minus = p => <Svg {...p}><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
const Trash = p => <Svg {...p}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></Svg>;
const CheckCircle = p => <Svg {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></Svg>;
const X = p => <Svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>;

// --- CONFIGURACIÓN DE ENTORNO ---
const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "q0q09e-cp.myshopify.com";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || "c9bda45020488455d7fe2d8b7e22f352";

export default function KolmaPOS() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  // --- 1. CARGAR CATÁLOGO DEL SUPERMERCADO ---
  useEffect(() => {
    const fetchShopifyProducts = async () => {
      try {
        const res = await fetch(`https://${DOMAIN}/api/2024-04/graphql.json`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': ACCESS_TOKEN },
          body: JSON.stringify({ query: `{ products(first: 50) { edges { node { id title images(first: 1) { edges { node { url } } } variants(first: 1) { edges { node { id price { amount } } } } } } } }`})
        });
        const { data } = await res.json();
        if (data?.products) {
          const shopifyProds = data.products.edges.map(p => ({
            id: p.node.id, 
            name: p.node.title, 
            price: parseFloat(p.node.variants.edges[0].node.price.amount),
            image: p.node.images.edges[0]?.node.url, 
            variantId: p.node.variants.edges[0].node.id
          }));
          setProducts(shopifyProds);
          return;
        }
      } catch (e) { console.log("Usando catálogo de respaldo..."); }
      
      // Catálogo por defecto si falla la conexión
      setProducts([
        { id: '1', name: 'Leche Rica Entera 1L', price: 78.0, image: 'https://images.unsplash.com/photo-1563636619-e9107da5a1bb?w=300', variantId: 'v1' },
        { id: '2', name: 'Aguacate Hass', price: 45.0, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300', variantId: 'v2' },
        { id: '3', name: 'Pechuga de Pollo 1lb', price: 185.0, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300', variantId: 'v3' },
        { id: '4', name: 'Pan Sobao', price: 55.0, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300', variantId: 'v4' },
        { id: '5', name: 'Arroz Selecto 5lb', price: 160.0, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300', variantId: 'v5' },
        { id: '6', name: 'Refresco Cola 2L', price: 98.0, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300', variantId: 'v7' },
      ]);
    };
    fetchShopifyProducts();
  }, []);

  // --- 2. LÓGICA DE LA CAJA (CARRITO) ---
  const filteredProducts = useMemo(() => 
    products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())), 
  [products, searchTerm]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.variantId === product.variantId);
      if (existing) return prev.map(item => item.variantId === product.variantId ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.variantId === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // --- 3. REGLA ESTRICTA: REGISTRAR EN SHOPIFY ---
  const procesarVenta = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    const line_items = cart.map(item => ({
      title: item.name,
      price: item.price.toString(),
      quantity: item.qty
    }));

    const orderData = {
      order: {
        line_items: line_items,
        financial_status: "paid", // Cobrado en el instante
        customer: {
          first_name: "Ventas",
          last_name: "Directa"
        },
        source_name: "Kolma POS"
      }
    };

    try {
      const res = await fetch(`https://${DOMAIN}/admin/api/2024-04/orders.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': ACCESS_TOKEN
        },
        body: JSON.stringify(orderData)
      });
      
      if (res.ok) {
        setSuccessMsg(true);
        clearCart();
        setTimeout(() => setSuccessMsg(false), 3000);
      } else {
        console.error("Error Shopify:", await res.text());
        alert("La venta se procesó localmente, pero hubo un error conectando con Shopify. Revisa la consola.");
      }
    } catch (e) {
      console.error("Error de red:", e);
      alert("Error de conexión al procesar la venta.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- 4. INTERFAZ DEL POS ---
  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden selection:bg-orange-200 text-slate-900">
      
      {/* PANEL IZQUIERDO: PRODUCTOS */}
      <div className="flex-1 flex flex-col p-6">
        {/* Header Buscador */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-[#111] text-white w-12 h-12 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg">K</div>
            <div>
              <h1 className="font-black text-2xl tracking-tighter leading-none">Kolma POS</h1>
              <p className="text-xs font-bold text-slate-500">Terminal Supermercado</p>
            </div>
          </div>
          
          <div className="relative w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar producto o código de barras..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 font-bold outline-none focus:border-[#FF3D00] focus:ring-4 focus:ring-red-100 transition-all text-lg shadow-sm"
              autoFocus
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Grid de Productos */}
        <div className="flex-1 overflow-y-auto pr-2 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredProducts.map(p => (
              <div 
                key={p.id} 
                onClick={() => addToCart(p)}
                className="bg-white rounded-[24px] p-3 border border-slate-200 shadow-sm cursor-pointer hover:border-[#FF3D00] hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 group flex flex-col"
              >
                <div className="aspect-square bg-slate-50 rounded-[16px] mb-3 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform" draggable="false"/>
                </div>
                <h3 className="font-bold text-sm leading-tight mb-1 text-slate-800 line-clamp-2">{p.name}</h3>
                <p className="font-black text-lg text-[#111] mt-auto">RD$ {p.price.toFixed(0)}</p>
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-slate-400">
               <Search size={48} className="mb-4 opacity-50" />
               <p className="font-black text-xl">No hay productos con ese nombre.</p>
             </div>
          )}
        </div>
      </div>

      {/* PANEL DERECHO: TICKET DE CAJA */}
      <div className="w-[450px] bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.05)] flex flex-col border-l border-slate-200 z-10">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-2xl font-black tracking-tighter">Ticket Actual</h2>
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 flex items-center gap-2 font-bold text-sm">
              <Trash size={16} /> Vaciar
            </button>
          )}
        </div>

        {/* Lista del carrito */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
              <p className="font-bold text-lg text-center px-8">Selecciona productos o escanea el código para agregarlos a la venta.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.variantId} className="flex items-center gap-4">
                <div className="flex-1">
                  <h4 className="font-bold text-sm leading-tight text-slate-800">{item.name}</h4>
                  <p className="font-black text-[#FF3D00]">RD$ {item.price.toFixed(0)}</p>
                </div>
                
                <div className="flex items-center bg-slate-100 rounded-xl p-1">
                  <button onClick={() => updateQty(item.variantId, -1)} className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm rounded-lg transition-all active:scale-95">
                    {item.qty === 1 ? <Trash size={16} className="text-red-500" /> : <Minus size={16} />}
                  </button>
                  <span className="w-8 text-center font-black">{item.qty}</span>
                  <button onClick={() => updateQty(item.variantId, 1)} className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm rounded-lg transition-all active:scale-95">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="w-20 text-right font-black text-lg text-[#111]">
                  ${(item.price * item.qty).toFixed(0)}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Botonera de Cobro */}
        <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-end mb-6">
            <span className="font-bold text-slate-500 uppercase tracking-widest text-sm">Total a cobrar</span>
            <span className="text-5xl font-black tracking-tighter text-[#111]">RD$ {total.toFixed(0)}</span>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 flex items-center gap-3 text-sm font-bold text-slate-600">
            <div className="w-2 h-2 rounded-full bg-green-500"></div> Cliente: Ventas Directa
          </div>

          {successMsg ? (
            <div className="w-full bg-green-500 text-white py-6 rounded-2xl font-black text-2xl flex items-center justify-center gap-3 animate-in zoom-in duration-300">
              <CheckCircle size={32} /> ¡Venta Registrada!
            </div>
          ) : (
            <button 
              onClick={procesarVenta} 
              disabled={cart.length === 0 || isProcessing}
              className={`w-full py-6 rounded-2xl font-black text-2xl flex items-center justify-center gap-3 transition-all ${cart.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-[#FF3D00] text-white hover:bg-[#E31E24] hover:shadow-xl hover:shadow-red-200 active:scale-95'}`}
            >
              {isProcessing ? 'Procesando en Shopify...' : 'Cobrar Exacto'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
