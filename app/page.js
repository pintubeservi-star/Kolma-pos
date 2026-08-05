'use client';

import React, { useState } from 'react';

export default function App() {
  const [currentUser, setCurrentUser] = useState({
    name: 'Michael Pineda',
    role: 'admin'
  });

  const [activeTab, setActiveTab] = useState('pos');
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
  const [orderType, setOrderType] = useState('Para Comer Aquí');
  
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
    }
  ]);

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

  const expectedCashInBox = cashRegister.openingBalance + cashRegister.cashSales + cashRegister.cashIn - cashRegister.cashOut;
  const totalShiftSales = cashRegister.cashSales + cashRegister.cardSales;

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // ESTILOS EN LÍNEA / CSS PURO PARA GARANTIZAR FUNCIONAMIENTO VISUAL
  const s = {
    app: { fontFamily: 'sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' },
    header: { backgroundColor: '#1e293b', borderBottom: '1px solid #334155', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    navBtn: (active) => ({ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', backgroundColor: active ? '#f97316' : 'transparent', color: active ? '#ffffff' : '#94a3b8' }),
    main: { flex: 1, display: 'flex', overflow: 'hidden', height: 'calc(100vh - 75px)' },
    card: { backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '20px' },
    input: { width: '100%', backgroundColor: '#0f172a', border: '1px solid #475569', borderRadius: '8px', padding: '10px', color: '#ffffff', outline: 'none', boxSizing: 'border-box' },
    btnPrimary: { backgroundColor: '#f97316', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }
  };

  return (
    <div style={s.app}>
      {/* HEADER PRINCIPAL */}
      <header style={s.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#f97316', color: 'white', padding: '10px', borderRadius: '10px', fontSize: '20px' }}>🍽️</div>
          <div>
            <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Xiiao <span style={{ color: '#f97316' }}>Kitchen POS</span></h1>
            <span style={{ fontSize: '12px', color: '#34d399' }}>● Turno Abierto & Activo</span>
          </div>
        </div>

        {/* NAVEGACIÓN */}
        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#0f172a', padding: '5px', borderRadius: '10px', border: '1px solid #334155' }}>
          <button onClick={() => setActiveTab('pos')} style={s.navBtn(activeTab === 'pos')}>Shopfront POS</button>
          <button onClick={() => setActiveTab('cocina')} style={s.navBtn(activeTab === 'cocina')}>Cocina ({kitchenOrders.length})</button>
          <button onClick={() => setActiveTab('caja')} style={s.navBtn(activeTab === 'caja')}>Caja & Turno</button>
          {currentUser.role === 'admin' && (
            <button onClick={() => setActiveTab('admin')} style={s.navBtn(activeTab === 'admin')}>🛡️ Admin</button>
          )}
        </div>

        {/* SELECTOR DE ROL */}
        <div>
          <select
            value={currentUser.role}
            onChange={(e) => {
              const role = e.target.value;
              setCurrentUser({ name: role === 'admin' ? 'Michael Pineda' : 'Cajero', role });
              if (role !== 'admin' && activeTab === 'admin') setActiveTab('pos');
            }}
            style={{ backgroundColor: '#0f172a', color: 'white', border: '1px solid #334155', padding: '8px 12px', borderRadius: '8px' }}>
            <option value="admin">Admin (Acceso Total)</option>
            <option value="cajero">Cajero</option>
          </select>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main style={s.main}>
        {/* VISTA 1: POS */}
        {activeTab === 'pos' && (
          <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            {/* CATÁLOGO */}
            <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '15px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[{ id: 'all', label: 'Todos' }, { id: 'platos', label: 'Platos' }, { id: 'entradas', label: 'Entradas' }, { id: 'bebidas', label: 'Bebidas' }].map(cat => (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: selectedCategory === cat.id ? '#ffffff' : '#1e293b', color: selectedCategory === cat.id ? '#000' : '#fff', fontWeight: 'bold' }}>
                      {cat.label}
                    </button>
                  ))}
                </div>
                <input type="text" placeholder="Buscar plato..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ ...s.input, width: '250px' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                {filteredProducts.map(product => (
                  <div key={product.id} onClick={() => addToCart(product)} style={{ ...s.card, cursor: 'pointer', transition: '0.2s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '30px', marginBottom: '10px' }}>{product.img}</div>
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>{product.name}</h4>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #334155', paddingTop: '10px' }}>
                      <span style={{ color: '#f97316', fontWeight: 'bold' }}>RD$ {product.price}</span>
                      <span style={{ backgroundColor: '#f97316', color: 'white', width: '25px', height: '25px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>+</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CARRITO */}
            <div style={{ width: '380px', backgroundColor: '#1e293b', borderLeft: '1px solid #334155', display: 'flex', flexDirection: 'column', padding: '20px', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>
                  <h3 style={{ margin: 0 }}>🛒 Orden Actual</h3>
                  {cart.length > 0 && <button onClick={clearCart} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>Limpiar</button>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', margin: '15px 0' }}>
                  {['Para Comer Aquí', 'Para Llevar'].map(type => (
                    <button key={type} onClick={() => setOrderType(type)} style={{ padding: '8px', fontSize: '12px', fontWeight: 'bold', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: orderType === type ? '#f97316' : '#0f172a', color: '#fff' }}>
                      {type}
                    </button>
                  ))}
                </div>

                <div style={{ maxHeight: 'calc(100vh - 350px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {cart.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#64748b', marginTop: '50px' }}>Selecciona productos para armar la orden</p>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} style={{ backgroundColor: '#0f172a', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{item.name}</div>
                          <div style={{ fontSize: '12px', color: '#f97316', fontWeight: 'bold' }}>RD$ {item.price * item.qty}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#1e293b', padding: '4px 8px', borderRadius: '6px' }}>
                          <button onClick={() => updateQty(item.id, -1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                          <span style={{ fontSize: '13px', fontWeight: 'bold' }}>{item.qty}</span>
                          <button onClick={() => updateQty(item.id, 1)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>+</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', margin: '15px 0', borderTop: '1px solid #334155', paddingTop: '15px' }}>
                  <span>TOTAL:</span>
                  <span style={{ color: '#f97316' }}>RD$ {cartTotal}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button disabled={cart.length === 0} onClick={() => sendOrderToKitchen('Efectivo')} style={{ ...s.btnPrimary, opacity: cart.length === 0 ? 0.5 : 1 }}>Efectivo</button>
                  <button disabled={cart.length === 0} onClick={() => sendOrderToKitchen('Tarjeta')} style={{ ...s.btnPrimary, backgroundColor: '#ffffff', color: '#000000', opacity: cart.length === 0 ? 0.5 : 1 }}>Tarjeta</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 2: COCINA (KDS) */}
        {activeTab === 'cocina' && (
          <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
            <h2 style={{ marginTop: 0 }}>Pantalla de Cocina (KDS)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
              {kitchenOrders.length === 0 ? (
                <p style={{ color: '#64748b' }}>No hay órdenes pendientes en cocina.</p>
              ) : (
                kitchenOrders.map(order => (
                  <div key={order.id} style={{ ...s.card, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold', backgroundColor: '#0f172a', padding: '4px 8px', borderRadius: '4px' }}>#ORD-{order.id}</span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>{order.time}</span>
                      </div>
                      <p style={{ color: '#f97316', fontSize: '12px', fontWeight: 'bold' }}>{order.orderType}</p>
                      <div style={{ margin: '15px 0' }}>
                        {order.items.map((it, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
                            <span>{it.name}</span>
                            <span style={{ fontWeight: 'bold', color: '#f97316' }}>x{it.qty}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (order.status === 'Pendiente') {
                          setKitchenOrders(kitchenOrders.map(o => o.id === order.id ? { ...o, status: 'En Preparación' } : o));
                        } else {
                          setKitchenOrders(kitchenOrders.filter(o => o.id !== order.id));
                        }
                      }}
                      style={{ ...s.btnPrimary, backgroundColor: order.status === 'Pendiente' ? '#3b82f6' : '#22c55e' }}>
                      {order.status === 'Pendiente' ? 'Iniciar Preparación' : 'Marcar como Entregado'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* VISTA 3: CAJA */}
        {activeTab === 'caja' && (
          <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', ...s.card, marginBottom: '20px' }}>
              <div>
                <h2 style={{ margin: 0 }}>Control de Caja & Cierre</h2>
                <p style={{ margin: '5px 0 0 0', color: '#94a3b8', fontSize: '13px' }}>Gestión de efectivo y arqueo final de turno</p>
              </div>
              <button onClick={() => setShowShiftModal(true)} style={{ ...s.btnPrimary, width: 'auto', padding: '12px 20px' }}>Generar Cierre de Turno</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
              <div style={s.card}><span style={{ fontSize: '12px', color: '#94a3b8' }}>Fondo Inicial</span><p style={{ fontSize: '22px', fontWeight: 'bold', margin: '5px 0 0 0' }}>RD$ {cashRegister.openingBalance}</p></div>
              <div style={s.card}><span style={{ fontSize: '12px', color: '#94a3b8' }}>Ventas Efectivo</span><p style={{ fontSize: '22px', fontWeight: 'bold', color: '#f97316', margin: '5px 0 0 0' }}>RD$ {cashRegister.cashSales}</p></div>
              <div style={s.card}><span style={{ fontSize: '12px', color: '#94a3b8' }}>Ventas Tarjeta</span><p style={{ fontSize: '22px', fontWeight: 'bold', margin: '5px 0 0 0' }}>RD$ {cashRegister.cardSales}</p></div>
              <div style={{ ...s.card, border: '1px solid #f97316' }}><span style={{ fontSize: '12px', color: '#f97316', fontWeight: 'bold' }}>EFECTIVO EN CAJA</span><p style={{ fontSize: '22px', fontWeight: 'bold', margin: '5px 0 0 0' }}>RD$ {expectedCashInBox}</p></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
              <form onSubmit={handleAddMovement} style={s.card}>
                <h3 style={{ marginTop: 0 }}>Registrar Movimiento</h3>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Tipo</label>
                  <select value={movementForm.type} onChange={(e) => setMovementForm({ ...movementForm, type: e.target.value })} style={s.input}>
                    <option value="IN">Entrada de Efectivo (+)</option>
                    <option value="OUT">Salida / Gasto (-)</option>
                  </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Monto (RD$)</label>
                  <input type="number" placeholder="0.00" value={movementForm.amount} onChange={(e) => setMovementForm({ ...movementForm, amount: e.target.value })} style={s.input} required />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Concepto</label>
                  <input type="text" placeholder="Ej: Compra de hielo" value={movementForm.reason} onChange={(e) => setMovementForm({ ...movementForm, reason: e.target.value })} style={s.input} required />
                </div>
                <button type="submit" style={s.btnPrimary}>Registrar Movimiento</button>
              </form>

              <div style={s.card}>
                <h3 style={{ marginTop: 0 }}>Historial de Movimientos</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                  {cashMovements.map(m => (
                    <div key={m.id} style={{ backgroundColor: '#0f172a', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{m.reason}</div>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>{m.time}</span>
                      </div>
                      <span style={{ fontWeight: 'bold', color: m.type === 'IN' ? '#22c55e' : '#ef4444' }}>
                        {m.type === 'IN' ? `+RD$ ${m.amount}` : `-RD$ ${m.amount}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISTA 4: ADMIN */}
        {activeTab === 'admin' && currentUser.role === 'admin' && (
          <div style={{ flex: 1, padding: '25px', overflowY: 'auto' }}>
            <div style={s.card}>
              <h2 style={{ marginTop: 0 }}>Panel de Administración</h2>
              <p style={{ color: '#94a3b8', fontSize: '14px' }}>Control de permisos de usuarios y parámetros del sistema.</p>
              <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8', fontSize: '12px' }}>
                    <th style={{ padding: '10px' }}>Usuario</th>
                    <th style={{ padding: '10px' }}>Rol</th>
                    <th style={{ padding: '10px' }}>Acceso</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #334155' }}>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>Michael Pineda</td>
                    <td style={{ padding: '10px' }}><span style={{ backgroundColor: '#f97316', padding: '2px 8px', borderRadius: '4px', fontSize: '11px' }}>Admin</span></td>
                    <td style={{ padding: '10px', color: '#94a3b8' }}>Acceso Total</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL DE CIERRE DE TURNO */}
      {showShiftModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ ...s.card, width: '450px', backgroundColor: '#0f172a', border: '1px solid #334155' }}>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #334155', paddingBottom: '10px' }}>Cierre de Turno</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', margin: '15px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Fondo Inicial:</span> <b>RD$ {cashRegister.openingBalance}</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Ventas Efectivo:</span> <b style={{ color: '#f97316' }}>+ RD$ {cashRegister.cashSales}</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Ventas Tarjeta:</span> <b>+ RD$ {cashRegister.cardSales}</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #334155', paddingTop: '10px', fontSize: '16px' }}>
                <span>TOTAL ESPERADO:</span> <b style={{ color: '#f97316' }}>RD$ {expectedCashInBox}</b>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => setShowShiftModal(false)} style={{ ...s.btnPrimary, backgroundColor: '#334155' }}>Cancelar</button>
              <button onClick={() => { setShiftOpen(false); setShowShiftModal(false); alert('Turno cerrado exitosamente.'); }} style={s.btnPrimary}>Confirmar Cierre</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
