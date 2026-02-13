import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Phone, ArrowLeft, Calendar, Gauge, Tag, MapPin } from 'lucide-react';
import { API_URL } from '../api';

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/listings/${id}`)
            .then(res => res.json())
            .then(data => {
                setCar(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="p-10 text-center">Cargando...</div>;
    if (!car || car.error) return <div className="p-10 text-center">Auto no encontrado.</div>;

    const mainImage = car.images && car.images.length > 0 ? car.images[0].url : null;
    const otherImages = car.images ? car.images.slice(1) : [];

    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    const isOwner = user && (user.id === car.user_id || user.role === 'admin');

    const handleToggleStatus = async () => {
        if (!window.confirm('¿Estás seguro de cambiar el estado de esta publicación?')) return;
        try {
            const newStatus = car.status === 'available' ? 'sold' : 'available';
            const response = await fetch(`${API_URL}/api/listings/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (response.ok) {
                setCar({ ...car, status: newStatus });
            } else {
                alert('Error al actualizar estado');
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
            </Link>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
                <div className="lg:flex">
                    {/* Gallery */}
                    <div className="lg:w-3/5 p-1 bg-gray-50">
                        <div className="aspect-w-16 aspect-h-10 bg-gray-200 rounded-lg overflow-hidden mb-2">
                            {mainImage ? (
                                <img src={`${API_URL}${mainImage}`} alt={car.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-96 bg-gray-200 text-gray-400">Sin imagen</div>
                            )}
                            {car.status === 'sold' && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center pointer-events-none z-10">
                                    <span className="text-white font-bold text-4xl transform -rotate-12 border-4 border-white px-6 py-3 opacity-90">
                                        VENDIDO
                                    </span>
                                </div>
                            )}
                        </div>
                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-2">
                            {otherImages.map((img, idx) => (
                                <div key={idx} className="aspect-w-16 aspect-h-10 bg-gray-200 rounded-lg overflow-hidden">
                                    <img src={`${API_URL}${img.url}`} alt={`Foto ${idx + 2}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="lg:w-2/5 p-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{car.title}</h1>
                                <p className="text-sm text-gray-500 mb-4">Publicado: {new Date(car.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {car.status === 'available' ? 'Disponible' : car.status}
                            </span>
                        </div>

                        <div className="text-4xl font-bold text-blue-600 mb-8">
                            ${new Intl.NumberFormat('es-CL').format(car.price)}
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center text-gray-600">
                                <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Año</p>
                                    <p className="font-medium">{car.year}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Gauge className="h-5 w-5 mr-3 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Kilometraje</p>
                                    <p className="font-medium">{new Intl.NumberFormat('es-CL').format(car.mileage)} km</p>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Tag className="h-5 w-5 mr-3 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Marca</p>
                                    <p className="font-medium">{car.brand}</p>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Tag className="h-5 w-5 mr-3 text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500">Modelo</p>
                                    <p className="font-medium">{car.model}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-6 mb-8">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Descripción</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {car.description}
                            </p>
                        </div>


                        {isOwner && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                                <h3 className="text-lg font-bold text-yellow-800 mb-3">Gestión de Publicación</h3>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => navigate(`/editar/${id}`)}
                                        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        Editar Publicación
                                    </button>
                                    <button
                                        onClick={handleToggleStatus}
                                        className={`px-5 py-2.5 rounded-lg font-medium text-white transition-colors shadow-sm ${car.status === 'available'
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-green-600 hover:bg-green-700'
                                            }`}
                                    >
                                        {car.status === 'available' ? 'Marcar como Vendido' : 'Marcar como Disponible'}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="bg-blue-50 rounded-xl p-6">
                            <h3 className="text-lg font-medium text-blue-900 mb-4">Contacto del Vendedor</h3>
                            <div className="flex items-center mb-6">
                                <div className="h-10 w-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-xl mr-4">
                                    {(car.contact_name || 'U').charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{car.contact_name}</p>
                                    <p className="text-sm text-gray-500">Vendedor</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <a
                                    href={`https://wa.me/${car.contact_phone.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block w-full text-center bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center"
                                >
                                    <Phone className="h-5 w-5 mr-2" />
                                    WhatsApp
                                </a>
                                <a
                                    href={`tel:${car.contact_phone}`}
                                    className="block w-full text-center bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-lg transition-colors"
                                >
                                    Llamar ahora
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CarDetails;
