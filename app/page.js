'use client';

import React, { useState } from 'react';

export default function App() {
  // SESIÓN Y USUARIOS
  const [currentUser, setCurrentUser] = useState({
    name: 'Michael Pineda',
    role: 'admin' // 'admin' | 'cajero'
  });

  // NAVEGACIÓN
  const [activeTab, setActiveTab] = useState('pos'); // 'pos' | 'cocina' | 'caja' | 'admin'

  // ESTADO DEL TURNO Y CAJA
  const [shiftOpen, setShiftOpen] = useState(true);
  const [cashRegister, setCashRegister] = useState({
    openingBalance: 2500,
    cashSales: 4850,
    cardSales: 3200,
    cashIn: 1000,
    cashOut: 650
  });
  const [cashMovements, setCashMovements] = useState([
    { id: 1, type: 'IN', amount: 1000, reason: 'Aporte para cambio de sencillo', time: '09:15 AM' },
    { id: 2, type: 'OUT', amount: 650, reason: 'Pago de hielo y suministro urgente', time: '11:40 AM' }
  ]);
  const [movementForm, setMovementForm] = useState({ type: 'IN', amount: '', reason: '' });
  const [showShiftModal, setShowShiftModal] = useState(false);

  // PRODUCTOS Y CATEGORÍAS
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [products] = useState([
    { id: 1, name: 'Yaroa Mixta Especial', price: 350, category: 'platos', img: '🍟' },
    { id: 2, name: 'Hot Dog Dominicano', price: 150, category: 'platos', img: '🌭' },
    { id: 3, name: 'Tostada Dominicana', price: 120, category: 'platos', img: '🥪' },
    { id: 4, name: 'Chimi de Res Premium', price: 280, category: 'platos', img: '🍔' },
    { id: 5, name: 'Queso Frito Bites (8 uds)', price: 220, category: 'entradas', img: '🧀' },
    { id: 6, name: 'Papas Fritas con Cheddar', price: 180, category: 'entradas', img: '🍟' },
    { id: 7, name: 'Refresco Botella 20oz', price: 60, category: 'bebidas', img: '🥤' },
    { id: 8, name: 'Jugo Natural de Chinola', price: 90, category: 'bebidas', img: '🍹' }
  ]);

  // CARRITO Y ÓRDENES DE COCINA
  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('Para Comer Aquí'); // 'Para Comer Aquí' | 'Para Llevar'
  const [kitchenOrders, setKitchenOrders] = useState([
    {
      id: 101,
      orderType: 'Para Comer Aquí',
      items: [
        { name: 'Yaroa Mixta Especial', qty: 1 },
        { name: 'Refresco Botella 20oz', qty: 1 }
      ],
      status: 'En Preparación',
      time: '12:04 PM',
      total: 410
    },
    {
      id: 102,
      orderType: 'Para Llevar',
      items: [
        { name: 'Chimi de Res Premium', qty: 2 },
        { name: 'Papas Fritas con Cheddar', qty: 1 }
      ],
      status: 'Pendiente',
      time: '12:10 PM',
      total: 740
    }
  ]);

  // ACCIONES DEL CARRITO
  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const sendOrderToKitchen = (paymentMethod = 'Efectivo') => {
    if (cart.length === 0) return;
    const newOrder = {
      id: Math.floor(100 + Math.random() * 900),
      orderType,
      items: cart.map(item => ({ name: item.name, qty: item.qty })),
      status: 'Pendiente',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      total: cartTotal
    };

    setKitchenOrders([newOrder, ...kitchenOrders]);

    if (paymentMethod === 'Efectivo') {
      setCashRegister(prev => ({ ...prev, cashSales: prev.cashSales + cartTotal }));
    } else {
      setCashRegister(prev => ({ ...prev, cardSales: prev.cardSales + cartTotal }));
    }

    clearCart();
  };

  // CONTROL DE CAJA
  const handleAddMovement = (e) => {
    e.preventDefault();
    if (!movementForm.amount || !movementForm.reason) return;
    const amountNum = parseFloat(movementForm.amount);
    
    const newMove = {
      id: Date.now(),
      type: movementForm.type,
      amount: amountNum,
      reason: movementForm.reason,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCashMovements([newMove, ...cashMovements]);

    if (movementForm.type === 'IN') {
      setCashRegister(prev => ({ ...prev, cashIn: prev.cashIn + amountNum }));
    } else {
      setCashRegister(prev => ({ ...prev, cashOut: prev.cashOut + amountNum }));
    }

    setMovementForm({ type: 'IN', amount: '', reason: '' });
  };

  // CÁLCULOS DEL TURNO
  const expectedCashInBox = cashRegister.openingBalance + cashRegister.cashSales + cashRegister.cashIn - cashRegister.cashOut;
  const totalShiftSales = cashRegister.cashSales + cashRegister.cardSales;

  // PRODUCTOS FILTRADOS
  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      {/* HEADER PRINCIPAL */}
      <header className="bg-neutral-950 border-b border-neutral-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="bg-orange-600 text-white p-2.5 rounded-xl font-bold flex items-center justify-center shadow-lg shadow-orange-600/30 text-lg">
            🍽️
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white uppercase">
              Xiiao <span className="text-orange-500">Kitchen POS</span>
            </h1>
            <div className="flex items-center gap-2 text-xs">
              <span className={`inline-block w-2 h-2 rounded-full ${shiftOpen ? 'bg-orange-500 animate-pulse' : 'bg-neutral-600'}`}></span>
              <span className="text-neutral-400 font-medium">
                {shiftOpen ? 'Turno Abierto & Activo' : 'Turno Cerrado'}
              </span>
            </div>
          </div>
        </div>

        {/* NAVEGACIÓN */}
        <div className="flex items-center gap-2 bg-neutral-900 p-1.5 rounded-xl border border-neutral-800">
          <button 
            onClick={() => setActiveTab('pos')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'pos' ? 'bg-orange-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'}`}>
            Shopfront POS
          </button>
          <button 
            onClick={() => setActiveTab('cocina')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${activeTab === 'cocina' ? 'bg-orange-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'}`}>
            Cocina (KDS)
            {kitchenOrders.length > 0 && (
              <span className="bg-white text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                {kitchenOrders.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('caja')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'caja' ? 'bg-orange-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'}`}>
            Caja & Turno
          </button>
          {currentUser.role === 'admin' && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1 ${activeTab === 'admin' ? 'bg-orange-600 text-white shadow-md' : 'text-neutral-400 hover:text-white'}`}>
              🛡️ Admin
            </button>
          )}
        </div>

        {/* SELECTOR DE USUARIO Y ROLES */}
        <div className="flex items-center gap-3">
          <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <span className="text-orange-500 text-sm">👤</span>
            <select
              value={currentUser.role}
              onChange={(e) => {
                const role = e.target.value;
                setCurrentUser({
                  name: role === 'admin' ? 'Michael Pineda' : 'Cajero Operador',
                  role: role
                });
                if (role !== 'admin' && activeTab === 'admin') setActiveTab('pos');
              }}
              className="bg-transparent text-sm font-medium text-white focus:outline-none cursor-pointer">
              <option value="admin" className="bg-neutral-900 text-white">Admin (Acceso Total)</option>
              <option value="cajero" className="bg-neutral-900 text-white">Cajero (Ventas/Caja)</option>
            </select>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex overflow-hidden">
        {/* ======================= VISTA 1: SHOPFRONT POS ======================= */}
        {activeTab === 'pos' && (
          <div className="flex-1 flex overflow-hidden">
            {/* PANEL IZQUIERDO: CATÁLOGO */}
            <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* FILTROS POR CATEGORÍA */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[
                    { id: 'all', label: 'Todos los Platos' },
                    { id: 'platos', label: 'Platos Fuertes' },
                    { id: 'entradas', label: 'Entradas & Snacks' },
                    { id: 'bebidas', label: 'Bebidas' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${selectedCategory === cat.id ? 'bg-white text-black font-bold' : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-white'}`}>
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* BUSCADOR */}
                <div className="relative w-full md:w-64">
                  <span className="absolute left-3 top-2.5 text-neutral-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Buscar plato..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* GRID DE PRODUCTOS */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-orange-500/50 p-4 rounded-2xl flex flex-col justify-between cursor-pointer transition-all group select-none">
                    <div>
                      <div className="text-3xl mb-2">{product.img}</div>
                      <h4 className="font-bold text-white text-sm leading-tight group-hover:text-orange-400 transition-colors">
                        {product.name}
                      </h4>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-neutral-800/80">
                      <span className="text-orange-500 font-extrabold text-base">
                        RD$ {product.price}
                      </span>
                      <span className="w-7 h-7 bg-orange-600 group-hover:bg-orange-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                        +
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PANEL DERECHO: CARRITO / TERMINAL */}
            <div className="w-96 bg-neutral-950 border-l border-neutral-800 flex flex-col justify-between p-6">
              <div className="flex flex-col gap-4 overflow-hidden flex-1">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    🛒 Orden Actual
                  </h3>
                  {cart.length > 0 && (
                    <button onClick={clearCart} className="text-xs text-neutral-500 hover:text-orange-400">
                      🗑️ Limpiar
                    </button>
                  )}
                </div>

                {/* SELECTOR DE TIPO DE ORDEN */}
                <div className="grid grid-cols-2 gap-2 bg-neutral-900 p-1.5 rounded-xl border border-neutral-800">
                  {['Para Comer Aquí', 'Para Llevar'].map(type => (
                    <button
                      key={type}
                      onClick={() => setOrderType(type)}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${orderType === type ? 'bg-orange-600 text-white' : 'text-neutral-400 hover:text-white'}`}>
                      {type}
                    </button>
                  ))}
                </div>

                {/* LISTA DE ITEMS EN EL CARRITO */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-600 text-center space-y-2">
                      <div className="text-4xl">🍽️</div>
                      <p className="text-sm">Selecciona productos del catálogo para armar la orden</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl flex justify-between items-center">
                        <div className="flex-1 pr-2">
                          <h5 className="text-sm font-semibold text-white leading-tight">{item.name}</h5>
                          <p className="text-xs text-orange-500 font-bold mt-1">RD$ {item.price * item.qty}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 px-2 py-1 rounded-lg">
                          <button onClick={() => updateQty(item.id, -1)} className="text-neutral-400 hover:text-white font-bold px-1.5">-</button>
                          <span className="text-sm font-bold w-4 text-center text-white">{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} className="text-neutral-400 hover:text-white font-bold px-1.5">+</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* TOTAL Y ACCIONES DE COBRO */}
              <div className="pt-4 border-t border-neutral-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-400 font-medium">Subtotal</span>
                  <span className="text-sm text-neutral-300 font-semibold">RD$ {cartTotal}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-black">
                  <span className="text-white">TOTAL A PAGAR</span>
                  <span className="text-orange-500">RD$ {cartTotal}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    disabled={cart.length === 0}
                    onClick={() => sendOrderToKitchen('Efectivo')}
                    className="bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-lg shadow-orange-600/20">
                    Cobrar Efectivo
                  </button>
                  <button
                    disabled={cart.length === 0}
                    onClick={() => sendOrderToKitchen('Tarjeta')}
                    className="bg-white hover:bg-neutral-200 disabled:opacity-40 text-black font-bold py-3 rounded-xl text-sm transition-all">
                    Cobrar Tarjeta
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= VISTA 2: PANTALLA DE COCINA (KDS) ======================= */}
        {activeTab === 'cocina' && (
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-black text-white">Pantalla de Cocina (KDS)</h2>
                <p className="text-sm text-neutral-400">Control interactivo de preparación en tiempo real</p>
              </div>
              <span className="bg-orange-500/10 text-orange-500 border border-orange-500/30 px-3 py-1.5 rounded-xl text-xs font-bold">
                {kitchenOrders.length} Órdenes Activas
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {kitchenOrders.length === 0 ? (
                <div className="col-span-full py-20 text-center text-neutral-600">
                  <div className="text-4xl mb-2">✔️</div>
                  <p className="text-base font-semibold">No hay órdenes pendientes en cocina</p>
                </div>
              ) : (
                kitchenOrders.map(order => (
                  <div
                    key={order.id}
                    className={`bg-neutral-900 border rounded-2xl p-5 flex flex-col justify-between space-y-4 ${order.status === 'Listo para Servir' ? 'border-orange-500 bg-orange-950/20' : 'border-neutral-800'}`}>
                    <div>
                      <div className="flex justify-between items-start pb-3 border-b border-neutral-800">
                        <div>
                          <span className="text-xs bg-neutral-800 text-neutral-300 font-bold px-2.5 py-1 rounded-md">
                            #ORD-{order.id}
                          </span>
                          <p className="text-xs text-orange-500 font-bold mt-2">{order.orderType}</p>
                        </div>
                        <span className="text-xs text-neutral-400 font-mono">
                          🕒 {order.time}
                        </span>
                      </div>

                      <div className="py-3 space-y-2">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm font-semibold">
                            <span className="text-white">{it.name}</span>
                            <span className="bg-neutral-800 text-white font-mono px-2 py-0.5 rounded text-xs">
                              x{it.qty}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-800 flex justify-between items-center gap-2">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                        order.status === 'Pendiente' 
                          ? 'bg-neutral-800 text-neutral-300' 
                          : order.status === 'En Preparación' 
                            ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30' 
                            : 'bg-white text-black'
                      }`}>
                        {order.status}
                      </span>

                      <button
                        onClick={() => {
                          if (order.status === 'Pendiente') {
                            setKitchenOrders(kitchenOrders.map(o => o.id === order.id ? { ...o, status: 'En Preparación' } : o));
                          } else if (order.status === 'En Preparación') {
                            setKitchenOrders(kitchenOrders.map(o => o.id === order.id ? { ...o, status: 'Listo para Servir' } : o));
                          } else {
                            setKitchenOrders(kitchenOrders.filter(o => o.id !== order.id));
                          }
                        }}
                        className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all">
                        {order.status === 'Pendiente' ? 'Preparar' : order.status === 'En Preparación' ? 'Marcar Listo' : 'Entregado (Quitar)'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================= VISTA 3: CAJA Y CIERRE DE TURNO ======================= */}
        {activeTab === 'caja' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
              <div>
                <h2 className="text-2xl font-black text-white">Control de Caja & Cierre de Turno</h2>
                <p className="text-sm text-neutral-400 mt-0.5">Gestión de efectivo, entradas extras, retiros y cuadre final</p>
              </div>
              <button
                onClick={() => setShowShiftModal(true)}
                className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-lg shadow-orange-600/20 flex items-center gap-2">
                🖨️ Generar Cierre de Turno
              </button>
            </div>

            {/* CUADROS DE RESUMEN FINANCIERO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-2xl">
                <p className="text-xs text-neutral-400 font-medium">Fondo Inicial</p>
                <p className="text-2xl font-black text-white mt-1">RD$ {cashRegister.openingBalance}</p>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-2xl">
                <p className="text-xs text-neutral-400 font-medium">Ventas Efectivo</p>
                <p className="text-2xl font-black text-orange-500 mt-1">RD$ {cashRegister.cashSales}</p>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-2xl">
                <p className="text-xs text-neutral-400 font-medium">Ventas Tarjeta</p>
                <p className="text-2xl font-black text-white mt-1">RD$ {cashRegister.cardSales}</p>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 p-5 rounded-2xl">
                <p className="text-xs text-neutral-400 font-medium">Entradas (+) / Salidas (-)</p>
                <p className="text-lg font-bold text-neutral-300 mt-2">
                  +{cashRegister.cashIn} / <span className="text-orange-400">-{cashRegister.cashOut}</span>
                </p>
              </div>
              <div className="bg-neutral-900 border border-orange-500/50 p-5 rounded-2xl">
                <p className="text-xs text-orange-400 font-bold uppercase">Efectivo en Caja</p>
                <p className="text-2xl font-black text-white mt-1">RD$ {expectedCashInBox}</p>
              </div>
            </div>

            {/* FORMULARIO DE REGISTRO DE ENTRADA / SALIDA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form onSubmit={handleAddMovement} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl space-y-4">
                <h3 className="font-bold text-white text-base">Registrar Movimiento en Efectivo</h3>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Tipo de Movimiento</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setMovementForm({ ...movementForm, type: 'IN' })}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${movementForm.type === 'IN' ? 'bg-white text-black' : 'bg-neutral-950 text-neutral-400 border border-neutral-800'}`}>
                      + Entrada de Efectivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setMovementForm({ ...movementForm, type: 'OUT' })}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${movementForm.type === 'OUT' ? 'bg-orange-600 text-white' : 'bg-neutral-950 text-neutral-400 border border-neutral-800'}`}>
                      - Salida (Gasto / Retiro)
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Monto (RD$)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={movementForm.amount}
                    onChange={(e) => setMovementForm({ ...movementForm, amount: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 block mb-1">Concepto / Razón del Movimiento</label>
                  <input
                    type="text"
                    placeholder="Ej: Compra urgente de hielo, cambio..."
                    value={movementForm.reason}
                    onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-3 rounded-xl text-sm transition-all mt-2">
                  Registrar Movimiento
                </button>
              </form>

              {/* HISTORIAL DE MOVIMIENTOS */}
              <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-base mb-4">Historial de Entradas y Salidas</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {cashMovements.map(m => (
                      <div key={m.id} className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg font-bold text-xs ${m.type === 'IN' ? 'bg-white text-black' : 'bg-orange-600/20 text-orange-500'}`}>
                            {m.type === 'IN' ? '↗' : '↘'}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{m.reason}</p>
                            <span className="text-xs text-neutral-500 font-mono">{m.time}</span>
                          </div>
                        </div>
                        <span className={`font-mono font-bold text-sm ${m.type === 'IN' ? 'text-white' : 'text-orange-500'}`}>
                          {m.type === 'IN' ? `+RD$ ${m.amount}` : `-RD$ ${m.amount}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= VISTA 4: ADMINISTRACIÓN (SOLO ADMIN) ======================= */}
        {activeTab === 'admin' && currentUser.role === 'admin' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-white">Panel de Administración de Xiiao Kitchen</h2>
                <p className="text-sm text-neutral-400">Control de permisos de usuarios y parámetros de caja</p>
              </div>
              <span className="bg-orange-600/20 text-orange-500 border border-orange-500/30 px-4 py-1.5 rounded-xl text-xs font-bold uppercase">
                Permiso: Administrador Total
              </span>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-white text-base">Control de Usuarios del Terminal</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-800 text-xs text-neutral-400 uppercase">
                    <th className="py-3 px-4">Usuario</th>
                    <th className="py-3 px-4">Rol Asignado</th>
                    <th className="py-3 px-4">Capacidad Administrativa</th>
                    <th className="py-3 px-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-neutral-800/80">
                  <tr>
                    <td className="py-4 px-4 font-bold text-white">Michael Pineda</td>
                    <td className="py-4 px-4"><span className="bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-xs font-bold">Administrador</span></td>
                    <td className="py-4 px-4 text-neutral-300">Acceso Total (Catálogo, Usuarios, Cierre de Caja)</td>
                    <td className="py-4 px-4"><span className="text-emerald-400 text-xs font-bold">Activo (Sesión Actual)</span></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-bold text-white">Cajero Operador 1</td>
                    <td className="py-4 px-4"><span className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-xs font-bold">Cajero-Mesero</span></td>
                    <td className="py-4 px-4 text-neutral-400">Sólo Shopfront POS y Consulta de Cocina</td>
                    <td className="py-4 px-4"><span className="text-neutral-500 text-xs font-bold">Sin permisos de Admin</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL DE CIERRE DE TURNO */}
      {showShiftModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
              <div>
                <h3 className="text-lg font-black text-white uppercase">Reporte Cierre de Turno</h3>
                <p className="text-xs text-neutral-400">Xiiao Kitchen POS &bull; {new Date().toLocaleDateString()}</p>
              </div>
              <button onClick={() => setShowShiftModal(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-neutral-800">
                <span className="text-neutral-400">Fondo Inicial de Caja:</span>
                <span className="font-bold text-white">RD$ {cashRegister.openingBalance}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-800">
                <span className="text-neutral-400">Ventas en Efectivo:</span>
                <span className="font-bold text-orange-500">+ RD$ {cashRegister.cashSales}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-800">
                <span className="text-neutral-400">Ventas con Tarjeta:</span>
                <span className="font-bold text-white">+ RD$ {cashRegister.cardSales}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-800">
                <span className="text-neutral-400">Entradas Extra de Efectivo:</span>
                <span className="font-bold text-white">+ RD$ {cashRegister.cashIn}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-neutral-800">
                <span className="text-neutral-400">Salidas / Gastos / Retiros:</span>
                <span className="font-bold text-orange-500">- RD$ {cashRegister.cashOut}</span>
              </div>
              <div className="flex justify-between py-3 bg-neutral-900 px-4 rounded-xl border border-neutral-800 text-base font-black">
                <span className="text-white">TOTAL ESPERADO EN CAJA:</span>
                <span className="text-orange-500">RD$ {expectedCashInBox}</span>
              </div>
              <div className="flex justify-between py-2 px-4 text-xs text-neutral-400">
                <span>Ventas Totales del Turno (Efectivo + Tarjeta):</span>
                <span className="font-bold text-white">RD$ {totalShiftSales}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowShiftModal(false)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShiftOpen(false);
                  setShowShiftModal(false);
                  alert('Turno cerrado exitosamente y reporte guardado en el sistema.');
                }}
                className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-600/30">
                Confirmar y Cerrar Turno
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
