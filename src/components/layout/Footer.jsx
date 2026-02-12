import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">AutosLinares</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            La plataforma más confiable para comprar y vender vehículos en Linares y la región del Maule.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Enlaces Rápidos</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Inicio</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Buscar Autos</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Vender</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contacto</h4>
                        <ul className="space-y-2">
                            <li className="text-gray-500 text-sm">support@autoslinares.cl</li>
                            <li className="text-gray-500 text-sm">+56 9 1234 5678</li>
                            <div className="flex space-x-4 mt-4">
                                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-pink-600 transition-colors">
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </a>
                            </div>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} AutosLinares. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
