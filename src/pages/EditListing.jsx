import React, { useState, useEffect } from 'react';
import { Camera, Car, MapPin, DollarSign, Calendar, FileText, User, Phone, Mail, Save, ArrowLeft } from 'lucide-react';
import { API_URL } from '../api';
import { useNavigate, useParams, Link } from 'react-router-dom';

const EditListing = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // User check
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    const [formData, setFormData] = useState({
        title: '',
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        price: '',
        mileage: '',
        description: '',
        contactName: '',
        contactPhone: '',
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Fetch existing data
        fetch(`${API_URL}/api/listings/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    // Check ownership (simple client-side check, backend should also verify)
                    if (data.user_id !== user.id && user.role !== 'admin') {
                        alert('No tienes permiso para editar esta publicación');
                        navigate('/');
                        return;
                    }

                    setFormData({
                        title: data.title,
                        brand: data.brand,
                        model: data.model,
                        year: data.year,
                        price: new Intl.NumberFormat('es-CL').format(data.price),
                        mileage: new Intl.NumberFormat('es-CL').format(data.mileage),
                        description: data.description,
                        contactName: data.contact_name,
                        contactPhone: data.contact_phone
                    });
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Error al cargar la publicación');
                setLoading(false);
            });
    }, [id, user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Handle number formatting for price and mileage
        if (name === 'price' || name === 'mileage') {
            // Remove non-numeric characters to get raw number
            const rawValue = value.replace(/\D/g, '');
            // Format for display (Chilean peso style: 1.000.000)
            const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

            setFormData(prev => ({ ...prev, [name]: formattedValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/listings/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Although backend MVP might not fully check this yet
                },
                body: JSON.stringify({
                    ...formData,
                    price: formData.price.replace(/\./g, ''),
                    mileage: formData.mileage.replace(/\./g, '')
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert('¡Publicación actualizada con éxito!');
                navigate(`/auto/${id}`);
            } else {
                setError(data.error || 'Error al actualizar');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Cargando...</div>;
    if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to={`/auto/${id}`} className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancelar y volver
            </Link>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
                    <h1 className="text-2xl font-bold text-white flex items-center">
                        <Car className="mr-3 h-6 w-6" />
                        Editar Publicación
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Vehicle Details */}
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Detalles del Vehículo</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título del Anuncio</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Precio (CLP)</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="price"
                                        required
                                        className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border"
                                        value={formData.price}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                                <input
                                    type="text"
                                    name="brand"
                                    required
                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border"
                                    value={formData.brand}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                                <input
                                    type="text"
                                    name="model"
                                    required
                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border"
                                    value={formData.model}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="year"
                                        maxLength="4"
                                        required
                                        className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value.replace(/\D/g, '') })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kilometraje</label>
                                <input
                                    type="number"
                                    name="mileage"
                                    required
                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border"
                                    value={formData.mileage}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    name="description"
                                    rows={4}
                                    required
                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Información de Contacto</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Contacto</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="contactName"
                                        required
                                        className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border"
                                        value={formData.contactName}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono / WhatsApp</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="contactPhone"
                                        required
                                        className="block w-full pl-10 border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border"
                                        value={formData.contactPhone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {submitting ? 'Guardando...' : (
                                <>
                                    <Save className="mr-2 h-5 w-5" />
                                    Guardar Cambios
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditListing;
