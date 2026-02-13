import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../api';

const Home = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetch(`${API_URL}/api/listings`)
            .then(res => res.json())
            .then(data => {
                setListings(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredListings = listings.filter(l =>
        l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.brand.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            {/* Hero Section */}
            <div className="relative bg-blue-600 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        className="w-full h-full object-cover opacity-20"
                        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
                        alt="Fondo de autos"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 mix-blend-multiply" />
                </div>
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
                        Encuentra tu próximo auto <br className="hidden sm:block" />
                        <span className="text-blue-200">en Linares</span>
                    </h1>
                    <p className="mt-6 text-xl text-blue-100 max-w-3xl">
                        La forma más fácil y segura de comprar y vender vehículos en la región.
                        Publica gratis y conecta con compradores locales al instante.
                    </p>

                    <div className="mt-10 max-w-xl">
                        <div className="relative rounded-full shadow-sm bg-white p-2 flex">
                            <div className="flex-grow flex items-center pl-4">
                                <Search className="h-5 w-5 text-gray-400 mr-3" />
                                <input
                                    type="text"
                                    className="block w-full border-0 focus:ring-0 text-gray-900 placeholder-gray-500 sm:text-sm outline-none"
                                    placeholder="Buscar por marca, modelo o año..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="flex-shrink-0 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors shadow-sm">
                                Buscar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Listings */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Publicaciones Recientes</h2>

                {loading ? (
                    <p>Cargando anuncios...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredListings.map((item) => (
                            <Link to={`/auto/${item.id}`} key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 group block">
                                <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative overflow-hidden h-48">
                                    {item.main_image ? (
                                        <img
                                            src={`${API_URL}${item.main_image}`}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-100">
                                            <span className="text-xs">Sin Foto</span>
                                        </div>
                                    )}
                                    {item.status === 'sold' && (
                                        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center pointer-events-none">
                                            <span className="text-white font-bold text-xl border-4 border-white px-2 py-1 transform -rotate-12 opacity-80">
                                                VENDIDO
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-600 mb-2">${new Intl.NumberFormat('es-CL').format(item.price)}</p>
                                    <div className="flex items-center text-sm text-gray-500 mb-4">
                                        <span>{new Intl.NumberFormat('es-CL').format(item.mileage || 0)} km</span>
                                        <span className="mx-2">•</span>
                                        <span>{item.year}</span>
                                        <span className="mx-2">•</span>
                                        <span>{item.brand}</span>
                                    </div>
                                    <span className="block w-full text-center py-2 px-4 bg-gray-50 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors text-sm">
                                        Ver Detalles
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                {filteredListings.length === 0 && !loading && (
                    <p className="text-gray-500 text-center py-10">No se encontraron autos.</p>
                )}
            </div>
        </div>
    );
};

export default Home;
