'use client';
​import React, { useState, useEffect } from 'react';
​export default function App() {
const initialMenu = [
{ id: 1, category: 'Carnes', name: 'Alitas', price: 250, desc: '', disponible: true },
{ id: 2, category: 'Carnes', name: 'Carne Salada', price: 260, desc: '', disponible: true },
{ id: 3, category: 'Especiales', name: 'Toy en Salchi (Pequeña)', price: 160, desc: 'Salchipapa con queso mozarella', disponible: true },
{ id: 4, category: 'Especiales', name: 'Toy en Salchi (Grande)', price: 250, desc: 'Salchipapa con queso mozarella', disponible: true },
{ id: 5, category: 'Especiales', name: 'La Yaya (¡La Estrella!)', price: 350, desc: 'Papa + Pollo extra queso + tocineta (Para 2 personas)', disponible: true },
{ id: 6, category: 'Sándwiches', name: 'Club Sandwich', price: 230, desc: 'Con pechuga de pollo y tocineta. Incluye papa.', disponible: true },
{ id: 7, category: 'Sándwiches', name: 'Sandwich Jamón y Queso', price: 75, desc: '', disponible: true },
{ id: 8, category: 'Sándwiches', name: 'Sandwich de Pollo y Tocineta', price: 120, desc: '', disponible: true },
{ id: 9, category: 'Sándwiches', name: 'Sandwich de Pollo, Queso, Jamoneta', price: 120, desc: '', disponible: true },
{ id: 10, category: 'Sándwiches', name: 'Sandwich de Pollo, Queso y Tocineta', price: 170, desc: '', disponible: true },
{ id: 11, category: 'Burritos', name: 'Burrito de Pollo (Normal)', price: 185, desc: '', disponible: true },
{ id: 12, category: 'Burritos', name: 'Burrito de Pollo (Con Papa)', price: 230, desc: '', disponible: true },
{ id: 13, category: 'Burritos', name: 'Burrito Pollo y Tocineta (Normal)', price: 220, desc: '', disponible: true },
{ id: 14, category: 'Burritos', name: 'Burrito Pollo y Tocineta (Con Papa)', price: 270, desc: '', disponible: true },
{ id: 15, category: 'Burritos', name: 'Burrito de Res (Normal)', price: 220, desc: '', disponible: true },
{ id: 16, category: 'Burritos', name: 'Burrito de Res (Con Papa)', price: 270, desc: '', disponible: true },
{ id: 17, category: 'Burritos', name: 'Burrito Mixto (Normal)', price: 250, desc: '', disponible: true },
{ id: 18, category: 'Burritos', name: 'Burrito Mixto (Con Papa)', price: 290, desc: '', disponible: true },
{ id: 19, category: 'Burritos', name: 'Burrito XXL Extra Pollo (Normal)', price: 300, desc: '', disponible: true },
{ id: 20, category: 'Burritos', name: 'Burrito XXL Extra Pollo (Con Papa)', price: 350, desc: '', disponible: true },
{ id: 21, category: 'Yaroa', name: 'Yaroa de Pollo (Mediana)', price: 250, desc: 'Elegir base: Plátano maduro o papa', disponible: true },
{ id: 22, category: 'Yaroa', name: 'Yaroa de Res (Mediana)', price: 300, desc: 'Elegir base: Plátano maduro o papa', disponible: true },
{ id: 23, category: 'Yaroa', name: 'Yaroa de Pollo (Grande)', price: 350, desc: 'Elegir base: Plátano maduro o papa', disponible: true },
{ id: 24, category: 'Yaroa', name: 'Yaroa de Res (Grande)', price: 400, desc: 'Elegir base: Plátano maduro o papa', disponible: true },
{ id: 25, category: 'Hot Dog', name: 'Hot Dog Dominicano', price: 150, desc: 'Salchicha jugosa, pan suave y tostado, repollo fresco y salsa especial', disponible: true }
];
​const categories = [...new Set(initialMenu.map(i => i.category))];
​const [menuItems, setMenuItems] = useState(initialMenu);
const [orders, setOrders] = useState([]);
const [carrito, setCarrito] = useState([]);
const [tipoPedido, setTipoPedido] = useState('delivery');
const [activeCategory, setActiveCategory] = useState(categories[0]);
const [trackedOrderId, setTrackedOrderId] = useState(null);
​// Modals & Admin
const [showPinModal, setShowPinModal] = useState(false);
const [pinInput, setPinInput] = useState('');
const [pinError, setPinError] = useState(false);
const [showAdminPanel, setShowAdminPanel] = useState(false);
const [showKitchenModal, setShowKitchenModal] = useState(false);
const [showCheckoutModal, setShowCheckoutModal] = useState(false);
​// Form states
const [nombreCliente, setNombreCliente] = useState('');
const [telefonoCliente, setTelefonoCliente] = useState('');
const [direccionCliente, setDireccionCliente] = useState('');
​useEffect(() => {
const savedMenu = localStorage.getItem('xiiao_menu');
const savedOrders = localStorage.getItem('xiiao_orders');
const savedTracked = localStorage.getItem('xiiao_tracked');
​if (savedMenu) setMenuItems(JSON.parse(savedMenu));
if (savedOrders) setOrders(JSON.parse(savedOrders));
if (savedTracked) setTrackedOrderId(savedTracked);
}, []);
​const saveMenu = (newMenu) => {
setMenuItems(newMenu);
localStorage.setItem('xiiao_menu', JSON.stringify(newMenu));
};
​const saveOrders = (newOrders) => {
setOrders(newOrders);
localStorage.setItem('xiiao_orders', JSON.stringify(newOrders));
};
​const agregarAlCarrito = (item) => {
setCarrito([...carrito, item]);
};
​const eliminarDelCarrito = (index) => {
const nuevoCarrito = [...carrito];
nuevoCarrito.splice(index, 1);
setCarrito(nuevoCarrito);
};
​const confirmarCrearOrden = (e) => {
e.preventDefault();
const total = carrito.reduce((acc, item) => acc + item.price, 0);
​const conteoItems = carrito.reduce((acc, item) => {
acc[item.name] = (acc[item.name] || 0) + 1;
return acc;
}, {});
​const newOrder = {
id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
cliente: nombreCliente,
telefono: telefonoCliente,
direccion: tipoPedido === 'delivery' ? direccionCliente : 'Consumo / Retiro en Local',
tipo: tipoPedido,
items: conteoItems,
total: total,
estado: 'Pendiente',
fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};
​const nuevasOrdenes = [newOrder, ...orders];
saveOrders(nuevasOrdenes);
​setTrackedOrderId(newOrder.id);
localStorage.setItem('xiiao_tracked', newOrder.id);
​const listaProductos = Object.entries(conteoItems)
.map(([nombre, cant]) => 🔸 ${cant}x ${nombre})
.join('%0A');
​const mensaje = 🔥 *NUEVO PEDIDO - XIIAO KITCHEN* 🔥%0A%0A*Cliente:* ${nombreCliente}%0A*Teléfono:* ${telefonoCliente}%0A*${tipoPedido === 'delivery' ? 'Dirección:' : 'Tipo:'}* ${tipoPedido === 'delivery' ? direccionCliente : 'En Local'}%0A%0A*Productos:*%0A${listaProductos}%0A%0A💰 *Total:* RD$${total};
​setShowCheckoutModal(false);
setCarrito([]);
setNombreCliente('');
setTelefonoCliente('');
setDireccionCliente('');
window.open(https://wa.me/18298558779?text=${mensaje}, '_blank');
};
​const cambiarEstado = (id, nuevoEstado) => {
const actualizadas = orders.map(o => o.id === id ? { ...o, estado: nuevoEstado } : o);
saveOrders(actualizadas);
};
​const notificarPreparadoLocal = (id) => {
const ord = orders.find(o => o.id === id);
if (!ord) return;
cambiarEstado(id, 'Preparado');
const telLimpio = ord.telefono.replace(/\D/g, '');
const mensaje = ¡Hola ${ord.cliente}! 📢 Tu pedido en *Xiiao Kitchen* ya está *Preparado* y listo para retirar en el local. ¡Te esperamos! 🍟🔥;
window.open(https://wa.me/1${telLimpio}?text=${encodeURIComponent(mensaje)}, '_blank');
};
​const toggleItem = (id) => {
const updated = menuItems.map(i => i.id === id ? { ...i, disponible: i.disponible === false ? true : false } : i);
saveMenu(updated);
};
​const totalCarrito = carrito.reduce((acc, item) => acc + item.price, 0);
const trackedOrder = orders.find(o => o.id === trackedOrderId);
​return (
<div className="min-h-screen bg-[#050505] text-gray-100 flex flex-col items-center pb-32">
<div className="w-full max-w-md bg-[#0a0a0a] min-h-screen relative flex flex-col shadow-2xl">
​{/* Header */}
<header className="pt-8 pb-4 px-4 sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5">
<div className="text-center">
<h1 className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
Xiiao Kitchen
</h1>
<p className="text-gray-400 text-xs font-semibold mt-1 tracking-widest uppercase">
Sabor que se siente
</p>
<div className="mt-3 inline-block bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs px-4 py-1.5 rounded-full font-bold shadow-[0_0_15px_rgba(249,115,22,0.1)]">
🛵 ¡Envío Gratis en Cotuí!
</div>
</div>
​{/* Category Tabs */}
<div className="mt-5 flex overflow-x-auto gap-2 pb-2 px-1">
{categories.map(cat => (
<button
key={cat}
onClick={() => setActiveCategory(cat)}
className={whitespace-nowrap px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${ activeCategory === cat ? 'bg-orange-500 text-black shadow-lg scale-105' : 'bg-[#141414] text-gray-400 border border-white/5' }}
>
{cat}
</button>
))}
</div>
</header>
​{/* Track Order Banner */}
{trackedOrder && (
<div className="mx-4 mt-4 bg-[#141414] border border-orange-500/30 p-4 rounded-3xl shadow-xl">
<div className="flex justify-between items-center mb-2">
<span className="text-xs font-black uppercase tracking-wider text-orange-400">Estado de tu orden ({trackedOrder.tipo === 'delivery' ? 'Delivery' : 'En Local'})</span>
<button onClick={() => { setTrackedOrderId(null); localStorage.removeItem('xiiao_tracked'); }} className="text-gray-500 hover:text-white text-xs">✕ Ocultar</button>
</div>
​<div className="flex items-center justify-between mt-3 px-2">
<div className="flex flex-col items-center">
<div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs bg-orange-500 text-black">✓</div>
<span className="text-[10px] text-gray-400 mt-1">Recibido</span>
</div>
<div className={flex-1 h-1 mx-2 ${trackedOrder.estado !== 'Pendiente' ? 'bg-orange-500' : 'bg-gray-800'}}></div>
​<div className="flex flex-col items-center">
<div className={w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${trackedOrder.estado !== 'Pendiente' ? 'bg-orange-500 text-black' : 'bg-gray-800 text-gray-500'}}>🔥</div>
<span className="text-[10px] text-gray-400 mt-1">Cocinando</span>
</div>
​<div className={flex-1 h-1 mx-2 ${trackedOrder.estado === 'Enviado' || trackedOrder.estado === 'Preparado' ? 'bg-orange-500' : 'bg-gray-800'}}></div>
​<div className="flex flex-col items-center">
<div className={w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${trackedOrder.estado === 'Enviado' || trackedOrder.estado === 'Preparado' ? 'bg-green-500 text-black animate-pulse' : 'bg-gray-800 text-gray-500'}}>
{trackedOrder.tipo === 'delivery' ? '🛵' : '🛎️'}
</div>
<span className="text-[10px] text-gray-400 mt-1">
{trackedOrder.tipo === 'delivery' ? 'En Camino' : 'Preparado'}
</span>
</div>
</div>
​<div className="mt-3 text-center bg-[#0a0a0a] py-2 rounded-xl border border-white/5">
<p className="text-xs text-orange-300 font-bold">
{trackedOrder.estado === 'Enviado' ? '🛵 ¡Tu pedido va en camino!' : trackedOrder.estado === 'Preparado' ? '🛎️ ¡Tu pedido está preparado y listo para retirar en el local!' : Estado actual: ${trackedOrder.estado}}
</p>
</div>
</div>
)}
​{/* Menu Items Container */}
<main className="p-4 space-y-4 flex-1">
<div className="flex items-center gap-2 mb-2">
<h2 className="text-xl font-black text-white">{activeCategory}</h2>
<div className="flex-1 h-px bg-gradient-to-r from-orange-500/50 to-transparent ml-2"></div>
</div>
​<div className="space-y-4 pb-8">
{menuItems.filter(i => i.category === activeCategory && i.disponible !== false).map(item => (
<div key={item.id} className="bg-[#111111] p-5 rounded-3xl border border-white/5 flex justify-between items-center hover:border-orange-500/30 transition-all">
<div className="pr-4 flex-1">
<h3 className="font-bold text-gray-100 text-lg leading-tight">{item.name}</h3>
{item.desc && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{item.desc}</p>}
<p className="font-black mt-3 text-orange-500 text-lg tracking-tight">RD$ {item.price}</p>
</div>
<button onClick={() => agregarAlCarrito(item)} className="bg-[#1a1a1a] border border-white/5 text-orange-500 h-12 w-12 flex items-center justify-center rounded-2xl text-2xl font-light hover:bg-orange-500 hover:text-black transition-all shrink-0">+</button>
</div>
))}
</div>
</main>
​{/* Admin toggle button footer */}
<div className="py-6 flex justify-center pb-20 gap-4">
<button onClick={() => setShowPinModal(true)} className="text-gray-700 hover:text-orange-500 transition-colors text-xl" title="Panel de Administración">
🔒
</button>
<button onClick={() => setShowKitchenModal(true)} className="text-xs bg-[#1a1a1a] text-gray-400 hover:text-orange-400 px-3 py-1.5 rounded-xl border border-white/5 transition-colors font-bold">
👨‍🍳 Cocina (KDS)
</button>
</div>
​{/* Checkout Modal */}
{showCheckoutModal && (
<div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
<div className="bg-[#111111] p-6 rounded-3xl w-full max-w-sm border border-white/10 shadow-2xl">
<h3 className="text-xl font-black text-white mb-1">Completa tu orden</h3>
<p className="text-gray-400 text-xs mb-5">Ingresa tus datos para procesar el pedido.</p>
​<form onSubmit={confirmarCrearOrden} className="space-y-4">
<div>
<label className="text-xs font-bold text-gray-400 block mb-1">Tu Nombre</label>
<input type="text" value={nombreCliente} onChange={e => setNombreCliente(e.target.value)} required placeholder="Ej. Juan Pérez" className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500" />
</div>
<div>
<label className="text-xs font-bold text-gray-400 block mb-1">Tu Teléfono / WhatsApp</label>
<input type="tel" value={telefonoCliente} onChange={e => setTelefonoCliente(e.target.value)} required placeholder="Ej. 829-000-0000" className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500" />
</div>
{tipoPedido === 'delivery' && (
<div>
<label className="text-xs font-bold text-gray-400 block mb-1">Dirección de Entrega en Cotuí</label>
<textarea value={direccionCliente} onChange={e => setDireccionCliente(e.target.value)} rows="2" required placeholder="Calle, número de casa, referencias..." className="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500 resize-none"></textarea>
</div>
)}
​<div className="flex gap-2 pt-2">
<button type="button" onClick={() => setShowCheckoutModal(false)} className="flex-1 py-3 bg-[#1a1a1a] rounded-xl font-bold text-gray-400 text-sm">Volver</button>
<button type="submit" className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-black rounded-xl font-black text-sm shadow-lg">Crear orden</button>
</div>
</form>
</div>
</div>
)}
​{/* Admin PIN Modal */}
{showPinModal && (
<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
<div className="bg-[#111111] p-6 rounded-3xl w-full max-w-sm border border-white/10 shadow-2xl">
<h3 className="text-xl font-bold text-white mb-2 text-center">Acceso Administrador</h3>
<p className="text-gray-400 text-sm mb-5 text-center">Ingresa tu PIN (8779) para activar/desactivar platos.</p>
​<form onSubmit={e => {
e.preventDefault();
if (pinInput === '8779') {
setShowPinModal(false);
setPinInput('');
setPinError(false);
setShowAdminPanel(true);
} else {
setPinError(true);
}
}} className="space-y-4">
<input type="password" value={pinInput} onChange={e => setPinInput(e.target.value)} placeholder="****" maxLength="4" className="w-full bg-[#050505] border border-white/10 rounded-xl p-4 text-center text-2xl text-white tracking-[0.5em] focus:outline-none focus:border-orange-500" autoFocus />
{pinError && <p className="text-red-500 text-xs text-center">PIN Incorrecto</p>}
​<div className="flex gap-2">
<button type="button" onClick={() => { setShowPinModal(false); setPinInput(''); setPinError(false); }} className="flex-1 py-3 bg-[#1a1a1a] rounded-xl font-bold text-gray-400">Cancelar</button>
<button type="submit" className="flex-1 py-3 bg-orange-500 text-black rounded-xl font-bold">Entrar</button>
</div>
</form>
</div>
</div>
)}
​{/* Admin Management Panel Modal */}
{showAdminPanel && (
<div className="fixed inset-0 bg-[#050505] z-[120] flex flex-col p-4 overflow-y-auto">
<div className="w-full max-w-md mx-auto">
<div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
<div>
<h2 className="text-2xl font-black text-orange-500">Gestor Rápido</h2>
<p className="text-gray-400 text-xs">Activa o desactiva productos al instante</p>
</div>
<button onClick={() => setShowAdminPanel(false)} className="bg-[#1a1a1a] text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/10">Cerrar</button>
</div>
<div className="mb-4">
<button onClick={() => { setShowAdminPanel(false); setShowKitchenModal(true); }} className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-black font-black rounded-xl text-sm shadow-md">
👨‍🍳 Abrir Pantalla de Cocina (KDS)
</button>
</div>
<div className="space-y-4 pb-20">
{categories.map(cat => (
<div key={cat}>
<h3 className="text-orange-400 font-bold border-b border-white/5 pb-1 mt-4 mb-2">{cat}</h3>
{menuItems.filter(i => i.category === cat).map(item => (
<div key={item.id} className="flex justify-between items-center bg-[#111] p-3 rounded-xl border border-white/5 mb-2">
<span className="text-sm pr-2">{item.name}</span>
<button onClick={() => toggleItem(item.id)} className={relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${item.disponible !== false ? 'bg-orange-500' : 'bg-gray-700'}}>
<span className={inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${item.disponible !== false ? 'translate-x-6' : 'translate-x-1'}}></span>
</button>
</div>
))}
</div>
))}
</div>
</div>
</div>
)}
​{/* Kitchen Display System (KDS) Modal */}
{showKitchenModal && (
<div className="fixed inset-0 bg-[#050505] z-[130] flex flex-col p-4 overflow-y-auto">
<div className="w-full max-w-lg mx-auto">
<div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
<div>
<h2 className="text-2xl font-black text-orange-500">Cocina / KDS</h2>
<p className="text-gray-400 text-xs">Gestiona órdenes en tiempo real</p>
</div>
<button onClick={() => setShowKitchenModal(false)} className="bg-[#1a1a1a] text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/10">Cerrar</button>
</div>
<div className="space-y-4 pb-20">
{orders.length === 0 ? (
<div className="text-center py-20 text-gray-500 text-sm">No hay pedidos registrados todavía.</div>
) : (
orders.map(ord => (
<div key={ord.id} className="bg-[#111] p-4 rounded-2xl border border-white/10 flex flex-col justify-between">
<div>
<div className="flex justify-between items-start mb-2">
<div>
<h3 className="font-bold text-white text-base">{ord.cliente}</h3>
<p className="text-xs text-orange-400">{ord.telefono} • {ord.fecha}</p>
</div>
<span className="text-xs px-2.5 py-1 rounded-full font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">{ord.estado}</span>
</div>
<p className="text-xs text-gray-400 mb-1">📍 {ord.direccion}</p>
<p className="text-[10px] uppercase font-bold text-orange-500 mb-2">Tipo: {ord.tipo}</p>
​<div className="bg-[#050505] p-2.5 rounded-xl space-y-1 mb-3 border border-white/5">
{Object.entries(ord.items).map(([nombre, cant]) => (
<div key={nombre} className="text-xs text-gray-300">🔸 {cant}x {nombre}</div>
))}
</div>
</div>
​<div className="flex flex-col gap-2 pt-2 border-t border-white/5">
<div className="flex gap-2">
<button onClick={() => cambiarEstado(ord.id, 'Pendiente')} className="flex-1 py-2 bg-[#1a1a1a] text-xs font-bold rounded-lg text-gray-300">Pendiente</button>
<button onClick={() => cambiarEstado(ord.id, 'Cocinando')} className="flex-1 py-2 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg border border-blue-500/30">Cocinando</button>
</div>
{ord.tipo === 'delivery' ? (
<button onClick={() => cambiarEstado(ord.id, 'Enviado')} className="w-full py-2 bg-green-500/20 text-green-400 text-xs font-bold rounded-lg border border-green-500/30">
🛵 Marcar En Camino
</button>
) : (
<button onClick={() => notificarPreparadoLocal(ord.id)} className="w-full py-2 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-lg border border-purple-500/30">
🔔 Marcar Preparado (Notificar WhatsApp)
</button>
)}
</div>
</div>
))
)}
</div>
</div>
</div>
)}
​{/* Floating Cart Bar */}
{carrito.length > 0 && (
<div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#111111] border-t border-white/10 p-5 shadow-[0_-20px_40px_rgba(0,0,0,0.9)] z-50 rounded-t-[2.5rem] backdrop-blur-xl">
<div className="flex justify-between items-end mb-4 px-1">
<div className="flex flex-col">
<span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tu Orden</span>
<span className="font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full text-sm inline-block w-max border border-orange-500/25">{carrito.length} {carrito.length === 1 ? 'artículo' : 'artículos'}</span>
</div>
<div className="text-right">
<span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Total</span>
<span className="font-black text-3xl text-white tracking-tighter">RD$ {totalCarrito}</span>
</div>
</div>
​<div className="max-h-28 overflow-y-auto mb-4 space-y-1 bg-[#050505] p-2 rounded-xl border border-white/5">
{carrito.map((item, idx) => (
<div key={idx} className="flex justify-between items-center text-xs text-gray-300 py-1 border-b border-white/5 last:border-0">
<span className="truncate pr-2">{item.name}</span>
<div className="flex items-center gap-2 shrink-0">
<span className="font-bold text-orange-400">RD$ {item.price}</span>
<button onClick={() => eliminarDelCarrito(idx)} className="text-red-400 hover:text-red-300 px-1 font-bold">×</button>
</div>
</div>
))}
</div>
​<div className="flex gap-2 mb-4 bg-[#050505] p-1.5 rounded-2xl border border-white/5">
<button onClick={() => setTipoPedido('delivery')} className={flex-1 py-3 text-sm font-bold rounded-xl transition-all ${tipoPedido === 'delivery' ? 'bg-[#1c1c1c] text-orange-500 border border-white/5' : 'text-gray-500'}}>🛵 Delivery</button>
<button onClick={() => setTipoPedido('local')} className={flex-1 py-3 text-sm font-bold rounded-xl transition-all ${tipoPedido === 'local' ? 'bg-[#1c1c1c] text-orange-500 border border-white/5' : 'text-gray-500'}}>🍽️ En Local</button>
</div>
​<button onClick={() => setShowCheckoutModal(true)} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-black py-4 rounded-2xl font-black text-lg shadow-[0_8px_25px_rgba(249,115,22,0.3)] active:scale-[0.98]">
Crear orden
</button>
</div>
)}
​</div>
</div>
);
}