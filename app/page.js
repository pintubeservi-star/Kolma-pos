```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xiiao Kitchen - Sabor que se siente</title>
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
    body { font-family: 'Inter', sans-serif; background-color: #050505; color: #f3f4f6; }
    /* Hide scrollbar for Chrome, Safari and Opera */
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    /* Hide scrollbar for IE, Edge and Firefox */
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="min-h-screen flex flex-col items-center pb-32">

  <div class="w-full max-w-md bg-[#0a0a0a] min-h-screen relative flex flex-col shadow-2xl">
    
    <!-- Header -->
    <header class="pt-8 pb-4 px-4 sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/5">
      <div class="text-center">
        <h1 class="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
          Xiiao Kitchen
        </h1>
        <p class="text-gray-400 text-xs font-semibold mt-1 tracking-widest uppercase">
          Sabor que se siente
        </p>
        <div class="mt-3 inline-block bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs px-4 py-1.5 rounded-full font-bold shadow-[0_0_15px_rgba(249,115,22,0.1)]">
          🛵 ¡Envío Gratis en Cotuí!
        </div>
      </div>
      
      <!-- Category Tabs -->
      <div id="category-tabs" class="mt-5 flex overflow-x-auto gap-2 pb-2 scrollbar-hide px-1">
        <!-- Injected via JS -->
      </div>
    </header>

    <!-- Track Order Banner -->
    <div id="tracker-banner" class="mx-4 mt-4 hidden">
      <!-- Injected via JS -->
    </div>

    <!-- Menu Items Container -->
    <main class="p-4 space-y-4 flex-1" id="menu-container">
      <!-- Injected via JS -->
    </main>

    <!-- Admin toggle button footer -->
    <div class="py-6 flex justify-center pb-20 gap-4">
      <button onclick="openPinModal()" class="text-gray-700 hover:text-orange-500 transition-colors text-xl" title="Panel de Administración">
        🔒
      </button>
      <button onclick="openKitchen()" class="text-xs bg-[#1a1a1a] text-gray-400 hover:text-orange-400 px-3 py-1.5 rounded-xl border border-white/5 transition-colors font-bold">
        👨‍🍳 Cocina (KDS)
      </button>
    </div>

    <!-- Checkout Modal -->
    <div id="checkout-modal" class="fixed inset-0 bg-black/85 backdrop-blur-sm z-[110] hidden items-center justify-center p-4">
      <div class="bg-[#111111] p-6 rounded-3xl w-full max-w-sm border border-white/10 shadow-2xl">
        <h3 class="text-xl font-black text-white mb-1">Completa tu orden</h3>
        <p class="text-gray-400 text-xs mb-5">Ingresa tus datos para procesar el pedido.</p>
        
        <form onsubmit="confirmarCrearOrden(event)" class="space-y-4">
          <div>
            <label class="text-xs font-bold text-gray-400 block mb-1">Tu Nombre</label>
            <input type="text" id="nombre-cliente" required placeholder="Ej. Juan Pérez" class="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500" />
          </div>
          <div>
            <label class="text-xs font-bold text-gray-400 block mb-1">Tu Teléfono / WhatsApp</label>
            <input type="tel" id="telefono-cliente" required placeholder="Ej. 829-000-0000" class="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500" />
          </div>
          <div id="direccion-container">
            <label class="text-xs font-bold text-gray-400 block mb-1">Dirección de Entrega en Cotuí</label>
            <textarea id="direccion-cliente" rows="2" placeholder="Calle, número de casa, referencias..." class="w-full bg-[#050505] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500 resize-none"></textarea>
          </div>

          <div class="flex gap-2 pt-2">
            <button type="button" onclick="closeCheckoutModal()" class="flex-1 py-3 bg-[#1a1a1a] rounded-xl font-bold text-gray-400 text-sm">Volver</button>
            <button type="submit" class="flex-1 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-black rounded-xl font-black text-sm shadow-lg">Crear orden</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Admin PIN Modal -->
    <div id="pin-modal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] hidden items-center justify-center p-4">
      <div class="bg-[#111111] p-6 rounded-3xl w-full max-w-sm border border-white/10 shadow-2xl">
        <h3 class="text-xl font-bold text-white mb-2 text-center">Acceso Administrador</h3>
        <p class="text-gray-400 text-sm mb-5 text-center">Ingresa tu PIN (8779) para activar/desactivar platos.</p>
        
        <form onsubmit="handlePinSubmit(event)" class="space-y-4">
          <input type="password" id="pin-input" placeholder="****" maxlength="4" class="w-full bg-[#050505] border border-white/10 rounded-xl p-4 text-center text-2xl text-white tracking-[0.5em] focus:outline-none focus:border-orange-500" autofocus />
          <p id="pin-error" class="text-red-500 text-xs text-center hidden">PIN Incorrecto</p>
          
          <div class="flex gap-2">
            <button type="button" onclick="closePinModal()" class="flex-1 py-3 bg-[#1a1a1a] rounded-xl font-bold text-gray-400">Cancelar</button>
            <button type="submit" class="flex-1 py-3 bg-orange-500 text-black rounded-xl font-bold">Entrar</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Admin Management Panel Modal -->
    <div id="admin-panel" class="fixed inset-0 bg-[#050505] z-[120] hidden flex flex-col p-4 overflow-y-auto">
      <div class="w-full max-w-md mx-auto">
        <div class="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <div>
            <h2 class="text-2xl font-black text-orange-500">Gestor Rápido</h2>
            <p class="text-gray-400 text-xs">Activa o desactiva productos al instante</p>
          </div>
          <button onclick="closeAdminPanel()" class="bg-[#1a1a1a] text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/10">Cerrar</button>
        </div>
        <div class="mb-4">
          <button onclick="openKitchenFromAdmin()" class="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-black font-black rounded-xl text-sm shadow-md">
            👨‍🍳 Abrir Pantalla de Cocina (KDS)
          </button>
        </div>
        <div id="admin-items-list" class="space-y-4 pb-20">
          <!-- Injected via JS -->
        </div>
      </div>
    </div>

    <!-- Kitchen Display System (KDS) Modal -->
    <div id="kitchen-modal" class="fixed inset-0 bg-[#050505] z-[130] hidden flex flex-col p-4 overflow-y-auto">
      <div class="w-full max-w-lg mx-auto">
        <div class="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
          <div>
            <h2 class="text-2xl font-black text-orange-500">Cocina / KDS</h2>
            <p class="text-gray-400 text-xs">Gestiona órdenes en tiempo real</p>
          </div>
          <button onclick="closeKitchen()" class="bg-[#1a1a1a] text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/10">Cerrar</button>
        </div>
        <div id="kitchen-orders-list" class="space-y-4 pb-20">
          <!-- Injected via JS -->
        </div>
      </div>
    </div>

    <!-- Floating Cart Bar -->
    <div id="cart-bar" class="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#111111] border-t border-white/10 p-5 shadow-[0_-20px_40px_rgba(0,0,0,0.9)] z-50 rounded-t-[2.5rem] backdrop-blur-xl hidden">
      <div class="flex justify-between items-end mb-4 px-1">
        <div class="flex flex-col">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Tu Orden</span>
          <span id="cart-count-badge" class="font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full text-sm inline-block w-max border border-orange-500/25">0 artículos</span>
        </div>
        <div class="text-right">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-1">Total</span>
          <span id="cart-total" class="font-black text-3xl text-white tracking-tighter">RD$ 0</span>
        </div>
      </div>

      <div id="cart-items-list" class="max-h-28 overflow-y-auto mb-4 space-y-1 bg-[#050505] p-2 rounded-xl border border-white/5 scrollbar-hide">
        <!-- Injected via JS -->
      </div>
      
      <div class="flex gap-2 mb-4 bg-[#050505] p-1.5 rounded-2xl border border-white/5">
        <button onclick="setTipoPedido('delivery')" id="btn-delivery" class="flex-1 py-3 text-sm font-bold rounded-xl transition-all bg-[#1c1c1c] text-orange-500 border border-white/5">🛵 Delivery</button>
        <button onclick="setTipoPedido('local')" id="btn-local" class="flex-1 py-3 text-sm font-bold rounded-xl transition-all text-gray-500 hover:text-gray-300">🍽️ En Local</button>
      </div>

      <button onclick="abrirCheckout()" class="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-black py-4 rounded-2xl font-black text-lg shadow-[0_8px_25px_rgba(249,115,22,0.3)] active:scale-[0.98]">
        Crear orden
      </button>
    </div>

  </div>

  <script>
    // Initial Menu Data extracted from Xiiao Kitchen flyer
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

    // Load state from localStorage or defaults
    let menuItems = JSON.parse(localStorage.getItem('xiiao_menu')) || initialMenu;
    let orders = JSON.parse(localStorage.getItem('xiiao_orders')) || [];
    let carrito = [];
    let tipoPedido = 'delivery';
    let activeCategory = [...new Set(menuItems.map(i => i.category))][0];
    let trackedOrderId = localStorage.getItem('xiiao_tracked') || null;

    const categories = [...new Set(menuItems.map(i => i.category))];

    function saveMenu() {
      localStorage.setItem('xiiao_menu', JSON.stringify(menuItems));
      renderMenu();
      renderAdminPanel();
    }

    function saveOrders() {
      localStorage.setItem('xiiao_orders', JSON.stringify(orders));
      renderKitchen();
      renderTracker();
    }

    function renderTabs() {
      const container = document.getElementById('category-tabs');
      container.innerHTML = categories.map(cat => `
        <button onclick="setActiveCategory('${cat}')" class="whitespace-nowrap px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${activeCategory === cat ? 'bg-orange-500 text-black shadow-[0_4px_15px_rgba(249,115,22,0.4)] scale-105' : 'bg-[#141414] text-gray-400 hover:text-white border border-white/5'}">
          ${cat}
        </button>
      `).join('');
    }

    function setActiveCategory(cat) {
      activeCategory = cat;
      renderTabs();
      renderMenu();
    }

    function renderMenu() {
      renderTabs();
      const container = document.getElementById('menu-container');
      const filtered = menuItems.filter(i => i.category === activeCategory && i.disponible !== false);

      let html = `
        <div class="flex items-center gap-2 mb-2">
          <h2 class="text-xl font-black text-white">${activeCategory}</h2>
          <div class="flex-1 h-px bg-gradient-to-r from-orange-500/50 to-transparent ml-2"></div>
        </div>
        <div class="space-y-4 pb-8">
      `;

      if (filtered.length === 0) {
        html += `<div class="text-center py-10 text-gray-500 text-sm">No hay productos disponibles en esta categoría.</div>`;
      } else {
        filtered.forEach(item => {
          html += `
            <div class="bg-[#111111] p-5 rounded-3xl border border-white/5 flex justify-between items-center transition-all hover:border-orange-500/30">
              <div class="pr-4 flex-1">
                <h3 class="font-bold text-gray-100 text-lg leading-tight">${item.name}</h3>
                ${item.desc ? `<p class="text-xs text-gray-500 mt-1.5 leading-relaxed">${item.desc}</p>` : ''}
                <p class="font-black mt-3 text-orange-500 text-lg tracking-tight">RD$ ${item.price}</p>
              </div>
              <button onclick="agregarAlCarrito(${item.id})" class="bg-[#1a1a1a] border border-white/5 text-orange-500 h-12 w-12 flex items-center justify-center rounded-2xl text-2xl font-light hover:bg-orange-500 hover:text-black transition-all shrink-0">+</button>
            </div>
          `;
        });
      }
      html += `</div>`;
      container.innerHTML = html;
      renderTracker();
    }

    function agregarAlCarrito(id) {
      const item = menuItems.find(i => i.id === id);
      if (item) {
        carrito.push(item);
        renderCart();
      }
    }

    function eliminarDelCarrito(index) {
      carrito.splice(index, 1);
      renderCart();
    }

    function renderCart() {
      const cartBar = document.getElementById('cart-bar');
      if (carrito.length === 0) {
        cartBar.classList.add('hidden');
        return;
      }
      cartBar.classList.remove('hidden');

      const total = carrito.reduce((acc, item) => acc + item.price, 0);
      document.getElementById('cart-count-badge').innerText = `${carrito.length} ${carrito.length === 1 ? 'artículo' : 'artículos'}`;
      document.getElementById('cart-total').innerText = `RD$ ${total}`;

      const itemsList = document.getElementById('cart-items-list');
      itemsList.innerHTML = carrito.map((item, idx) => `
        <div class="flex justify-between items-center text-xs text-gray-300 py-1 border-b border-white/5 last:border-0">
          <span class="truncate pr-2">${item.name}</span>
          <div class="flex items-center gap-2 shrink-0">
            <span class="font-bold text-orange-400">RD$ ${item.price}</span>
            <button onclick="eliminarDelCarrito(${idx})" class="text-red-400 hover:text-red-300 px-1 font-bold">×</button>
          </div>
        </div>
      `).join('');
    }

    function setTipoPedido(tipo) {
      tipoPedido = tipo;
      const btnDel = document.getElementById('btn-delivery');
      const btnLoc = document.getElementById('btn-local');
      const dirContainer = document.getElementById('direccion-container');

      if (tipo === 'delivery') {
        btnDel.className = "flex-1 py-3 text-sm font-bold rounded-xl transition-all bg-[#1c1c1c] text-orange-500 border border-white/5";
        btnLoc.className = "flex-1 py-3 text-sm font-bold rounded-xl transition-all text-gray-500 hover:text-gray-300";
        dirContainer.style.display = 'block';
        document.getElementById('direccion-cliente').required = true;
      } else {
        btnLoc.className = "flex-1 py-3 text-sm font-bold rounded-xl transition-all bg-[#1c1c1c] text-orange-500 border border-white/5";
        btnDel.className = "flex-1 py-3 text-sm font-bold rounded-xl transition-all text-gray-500 hover:text-gray-300";
        dirContainer.style.display = 'none';
        document.getElementById('direccion-cliente').required = false;
      }
    }

    function abrirCheckout() {
      document.getElementById('checkout-modal').classList.remove('hidden');
      document.getElementById('checkout-modal').classList.add('flex');
    }

    function closeCheckoutModal() {
      document.getElementById('checkout-modal').classList.add('hidden');
      document.getElementById('checkout-modal').classList.remove('flex');
    }

    function confirmarCrearOrden(e) {
      e.preventDefault();
      const nombre = document.getElementById('nombre-cliente').value;
      const telefono = document.getElementById('telefono-cliente').value;
      const direccion = tipoPedido === 'delivery' ? document.getElementById('direccion-cliente').value : 'Consumo / Retiro en Local';
      const total = carrito.reduce((acc, item) => acc + item.price, 0);

      const conteoItems = carrito.reduce((acc, item) => {
        acc[item.name] = (acc[item.name] || 0) + 1;
        return acc;
      }, {});

      const newOrder = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        cliente: nombre,
        telefono: telefono,
        direccion: direccion,
        tipo: tipoPedido,
        items: conteoItems,
        total: total,
        estado: 'Pendiente',
        fecha: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      orders.unshift(newOrder);
      trackedOrderId = newOrder.id;
      localStorage.setItem('xiiao_tracked', trackedOrderId);
      saveOrders();

      const listaProductos = Object.ent