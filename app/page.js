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
const ShoppingBasket = p => <Svg {...p}><path d="m5 11 4-7"/><path d="m19 11-4-7"/><path d="M2 11h20"/><path d="m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4"/></Svg>;
const Flame = p => <Svg {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></Svg>;

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
      
      // Catálogo por defecto premium
      setProducts([
        { id: '1', name: 'Leche Rica Entera 1L', price: 78.0, image: 'https://images.unsplash.com/photo-1563636619-e9107da5a1bb?w=300', variantId: 'v1' },
        { id: '2', name: 'Aguacate Hass Premium', price: 45.0, image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300', variantId: 'v2' },
        { id: '3', name: 'Pechuga de Pollo Fresca 1lb', price: 185.0, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=300', variantId: 'v3' },
        { id: '4', name: 'Pan Sobao Horneado Hoy', price: 55.0, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300', variantId: 'v4' },
        { id: '5', name: 'Arroz Selecto Kolma 5lb', price: 160.0, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300', variantId: 'v5' },
        { id: '6', name: 'Refresco Cola Frío 2L', price: 98.0, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300', variantId: 'v7' },
      ]);
    };
    fetchShopifyProducts();
  }, []);

  // --- 2. LÓGICA DE LA CAJA ---
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
  const itemsCount = cart.reduce((acc, item) => acc + item.qty, 0);

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

  // --- 4. INTERFAZ DEL POS PREMIUM ---
  return (
    <div className="flex h-screen bg-[#FDFDFD] font-sans overflow-hidden selection:bg-orange-200 text-slate-900">
      
      {/* PANEL IZQUIERDO: PRODUCTOS */}
      <div className="flex-1 flex flex-col p-8 pb-0">
        
        {/* Header Premium */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#FF3D00] to-[#FF9100] text-white w-16 h-16 rounded-[20px] flex items-center justify-center font-black text-3xl shadow-xl shadow-orange-200">K</div>
            <div>
              <h1 className="font-black text-3xl tracking-tighter leading-none text-slate-900">Kolma<span className="text-[#FF3D00]">POS</span></h1>
              <div className="flex items-center gap-1 text-slate-400 font-bold text-xs mt-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Sistema en línea
              </div>
            </div>
          </div>
          
          <div className="relative w-[450px]">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#FF3D00]" size={22} />
            <input 
              type="text" 
              placeholder="Buscar producto o código de barras..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-orange-200 focus:bg-white rounded-[24px] py-4 pl-14 pr-4 font-bold outline-none transition-all text-lg shadow-sm placeholder:text-slate-400"
              autoFocus
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-200 p-1.5 rounded-full text-slate-500 hover:text-slate-900 transition-colors">
                <X size={16} strokeWidth={3} />
              </button>
            )}
          </div>
        </div>

        {/* Título de sección */}
        <div className="flex items-center gap-2 mb-6 px-2">
           <Flame className="text-[#FF3D00]" fill="currentColor" size={24}/>
           <h2 className="text-2xl font-black tracking-tighter">Catálogo Supermercado</h2>
        </div>

        {/* Grid de Productos Tipo App */}
        <div className="flex-1 overflow-y-auto pb-8 pr-2 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          <div className="grid grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {filteredProducts.map(p => (
              <div 
                key={p.id} 
                onClick={() => addToCart(p)}
                className="group relative bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-orange-100/50 hover:border-orange-100 cursor-pointer transition-all duration-300 active:scale-95 flex flex-col"
              >
                <div className="aspect-square bg-slate-50 rounded-[24px] mb-4 overflow-hidden relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500" draggable="false"/>
                  {/* Botón flotante estilo app */}
                  <div className="absolute bottom-3 right-3 bg-[#111] text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl">
                    <Plus size={20} strokeWidth={3} />
                  </div>
                </div>
                <h3 className="font-bold text-base leading-tight mb-2 text-slate-800 line-clamp-2">{p.name}</h3>
                <p className="font-black text-2xl text-[#FF3D00] mt-auto tracking-tighter">RD${p.price.toFixed(0)}</p>
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && (
             <div className="h-64 flex flex-col items-center justify-center text-slate-400 bg-white rounded-[40px] border-2 border-dashed border-slate-200 mt-4">
               <ShoppingBasket size={48} className="mb-4 opacity-50" />
               <p className="font-black text-2xl text-slate-800">Producto no encontrado</p>
               <p className="font-bold mt-1">Verifica el nombre o el código escaneado.</p>
             </div>
          )}
        </div>
      </div>

      {/* PANEL DERECHO: TICKET DE CAJA PREMIUM */}
      <div className="w-[450px] bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.05)] flex flex-col rounded-l-[48px] my-4 border border-slate-100 relative z-10 overflow-hidden">
        
        {/* Cabecera Ticket */}
        <div className="p-8 pb-6 bg-slate-50 border-b border-slate-100 flex justify-between items-end">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF9100] bg-orange-100 px-3 py-1 rounded-xl">Terminal 1</span>
            <h2 className="text-3xl font-black tracking-tighter mt-3">Ticket Actual</h2>
          </div>
          {cart.length > 0 && (
            <button onClick={clearCart} className="text-red-500 bg-red-50 hover:bg-red-100 transition-colors px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-2">
              <Trash size={16} /> Vaciar
            </button>
          )}
        </div>

        {/* Lista del carrito */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300">
               <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                 <ShoppingBasket size={40} />
               </div>
              <p className="font-black text-xl text-slate-800">Caja vacía</p>
              <p className="font-bold text-sm text-center mt-2">Agrega productos para procesar la venta.</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.variantId} className="flex flex-col bg-white border border-slate-100 rounded-[24px] p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-sm leading-tight text-slate-800 pr-4">{item.name}</h4>
                  <p className="font-black text-[#FF3D00] text-lg">RD${item.price.toFixed(0)}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-[16px] p-1">
                    <button onClick={() => updateQty(item.variantId, -1)} className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all active:scale-95">
                      {item.qty === 1 ? <Trash size={16} className="text-red-500" /> : <Minus size={16} />}
                    </button>
                    <span className="w-10 text-center font-black text-lg">{item.qty}</span>
                    <button onClick={() => updateQty(item.variantId, 1)} className="w-10 h-10 flex items-center justify-center bg-[#111] text-white rounded-xl shadow-md transition-all active:scale-95">
                      <Plus size={16} strokeWidth={3}/>
                    </button>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase text-slate-400 block mb-1">Subtotal</span>
                    <span className="font-black text-xl text-[#111]">${(item.price * item.qty).toFixed(0)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Botonera de Cobro (Fija abajo) */}
        <div className="p-8 bg-white border-t border-slate-100 shadow-[0_-20px_50px_rgba(0,0,0,0.03)]">
          
          <div className="flex justify-between items-center text-slate-500 font-bold mb-2 text-sm">
            <span>Artículos en ticket</span>
            <span className="bg-slate-100 px-3 py-1 rounded-lg text-slate-800">{itemsCount}</span>
          </div>
          
          <div className="flex justify-between items-end mb-6">
            <span className="font-black text-slate-800 uppercase tracking-widest text-sm">Total Cobro</span>
            <span className="text-5xl font-black tracking-tighter text-[#111]">RD$ {total.toFixed(0)}</span>
          </div>

          <div className="bg-orange-50 rounded-2xl p-4 mb-6 border border-orange-100 flex items-center gap-3 text-sm font-black text-[#FF9100]">
            <div className="w-3 h-3 rounded-full bg-[#FF3D00] border-2 border-white shadow-sm"></div> 
            Cliente: Ventas Directa
          </div>

          {successMsg ? (
            <div className="w-full bg-green-500 text-white py-6 rounded-[24px] font-black text-2xl flex items-center justify-center gap-3 animate-in zoom-in duration-300 shadow-xl shadow-green-200">
              <CheckCircle size={32} strokeWidth={3}/> ¡Venta Registrada!
            </div>
          ) : (
            <button 
              onClick={procesarVenta} 
              disabled={cart.length === 0 || isProcessing}
              className={`w-full py-6 rounded-[24px] font-black text-2xl flex items-center justify-center gap-3 transition-all shadow-2xl ${cart.length === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 'bg-gradient-to-br from-[#FF3D00] to-[#FF9100] text-white hover:scale-[1.02] active:scale-95 shadow-orange-200/50'}`}
            >
              {isProcessing ? 'Enviando a Shopify...' : 'Cobrar Exacto'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
