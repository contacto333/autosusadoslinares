import React, { useState } from 'react';
import { API_URL } from '../api';
import { useNavigate } from 'react-router-dom';
import { Upload, DollarSign, PenTool, Phone, User, Calendar, Gauge, X, Edit2 } from 'lucide-react';
import MakeAutocomplete from '../components/common/MakeAutocomplete';
import ModelAutocomplete from '../components/common/ModelAutocomplete';
import PhotoEditorModal from '../components/common/PhotoEditorModal';

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

    const [editingImageIndex, setEditingImageIndex] = useState(null);

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
            const newFiles = Array.from(e.target.files);
            if (formData.images.length + newFiles.length > 5) {
                alert('Máximo 5 fotos');
                return;
            }
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newFiles]
            }));
        }
    };

    const removeImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSaveEditedImage = (editedFile) => {
        const updatedImages = [...formData.images];
        updatedImages[editingImageIndex] = editedFile;
        setFormData(prev => ({ ...prev, images: updatedImages }));
        setEditingImageIndex(null);
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
                                <MakeAutocomplete
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 border px-3"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="model" className="block text-sm font-medium text-gray-700">Modelo</label>
                                <ModelAutocomplete
                                    brand={formData.brand}
                                    value={formData.model}
                                    onChange={handleChange}
                                    className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 border px-3"
                                />
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
                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {formData.images.map((image, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group border border-gray-200">
                                    <img 
                                        src={URL.createObjectURL(image)} 
                                        alt={`Preview ${index}`} 
                                        className="w-full h-full object-cover" 
                                        onLoad={(e) => URL.revokeObjectURL(e.target.src)} // Clean up URL
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setEditingImageIndex(index)}
                                            className="p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                            title="Esconder patente"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                            title="Eliminar"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {formData.images.length < 5 && (
                                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                                    <Upload className="h-8 w-8 text-gray-400" />
                                    <span className="text-xs text-gray-500 mt-1">Sube un archivo</span>
                                    <input 
                                        id="file-upload" 
                                        name="file-upload" 
                                        type="file" 
                                        className="hidden" 
                                        multiple 
                                        accept="image/*" 
                                        onChange={handleImageChange} 
                                    />
                                </label>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-3 italic">
                            Haz clic en el icono de edición (<Edit2 className="inline h-3 w-3" />) para ocultar la patente antes de publicar.
                        </p>
                    </div>

                    {editingImageIndex !== null && (
                        <PhotoEditorModal 
                            imageFile={formData.images[editingImageIndex]}
                            onSave={handleSaveEditedImage}
                            onCancel={() => setEditingImageIndex(null)}
                        />
                    )}

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
