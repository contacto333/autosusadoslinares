import React from 'react';
import { Zap, DollarSign, ShieldCheck } from 'lucide-react';

const CompraAutoExpress = () => {
    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex flex-col">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm mb-6">
                        <Zap className="h-5 w-5 text-yellow-400" />
                        <span className="text-sm font-semibold tracking-wide uppercase">Venta Rápida y Segura</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                        CompraAuto<span className="text-blue-300">Express</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Compramos tu auto al contado y en tiempo récord. Obtén la mejor tasación de Linares y recibe tu dinero en menos de 24 horas.
                    </p>
                    <a href="#contacto" className="inline-block bg-white text-blue-700 font-bold py-4 px-10 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-1 transition-all duration-300 text-lg">
                        Cotizar mi auto ahora
                    </a>
                </div>
            </div>

            {/* Features */}
            <div className="py-20 flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            ¿Por qué elegir nuestro servicio Express?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Simplificamos el proceso de venta para que no tengas que preocuparte por nada.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Feature 1 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 group">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Zap className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Venta Inmediata</h3>
                            <p className="text-gray-600 leading-relaxed">Olvídate de publicar, contestar llamadas y mostrar el auto a desconocidos. Te hacemos una oferta concreta en minutos tras la inspección.</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 group">
                            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <DollarSign className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Pago Seguro y Rápido</h3>
                            <p className="text-gray-600 leading-relaxed">Transferencia bancaria al instante o vale vista en el momento de la firma. Garantizamos tu tranquilidad financiera sin demoras.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-300 group">
                            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Trámites Incluidos</h3>
                            <p className="text-gray-600 leading-relaxed">Nuestro equipo legal se encarga de todo el papeleo notarial, de transferencia y regularización de multas de forma transparente.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to action */}
            <div id="contacto" className="bg-white py-20 border-t border-gray-100 mt-auto">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-gray-50 rounded-3xl p-10 border border-gray-100 shadow-sm">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        ¿Listo para evaluar tu vehículo?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Contáctanos directamente por WhatsApp enviando fotos y detalles de tu auto (marca, modelo, año y kilometraje) para recibir una pre-evaluación.
                    </p>
                    <a
                        href="https://wa.me/56900000000?text=Hola,%20me%20interesa%20vender%20mi%20auto%20por%20CompraAutoExpress"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-8 py-4 border-2 border-transparent text-lg font-bold rounded-xl text-white bg-green-500 hover:bg-green-600 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-300"
                    >
                        Contactar por WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CompraAutoExpress;
