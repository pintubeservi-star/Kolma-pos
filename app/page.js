'use client';

import React, { useState, useEffect } from 'react';

export default function App() {
  // PERSISTENCIA CON LOCALSTORAGE PARA QUE NO SE PIERDA AL RECARGAR
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('xiiao_logged') === 'true';
    }
    return false;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('xiiao_user');
      return saved ? JSON.parse(saved) : { name: '', role: 'cajero' };
    }
    return { name: '', role: 'cajero' };
  });

  const [loginForm, setLoginForm] = useState({ name: '', password: '', role: 'cajero', openingBalance: '2500' });

  const [activeTab, setActiveTab] = useState('pos');
  
  const [cashRegister, setCashRegister] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('xiiao_cash');
      return saved ? JSON.parse(saved) : { openingBalance: 0, cashSales: 0, cardSales: 0, cashIn: 0, cashOut: 0 };
    }
    return { openingBalance: 0, cashSales: 0, cardSales: 0, cashIn: 0, cashOut: 0 };
  });

  const [cashMovements, setCashMovements] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('xiiao_movements');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [movementForm, setMovementForm] = useState({ type: 'IN', amount: '', reason: '' });
  const [showShiftModal, setShowShiftModal] = useState(false);

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

  const [cart, setCart] = useState([]);
  const [orderType, setOrderType] = useState('Para Comer Aquí'); // 'Para Comer Aquí' | 'Para Llevar' | 'Delivery'
  
  // DATOS ADICIONALES PARA SHIPDAY (Retirada y Delivery)
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', address: '' });

  const [kitchenOrders, setKitchenOrders] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('xiiao_kitchen');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [orderHistory, setOrderHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('xiiao_history');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // SINCRONIZAR CON LOCALSTORAGE
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('xiiao_logged', isLoggedIn);
      localStorage.setItem('xiiao_user', JSON.stringify(currentUser));
      localStorage.setItem('xiiao_cash', JSON.stringify(cashRegister));
      localStorage.setItem('xiiao_movements', JSON.stringify(cashMovements));
      localStorage.setItem('xiiao_kitchen', JSON.stringify(kitchenOrders));
      localStorage.setItem('xiiao_history', JSON.stringify(orderHistory));
    }
  }, [isLoggedIn, currentUser, cashRegister, cashMovements, kitchenOrders, orderHistory]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginForm.name.trim() || !loginForm.password.trim() || !loginForm.openingBalance) {
      alert('Por favor completa todos los campos.');
      return;
    }

    if (loginForm.role === 'admin' && loginForm.password !== '1221') {
      alert('Contraseña de Administrador incorrecta.');
      return;
    }

    setCurrentUser({ name: loginForm.name, role: loginForm.role });
    setCashRegister({
      openingBalance: parseFloat(loginForm.openingBalance) || 0,
      cashSales: 0,
      cardSales: 0,
      cashIn: 0,
      cashOut: 0
    });
    setIsLoggedIn(true);
  };

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

  const clearCart = () => {
    setCart([]);
    setCustomerInfo({ name: '', phone: '', address: '' });
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const sendOrderToKitchen = (paymentMethod = 'Efectivo') => {
    if (cart.length === 0) return;

    // VALIDACIONES SEGÚN TIPO DE ORDEN (Preparado para Shipday)
    if (orderType === 'Para Llevar' && !customerInfo.name.trim()) {
      alert('Por favor ingrese el nombre del cliente para órdenes de retirada.');
      return;
    }

    if (orderType === 'Delivery') {
      if (!customerInfo.name.trim() || !customerInfo.phone.trim() || !customerInfo.address.trim()) {
        alert('Para Delivery es obligatorio el Nombre, Teléfono y Ubicación/Dirección del cliente.');
        return;
      }
    }

    const newOrder = {
      id: Math.floor(100 + Math.random() * 900),
      orderType,
      customer: { ...customerInfo },
      items: cart.map(item => ({ name: item.name, qty: item.qty })),
      status: 'Pendiente',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      total: cartTotal,
      cashier: currentUser.name,
      paymentMethod
    };

    setKitchenOrders([newOrder, ...kitchenOrders]);
    setOrderHistory([newOrder, ...orderHistory]);

    if (paymentMethod === 'Efectivo') {
      setCashRegister(prev => ({ ...prev, cashSales: prev.cashSales + cartTotal }));
    } else {
      setCashRegister(prev => ({ ...prev, cardSales: prev.cardSales + cartTotal }));
    }
    clearCart();
  };

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

  const handleDeleteOrder = (orderId) => {
    const pwd = prompt('Ingrese la contraseña de Administrador (1221) para eliminar el ticket:');
    if (pwd === '1221') {
      setKitchenOrders(kitchenOrders.filter(o => o.id !== orderId));
      alert('Ticket eliminado correctamente.');
    } else if (pwd !== null) {
      alert('Contraseña incorrecta.');
    }
  };

  const handleTriggerShiftClosure = () => {
    const pwd = prompt('Ingrese contraseña de Administrador (1221) para generar el cierre de turno:');
    if (pwd === '1221') {
      setShowShiftModal(true);
    } else if (pwd !== null) {
      alert('Contraseña incorrecta.');
    }
  };

  const expectedCashInBox = cashRegister.openingBalance + cashRegister.cashSales + cashRegister.cashIn - cashRegister.cashOut;
  const totalShiftSales = cashRegister.cashSales + cashRegister.cardSales;

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const sendWhatsAppClosure = () => {
    const message = encodeURIComponent(
      `*REPORTE DE CIERRE DE TURNO - XIIAO KITCHEN*\n\n` +
      `👤 Cajera/Operador: ${currentUser.name}\n` +
      `📅 Fecha: ${new Date().toLocaleDateString()}\n\n` +
      `• Fondo Inicial de Caja: RD$ ${cashRegister.openingBalance}\n` +
      `• Ventas en Efectivo: RD$ ${cashRegister.cashSales}\n` +
      `• Ventas con Tarjeta: RD$ ${cashRegister.cardSales}\n` +
      `• Entradas Extra de Efectivo: RD$ ${cashRegister.cashIn}\n` +
      `• Salidas / Retiros: RD$ ${cashRegister.cashOut}\n` +
      `• *EFECTIVO ESPERADO EN CAJA: RD$ ${expectedCashInBox}*\n` +
      `• *VENTAS TOTALES DEL TURNO: RD$ ${totalShiftSales}*\n` +
      `• Total de Órdenes Atendidas: ${orderHistory.length}`
    );
    window.open(`https://wa.me/18298558779?text=${message}`, '_blank');
  };

  const s = {
    app: { fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    header: { backgroundColor: '#1e293b', borderBottom: '1px solid #334155', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' },
    navBtn: (active) => ({ padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', backgroundColor: active ? '#f97316' : 'transparent', color: active ? '#ffffff' : '#94a3b8' }),
    main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    card: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '15px' },
    input: { width: '100%', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', padding: '10px', color: '#ffffff', outline: 'none', boxSizing: 'border-box' },
    btnPrimary: { backgroundColor: '#f97316', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }
  };

  if (!isLoggedIn) {
    return (
      <div style={{ ...s.app, justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
        <div style={{ ...s.card, width: '100%', maxWidth: '400px', backgroundColor: '#1e293b' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🍽️</div>
            <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>Xiiao <span style={{ color: '#f97316' }}>Kitchen POS</span></h1>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '5px' }}>Configure su turno de caja para iniciar</p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Nombre del Operador / Cajera</label>
              <input
                type="text"
                placeholder="Ej: Ana Pérez"
                value={loginForm.name}
                onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                style={s.input}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Fondo Inicial en Caja (RD$)</label>
              <input
                type="number"
                placeholder="2500"
                value={loginForm.openingBalance}
                onChange={(e) => setLoginForm({ ...loginForm, openingBalance: e.target.value })}
                style={s.input}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Rol en el Sistema</label>
              <select
                value={loginForm.role}
                onChange={(e) => setLoginForm({ ...loginForm, role: e.target.value })}
                style={s.input}>
                <option value="cajero">Cajero / Operador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Contraseña de Acceso</label>
              <input
                type="password"
                placeholder="••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                style={s.input}
                required
              />
            </div>

            <button type="submit" style={{ ...s.btnPrimary, marginTop: '10px' }}>Iniciar Turno</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={s.app}>
      <header style={s.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ backgroundColor: '#f97316', color: 'white', padding: '8px', borderRadius: '8px', fontSize: '18px' }}>🍽️</div>
          <div>
            <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Xiiao <span style={{ color: '#f97316' }}>Kitchen</span></h1>
            <span style={{ fontSize: '11px', color: '#34d399' }}>● {currentUser.name} ({currentUser.role})</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '5px', backgroundColor: '#0f172a', padding: '4px', borderRadius: '8px', border: '1px solid #334155', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('pos')} style={s.navBtn(activeTab === 'pos')}>Shopfront POS</button>
          <button onClick={() => setActiveTab('cocina')} style={s.navBtn(activeTab === 'cocina')}>Cocina KDS ({kitchenOrders.length})</button>
          <button onClick={() => setActiveTab('caja')} style={s.navBtn(activeTab === 'caja')}>Caja & Turno</button>
          {currentUser.role === 'admin' && (
            <button onClick={() => setActiveTab('admin')} style={s.navBtn(activeTab === 'admin')}>Admin</button>
          )}
        </div>

        <div>
          <button onClick={() => {
            if (confirm('¿Desea cerrar sesión y finalizar el turno actual?')) {
              setIsLoggedIn(false);
              localStorage.clear();
            }
          }} style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main style={{ ...s.main, flexDirection: 'column' }}>
        {activeTab === 'pos' && (
          <div style={{ display: 'flex', flex: 1, flexDirection: 'column', overflow: 'hidden' }} className="md:flex-row">
            <div style={{ flex: 1, padding: '15px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }} className="md:flex-row md:justify-between">
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '5px' }}>
                  {[{ id: 'all', label: 'Todos' }, { id: 'platos', label: 'Platos' }, { id: 'entradas', label: 'Entradas' }, { id: 'bebidas', label: 'Bebidas' }].map(cat => (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: selectedCategory === cat.id ? '#ffffff' : '#1e293b', color: selectedCategory === cat.id ? '#000' : '#fff', fontWeight: 'bold', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {cat.label}
                    </button>
                  ))}
                </div>
                <input type="text" placeholder="Buscar plato..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ ...s.input, width: '100%', maxWidth: '220px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                {filteredProducts.map(product => (
                  <div key={product.id} onClick={() => addToCart(product)} style={{ ...s.card, cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '12px' }}>
                    <div>
                      <div style={{ fontSize: '24px', marginBottom: '6px' }}>{product.img}</div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '13px' }}>{product.name}</h4>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155', paddingTop: '8px' }}>
                      <span style={{ color: '#f97316', fontWeight: 'bold', fontSize: '13px' }}>RD$ {product.price}</span>
                      <span style={{ backgroundColor: '#f97316', color: 'white', width: '22px', height: '22px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>+</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ width: '100%', maxWidth: '350px', backgroundColor: '#1e293b', borderTop: '1px solid #334155', display: 'flex', flexDirection: 'column', padding: '15px', justifyContent: 'space-between' }} className="md:border-t-0 md:border-l">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '15px' }}>🛒 Orden Actual</h3>
                  {cart.length > 0 && <button onClick={clearCart} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}>Limpiar</button>}
                </div>

                {/* SELECTOR DE TIPO DE ORDEN */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', margin: '10px 0' }}>
                  {['Para Comer Aquí', 'Para Llevar', 'Delivery'].map(type => (
                    <button key={type} onClick={() => setOrderType(type)} style={{ padding: '6px 2px', fontSize: '10px', fontWeight: 'bold', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: orderType === type ? '#f97316' : '#0f172a', color: '#fff' }}>
                      {type}
                    </button>
                  ))}
                </div>

                {/* CAMPOS DINÁMICOS PARA SHIPDAY (Retirada y Delivery) */}
                {orderType === 'Para Llevar' && (
                  <div style={{ marginBottom: '10px', backgroundColor: '#0f172a', padding: '8px', borderRadius: '8px', border: '1px solid #334155' }}>
                    <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>Nombre del Cliente (Retirada)*</label>
                    <input type="text" placeholder="Nombre completo" value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} style={{ ...s.input, padding: '6px', fontSize: '12px' }} />
                  </div>
                )}

                {orderType === 'Delivery' && (
                  <div style={{ marginBottom: '10px', backgroundColor: '#0f172a', padding: '8px', borderRadius: '8px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: '#f97316', fontWeight: 'bold' }}> Datos para Delivery (Shipday)</span>
                    <input type="text" placeholder="Nombre del cliente*" value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} style={{ ...s.input, padding: '6px', fontSize: '12px' }} />
                    <input type="text" placeholder="Teléfono del cliente*" value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} style={{ ...s.input, padding: '6px', fontSize: '12px' }} />
                    <input type="text" placeholder="Ubicación / Dirección*" value={customerInfo.address} onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })} style={{ ...s.input, padding: '6px', fontSize: '12px' }} />
                  </div>
                )}

                <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cart.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', marginTop: '10px' }}>Selecciona productos para armar la orden</p>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} style={{ backgroundColor: '#0f172a', padding: '8px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{item.name}</div>
                          <div style={{ fontSize: '11px', color: '#f97316', fontWeight: 'bold' }}>RD$ {item.price * item.qty}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#1e293b', padding: '2px 6px', borderRadius: '6px' }}>
                          <button onClick={() => updateQty(item.id, -1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                          <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', margin: '10px 0', borderTop: '1px solid #334155', paddingTop: '10px' }}>
                  <span>TOTAL:</span>
                  <span style={{ color: '#f97316' }}>RD$ {cartTotal}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button disabled={cart.length === 0} onClick={() => sendOrderToKitchen('Efectivo')} style={{ ...s.btnPrimary, padding: '10px', fontSize: '13px', opacity: cart.length === 0 ? 0.5 : 1 }}>Efectivo</button>
                  <button disabled={cart.length === 0} onClick={() => sendOrderToKitchen('Tarjeta')} style={{ ...s.btnPrimary, padding: '10px', fontSize: '13px', backgroundColor: '#ffffff', color: '#000000', opacity: cart.length === 0 ? 0.5 : 1 }}>Tarjeta</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'cocina' && (
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0, fontSize: '18px' }}>Pantalla de Cocina (KDS)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '15px', marginTop: '15px' }}>
              {kitchenOrders.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '13px' }}>No hay órdenes pendientes en cocina.</p>
              ) : (
                kitchenOrders.map(order => (
                  <div key={order.id} style={{ ...s.card, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '8px', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold', backgroundColor: '#0f172a', padding: '3px 6px', borderRadius: '4px', fontSize: '12px' }}>#ORD-{order.id}</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{order.time}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                        <span style={{ color: '#f97316', fontWeight: 'bold' }}>{order.orderType}</span>
                        <span style={{ color: '#cbd5e1' }}>Cajero: {order.cashier}</span>
                      </div>
                      
                      {/* DETALLES DE CLIENTE PARA SHIPDAY */}
                      {order.orderType !== 'Para Comer Aquí' && (
                        <div style={{ backgroundColor: '#0f172a', padding: '6px', borderRadius: '6px', margin: '6px 0', fontSize: '11px', border: '1px solid #334155' }}>
                          <div><b>Cliente:</b> {order.customer.name || 'N/A'}</div>
                          {order.orderType === 'Delivery' && (
                            <>
                              <div><b>Tel:</b> {order.customer.phone || 'N/A'}</div>
                              <div><b>Ubicación:</b> {order.customer.address || 'N/A'}</div>
                            </>
                          )}
                        </div>
                      )}

                      <div style={{ margin: '10px 0' }}>
                        {order.items.map((it, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                            <span>{it.name}</span>
                            <span style={{ fontWeight: 'bold', color: '#f97316' }}>x{it.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
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
                        style={{ ...s.btnPrimary, flex: 1, padding: '8px', fontSize: '12px', backgroundColor: order.status === 'Pendiente' ? '#3b82f6' : order.status === 'En Preparación' ? '#f59e0b' : '#22c55e' }}>
                        {order.status === 'Pendiente' ? 'Preparar' : order.status === 'En Preparación' ? 'Marcar Listo' : 'Entregado (Quitar)'}
                      </button>

                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        title="Eliminar ticket (Requiere Admin 1221)"
                        style={{ backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'caja' && (
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'space-between', alignItems: 'flex-start', ...s.card, marginBottom: '15px' }} className="md:flex-row md:items-center">
              <div>
                <h2 style={{ margin: 0, fontSize: '18px' }}>Control de Caja & Cierre de Turno</h2>
                <p style={{ margin: '3px 0 0 0', color: '#94a3b8', fontSize: '12px' }}>Gestión de efectivo y arqueo en tiempo real</p>
              </div>
              <button onClick={handleTriggerShiftClosure} style={{ ...s.btnPrimary, width: 'auto', padding: '10px 15px', fontSize: '13px' }}>Generar Cierre de Turno</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '15px' }}>
              <div style={s.card}><span style={{ fontSize: '11px', color: '#94a3b8' }}>Fondo Inicial</span><p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 0 0' }}>RD$ {cashRegister.openingBalance}</p></div>
              <div style={s.card}><span style={{ fontSize: '11px', color: '#94a3b8' }}>Ventas Efectivo</span><p style={{ fontSize: '18px', fontWeight: 'bold', color: '#f97316', margin: '4px 0 0 0' }}>RD$ {cashRegister.cashSales}</p></div>
              <div style={s.card}><span style={{ fontSize: '11px', color: '#94a3b8' }}>Ventas Tarjeta</span><p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 0 0' }}>RD$ {cashRegister.cardSales}</p></div>
              <div style={{ ...s.card, border: '1px solid #f97316' }}><span style={{ fontSize: '11px', color: '#f97316', fontWeight: 'bold' }}>EFECTIVO EN CAJA</span><p style={{ fontSize: '18px', fontWeight: 'bold', margin: '4px 0 0 0' }}>RD$ {expectedCashInBox}</p></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }} className="lg:grid-cols-3">
              <form onSubmit={handleAddMovement} style={{ ...s.card, height: 'fit-content' }}>
                <h3 style={{ marginTop: 0, fontSize: '15px' }}>Registrar Movimiento</h3>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tipo</label>
                  <select value={movementForm.type} onChange={(e) => setMovementForm({ ...movementForm, type: e.target.value })} style={s.input}>
                    <option value="IN">Entrada (+)</option>
                    <option value="OUT">Salida / Gasto (-)</option>
                  </select>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Monto (RD$)</label>
                  <input type="number" placeholder="0.00" value={movementForm.amount} onChange={(e) => setMovementForm({ ...movementForm, amount: e.target.value })} style={s.input} required />
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '11px', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Concepto</label>
                  <input type="text" placeholder="Ej: Compra de hielo" value={movementForm.reason} onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })} style={s.input} required />
                </div>
                <button type="submit" style={{ ...s.btnPrimary, padding: '10px', fontSize: '13px' }}>Registrar</button>
              </form>

              <div style={{ ...s.card, gridColumn: 'span 2' }}>
                <h3 style={{ marginTop: 0, fontSize: '15px' }}>Historial de Órdenes y Movimientos del Turno</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                  {orderHistory.length === 0 && cashMovements.length === 0 && (
                    <p style={{ color: '#64748b', fontSize: '12px', textAlign: 'center', margin: '20px 0' }}>No hay registros en este turno todavía.</p>
                  )}
                  {orderHistory.map(ord => (
                    <div key={ord.id} style={{ backgroundColor: '#0f172a', padding: '8px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Ticket #{ord.id} ({ord.orderType}) - Pago: {ord.paymentMethod}</div>
                        <span style={{ fontSize: '10px', color: '#64748b' }}>{ord.time} | Cajero: {ord.cashier} {ord.customer.name ? `| Cliente: ${ord.customer.name}` : ''}</span>
                      </div>
                      <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#22c55e' }}>+RD$ {ord.total}</span>
                    </div>
                  ))}
                  {cashMovements.map(m => (
                    <div key={m.id} style={{ backgroundColor: '#0f172a', padding: '8px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>Movimiento: {m.reason}</div>
                        <span style={{ fontSize: '10px', color: '#64748b' }}>{m.time}</span>
                      </div>
                      <span style={{ fontWeight: 'bold', fontSize: '13px', color: m.type === 'IN' ? '#22c55e' : '#ef4444' }}>
                        {m.type === 'IN' ? `+RD$ ${m.amount}` : `-RD$ ${m.amount}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && currentUser.role === 'admin' && (
          <div style={{ flex: 1, padding: '15px', overflowY: 'auto' }}>
            <div style={s.card}>
              <h2 style={{ marginTop: 0, fontSize: '18px' }}>Panel de Administración</h2>
              <p style={{ color: '#94a3b8', fontSize: '13px' }}>Contraseña administrativa activa: <b>1221</b></p>
              <table style={{ width: '100%', marginTop: '15px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '11px' }}>
                    <th style={{ padding: '8px' }}>Usuario Actual</th>
                    <th style={{ padding: '8px' }}>Rol</th>
                    <th style={{ padding: '8px' }}>Privilegios</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '8px', fontWeight: 'bold' }}>{currentUser.name}</td>
                    <td style={{ padding: '8px' }}><span style={{ backgroundColor: '#f97316', padding: '2px 6px', borderRadius: '4px', fontSize: '10px' }}>Admin</span></td>
                    <td style={{ padding: '8px', color: '#94a3b8' }}>Acceso total a Cierre de Turno, Historial y Eliminación de Tickets (Clave 1221)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {showShiftModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '15px' }}>
          <div style={{ ...s.card, width: '100%', maxWidth: '420px', backgroundColor: '#0f172a', border: '1px solid #334155' }}>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #334155', paddingBottom: '10px', fontSize: '16px' }}>Reporte de Cierre de Turno & WhatsApp</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', margin: '12px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Cajera/Operador:</span> <b>{currentUser.name}</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Fondo Inicial:</span> <b>RD$ {cashRegister.openingBalance}</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Ventas Efectivo:</span> <b style={{ color: '#f97316' }}>+ RD$ {cashRegister.cashSales}</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Ventas Tarjeta:</span> <b>+ RD$ {cashRegister.cardSales}</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Entradas / Salidas:</span> <b>+{cashRegister.cashIn} / -{cashRegister.cashOut}</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total Órdenes:</span> <b>{orderHistory.length} tickets</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '8px', fontSize: '15px' }}>
                <span>EFECTIVO ESPERADO:</span> <b style={{ color: '#f97316' }}>RD$ {expectedCashInBox}</b>
              </div>
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '15px' }}>Se enviará el reporte completo vía WhatsApp al número <b>8298558779</b>.</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setShowShiftModal(false)} style={{ ...s.btnPrimary, backgroundColor: '#334155', padding: '10px', fontSize: '13px' }}>Cancelar</button>
              <button onClick={() => {
                sendWhatsAppClosure();
                setShowShiftModal(false);
                setIsLoggedIn(false);
                localStorage.clear();
                alert('¡Cierre generado, enviado a WhatsApp y turno finalizado correctamente!');
              }} style={{ ...s.btnPrimary, backgroundColor: '#22c55e', padding: '10px', fontSize: '13px' }}>Enviar a WhatsApp & Finalizar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
