import React, { useState } from 'react';
import { 
  UserCheck, FileText, FolderOpen, 
  MessageSquare, Shield, CheckCircle, AlertTriangle, 
  Upload, ChevronRight, Send, Search, Eye, X, Check, CreditCard
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('client-view'); // 'client-view' | 'consultant-panel'
  const [clientStep, setClientStep] = useState('identification'); // 'identification' | 'services' | 'payment' | 'interview' | 'dashboard' | 'chat' | 'lookup'
  
  // Datos de Identificación (Teléfono como identificador principal)
  const [clientInfo, setClientInfo] = useState({ fullName: '', phone: '', email: '', country: 'República Dominicana', city: '' });
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupResult, setLookupResult] = useState(null);

  const [selectedService, setSelectedService] = useState(null);
  const [interviewIndex, setInterviewIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentInput, setCurrentInput] = useState('');
  const [formspreeStatus, setFormspreeStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Panel Consultor State
  const [selectedClientDetail, setSelectedClientDetail] = useState(null);
  
  // Chat conversacional inteligente con el Gestor Migratorio Experto
  const [messages, setMessages] = useState([
    { 
      sender: 'consultant', 
      text: 'Saludos. Soy su gestor y consultor migratorio experto en procesos hacia Estados Unidos desde la República Dominicana. Estoy aquí para guiarle con absoluta precisión, responder cualquier inquietud sobre su visado, residencia o petición, y asegurar que su expediente cumpla con todos los estándares consulares antes de nuestra revisión final. ¿En qué le puedo asistir hoy?' 
    }
  ]);
  const [newMessageText, setNewMessageText] = useState('');

  const servicesList = [
    { id: 'evaluacion', title: 'Evaluación Migratoria Profesional', price: 10, desc: 'Análisis inicial de elegibilidad y perfil migratorio.', form: 'N/A' },
    { id: 'turista', title: 'Gestión Completa Visa de Turista', price: 50, desc: 'Incluye entrevista, expediente y formulario DS-160.', form: 'DS-160' },
    { id: 'peticion', title: 'Petición Familiar', price: 120, desc: 'Acompañamiento, documentación y formularios hasta la entrevista.', form: 'I-130' },
    { id: 'prometido', title: 'Visa de Prometido(a)', price: 120, desc: 'Preparación documental, organización y acompañamiento oficial.', form: 'I-129F' }
  ];

  const getInterviewFlow = (serviceId) => {
    switch(serviceId) {
      case 'evaluacion':
      case 'turista':
        return [
          { id: 'civilStatus', question: '¿Cuál es su estado civil actual?', type: 'select', options: ['Soltero/a', 'Casado/a', 'Divorciado/a', 'Unión libre'] },
          { id: 'children', question: '¿Tiene hijos? Indique cantidad y edades aproximadas.', type: 'text' },
          { id: 'employment', question: '¿Cuál es su ocupación actual, empresa y tiempo laborando?', type: 'text' },
          { id: 'income', question: '¿Cuál es su ingreso mensual aproximado en DOP o USD?', type: 'text' },
          { id: 'travelHistory', question: '¿Ha viajado fuera de la República Dominicana en los últimos 5 años?', type: 'select', options: ['Sí, a EE.UU. u otro país', 'No, nunca he salido del país'] }
        ];
      case 'peticion':
      case 'prometido':
        return [
          { id: 'petitionerRelation', question: '¿Cuál es la relación exacta con su familiar o peticionario en EE.UU.?', type: 'text' },
          { id: 'petitionerStatus', question: '¿Qué estatus migratorio posee su peticionario en EE.UU.?', type: 'select', options: ['Ciudadano Americano', 'Residente Permanente (Green Card)'] },
          { id: 'priorVisa', question: '¿Ha tenido visas o solicitudes migratorias previas?', type: 'text' }
        ];
      default:
        return [
          { id: 'details', question: 'Describa brevemente su objetivo migratorio principal.', type: 'text' }
        ];
    }
  };

  const handleIdentificationSubmit = (e) => {
    e.preventDefault();
    if (!clientInfo.fullName || !clientInfo.phone || !clientInfo.city) return;
    setClientStep('services');
  };

  const handleSelectService = (service) => {
    setSelectedService(service);
    setClientStep('payment');
  };

  const handleConfirmPayment = () => {
    setInterviewIndex(0);
    setAnswers({});
    setClientStep('interview');
  };

  const handleAnswerSubmit = (val) => {
    const flow = getInterviewFlow(selectedService.id);
    const currentQ = flow[interviewIndex];
    const updatedAnswers = { ...answers, [currentQ.id]: val };
    setAnswers(updatedAnswers);
    setCurrentInput('');

    if (interviewIndex < flow.length - 1) {
      setInterviewIndex(interviewIndex + 1);
    } else {
      submitExpedienteToFormspree(updatedAnswers);
      setClientStep('dashboard');
    }
  };

  const submitExpedienteToFormspree = async (finalAnswers) => {
    setIsSubmitting(true);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const fileName = `${clientInfo.phone}_EXP_${dateStr}.pdf`;

    const payload = {
      name: clientInfo.fullName,
      phone: clientInfo.phone,
      email: clientInfo.email || 'No proporcionado',
      ubicacion: `${clientInfo.city}, ${clientInfo.country}`,
      proceso: selectedService.title,
      formulario: selectedService.form,
      estadoExpediente: 'Entrevista Completada - Pendiente Revisión Consultor',
      nombreArchivoSugerido: fileName,
      destinatarioInterno: 'pintubeservi@gmail.com',
      respuestasEntrevista: JSON.stringify(finalAnswers, null, 2)
    };

    try {
      const response = await fetch('https://formspree.io/f/xlgveqlp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        setFormspreeStatus('Expediente generado y enviado a pintubeservi@gmail.com con éxito.');
      } else {
        setFormspreeStatus('Error al enviar expediente automático.');
      }
    } catch (error) {
      setFormspreeStatus('Error de red al conectar con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhoneLookup = (e) => {
    e.preventDefault();
    if (!lookupPhone) return;
    if (lookupPhone === clientInfo.phone || lookupPhone.length >= 8) {
      setLookupResult({
        name: clientInfo.fullName || 'Carlos Martínez',
        phone: lookupPhone,
        service: selectedService?.title || 'Gestión Completa Visa de Turista',
        status: 'En revisión por consultor experto',
        progress: '85%',
        pendingDocs: ['Fotografía Digital (Fondo Blanco)']
      });
    } else {
      setLookupResult({ notFound: true });
    }
  };

  const sendClientMessage = () => {
    if (!newMessageText.trim()) return;
    const userMsg = newMessageText;
    const updatedMessages = [...messages, { sender: 'client', text: userMsg }];
    setMessages(updatedMessages);
    setNewMessageText('');

    setTimeout(() => {
      let expertReply = "He tomado nota de su consulta. Como gestor experto en procesos hacia EE.UU. desde República Dominicana, le recomiendo mantener su expediente actualizado con soportes claros. Nuestro equipo revisará este detalle antes de proceder formalmente.";
      
      const lower = userMsg.toLowerCase();
      if (lower.includes('costo') || lower.includes('precio') || lower.includes('pago') || lower.includes('cuánto')) {
        expertReply = "Nuestros honorarios varían según el trámite: Evaluación profesional por $10 USD, Visa de Turista por $50 USD, y Petición Familiar o Visa de Prometido(a) por $120 USD. Recuerde que las tasas consulares de la Embajada de EE.UU. se pagan de forma independiente en el banco autorizado.";
      } else if (lower.includes('tiempo') || lower.includes('tarda') || lower.includes('duración') || lower.includes('demora')) {
        expertReply = "Los tiempos varían según el proceso consular. Para visas de turista B1/B2, dependemos de la disponibilidad de citas en la Embajada de EE.UU. en Santo Domingo. En peticiones familiares, los plazos están sujetos a los boletines de visas del Departamento de Estado.";
      } else if (lower.includes('requisito') || lower.includes('documento') || lower.includes('papel') || lower.includes('pasaporte')) {
        expertReply = "Para su expediente requerimos obligatoriamente su pasaporte vigente con al menos 6 meses de validez, soportes laborales o comerciales sólidos en la República Dominicana, y cumplir con cada parámetro de nuestra entrevista guiada.";
      } else if (lower.includes('entrevista') || lower.includes('embajada')) {
        expertReply = "La preparación para la entrevista consular es clave. Una vez nuestro equipo revise su formulario DS-160 o petición y apruebe su expediente, realizaremos simulacros y pautas precisas para su presentación en la Embajada.";
      }

      setMessages([...updatedMessages, { sender: 'consultant', text: expertReply }]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-2 rounded-xl font-bold flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">MigraRD <span className="text-blue-500">Pro</span></h1>
            <p className="text-xs text-slate-400">Oficina de Gestión Migratoria Especializada EE.UU. &bull; RD</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('client-view')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'client-view' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
            Portal del Cliente
          </button>
          <button 
            onClick={() => setActiveTab('consultant-panel')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'consultant-panel' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
            Panel del Consultor
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col">
        {activeTab === 'client-view' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex-1 flex flex-col">
            {clientStep === 'lookup' && (
              <div className="flex-1 flex flex-col justify-center p-8 max-w-md mx-auto my-auto text-center space-y-6 w-full">
                <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20">
                  <Search className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Consultar mi Expediente</h3>
                  <p className="text-slate-400 text-sm">Ingrese su número telefónico registrado para consultar el estado del proceso.</p>
                </div>
                <form onSubmit={handlePhoneLookup} className="space-y-4">
                  <input 
                    type="tel" 
                    placeholder="Ej. 8095551234"
                    value={lookupPhone}
                    onChange={(e) => setLookupPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 text-center font-mono text-lg"
                    required
                  />
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-sm font-medium transition-all shadow">
                    Consultar Estado
                  </button>
                </form>

                {lookupResult && !lookupResult.notFound && (
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-left space-y-2 mt-4 text-sm">
                    <p className="font-bold text-white">{lookupResult.name}</p>
                    <p className="text-slate-400">Trámite: <span className="text-white">{lookupResult.service}</span></p>
                    <p className="text-slate-400">Estado: <span className="text-amber-400 font-medium">{lookupResult.status}</span></p>
                    <p className="text-slate-400">Avance: <span className="text-emerald-400 font-bold">{lookupResult.progress}</span></p>
                  </div>
                )}
                {lookupResult && lookupResult.notFound && (
                  <p className="text-rose-400 text-xs">No se encontró ningún expediente con ese número telefónico.</p>
                )}

                <button onClick={() => setClientStep('identification')} className="text-xs text-blue-400 hover:underline">
                  &larr; Volver al inicio
                </button>
              </div>
            )}

            {clientStep === 'identification' && (
              <div className="flex-1 flex flex-col justify-center p-8 max-w-lg mx-auto my-auto space-y-6 w-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto border border-blue-500/20 mb-3">
                    <UserCheck className="w-8 h-8 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">Identificación del Solicitante</h2>
                  <p className="text-slate-400 text-sm">Su número de teléfono será el identificador principal de su expediente y clave de acceso para gestiones migratorias hacia EE.UU.</p>
                </div>

                <form onSubmit={handleIdentificationSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Nombre Completo *</label>
                    <input 
                      type="text" 
                      value={clientInfo.fullName}
                      onChange={(e) => setClientInfo({...clientInfo, fullName: e.target.value})}
                      placeholder="Ej. Juan Pérez"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Número de Teléfono (Identificador) *</label>
                    <input 
                      type="tel" 
                      value={clientInfo.phone}
                      onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
                      placeholder="Ej. 8095551234"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Correo Electrónico (Opcional)</label>
                    <input 
                      type="email" 
                      value={clientInfo.email}
                      onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                      placeholder="correo@ejemplo.com"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">País de Residencia</label>
                      <input 
                        type="text" 
                        value={clientInfo.country}
                        onChange={(e) => setClientInfo({...clientInfo, country: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 block mb-1">Ciudad *</label>
                      <input 
                        type="text" 
                        value={clientInfo.city}
                        onChange={(e) => setClientInfo({...clientInfo, city: e.target.value})}
                        placeholder="Ej. Santo Domingo"
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3.5 rounded-xl text-sm font-medium transition-all shadow-lg mt-2">
                    Continuar a Servicios
                  </button>
                </form>

                <div className="text-center pt-2 border-t border-slate-800/80">
                  <button onClick={() => setClientStep('lookup')} className="text-xs text-slate-400 hover:text-white">
                    ¿Ya tienes un expediente iniciado? <span className="text-blue-400 font-medium">Consúltalo aquí</span>
                  </button>
                </div>
              </div>
            )}

            {clientStep === 'services' && (
              <div className="flex-1 flex flex-col justify-center p-8 max-w-3xl mx-auto my-auto text-center space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Selecciona tu Servicio Migratorio</h2>
                  <p className="text-slate-400 text-sm">Expediente especializado EE.UU. a nombre de <strong className="text-white">{clientInfo.fullName}</strong> ({clientInfo.phone})</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {servicesList.map((srv) => (
                    <div 
                      key={srv.id}
                      onClick={() => handleSelectService(srv)}
                      className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 p-5 rounded-xl flex flex-col justify-between transition-all cursor-pointer group">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-white group-hover:text-blue-400 transition-colors">{srv.title}</h4>
                          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg text-sm">${srv.price} USD</span>
                        </div>
                        <p className="text-xs text-slate-400 mb-4">{srv.desc}</p>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-xs">
                        <span className="text-slate-500">Formulario: <strong className="text-slate-300">{srv.form}</strong></span>
                        <span className="text-blue-400 flex items-center gap-1 font-medium">Seleccionar <ChevronRight className="w-3.5 h-3.5" /></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {clientStep === 'payment' && selectedService && (
              <div className="flex-1 flex flex-col justify-center p-8 max-w-lg mx-auto my-auto text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-600/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                  <CreditCard className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Confirmación de Gestión EE.UU.</h3>
                  <p className="text-slate-400 text-sm">{selectedService.title}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-left space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Honorarios del servicio:</span>
                    <span className="font-bold text-white">${selectedService.price} USD</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-slate-800 pt-3">
                    <span className="text-slate-400">Tasas consulares oficiales:</span>
                    <span className="text-slate-300 text-xs italic">Se pagan por separado ante la Embajada</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setClientStep('services')} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl text-sm font-medium">
                    Regresar
                  </button>
                  <button onClick={handleConfirmPayment} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-sm font-medium shadow-lg">
                    Pagar y Comenzar Entrevista
                  </button>
                </div>
              </div>
            )}

            {clientStep === 'interview' && (
              <div className="flex-1 flex flex-col h-[650px]">
                <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">AI</div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Gestor Experto Migratorio EE.UU.</h3>
                      <p className="text-xs text-emerald-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Entrevista técnica en curso</p>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                    Pregunta {interviewIndex + 1} de {getInterviewFlow(selectedService.id).length}
                  </span>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col justify-end">
                  <div className="flex items-start gap-3 max-w-xl">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">AI</div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none text-slate-200">
                      <p className="text-sm leading-relaxed">{getInterviewFlow(selectedService.id)[interviewIndex].question}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 border-t border-slate-800">
                  {getInterviewFlow(selectedService.id)[interviewIndex].type === 'select' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {getInterviewFlow(selectedService.id)[interviewIndex].options.map((opt, idx) => (
                        <button key={idx} onClick={() => handleAnswerSubmit(opt)} className="bg-slate-800 hover:bg-blue-600 hover:text-white border border-slate-700 p-3 rounded-xl text-left text-sm font-medium">
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        placeholder="Escriba su respuesta con precisión..."
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                        onKeyDown={(e) => e.key === 'Enter' && currentInput && handleAnswerSubmit(currentInput)}
                      />
                      <button onClick={() => currentInput && handleAnswerSubmit(currentInput)} disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl flex items-center justify-center">
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {clientStep === 'dashboard' && (
              <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900 border border-slate-800 p-6 rounded-2xl gap-4">
                  <div>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-medium">Expediente EE.UU. Generado Automáticamente</span>
                    <h3 className="text-2xl font-bold text-white mt-2">Expediente: {clientInfo.phone}_EXP_{new Date().toISOString().slice(0, 10).replace(/-/g, '')}.pdf</h3>
                    <p className="text-slate-400 text-sm mt-1">{formspreeStatus || 'Enviado automáticamente a pintubeservi@gmail.com'}</p>
                  </div>
                  <button onClick={() => setClientStep('chat')} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg">
                    <MessageSquare className="w-4 h-4" /> Consultar al Gestor Experto
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <h4 className="font-semibold text-white flex items-center gap-2"><FolderOpen className="w-5 h-5 text-blue-500" /> Documentos Consulares</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 border border-slate-700 rounded-xl">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <span className="text-sm font-medium">Pasaporte Vigente EE.UU. / RD</span>
                        </div>
                        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">Verificado</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                    <h4 className="font-semibold text-white flex items-center gap-2"><FileText className="w-5 h-5 text-blue-500" /> Resumen del Expediente</h4>
                    <div className="space-y-2 text-sm text-slate-300 bg-slate-800/40 p-4 rounded-xl border border-slate-700 max-h-48 overflow-y-auto">
                      <p><strong>Titular:</strong> {clientInfo.fullName}</p>
                      <p><strong>Teléfono ID:</strong> {clientInfo.phone}</p>
                      <p><strong>Ubicación:</strong> {clientInfo.city}, {clientInfo.country}</p>
                      {Object.entries(answers).map(([key, val], idx) => (
                        <div key={idx} className="border-t border-slate-700/50 pt-1 mt-1">
                          <span className="text-slate-400 capitalize">{key}:</span> <span className="text-white">{val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {clientStep === 'chat' && (
              <div className="flex-1 flex flex-col h-[650px]">
                <div className="bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">GM</div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">Gestor y Consultor Experto EE.UU.</h3>
                      <p className="text-xs text-emerald-400 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Disponible para responder cualquier inquietud</p>
                    </div>
                  </div>
                  <button onClick={() => setClientStep('dashboard')} className="text-xs bg-slate-800 text-white px-3 py-1.5 rounded-lg">Regresar al Expediente</button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-4 flex flex-col">
                  {messages.map((m, idx) => (
                    <div key={idx} className={`flex ${m.sender === 'client' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${m.sender === 'client' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'}`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
                  <input 
                    type="text"
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    placeholder="Consulte sobre visados, tiempos, costos, requisitos o citas consulares..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && sendClientMessage()}
                  />
                  <button onClick={sendClientMessage} className="bg-blue-600 text-white px-6 rounded-xl flex items-center justify-center"><Send className="w-5 h-5" /></button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'consultant-panel' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs text-slate-400 font-medium">Expedientes Activos</p>
                <p className="text-3xl font-bold text-white mt-1">42</p>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs text-slate-400 font-medium">Por Aprobar</p>
                <p className="text-3xl font-bold text-amber-400 mt-1">8</p>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs text-slate-400 font-medium">Enviados a Formspree</p>
                <p className="text-3xl font-bold text-emerald-400 mt-1">24</p>
              </div>
              <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl">
                <p className="text-xs text-slate-400 font-medium">Ingresos Mes</p>
                <p className="text-3xl font-bold text-blue-400 mt-1">$4,320 USD</p>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-lg font-bold text-white">Panel de Control y Búsqueda por Teléfono</h3>
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input 
                    type="text" 
                    placeholder="Buscar por teléfono o nombre..." 
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-xs text-slate-400 uppercase">
                      <th className="py-3 px-4">Teléfono (ID)</th>
                      <th className="py-3 px-4">Cliente</th>
                      <th className="py-3 px-4">Trámite EE.UU.</th>
                      <th className="py-3 px-4">Estado PDF</th>
                      <th className="py-3 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-800/60">
                    <tr>
                      <td className="py-4 px-4 font-mono text-blue-400">8095551234</td>
                      <td className="py-4 px-4 font-medium text-white">Carlos Martínez</td>
                      <td className="py-4 px-4 text-slate-300">Visa de Turista (<span className="text-blue-400 font-mono text-xs">DS-160</span>)</td>
                      <td className="py-4 px-4"><span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-xs">Enviado Formspree</span></td>
                      <td className="py-4 px-4 text-right">
                        <button onClick={() => setSelectedClientDetail({ name: 'Carlos Martínez', phone: '8095551234', form: 'DS-160' })} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium inline-flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" /> Revisar
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {selectedClientDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Expediente: {selectedClientDetail.phone}</h3>
                <p className="text-xs text-slate-400">Titular: {selectedClientDetail.name}</p>
              </div>
              <button onClick={() => setSelectedClientDetail(null)} className="text-slate-400 hover:text-white p-1"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                <p className="text-xs text-slate-400 font-medium">Archivo PDF generado:</p>
                <p className="font-mono text-xs text-emerald-400">{selectedClientDetail.phone}_EXP_20260729.pdf</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 p-2.5 rounded-lg text-xs font-medium hover:bg-emerald-600 hover:text-white flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> Aprobar Expediente
                </button>
                <button className="bg-blue-600/20 text-blue-400 border border-blue-500/30 p-2.5 rounded-lg text-xs font-medium hover:bg-blue-600 hover:text-white flex items-center justify-center gap-1">
                  <FileText className="w-4 h-4" /> Ver Formulario
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedClientDetail(null)} className="bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-medium">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
