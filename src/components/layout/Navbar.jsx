import React, { useState } from 'react';
import { Menu, X, Car, PlusCircle, User, LogOut, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <Car className="h-8 w-8 text-blue-600" />
                            <span className="font-bold text-xl tracking-tight text-gray-900">
                                Autos<span className="text-blue-600">Linares</span>
                            </span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        <Link
                            to="/publicar"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-md hover:shadow-lg"
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Vender mi Auto
                        </Link>

                        {user?.role === 'admin' && (
                            <Link
                                to="/admin"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Panel Admin
                            </Link>
                        )}

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700 hidden lg:block">
                                    Hola, {user.email.split('@')[0]}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                    title="Cerrar Sesión"
                                >
                                    <LogOut className="h-6 w-6" />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="p-2 text-gray-500 hover:text-blue-600 transition-colors" title="Iniciar Sesión">
                                <User className="h-6 w-6" />
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden animate-fade-in-down">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-b border-gray-100 shadow-lg">
                        <Link
                            to="/publicar"
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            onClick={() => setIsOpen(false)}
                        >
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Vender mi Auto
                        </Link>
                        {user?.role === 'admin' && (
                            <Link
                                to="/admin"
                                className="flex items-center px-4 py-2 text-base font-medium text-blue-600 hover:bg-blue-50 rounded-md"
                                onClick={() => setIsOpen(false)}
                            >
                                <ShieldCheck className="mr-3 h-5 w-5" />
                                Panel de Administración
                            </Link>
                        )}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                                >
                                    <LogOut className="mr-3 h-5 w-5" />
                                    Cerrar Sesión
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex items-center w-full px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-50 rounded-md"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <User className="mr-3 h-5 w-5" />
                                    Iniciar Sesión
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
