'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react';

// ==========================================
// ÍCONOS SVG
// ==========================================
const Svg = ({ children, size=24, className='', strokeWidth=2, ...props }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>{children}</svg>;
const Search = p => <Svg {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></Svg>;
const Plus = p => <Svg {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
const Minus = p => <Svg {...p}><line x1="5" y1="12" x2="19" y2="12"/></Svg>;
const X = p => <Svg {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></Svg>;
const LayoutDashboard = p => <Svg {...p}><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></Svg>;
const Receipt = p => <Svg {...p}><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17V7"/></Svg>;
const ShoppingCart = p => <Svg {...p}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></Svg>;
const Loader = ({ className='', ...p }) => <Svg {...p} className={`animate-spin ${className}`}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></Svg>;
const Download = p => <Svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></Svg>;
const History = p => <Svg {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></Svg>;
const CheckCircle = p => <Svg {...p}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></Svg>;
const AlertCircle = p => <Svg {...p}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></Svg>;
const Lock = p => <Svg {...p}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Svg>;
const Truck = p => <Svg {...p}><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></Svg>;
const Store = p => <Svg {...p}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h2v-4h8v4h2a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 9.7V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2.7a2 2 0 0 1-.59 1.42l-1.63 1.63a2 2 0 0 1-2.83 0l-1.66-1.66a2 2 0 0 0-2.82 0l-1.66 1.66a2 2 0 0 1-2.83 0l-1.66-1.66a2 2 0 0 0-2.82 0l-1.63-1.63A2 2 0 0 1 2 9.7Z"/></Svg>;
const Bot = p => <Svg {...p}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></Svg>;
const Send = p => <Svg {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></Svg>;

// --- CONFIGURACIÓN Y SEGURIDAD ---
const ADMIN_PIN = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_ADMIN_PIN) ? process.env.NEXT_PUBLIC_ADMIN_PIN : "1221";
const SHIPDAY_API_KEY = "fzKmvwy7mB.DgaRNOaMv19P28urcMEb";

// --- MENÚ XIIAO KITCHEN (ACTUALIZADO) ---
const CATEGORIAS = ['Todos', 'Sándwiches', 'Tostadas', 'Burritos', 'Yaroas'];
const RESTAURANT_MENU = [
  // SÁNDWICHES
  { id: 's1', name: 'Sándwich de Jamón y Queso', price: 75, category: 'Sándwiches' },
  { id: 's2', name: 'Sándwich de Pollo, Queso y Jamón', price: 125, category: 'Sándwiches' },
  { id: 's3', name: 'Sándwich de Pollo, Queso, Jamón y Tocineta', price: 170, category: 'Sándwiches' },
  { id: 's4', name: 'Club Sándwich Premium', price: 230, category: 'Sándwiches' },
  
  // TOSTADAS
  { id: 't1', name: 'Tostada de Jamón y Queso', price: 50, category: 'Tostadas' },
  { id: 't2', name: 'Tostada de Jamón, Queso, Lechuga y Tomate', price: 75, category: 'Tostadas' },
  
  // BURRITOS
  { id: 'b1', name: 'Burrito de Pollo (Sin papas)', price: 185, category: 'Burritos' },
  { id: 'b1p', name: 'Burrito de Pollo (Con papas)', price: 230, category: 'Burritos' },
  { id: 'b2', name: 'Burrito de Res (Sin papas)', price: 220, category: 'Burritos' },
  { id: 'b2p', name: 'Burrito de Res (Con papas)', price: 270, category: 'Burritos' },
  { id: 'b3', name: 'Burrito Mixto Pollo+Res (Sin papas)', price: 250, category: 'Burritos' },
  { id: 'b3p', name: 'Burrito Mixto Pollo+Res (Con papas)', price: 290, category: 'Burritos' },
  { id: 'b4', name: 'Burrito Pollo con Tocineta (Sin papas)', price: 220, category: 'Burritos' },
  { id: 'b4p', name: 'Burrito Pollo con Tocineta (Con papas)', price: 270, category: 'Burritos' },
  { id: 'b5', name: 'Burrito XXL (Sin papas)', price: 300, category: 'Burritos' },
  { id: 'b5p', name: 'Burrito XXL (Con papas)', price: 350, category: 'Burritos' },
  
  // YAROAS
  { id: 'y1p', name: 'Yaroa de Pollo (Pequeña)', price: 200, category: 'Yaroas' },
  { id: 'y1m', name: 'Yaroa de Pollo (Mediana)', price: 250, category: 'Yaroas' },
  { id: 'y1g', name: 'Yaroa de Pollo (Grande)', price: 350, category: 'Yaroas' },
  
  { id: 'y2p', name: 'Yaroa de Res (Pequeña)', price: 250, category: 'Yaroas' },
  { id: 'y2m', name: 'Yaroa de Res (Mediana)', price: 300, category: 'Yaroas' },
  { id: 'y2g', name: 'Yaroa de Res (Grande)', price: 390, category: 'Yaroas' },
  
  { id: 'y3p', name: 'Yaroa Mixta (Pequeña)', price: 250, category: 'Yaroas' },
  { id: 'y3m', name: 'Yaroa Mixta (Mediana)', price: 300, category: 'Yaroas' },
  { id: 'y3g', name: 'Yaroa Mixta (Grande)', price: 390, category: 'Yaroas' },
  
  { id: 'y4p', name: 'Yaroa La Yaya (Pequeña)', price: 280, category: 'Yaroas' },
  { id: 'y4m', name: 'Yaroa La Yaya (Mediana)', price: 350, category: 'Yaroas' }
];

export default function XiaoKitchenPOS() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [activeView, setActiveView] = useState('pos');
  
  // Datos y Estados
  const [products, setProducts] = useState(RESTAURANT_MENU);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [localSales, setLocalSales] = useState([]);
  
  // UI States
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [orderMethod, setOrderMethod] = useState('local'); // 'local' o 'delivery'
  const [paymentType, setPaymentType] = useState('cash'); // 'cash' o 'credit'
  const [customerData, setCustomerData] = useState({ name: '', phone: '', address: '' });
  const [successToast, setSuccessToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Security States
  const [authModal, setAuthModal] = useState({ isOpen: false, targetView: null, pinCode: '' });
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  // Estados para el Asistente IA
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([{ role: 'model', text: '¡Hola! Soy XiaoBot 🤖. Conozco el menú y las ventas del día. ¿En qué te ayudo?' }]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatScrollRef = useRef(null);

  const searchInputRef = useRef(null);

  // --- INICIALIZACIÓN ---
  useEffect(() => {
    const session = localStorage.getItem('xiao_pos_session');
    const savedSales = JSON.parse(localStorage.getItem('xiao_daily_sales') || '[]');
    
    if (session === 'active') setIsAuthenticated(true);
    setLocalSales(savedSales);
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('xiao_daily_sales', JSON.stringify(localSales));
  }, [localSales]);

  // Cierre Automático del Cajón
  useEffect(() => {
    if (cart.length === 0) {
      setIsCartDrawerOpen(false);
    }
  }, [cart.length]);

  // Scroll automático en el chat de IA
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [aiMessages, isAiLoading, isAiModalOpen]);

  const stats = useMemo(() => {
    let cash = 0, credit = 0;
    const validSales = localSales.filter(s => s.status === 'completed');
    validSales.forEach(s => { 
      if (s.type === 'cash') cash += (s.total || 0); 
      else credit += (s.total || 0); 
    });
    return { cash, credit, total: cash + credit, count: validSales.length };
  }, [localSales]);

  // --- ASISTENTE IA (GEMINI API) ---
  const handleAskAI = async () => {
    if (!aiInput.trim() || isAiLoading) return;
    
    const userText = aiInput.trim();
    setAiInput('');
    setAiMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsAiLoading(true);

    try {
      const apiKey = ""; // Canvas provides this securely at runtime
      // Fallback response if no API key is provided
      if(!apiKey){
         setTimeout(() => {
             setAiMessages(prev => [...prev, { role: 'model', text: 'Simulación de IA: Para usar la IA real, la API Key debe ser inyectada por el entorno.' }]);
             setIsAiLoading(false);
         }, 1000);
         return;
      }
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      
      const systemPrompt = `Eres XiaoBot, el asistente inteligente de caja para el restaurante dominicano "XIIAO KITCHEN". 
      Tu objetivo es ayudar al cajero respondiendo rápido y conciso.
      Menú actual: ${JSON.stringify(RESTAURANT_MENU)}
      Ventas de hoy (hasta ahora): Efectivo RD$${stats.cash}, Crédito RD$${stats.credit}, Total: RD$${stats.total}, Cantidad Órdenes: ${stats.count}.
      Instrucciones:
      - Responde siempre en español, de forma muy amigable, útil y en 1 o 2 párrafos cortos.
      - Si preguntan por recomendaciones, basa tu respuesta en los ingredientes o tamaños del menú proporcionado.
      - Si preguntan cómo va el día, usa las métricas de ventas proporcionadas.`;

      const contents = aiMessages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));
      contents.push({ role: 'user', parts: [{ text: userText }] });

      const payload = {
        contents,
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        const botResponse = data.candidates[0].content.parts[0].text;
        setAiMessages(prev => [...prev, { role: 'model', text: botResponse }]);
      } else {
        setAiMessages(prev => [...prev, { role: 'model', text: 'Lo siento, tuve un problema al procesar tu solicitud.' }]);
      }
    } catch (error) {
      console.error(error);
      setAiMessages(prev => [...prev, { role: 'model', text: 'Error de conexión con la IA.' }]);
    }
    
    setIsAiLoading(false);
  };


  // --- IMPRESIÓN TÉRMICA TIPO POS (ANDROID & WINDOWS) ---
  const printReceipt = (sale) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    const itemsHtml = sale.items.map(item => `
      <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
        <span style="flex:1; padding-right: 8px;">${item.qty}x ${item.name}</span>
        <span style="font-weight: bold;">$${item.finalPrice.toFixed(0)}</span>
      </div>
    `).join('');

    const html = `
      <html>
        <head>
          <title>Recibo XIIAO KITCHEN</title>
          <style>
            @page { margin: 0; size: 58mm auto; }
            body { 
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              width: 58mm; 
              margin: 0; 
              padding: 4mm 2mm; 
              color: #000;
              font-size: 12px;
              line-height: 1.2;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .divider { border-bottom: 1px dashed #000; margin: 8px 0; }
            .divider-solid { border-bottom: 2px solid #000; margin: 10px 0; }
            h2 { margin: 0 0 4px 0; font-size: 20px; font-weight: 900; letter-spacing: -0.5px; }
            .slogan { font-size: 10px; font-style: italic; margin-bottom: 8px; }
            p { margin: 3px 0; }
            .total-row { display: flex; justify-content: space-between; font-size: 16px; font-weight: 900; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="center">
            <h2>XIIAO KITCHEN</h2>
            <div class="slogan">Fresco, Rápido y Delicioso</div>
            <p>WhatsApp: 829-855-8779</p>
            <div class="divider"></div>
            <p class="bold" style="font-size: 14px;">TICKET #${sale.id.toString().slice(-4)}</p>
            <p>${new Date(sale.date).toLocaleString('es-DO')}</p>
          </div>
          <div class="divider-solid"></div>
          
          <p class="bold" style="font-size: 14px; text-transform: uppercase;">TIPO: ${sale.method === 'delivery' ? 'DELIVERY' : 'LOCAL'}</p>
          <p class="bold">PAGO: ${sale.type === 'credit' ? 'CRÉDITO' : 'EFECTIVO'}</p>
          <div style="margin-top: 5px;">
            <p><strong>Cliente:</strong> ${sale.customer}</p>
            ${sale.method === 'delivery' ? `
              <p><strong>Tel:</strong> ${sale.phone}</p>
              <p><strong>Dir:</strong> ${sale.address}</p>
            ` : ''}
          </div>
          
          <div class="divider-solid"></div>
          <p class="bold" style="margin-bottom: 6px;">DETALLE DE ORDEN:</p>
          ${itemsHtml}
          
          <div class="divider-solid"></div>
          <div class="total-row">
            <span>TOTAL:</span>
            <span>RD$${sale.total.toFixed(2)}</span>
          </div>
          <div class="divider-solid"></div>
          
          <div class="center" style="margin-top: 15px;">
            <p class="bold">¡Gracias por preferirnos!</p>
            <p style="font-size: 10px;">¡Sabores que te despiertan!</p>
          </div>
        </body>
      </html>
    `;

    doc.open();
    doc.write(html);
    doc.close();

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1500);
    };
  };

  const printZReport = (validSales, currentStats) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    
    // Calcular productos vendidos
    const prodMap = {};
    validSales.forEach(sale => {
      if(sale.items) {
        sale.items.forEach(item => {
          if (!prodMap[item.name]) prodMap[item.name] = { qty: 0, revenue: 0 };
          prodMap[item.name].qty += item.qty;
          prodMap[item.name].revenue += item.finalPrice;
        });
      }
    });
    
    const sortedProducts = Object.entries(prodMap).sort((a, b) => b[1].qty - a[1].qty);

    const productsHtml = sortedProducts.map(([name, data]) => `
      <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
        <span style="flex: 0 0 20px;">${data.qty}</span>
        <span style="flex:1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-right: 5px;">${name}</span>
        <span>$${data.revenue.toFixed(0)}</span>
      </div>
    `).join('');

    const html = `
      <html>
        <head>
          <title>Reporte Z - XIIAO KITCHEN</title>
          <style>
            @page { margin: 0; size: 58mm auto; }
            body { 
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              width: 58mm; 
              margin: 0; 
              padding: 4mm 2mm; 
              color: #000;
              font-size: 12px;
              line-height: 1.2;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .divider { border-bottom: 1px dashed #000; margin: 6px 0; }
            .divider-solid { border-bottom: 2px solid #000; margin: 8px 0; }
            h2 { margin: 0 0 4px 0; font-size: 18px; font-weight: 900; }
            p { margin: 3px 0; }
          </style>
        </head>
        <body>
          <div class="center">
            <h2>XIIAO KITCHEN</h2>
            <p class="bold" style="font-size: 14px;">REPORTE Z (CIERRE)</p>
            <p>${new Date().toLocaleString('es-DO')}</p>
          </div>
          
          <div class="divider-solid"></div>
          <p class="bold">RESUMEN FINANCIERO</p>
          <div class="divider"></div>
          <div style="display: flex; justify-content: space-between;"><span>Órdenes:</span> <span>${currentStats.count}</span></div>
          <div style="display: flex; justify-content: space-between;"><span>Efectivo:</span> <span>RD$${currentStats.cash.toFixed(2)}</span></div>
          <div style="display: flex; justify-content: space-between;"><span>Crédito:</span> <span>RD$${currentStats.credit.toFixed(2)}</span></div>
          <div class="divider"></div>
          <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 900;">
            <span>TOTAL VENTAS:</span>
            <span>RD$${currentStats.total.toFixed(2)}</span>
          </div>
          
          <div class="divider-solid"></div>
          <p class="bold">DESGLOSE DE PRODUCTOS</p>
          <div class="divider"></div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: bold; margin-bottom: 4px;">
            <span style="flex: 0 0 20px;">CANT</span>
            <span style="flex:1;">PRODUCTO</span>
            <span>TOTAL</span>
          </div>
          ${productsHtml || '<p class="center" style="font-size:10px;">Sin productos vendidos</p>'}
          
          <div class="divider-solid"></div>
          <div class="center" style="margin-top: 15px;">
            <p>--- FIN DEL REPORTE ---</p>
          </div>
        </body>
      </html>
    `;

    doc.open();
    doc.write(html);
    doc.close();

    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 1500);
    };
  };

  // --- ENVÍO A SHIPDAY ---
  const sendToShipday = async (sale) => {
    try {
      const orderData = {
        orderNumber: `ORD-${sale.id.toString().slice(-6)}`,
        customerName: sale.customer,
        customerAddress: sale.address,
        customerPhoneNumber: sale.phone,
        restaurantName: "XIIAO KITCHEN",
        expectedDeliveryDate: new Date().toISOString().split('T')[0],
        expectedDeliveryTime: new Date(Date.now() + 30 * 60000).toLocaleTimeString('en-US', { hour12: false }), // +30 mins
        orderItem: sale.items.map(item => ({
          name: item.name,
          unitPrice: item.price,
          quantity: item.qty
        }))
      };

      await fetch('https://api.shipday.com/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${SHIPDAY_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      console.log('Enviado a Shipday exitosamente');
    } catch (error) {
      console.error('Error enviando a Shipday:', error);
    }
  };

  // --- SEGURIDAD Y NAVEGACIÓN ---
  const handleAuthPinInput = (num) => {
    const newPin = authModal.pinCode + num;
    setAuthModal(prev => ({ ...prev, pinCode: newPin }));
    
    if (newPin === ADMIN_PIN) {
      setTimeout(() => { 
        if(!isAuthenticated) {
            localStorage.setItem('xiao_pos_session', 'active');
            setIsAuthenticated(true);
        } else {
            setIsAdminUnlocked(true);
            setActiveView(authModal.targetView);
        }
        setAuthModal({ isOpen: false, targetView: null, pinCode: '' });
      }, 200);
    } else if (newPin.length === 4) {
      setTimeout(() => setAuthModal(prev => ({ ...prev, pinCode: '' })), 400);
    }
  };

  const requestAdminAccess = (view) => {
    if (isAdminUnlocked) {
      setActiveView(view);
    } else {
      setAuthModal({ isOpen: true, targetView: view, pinCode: '' });
    }
  };

  // --- CARRITO ---
  const filteredProducts = useMemo(() => {
    let filtered = products;
    if (activeCategory !== 'Todos') {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
    }
    return filtered;
  }, [products, searchTerm, activeCategory]);

  const handleProductClick = (product) => {
    addToCart(product, 1);
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  const addToCart = (product, quantity) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + quantity, finalPrice: item.price * (item.qty + quantity) } : item);
      } else {
        return [...prev, { ...product, cartId: Date.now(), qty: quantity, finalPrice: product.price * quantity }];
      }
    });
  };

  const updateQty = (id, delta) => setCart(prev => prev.map(i => i.id === id ? { ...i, qty: i.qty + delta, finalPrice: i.price * (i.qty + delta) } : i).filter(i => i.qty > 0));
  const removeCartItem = (cartId) => setCart(prev => prev.filter(i => i.cartId !== cartId));
  const total = cart.reduce((acc, item) => acc + item.finalPrice, 0);

  // --- PROCESAR VENTA ---
  const openCheckout = () => {
    setOrderMethod('local');
    setPaymentType('cash');
    setCustomerData({ name: '', phone: '', address: '' });
    setCheckoutModal(true);
  };

  const ejecutarVenta = async () => {
    if (!customerData.name.trim()) return alert("El nombre del cliente es obligatorio.");
    if (orderMethod === 'delivery' && (!customerData.phone.trim() || !customerData.address.trim())) {
      return alert("Teléfono y Dirección son obligatorios para Delivery.");
    }

    setIsProcessing(true);

    const newSale = {
      id: Date.now(),
      type: paymentType,
      method: orderMethod,
      customer: customerData.name,
      phone: customerData.phone,
      address: customerData.address,
      total: total,
      items: [...cart],
      date: new Date().toISOString(),
      status: 'completed'
    };
    
    setLocalSales(prev => [newSale, ...prev]);
    
    // 1. Imprimir Recibo
    printReceipt(newSale);
    
    // 2. Enviar a Shipday si es delivery
    if (orderMethod === 'delivery') {
      await sendToShipday(newSale);
    }

    setCart([]);
    setCheckoutModal(false);
    setIsCartDrawerOpen(false);
    
    setSuccessToast(true);
    setTimeout(() => setSuccessToast(false), 3000);
    setIsProcessing(false);
  };

  // --- HISTORIAL Y ANULACIONES ---
  const anularVenta = (id) => {
    if(window.confirm("¿Estás seguro de anular esta venta? Esto la descontará de la caja.")) {
      setLocalSales(prev => prev.map(s => s.id === id ? { ...s, status: 'voided' } : s));
    }
  };

  // --- CIERRE DE CAJA ---
  const generarCierre = () => {
    const validSales = localSales.filter(s => s.status === 'completed');
    if (validSales.length === 0) return alert("No hay ventas válidas registradas hoy.");

    // 1. Imprimir Reporte Z en impresora térmica
    printZReport(validSales, stats);

    // 2. Generar archivo .txt de respaldo (opcional pero seguro)
    const prodMap = {};
    validSales.forEach(sale => {
      if(sale.items) {
        sale.items.forEach(item => {
          if (!prodMap[item.name]) prodMap[item.name] = { qty: 0, revenue: 0 };
          prodMap[item.name].qty += item.qty;
          prodMap[item.name].revenue += item.finalPrice;
        });
      }
    });

    const sortedProducts = Object.entries(prodMap).sort((a, b) => b[1].qty - a[1].qty);

    let txt = `======================================\n`;
    txt += `     XIIAO KITCHEN - CIERRE DE CAJA   \n`;
    txt += `======================================\n`;
    txt += `Fecha: ${new Date().toLocaleString('es-DO')}\n\n`;
    txt += `--- RESUMEN FINANCIERO ---\n`;
    txt += `Órdenes Procesadas: ${stats.count}\n`;
    txt += `Total Efectivo: RD$ ${stats.cash.toFixed(2)}\n`;
    txt += `Total Crédito:  RD$ ${stats.credit.toFixed(2)}\n`;
    txt += `TOTAL VENTAS:   RD$ ${stats.total.toFixed(2)}\n\n`;

    txt += `--- PLATOS VENDIDOS ---\n`;
    txt += `CANT | PRODUCTO | TOTAL RD$\n`;
    txt += `--------------------------------------\n`;
    sortedProducts.forEach(([name, data]) => {
      txt += `${data.qty.toString().padEnd(4)} | ${name.substring(0, 20).padEnd(20)} | $${data.revenue.toFixed(2)}\n`;
    });
    
    txt += `\n--- DETALLE DE CRÉDITOS ---\n`;
    const credits = validSales.filter(s => s.type === 'credit');
    if(credits.length === 0) txt += "Sin créditos hoy.\n";
    credits.forEach(c => txt += `Cliente: ${c.customer} - Monto: RD$${(c.total||0).toFixed(2)}\n`);

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Cierre_Xiao_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();

    // 3. Limpiar estado y volver al login
    localStorage.removeItem('xiao_daily_sales');
    localStorage.removeItem('xiao_pos_session');
    setLocalSales([]);
    setIsAuthenticated(false);
    setIsAdminUnlocked(false);
    setActiveView('pos');
  };

  // ==========================================
  // RENDER MODALES GLOBALES
  // ==========================================
  const renderAuthModal = () => {
    if (!authModal.isOpen && isAuthenticated) return null;
    const isLogin = !isAuthenticated;
    return (
      <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center font-sans text-slate-200">
        <div className="bg-[#1e293b] border border-red-900/50 p-8 rounded-2xl shadow-2xl text-center w-[360px]">
          {isLogin ? (
            <div className="w-16 h-16 bg-red-600 text-white rounded-xl flex items-center justify-center font-black text-3xl mx-auto mb-4">XK</div>
          ) : (
            <div className="w-14 h-14 bg-slate-800 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4"><Lock size={28}/></div>
          )}
          <h2 className="text-xl font-bold text-white mb-1">{isLogin ? 'Xiiao Kitchen POS' : 'Administrador'}</h2>
          <p className="text-slate-400 text-xs mb-6">{isLogin ? 'Inicia sesión para continuar' : 'Ingresa el PIN para acceder'}</p>
          
          <div className="flex justify-center gap-3 mb-8">
            {[0, 1, 2, 3].map(i => <div key={i} className={`w-3 h-3 rounded-full ${authModal.pinCode.length > i ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-slate-600'}`} />)}
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button key={num} onClick={() => handleAuthPinInput(num.toString())} className="h-14 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl active:scale-95 transition-transform">{num}</button>
            ))}
            {!isLogin && <button onClick={() => setAuthModal({isOpen: false, targetView: null, pinCode: ''})} className="col-start-1 h-14 rounded-xl flex items-center justify-center text-slate-400 hover:text-white active:scale-95"><X size={24}/></button>}
            <button onClick={() => handleAuthPinInput('0')} className={`${isLogin ? 'col-start-2' : ''} w-full h-14 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xl active:scale-95 transition-transform`}>0</button>
            <button onClick={() => setAuthModal(prev => ({...prev, pinCode: prev.pinCode.slice(0, -1)}))} className="w-full h-14 rounded-xl flex items-center justify-center text-slate-400 hover:text-white active:scale-95"><Minus size={24}/></button>
          </div>
        </div>
      </div>
    );
  };

  if (isInitializing) return <div className="h-screen bg-slate-900 flex items-center justify-center"><Loader size={48} className="text-red-500" /></div>;
  if (!isAuthenticated) return renderAuthModal();

  return (
    <div className="flex h-screen bg-[#0f172a] font-sans text-slate-200 overflow-hidden relative">
      
      {/* TOAST DE ÉXITO */}
      {successToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold animate-in slide-in-from-top-10">
          <CheckCircle size={20}/> Orden registrada e impresa
        </div>
      )}

      {/* PIN MODAL (INTERNO) */}
      {renderAuthModal()}
      
      {/* MODAL IA XIAOBOT */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-red-500/30 rounded-2xl shadow-2xl w-full max-w-md flex flex-col h-[500px] max-h-full overflow-hidden">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-[#0f172a]">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Bot className="text-red-500" /> XiaoBot IA
              </div>
              <button onClick={() => setIsAiModalOpen(false)} className="text-slate-400 hover:text-white p-1 bg-slate-800 rounded-full"><X size={20}/></button>
            </div>
            
            <div ref={chatScrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1e293b] no-scrollbar">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-red-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isAiLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] p-3 rounded-2xl bg-slate-700 text-slate-200 rounded-bl-none flex items-center gap-2">
                    <Loader size={16} /> Escribiendo...
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-[#0f172a] border-t border-slate-700 flex gap-2">
              <input 
                type="text" 
                value={aiInput} 
                onChange={e => setAiInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleAskAI()}
                placeholder="Pregunta sobre el menú o ventas..." 
                className="flex-1 bg-[#1e293b] border border-slate-600 rounded-full px-4 py-2 text-sm text-white outline-none focus:border-red-500"
              />
              <button 
                onClick={handleAskAI}
                disabled={isAiLoading || !aiInput.trim()}
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-red-600 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHECKOUT COMPLETO */}
      {checkoutModal && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e293b] border border-slate-700 p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Completar Orden</h3>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={() => setOrderMethod('local')} className={`py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors ${orderMethod === 'local' ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                <Store size={18}/> Local
              </button>
              <button onClick={() => setOrderMethod('delivery')} className={`py-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors ${orderMethod === 'delivery' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                <Truck size={18}/> Delivery
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6">
              <button onClick={() => setPaymentType('cash')} className={`py-2 rounded-lg text-sm font-bold border transition-colors ${paymentType === 'cash' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                Efectivo
              </button>
              <button onClick={() => setPaymentType('credit')} className={`py-2 rounded-lg text-sm font-bold border transition-colors ${paymentType === 'credit' ? 'border-amber-500 bg-amber-500/10 text-amber-400' : 'border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                Crédito
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">NOMBRE DEL CLIENTE *</label>
                <input type="text" autoFocus value={customerData.name} onChange={e=>setCustomerData({...customerData, name: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-3 text-white outline-none focus:border-red-500" placeholder="Ej. Juan Pérez"/>
              </div>
              
              {orderMethod === 'delivery' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">TELÉFONO *</label>
                    <input type="tel" value={customerData.phone} onChange={e=>setCustomerData({...customerData, phone: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500" placeholder="Ej. 809-555-5555"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">DIRECCIÓN DE ENTREGA *</label>
                    <input type="text" value={customerData.address} onChange={e=>setCustomerData({...customerData, address: e.target.value})} className="w-full bg-[#0f172a] border border-slate-600 rounded-lg px-4 py-3 text-white outline-none focus:border-blue-500" placeholder="Calle, Número, Sector"/>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 font-bold">Total a Pagar</span>
              <span className="text-3xl font-black text-emerald-400">RD${total.toFixed(0)}</span>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setCheckoutModal(false)} className="flex-1 py-3 bg-slate-700 rounded-lg font-bold hover:bg-slate-600 text-white">Cancelar</button>
              <button onClick={ejecutarVenta} disabled={isProcessing} className="flex-1 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 flex justify-center items-center gap-2 disabled:opacity-50 transition-colors">
                {isProcessing ? <Loader size={20}/> : <><CheckCircle size={18}/> Confirmar</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TICKET DRAWER */}
      {isCartDrawerOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsCartDrawerOpen(false)}></div>}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[380px] bg-[#1e293b] border-l border-slate-700 z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${isCartDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-[70px] border-b border-slate-800 flex items-center justify-between px-6 bg-[#0f172a] shrink-0">
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><ShoppingCart size={20}/> Comanda</h2>
          <button onClick={() => setIsCartDrawerOpen(false)} className="text-slate-400 hover:text-white p-2 bg-slate-800 rounded-full"><X size={18}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {cart.map(item => (
            <div key={item.cartId} className="bg-[#0f172a] border border-slate-700 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-sm text-slate-200 pr-2 leading-tight">{item.name}</h4>
                <button onClick={() => removeCartItem(item.cartId)} className="text-slate-500 hover:text-red-400 bg-slate-800 p-1 rounded-md"><X size={14}/></button>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 bg-[#1e293b] rounded-lg py-1 px-2 border border-slate-700">
                  <button onClick={() => updateQty(item.id, -1)} className="text-slate-400 p-1 hover:text-white hover:bg-slate-700 rounded"><Minus size={14} /></button>
                  <span className="text-sm font-bold w-6 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, 1)} className="text-slate-400 p-1 hover:text-white hover:bg-slate-700 rounded"><Plus size={14}/></button>
                </div>
                <span className="font-black text-base text-white">RD${item.finalPrice.toFixed(0)}</span>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="text-center flex flex-col items-center justify-center text-slate-500 h-full mt-20">
              <ShoppingCart size={48} className="mb-4 opacity-30"/>
              <span className="text-sm font-bold">Sin platos agregados</span>
              <p className="text-xs mt-2 text-slate-600">Selecciona productos del menú</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-[#1e293b] border-t border-slate-800 shrink-0">
          <div className="flex justify-between items-end mb-4">
            <span className="text-slate-400 text-sm font-bold">Total a Pagar</span>
            <span className="text-3xl font-black text-emerald-400">RD$ {total.toFixed(0)}</span>
          </div>
          <button onClick={openCheckout} disabled={cart.length === 0} className="w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold flex justify-center items-center gap-2 disabled:opacity-50 disabled:hover:bg-red-600 transition-colors shadow-[0_4px_15px_rgba(239,68,68,0.3)]">
            Proceder al Pago
          </button>
        </div>
      </div>

      {/* MENÚ LATERAL IZQUIERDO */}
      <div className="w-[80px] bg-[#1e293b] border-r border-slate-800 flex flex-col items-center py-6 z-20 shrink-0 hidden md:flex">
        <div className="w-12 h-12 bg-red-600 text-white rounded-xl flex items-center justify-center font-black text-xl mb-8 shadow-[0_0_15px_rgba(239,68,68,0.4)]">XK</div>
        <div className="flex flex-col gap-6 w-full flex-1">
          <button onClick={() => setActiveView('pos')} className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'pos' ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'}`}><LayoutDashboard size={24} /><span className="text-[10px] font-bold">POS</span></button>
          <button onClick={() => requestAdminAccess('history')} className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'history' ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'}`}><History size={24} /><span className="text-[10px] font-bold">Órdenes</span></button>
          <button onClick={() => requestAdminAccess('cierre')} className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'cierre' ? 'text-red-500' : 'text-slate-500 hover:text-slate-300'}`}><Receipt size={24} /><span className="text-[10px] font-bold">Cierre</span></button>
        </div>
        
        {/* BOTÓN ASISTENTE IA */}
        <button onClick={() => setIsAiModalOpen(true)} className="mt-auto flex flex-col items-center gap-1 text-red-400 hover:text-red-300 transition-colors">
          <div className="bg-red-900/30 p-2 rounded-full border border-red-900/50">
             <Bot size={22} />
          </div>
          <span className="text-[10px] font-bold">XiaoBot</span>
        </button>
      </div>

      {/* ÁREA CENTRAL */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="h-[70px] border-b border-slate-800 flex items-center justify-between px-4 md:px-6 bg-[#0f172a] shrink-0">
          <div className="relative w-full max-w-[250px] md:max-w-md">
            {activeView === 'pos' && (
              <>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input ref={searchInputRef} type="text" placeholder="Buscar plato..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#1e293b] border border-slate-700 focus:border-red-500 rounded-full py-2 pl-10 pr-4 text-white outline-none text-sm transition-colors"/>
              </>
            )}
            {activeView === 'history' && <h2 className="text-xl font-bold">Historial de Órdenes</h2>}
            {activeView === 'cierre' && <h2 className="text-xl font-bold">Cierre de Caja</h2>}
          </div>
          
          <div className="flex items-center gap-4 hidden sm:flex">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Caja Actual</p>
              <p className="font-black text-lg text-emerald-400 leading-none">RD$ {stats.total.toFixed(0)}</p>
            </div>
            {isAdminUnlocked && <button onClick={() => setIsAdminUnlocked(false)} className="ml-4 text-slate-500 hover:text-amber-500 flex items-center gap-1 text-xs font-bold bg-slate-800 px-3 py-1.5 rounded-lg transition-colors"><Lock size={14}/> Bloquear Admin</button>}
          </div>
        </div>

        {activeView === 'pos' && (
          <div className="px-4 md:px-6 py-4 bg-[#0f172a] border-b border-slate-800/50 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
            {CATEGORIAS.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-red-600 text-white shadow-md' : 'bg-[#1e293b] text-slate-400 hover:bg-slate-700 hover:text-white'}`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* CONTENIDO PRINCIPAL SCROLLABLE */}
        {activeView === 'pos' && (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar pb-[100px]">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
              {filteredProducts.map(p => (
                <div key={p.id} onClick={() => handleProductClick(p)} className="bg-[#1e293b] rounded-2xl p-4 border border-slate-700/60 hover:border-red-500 cursor-pointer flex flex-col transition-all active:scale-95 hover:shadow-[0_0_15px_rgba(239,68,68,0.15)] min-h-[130px] group">
                  <div className="flex justify-between items-start mb-2">
                     <span className="text-[9px] font-black uppercase tracking-wider text-red-500/80 bg-red-500/10 px-2 py-0.5 rounded">{p.category}</span>
                     <Plus size={16} className="text-slate-600 group-hover:text-red-500 transition-colors" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-200 leading-snug mb-2 flex-1 mt-1">{p.name}</h3>
                  <p className="font-black text-lg text-emerald-400 mt-auto">RD${p.price.toFixed(0)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeView === 'pos' && (
          <div className="absolute bottom-0 left-0 right-0 bg-[#1e293b]/90 backdrop-blur-md border-t border-slate-700 p-4 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.5)] md:pb-4 pb-20 z-10">
            <div className="flex flex-col">
               <span className="text-xs font-bold text-slate-400 uppercase">{cart.length} Artículos</span>
               <span className="text-2xl font-black text-emerald-400">RD$ {total.toFixed(0)}</span>
            </div>
            <button onClick={() => setIsCartDrawerOpen(true)} className="bg-red-600 hover:bg-red-500 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-[0_4px_15px_rgba(239,68,68,0.3)] active:scale-95 transition-all">
               Comanda <ShoppingCart size={20}/>
            </button>
          </div>
        )}

        {activeView === 'history' && (
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-4 pb-20">
              {localSales.length === 0 ? (
                 <div className="text-center flex flex-col items-center justify-center text-slate-500 mt-20 h-full">
                   <History size={64} className="mb-4 opacity-20"/>
                   <p className="text-xl font-bold text-slate-400">No hay órdenes hoy</p>
                   <p className="text-sm mt-2">Las órdenes procesadas aparecerán aquí.</p>
                 </div>
              ) : (
                localSales.map(sale => (
                  <div key={sale.id} className={`bg-[#1e293b] border rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-colors ${sale.status === 'voided' ? 'border-red-900/50 opacity-50 bg-red-900/5' : 'border-slate-700 hover:border-slate-500'}`}>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${sale.method === 'delivery' ? 'bg-blue-900/50 text-blue-400' : 'bg-purple-900/50 text-purple-400'}`}>{sale.method}</span>
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${sale.type === 'cash' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-amber-900/50 text-amber-400'}`}>{sale.type}</span>
                        {sale.status === 'voided' && <span className="px-2 py-1 rounded bg-red-900/80 text-white text-[10px] font-black uppercase">Anulada</span>}
                        <span className="text-xs text-slate-400 font-medium ml-1">{new Date(sale.date).toLocaleTimeString('es-DO', {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="font-bold text-white text-base">{sale.customer} <span className="text-slate-500 text-sm font-normal ml-2">• {sale.items?.length || 0} platos</span></p>
                    </div>
                    <div className="flex flex-row-reverse sm:flex-row items-center gap-4 sm:gap-6 justify-between sm:justify-end">
                      {sale.status !== 'voided' && (
                        <div className="flex gap-2">
                          <button onClick={() => printReceipt(sale)} className="text-xs font-bold text-slate-300 border border-slate-600 px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors">Reimprimir</button>
                          <button onClick={() => anularVenta(sale.id)} className="text-xs font-bold text-red-400 border border-red-900/50 px-4 py-2 rounded-lg bg-red-900/20 hover:bg-red-900/40 transition-colors">Anular</button>
                        </div>
                      )}
                      <p className={`font-black text-2xl ${sale.status === 'voided' ? 'text-slate-500 line-through' : 'text-emerald-400'}`}>RD${(sale.total||0).toFixed(0)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeView === 'cierre' && (
          <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col items-center pb-20">
            <div className="bg-[#1e293b] border border-slate-700 p-6 md:p-8 rounded-3xl w-full max-w-2xl mt-4 shadow-xl">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-700/50">
                <div>
                  <h2 className="text-2xl font-black text-white">Resumen del Día</h2>
                  <p className="text-slate-400 text-sm mt-1">{new Date().toLocaleDateString('es-DO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="bg-slate-800 p-3 rounded-xl border border-slate-700">
                   <Receipt size={32} className="text-slate-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 flex flex-col justify-center">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Efectivo Recibido</p>
                  <p className="text-4xl font-black text-emerald-400">RD${stats.cash.toFixed(0)}</p>
                </div>
                <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 flex flex-col justify-center">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Créditos Otorgados</p>
                  <p className="text-4xl font-black text-amber-500">RD${stats.credit.toFixed(0)}</p>
                </div>
              </div>
              
              <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 flex justify-between items-center mb-8">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Ventas</span>
                  <span className="text-3xl font-black text-white">RD${stats.total.toFixed(0)}</span>
              </div>

              <button onClick={generarCierre} className="w-full bg-red-600 hover:bg-red-500 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-colors shadow-[0_4px_20px_rgba(239,68,68,0.25)]">
                <Download size={24}/> Imprimir Cierre y Descargar
              </button>
              <p className="text-center text-xs text-slate-500 mt-4">Esta acción reiniciará la caja a cero.</p>
            </div>
          </div>
        )}
      </div>

      {/* NAVEGACIÓN MÓVIL */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-[#1e293b]/95 backdrop-blur-md border-t border-slate-800 flex justify-around p-2 z-[20] pb-safe">
        <button onClick={() => setActiveView('pos')} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeView === 'pos' ? 'text-red-500 bg-red-500/10' : 'text-slate-500'}`}><LayoutDashboard size={20} /><span className="text-[10px] font-bold">POS</span></button>
        <button onClick={() => requestAdminAccess('history')} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeView === 'history' ? 'text-red-500 bg-red-500/10' : 'text-slate-500'}`}><History size={20} /><span className="text-[10px] font-bold">Órdenes</span></button>
        <button onClick={() => requestAdminAccess('cierre')} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeView === 'cierre' ? 'text-red-500 bg-red-500/10' : 'text-slate-500'}`}><Receipt size={20} /><span className="text-[10px] font-bold">Cierre</span></button>
        
        <button onClick={() => setIsAiModalOpen(true)} className="flex flex-col items-center gap-1 p-2 rounded-lg text-red-400">
           <Bot size={20} />
           <span className="text-[10px] font-bold">XiaoBot</span>
        </button>
      </nav>
    </div>
  );
}
