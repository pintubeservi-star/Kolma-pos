<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>migraRD | Preparación Profesional</title>
    
    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#1e3a8a">
    <meta name="description" content="Servicio privado de asistencia y preparación de solicitudes de visa americana.">
    <link rel="manifest" href="manifest.json">

    <!-- Estilos y Animaciones Optimizadas -->
    <style>
        :root {
            --primary: #1e3a8a;
            --primary-light: #2563eb;
            --emerald: #059669;
            --slate-dark: #0f172a;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
        body { background-color: #f8fafc; color: #1e293b; line-height: 1.6; overflow-x: hidden; }

        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
        }
        @keyframes pulseGlow {
            0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(37, 99, 235, 0); }
            100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-pulse-btn { animation: pulseGlow 2s infinite; }
        .fade-in { animation: fadeIn 0.3s ease-out forwards; }

        header { background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px); border-bottom: 1px solid #e2e8f0; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 40; }
        .logo { font-weight: 800; font-size: 1.25rem; color: var(--primary); display: flex; align-items: center; gap: 0.5rem; }
        .logo-icon { background: var(--primary); color: white; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 12px; font-size: 1.1rem; box-shadow: 0 4px 12px rgba(30, 58, 138, 0.3); }
        
        .btn { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; border: none; padding: 0.85rem 1.75rem; font-weight: 700; border-radius: 14px; cursor: pointer; text-decoration: none; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; text-align: center; transition: all 0.3s ease; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35); }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(37, 99, 235, 0.5); background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%); }

        /* Hero */
        .hero { background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%); color: white; padding: 5rem 1.5rem; text-align: center; position: relative; overflow: hidden; }
        .flags-banner { display: flex; justify-content: center; gap: 1rem; font-size: 2.5rem; margin-bottom: 1.5rem; }
        .hero h1 { font-size: clamp(2.2rem, 5vw, 3.5rem); font-weight: 800; margin-bottom: 1.2rem; letter-spacing: -0.025em; line-height: 1.2; }
        .hero h1 span { background: linear-gradient(to right, #60a5fa, #93c5fd); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { color: #cbd5e1; max-width: 680px; margin: 0 auto 2.5rem; font-size: 1.15rem; font-weight: 300; }

        /* PVU Cards */
        .pvu-section { max-width: 1200px; margin: -3rem auto 0; padding: 0 1.5rem; position: relative; z-index: 20; }
        .pvu-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
        .pvu-card { background: white; border-radius: 20px; padding: 2rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; transition: transform 0.3s ease; }
        .pvu-card:hover { transform: translateY(-5px); }
        .pvu-icon { width: 50px; height: 50px; border-radius: 12px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1.2rem; font-weight: bold; }
        .pvu-card h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--slate-dark); }
        .pvu-card p { font-size: 0.9rem; color: #64748b; }

        /* Planes */
        .container { max-width: 1200px; margin: 0 auto; padding: 5rem 1.5rem; }
        .section-header { text-align: center; max-width: 700px; margin: 0 auto 3.5rem; }
        .section-header h2 { font-size: clamp(2rem, 3vw, 2.75rem); font-weight: 800; color: var(--slate-dark); margin-bottom: 1rem; }
        .section-header p { color: #64748b; font-size: 1.1rem; }

        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; align-items: stretch; }
        .card { background: white; border: 1px solid #e2e8f0; border-radius: 28px; padding: 2.5rem; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); transition: all 0.3s ease; position: relative; }
        .card:hover { box-shadow: 0 20px 35px -10px rgba(0,0,0,0.08); border-color: #cbd5e1; }
        .card.popular { border: 2px solid #2563eb; box-shadow: 0 15px 30px -5px rgba(37,99,235,0.15); }
        
        .badge { background: #f1f5f9; color: #475569; font-size: 0.75rem; font-weight: 800; padding: 0.35rem 1rem; border-radius: 9999px; width: fit-content; margin-bottom: 1.25rem; text-transform: uppercase; }
        .popular-badge { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; position: absolute; top: -16px; left: 50%; transform: translateX(-50%); box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
        
        .price-box { margin: 1.5rem 0; display: flex; align-items: baseline; gap: 0.5rem; }
        .price { font-size: 3rem; font-weight: 800; color: var(--slate-dark); }
        .price-period { color: #64748b; font-size: 0.875rem; font-weight: 500; }
        
        .features { list-style: none; margin: 2rem 0; font-size: 0.95rem; color: #475569; }
        .features li { margin-bottom: 1rem; display: flex; align-items: flex-start; gap: 0.75rem; }
        .features li::before { content: "✓"; color: var(--emerald); font-weight: 900; background: #ecfdf5; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.75rem; }

        /* Mensaje Inspirador */
        .inspire-box { background: linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%); border: 1px solid #bfdbfe; border-radius: 20px; padding: 2.5rem; text-align: center; margin-top: 5rem; }
        .inspire-box h3 { font-size: 1.5rem; font-weight: 800; color: var(--primary); margin-bottom: 0.75rem; }
        .inspire-box p { color: #1e40af; max-width: 700px; margin: 0 auto; font-size: 1.05rem; }

        /* MODAL (Forzar visualización con display flex cuando esté activo) */
        .modal { display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); z-index: 1000; align-items: center; justify-content: center; padding: 1rem; }
        .modal.active { display: flex !important; }
        .modal-content { background: white; border-radius: 32px; width: 100%; max-width: 580px; padding: 2.5rem; max-height: 95vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); animation: fadeIn 0.3s ease-out; }
        
        .form-section-title { font-size: 0.85rem; font-weight: 800; color: var(--primary); text-transform: uppercase; margin-bottom: 1rem; border-bottom: 2px solid #eff6ff; padding-bottom: 0.3rem; letter-spacing: 0.05em; }
        .form-group { margin-bottom: 1.25rem; text-align: left; }
        .form-group label { display: block; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-bottom: 0.4rem; color: #475569; letter-spacing: 0.05em; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.8rem 1rem; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem; outline: none; transition: border-color 0.2s; background: #f8fafc; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--primary-light); background: white; }
        
        .close-btn { background: #f1f5f9; border: none; padding: 0.75rem; border-radius: 12px; cursor: pointer; font-weight: 700; color: #475569; width: 100%; margin-top: 0.75rem; transition: background 0.2s; }
        .close-btn:hover { background: #e2e8f0; }

        /* Tarjeta de Asistencia WhatsApp en Formulario */
        .whatsapp-notice { background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border: 2px solid #34d399; border-radius: 18px; padding: 1.5rem; margin-bottom: 1.5rem; display: flex; gap: 1rem; align-items: flex-start; text-align: left; }
        .whatsapp-notice-icon { font-size: 2rem; background: #059669; color: white; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 10px rgba(5,150,105,0.3); }
    </style>
</head>
<body>

    <!-- Header -->
    <header>
        <div class="logo">
            <div class="logo-icon animate-float">🇺🇸</div>
            <span>migraRD</span>
        </div>
        <a href="#planes" class="btn" style="padding: 0.6rem 1.25rem; font-size: 0.875rem;">Ver Planes</a>
    </header>

    <!-- Hero -->
    <section class="hero">
        <div class="flags-banner">
            <span class="flag-item animate-float" style="animation-delay: 0s;">🇩🇴</span>
            <span class="flag-item animate-float" style="animation-delay: 0.5s;">✈️</span>
            <span class="flag-item animate-float" style="animation-delay: 1s;">🇺🇸</span>
        </div>
        
        <h1>Haz realidad tu viaje y transforma tu futuro con <span>asistencia profesional</span></h1>
        <p>Tu entrevista consular es una oportunidad única. Te guiamos paso a paso con rigor, claridad y respaldo humano garantizado.</p>
        
        <a href="#planes" class="btn animate-pulse-btn" style="font-size: 1.05rem; padding: 1rem 2rem;">
            🚀 Elegir Mi Plan de Asistencia
        </a>
    </section>

    <!-- PVU -->
    <section class="pvu-section">
        <div class="pvu-grid">
            <div class="pvu-card">
                <div class="pvu-icon">🎯</div>
                <h3>Estrategia Personalizada</h3>
                <p>Analizamos cada detalle de tu perfil para resaltar tus fortalezas y preparar una solicitud impecable.</p>
            </div>
            <div class="pvu-card">
                <div class="pvu-icon">🛡️</div>
                <h3>Tranquilidad Absoluta</h3>
                <p>Evita errores críticos en formularios consulares que puedan comprometer o retrasar tu proceso.</p>
            </div>
            <div class="pvu-card">
                <div class="pvu-icon">🤝</div>
                <h3>Acompañamiento Humano</h3>
                <p>Nunca estarás solo: un experto te asistirá directamente por WhatsApp durante toda tu gestión.</p>
            </div>
        </div>
    </section>

    <!-- Planes -->
    <div id="planes" class="container">
        <div class="section-header">
            <h2>Selecciona tu nivel de acompañamiento</h2>
            <p>Inversión inteligente diseñada para darte la máxima seguridad ante el oficial consular.</p>
        </div>

        <div class="grid">
            <!-- Plan 1 -->
            <div class="card">
                <div>
                    <div class="badge">PREPARACIÓN + GUÍA</div>
                    <div class="price-box">
                        <span class="price">US$20</span>
                        <span class="price-period">pago único</span>
                    </div>
                    <p style="font-size: 0.9rem; color: #64748b; margin-bottom: 1.5rem;">Tú haces el proceso. Nosotros te guiamos paso a paso.</p>
                    <ul class="features">
                        <li>Orientación experta paso a paso</li>
                        <li>Guía para crear tu perfil de solicitud</li>
                        <li>Guía detallada para completar el DS-160</li>
                        <li>Evaluación profesional de tu información</li>
                        <li>Seguimiento directo por WhatsApp</li>
                    </ul>
                </div>
                <button type="button" onclick="openFormModal('Preparación + Guía', 'US$20')" class="btn" style="background: var(--slate-dark); width: 100%;">ADQUIRIR PLAN - US$20</button>
            </div>

            <!-- Plan 2 (Popular) -->
            <div class="card popular">
                <div class="badge popular-badge">⭐ MÁS ELEGIDO POR NUESTROS CLIENTES</div>
                <div>
                    <div class="badge" style="background: #e0e7ff; color: #1e40af;">PROCESO COMPLETO</div>
                    <div class="price-box">
                        <span class="price">US$60</span>
                        <span class="price-period">pago único</span>
                    </div>
                    <p style="font-size: 0.9rem; color: #64748b; margin-bottom: 1.5rem;">Nosotros hacemos todo el proceso pesado por ti.</p>
                    <ul class="features">
                        <li>Evaluación inicial de perfil completa</li>
                        <li>Creación profesional del perfil consular</li>
                        <li>Llenado experto y exacto del formulario DS-160</li>
                        <li>Asesoría y preparación intensiva para entrevista</li>
                        <li>Acompañamiento hasta la cita consular</li>
                    </ul>
                </div>
                <button type="button" onclick="openFormModal('Proceso Completo', 'US$60')" class="btn animate-pulse-btn" style="width: 100%;">ADQUIRIR PLAN - US$60</button>
            </div>

            <!-- Plan 3 -->
            <div class="card">
                <div>
                    <div class="badge" style="background: #fae8ff; color: #86198f;">PROCESO + VALIDACIÓN</div>
                    <div class="price-box">
                        <span class="price">US$80</span>
                        <span class="price-period">pago único</span>
                    </div>
                    <p style="font-size: 0.9rem; color: #64748b; margin-bottom: 1.5rem;">Para casos especiales con revisión documental profunda.</p>
                    <ul class="features">
                        <li>Todo lo incluido en el plan de US$60</li>
                        <li>Revisión documental detallada (divorcios, nombres)</li>
                        <li>Identificación minuciosa de inconsistencias</li>
                        <li>Orientación sobre documentos de soporte clave</li>
                        <li>Estrategia de presentación optimizada</li>
                    </ul>
                </div>
                <button type="button" onclick="openFormModal('Proceso Completo + Validación', 'US$80')" class="btn" style="background: var(--slate-dark); width: 100%;">ADQUIRIR PLAN - US$80</button>
            </div>
        </div>

        <!-- Mensaje Inspirador -->
        <div class="inspire-box">
            <h3>🌟 Tu meta está más cerca de lo que imaginas</h3>
            <p>Miles de personas han logrado organizar sus solicitudes de manera exitosa con nuestra asesoría experta. Da el primer paso hoy con total confianza y permítenos acompañarte hacia tu próximo destino.</p>
        </div>
    </div>

    <!-- MODAL DE FORMULARIO -->
    <div id="modal-solicitud" class="modal">
        <div class="modal-content">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <div>
                    <span id="modal-plan-tag" style="font-size: 0.7rem; font-weight: 800; color: var(--primary); text-transform: uppercase; background: #e0e7ff; padding: 0.2rem 0.6rem; border-radius: 99px;">Plan Seleccionado</span>
                    <h3 id="modal-titulo" style="font-size: 1.25rem; color: var(--slate-dark); font-weight: 800; margin-top: 0.3rem;">Completar Solicitud</h3>
                </div>
                <button type="button" onclick="closeFormModal()" style="background: #f1f5f9; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: bold;">✕</button>
            </div>

            <!-- Aviso de Pago Asistido por WhatsApp -->
            <div class="whatsapp-notice">
                <div class="whatsapp-notice-icon">💬</div>
                <div>
                    <h4 style="font-size: 0.95rem; font-weight: 800; color: #065f46; margin-bottom: 0.2rem;">Pago 100% Asistido por WhatsApp</h4>
                    <p style="font-size: 0.8rem; color: #047857; line-height: 1.4;">
                        Para tu seguridad, no solicitamos tarjetas en línea. Al enviar este formulario, tu información llegará a nuestros asesores y <strong>el proceso de pago será coordinado y asistido directamente por un agente experto vía WhatsApp</strong>.
                    </p>
                </div>
            </div>

            <form id="form-datos" onsubmit="submitSolicitudForm(event)">
                <div class="form-section-title">1. Datos del Solicitante</div>
                <div style="display: grid; grid-template-columns: 1fr; gap: 0.75rem;">
                    <div class="form-group">
                        <label>Nombre completo *</label>
                        <input type="text" id="input-nombre" required placeholder="Ej. Juan Pérez">
                    </div>
                    <div class="form-group">
                        <label>Teléfono / WhatsApp *</label>
                        <input type="tel" id="input-whatsapp" required placeholder="Ej. +1 809 000 0000">
                    </div>
                    <div class="form-group">
                        <label>Correo electrónico *</label>
                        <input type="email" id="input-email" required placeholder="correo@ejemplo.com">
                    </div>
                    <div class="form-group">
                        <label>Ciudad y país de residencia *</label>
                        <input type="text" id="input-residencia" required placeholder="Ej. Santo Domingo, Rep. Dom.">
                    </div>
                    <div class="form-group">
                        <label>Motivo principal del viaje *</label>
                        <input type="text" id="input-motivo" required placeholder="Ej. Turismo, Vacaciones">
                    </div>
                </div>

                <button type="submit" class="btn animate-pulse-btn" style="width: 100%; margin-top: 1rem; padding: 1rem; font-size: 1rem; background: #059669; justify-content: center;">
                    📲 ENVIAR Y COORDINAR PAGO POR WHATSAPP
                </button>
                <button type="button" onclick="closeFormModal()" class="close-btn">Cancelar</button>
            </form>
        </div>
    </div>

    <!-- Script de Control -->
    <script>
        let paqueteSeleccionadoNombre = '';
        let paqueteSeleccionadoPrecio = '';

        function openFormModal(nombre, precio) {
            paqueteSeleccionadoNombre = nombre;
            paqueteSeleccionadoPrecio = precio;
            
            document.getElementById('modal-plan-tag').innerText = `Plan: ${nombre} (${precio})`;
            document.getElementById('modal-titulo').innerText = `Adquirir ${nombre}`;
            
            // Mostrar modal forzando la clase active
            const modal = document.getElementById('modal-solicitud');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeFormModal() {
            const modal = document.getElementById('modal-solicitud');
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        function submitSolicitudForm(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('input-nombre').value;
            const whatsapp = document.getElementById('input-whatsapp').value;
            const email = document.getElementById('input-email').value;
            const residencia = document.getElementById('input-residencia').value;
            const motivo = document.getElementById('input-motivo').value;

            // Mensaje estructurado para WhatsApp
            const textoMensaje = `Hola, mi nombre es *${nombre}*. Acabo de completar mi solicitud para el plan *${paqueteSeleccionadoNombre} (${paqueteSeleccionadoPrecio})* en migraRD.\n\n*Datos de contacto:*\n- WhatsApp: ${whatsapp}\n- Correo: ${email}\n- Residencia: ${residencia}\n- Motivo de viaje: ${motivo}\n\nQuiero coordinar el pago con un agente y continuar con mi proceso.`;

            // Número administrativo configurado
            const numeroDestino = "18090000000"; 
            const urlWhatsApp = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(textoMensaje)}`;

            // Cerrar modal y abrir WhatsApp de inmediato
            closeFormModal();
            window.open(urlWhatsApp, '_blank');
        }
    </script>
</body>
</html>
