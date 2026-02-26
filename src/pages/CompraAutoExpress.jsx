import React, { useState } from 'react';
import {
    Phone,
    MessageCircle,
    Check,
    Zap,
    ClipboardList,
    Banknote,
    ShieldCheck,
    Timer,
    Handshake,
    ThumbsUp,
    Mail
} from 'lucide-react';

const CompraAutoExpress = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        modelo: '',
        comentarios: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleWhatsAppSubmit = (e) => {
        e.preventDefault();
        const message = `Hola, me interesa vender mi auto por CompraAutoExpress.%0A%0A*Datos de la cotización:*%0A- Nombre: ${formData.nombre}%0A- Teléfono: ${formData.telefono}%0A- Marca, Modelo y Año: ${formData.modelo}%0A- Comentarios: ${formData.comentarios}`;
        window.open(`https://wa.me/56973301653?text=${message}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            {/* Custom Top Header */}
            <div className="bg-[#002B5B] text-white py-2 px-4 shadow-md">
                <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <Zap className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                        </div>
                        <span className="text-2xl font-black italic tracking-tighter">
                            CompraAuto<span className="text-yellow-500">Express</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-4 md:gap-8">
                        <div className="hidden sm:flex items-center gap-2">
                            <Phone className="h-5 w-5 text-blue-300" />
                            <span className="font-bold">¡Llámanos! <span className="text-lg">+56 9 7330 1653</span></span>
                        </div>
                        <a
                            href="https://wa.me/56973301653"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold py-2 px-4 rounded-md transition-all flex items-center gap-2 shadow-lg"
                        >
                            <MessageCircle className="h-4 w-4 fill-white" />
                            Escribenos por WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative h-[450px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                        alt="Background"
                        className="w-full h-full object-cover brightness-[0.4]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                    <div className="max-w-2xl">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-8 leading-tight">
                            ¡Vende tu auto <span className="text-yellow-500">HOY</span> y recibe el <span className="text-yellow-500">mejor pago!</span>
                        </h1>

                        <ul className="space-y-4 mb-10">
                            {[
                                "Cotización Inmediata",
                                "Dinero en el Acto",
                                "Transferencia Segura"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-white text-lg font-bold">
                                    <div className="bg-orange-500 rounded-full p-1">
                                        <Check className="h-4 w-4 text-white stroke-[4]" />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <a
                            href="#form"
                            className="inline-block bg-gradient-to-b from-orange-400 to-orange-600 text-white font-black py-4 px-10 rounded-xl shadow-[0_4px_0_rgb(194,65,12)] hover:translate-y-0.5 hover:shadow-[0_2px_0_rgb(194,65,12)] transition-all text-xl"
                        >
                            ¡COTIZA AHORA!
                        </a>
                    </div>
                </div>

                {/* Overlying Cars Image (Floating effect if possible, or just placed) */}
                <div className="hidden lg:block absolute right-0 bottom-0 w-1/2 z-10 translate-y-10">
                    <img
                        src="https://www.pngmart.com/files/10/White-SUV-Car-PNG-Transparent-Image.png"
                        alt="SUV"
                        className="w-full h-auto object-contain drop-shadow-2xl"
                    />
                </div>
            </div>

            {/* Trust Bar */}
            <div className="bg-gradient-to-b from-gray-100 to-gray-300 border-y border-gray-400 shadow-inner">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-wrap justify-center gap-8 md:gap-20">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/50 p-2 rounded shadow-sm">
                                <ClipboardList className="h-8 w-8 text-[#002B5B]" />
                            </div>
                            <span className="font-bold text-[#002B5B]">Sin Trámites Engorrosos</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/50 p-2 rounded shadow-sm">
                                <Banknote className="h-8 w-8 text-green-600" />
                            </div>
                            <span className="font-bold text-[#002B5B]">Pago al Instante</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white/50 p-2 rounded shadow-sm">
                                <ShieldCheck className="h-8 w-8 text-blue-600" />
                            </div>
                            <span className="font-bold text-[#002B5B]">Compra Segura</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div id="form" className="py-16 px-4">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#002B5B] mb-8">
                        Completa el formulario y obtén tu cotización al instante
                    </h2>

                    <form onSubmit={handleWhatsAppSubmit} className="space-y-4 text-left">
                        <div className="group">
                            <input
                                type="text"
                                name="nombre"
                                placeholder="Nombre"
                                required
                                value={formData.nombre}
                                onChange={handleChange}
                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                            />
                        </div>
                        <div className="group">
                            <input
                                type="tel"
                                name="telefono"
                                placeholder="Teléfono"
                                required
                                value={formData.telefono}
                                onChange={handleChange}
                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                            />
                        </div>
                        <div className="group">
                            <input
                                type="text"
                                name="modelo"
                                placeholder="Marca, Modelo y Año"
                                required
                                value={formData.modelo}
                                onChange={handleChange}
                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                            />
                        </div>
                        <div className="group">
                            <textarea
                                name="comentarios"
                                placeholder="Comentarios"
                                rows="4"
                                value={formData.comentarios}
                                onChange={handleChange}
                                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all resize-none"
                            ></textarea>
                        </div>

                        <div className="flex flex-col items-center gap-4 mt-8">
                            <button
                                type="submit"
                                className="bg-gradient-to-b from-[#25D366] to-[#128C7E] text-white font-black py-4 px-12 rounded-2xl shadow-[0_6px_0_rgb(18,140,126)] hover:translate-y-1 hover:shadow-[0_3px_0_rgb(18,140,126)] transition-all text-xl flex items-center gap-3 w-full sm:w-auto"
                            >
                                <MessageCircle className="h-7 w-7 fill-white" />
                                Obtener Cotización por WhatsApp
                            </button>
                            <p className="text-gray-500 font-medium">Te contactaremos por WhatsApp con tu oferta de inmediato.</p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Why Us Section */}
            <div className="bg-gray-50 py-20 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 relative">
                        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-40 h-[2px] bg-gray-200 -z-10"></div>
                        <h2 className="text-3xl md:text-4xl font-black text-[#002B5B] bg-gray-50 px-8 inline-block">
                            ¿Por qué elegirnos?
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-center group">
                            <div className="flex justify-center mb-6">
                                <div className="bg-white p-6 rounded-full shadow-lg border border-gray-100 transition-transform group-hover:scale-110">
                                    <Timer className="h-12 w-12 text-[#002B5B]" />
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-[#002B5B] mb-4">Rápido y Seguro</h3>
                            <p className="text-gray-600 font-medium">Venta en minutos, sin complicaciones.</p>
                        </div>

                        <div className="text-center group">
                            <div className="flex justify-center mb-6">
                                <div className="bg-white p-6 rounded-full shadow-lg border border-gray-100 transition-transform group-hover:scale-110">
                                    <Handshake className="h-12 w-12 text-orange-500" />
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-[#002B5B] mb-4">Mejor Precio</h3>
                            <p className="text-gray-600 font-medium">Tasamos tu auto con la mejor oferta.</p>
                        </div>

                        <div className="text-center group">
                            <div className="flex justify-center mb-6">
                                <div className="bg-white p-6 rounded-full shadow-lg border border-gray-100 transition-transform group-hover:scale-110">
                                    <ThumbsUp className="h-12 w-12 text-blue-600" />
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-[#002B5B] mb-4">Atención Profesional</h3>
                            <p className="text-gray-600 font-medium">Asesoría experta, trato transparente.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-[#002B5B] text-white py-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <img src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Footer map" className="w-full h-full object-cover" />
                </div>
                <div className="max-w-5xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col items-center gap-8">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="flex items-center gap-3">
                                <Mail className="h-6 w-6 text-gray-400 font-bold" />
                                <span className="font-bold text-lg">bnunezhenriquezz@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-6 w-6 text-gray-400" />
                                <span className="font-bold text-lg uppercase tracking-wide">+56 9 7330 1653</span>
                            </div>
                        </div>

                        <div className="w-full h-px bg-white/20"></div>

                        <div className="text-center text-sm text-gray-300">
                            <p>© 2024 CompraAutoExpress. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default CompraAutoExpress;
