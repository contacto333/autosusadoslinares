import React, { useState, useEffect } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../api';
import DetailedSearch from '../components/search/DetailedSearch';

const Home = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // ML Search States
    const [mlResults, setMlResults] = useState(null);
    const [isSearchingML, setIsSearchingML] = useState(false);
    const [searchPerformed, setSearchPerformed] = useState(false);

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

    const handleSearch = async ({ brand, model, yearFrom, yearTo, text }) => {
        setIsSearchingML(true);
        setSearchPerformed(true);
        try {
            const queryParams = new URLSearchParams({ brand, model, yearFrom, yearTo });
            if (text) queryParams.append('text', text);
            
            const res = await fetch(`${API_URL}/api/search/ml?${queryParams.toString()}`);
            if (!res.ok) throw new Error('Error buscando');
            const data = await res.json();
            setMlResults(data);
        } catch (err) {
            console.error('Error fetching ML search', err);
            setMlResults([]);
        } finally {
            setIsSearchingML(false);
        }
    };

    const displayListings = searchPerformed ? (mlResults || []) : listings;

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

                    <DetailedSearch onSearch={handleSearch} isLoading={isSearchingML} />
                </div>
            </div>

            {/* Listings Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="search">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {searchPerformed ? 'Resultados de Búsqueda (Mercado Libre)' : 'Publicaciones Recientes'}
                    </h2>
                    {searchPerformed && (
                        <button 
                            onClick={() => { setSearchPerformed(false); setMlResults(null); }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                        >
                            Ver recientes locales
                        </button>
                    )}
                </div>

                {loading ? (
                    <p>Cargando anuncios...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {displayListings.map((item) => {
                            const isML = item.origin === 'MLC';
                            const CardWrapper = isML ? 'a' : Link;
                            const cardProps = isML 
                                ? { href: item.url, target: '_blank', rel: 'noopener noreferrer' }
                                : { to: `/auto/${item.id}` };

                            return (
                                <CardWrapper {...cardProps} key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 group block relative flex flex-col h-full">
                                    {isML && (
                                        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-full z-20 shadow-sm flex items-center gap-1">
                                            MercadoLibre <ExternalLink className="h-3 w-3" />
                                        </div>
                                    )}
                                <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative overflow-hidden h-48">
                                    {item.main_image ? (
                                        <img
                                            src={isML ? item.main_image : `${API_URL}${item.main_image}`}
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
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2" title={item.title}>{item.title}</h3>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-600 mb-2">${new Intl.NumberFormat('es-CL').format(item.price)}</p>
                                    <div className="flex items-center text-sm text-gray-500 mb-4 flex-wrap">
                                        <span>{new Intl.NumberFormat('es-CL').format(item.mileage || 0)} km</span>
                                        <span className="mx-2">•</span>
                                        <span>{item.year || 'N/A'}</span>
                                        <span className="mx-2">•</span>
                                        <span className="truncate max-w-[100px]">{item.brand || 'N/A'}</span>
                                    </div>
                                    <div className="mt-auto">
                                        <span className="block w-full text-center py-2 px-4 bg-gray-50 text-blue-600 font-medium rounded-lg group-hover:bg-blue-50 transition-colors text-sm">
                                            {isML ? 'Ver en Mercado Libre' : 'Ver Detalles'}
                                        </span>
                                    </div>
                                </div>
                            </CardWrapper>
                        );
                    })}
                    </div>
                )}
                {displayListings.length === 0 && !loading && (
                    <div className="text-center py-16 px-4">
                        <p className="text-gray-500 text-lg mb-2">No se encontraron autos.</p>
                        {searchPerformed && <p className="text-gray-400">Intenta afinar tu búsqueda de Mercado Libre.</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
