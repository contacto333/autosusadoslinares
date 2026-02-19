import React, { useState } from 'react';
import { Upload, DollarSign, PenTool, Phone, User, Calendar, Gauge } from 'lucide-react';

import { API_URL } from '../api';
import { useNavigate } from 'react-router-dom';

const PublishPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        brand: '',
        model: '',
        year: '',
        price: '',
        mileage: '',
        description: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        password: '',
        images: []
    });

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

    const handleImageChange = (e) => {
        if (e.target.files) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...Array.from(e.target.files)]
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'images') {
                formData.images.forEach(image => {
                    data.append('images', image);
                });
            } else if (key === 'price' || key === 'mileage') {
                // Send raw number to backend (remove dots)
                data.append(key, formData[key].replace(/\./g, ''));
            } else {
                data.append(key, formData[key]);
            }
        });

        try {
            const response = await fetch(`${API_URL}/api/listings`, {
                method: 'POST',
                body: data
            });
            const result = await response.json();
            if (response.ok) {
                alert('¡Aviso publicado con éxito!');
                navigate('/');
            } else {
                alert('Error: ' + (result.error || 'Hubo un problema.'));
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error de conexión.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                        Publicar Aviso
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Completa el formulario para vender tu auto en Linares. Es gratis y rápido.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 divide-y divide-gray-200 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="space-y-6">

                    {/* Detalles del Vehículo */}
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Detalles del Vehículo</h3>
                        <p className="mt-1 text-sm text-gray-500">Información básica sobre el auto que vendes.</p>

                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

                            <div className="sm:col-span-6">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título del Anuncio</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <PenTool className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        required
                                        className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                                        placeholder="Ej: Toyota Hilux 2018 4x4 Diesel"
                                        value={formData.title}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Marca</label>
                                <input type="text" name="brand" id="brand" required className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 border px-3" value={formData.brand} onChange={handleChange} />
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modelo</label>
                                <input type="text" name="model" id="model" required className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 border px-3" value={formData.model} onChange={handleChange} />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="year" className="block text-sm font-medium text-gray-700">Año</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input type="text" name="year" id="year" required maxLength="4" className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border" value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value.replace(/\D/g, '') })} />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">Kilometraje</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Gauge className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input type="text" name="mileage" id="mileage" required className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border" placeholder="Ej: 50.000" value={formData.mileage} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio (CLP)</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input type="text" name="price" id="price" required className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border" placeholder="Ej: 10.500.000" value={formData.price} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                                <div className="mt-1">
                                    <textarea id="description" name="description" rows={3} className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3" placeholder="Detalles extra: estado de los neumáticos, mantenimientos al día, etc." value={formData.description} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fotos */}
                    <div className="pt-8">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Fotos</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Sube fotos claras de tu auto. (Máximo 5 fotos).
                        </p>
                        <div className="mt-6">
                            <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                                            <span>Sube un archivo</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={handleImageChange} />
                                        </label>
                                        <p className="pl-1">o arrastra y suelta</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                                    <p className="text-xs text-blue-500 mt-2">{formData.images.length} fotos seleccionadas</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contacto */}
                    <div className="pt-8">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Información de Contacto</h3>
                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">Nombre</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input type="text" name="contactName" id="contactName" required className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border" value={formData.contactName} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Teléfono / WhatsApp</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input type="tel" name="contactPhone" id="contactPhone" required className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border" placeholder="+56 9 1234 5678" value={formData.contactPhone} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" name="contactEmail" id="contactEmail" required className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 border px-3" value={formData.contactEmail} onChange={handleChange} />
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña (para editar después)</label>
                                <input type="password" name="password" id="password" required className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 border px-3" value={formData.password} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                </div>

                <div className="pt-5">
                    <div className="flex justify-end">
                        <button type="button" onClick={() => navigate('/')} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            {loading ? 'Publicando...' : 'Publicar Aviso'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};


export default PublishPage;
