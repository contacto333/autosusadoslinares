import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Camera, Car, MapPin, DollarSign, Calendar, FileText, User, Phone, Mail, Save, ArrowLeft, X, Plus, Trash2, Edit2 } from 'lucide-react';
import { API_URL } from '../api';
import MakeAutocomplete from '../components/common/MakeAutocomplete';
import ModelAutocomplete from '../components/common/ModelAutocomplete';
import PhotoEditorModal from '../components/common/PhotoEditorModal';

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

    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [editingImageIndex, setEditingImageIndex] = useState(null);
    const [editingExistingImage, setEditingExistingImage] = useState(null); // { id, url, index }
    const [pendingDeletes, setPendingDeletes] = useState([]); 

    useEffect(() => {
        const userJson = localStorage.getItem('user');
        const currentUser = userJson ? JSON.parse(userJson) : null;

        if (!currentUser) {
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
                    if (data.user_id !== currentUser.id && currentUser.role !== 'admin') {
                        alert('No tienes permiso para editar esta publicación');
                        navigate('/');
                        return;
                    }

                    setFormData({
                        title: data.title || '',
                        brand: data.brand || '',
                        model: data.model || '',
                        year: data.year || '',
                        price: data.price ? new Intl.NumberFormat('es-CL').format(data.price) : '',
                        mileage: data.mileage ? new Intl.NumberFormat('es-CL').format(data.mileage) : '',
                        description: data.description || '',
                        contactName: data.contact_name || '',
                        contactPhone: data.contact_phone || ''
                    });

                    setExistingImages(data.images || []);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Error al cargar la publicación');
                setLoading(false);
            });
    }, [id, navigate]);

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
        const files = Array.from(e.target.files);
        if (existingImages.length + newImages.length + files.length > 5) {
            alert('Máximo 5 fotos por publicación');
            return;
        }

        setNewImages(prev => [...prev, ...files]);

        // Create preview URLs
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviews]);
    };

    const removeExistingImage = (imgId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar esta foto?')) return;
        
        // Instead of immediate delete, we queue it
        setPendingDeletes(prev => [...prev, imgId]);
        setExistingImages(prev => prev.filter(img => img.id !== imgId));
    };

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => {
            const updated = prev.filter((_, i) => i !== index);
            // Revoke the URL to avoid memory leaks
            URL.revokeObjectURL(prev[index]);
            return updated;
        });
    };

    const handleEditExistingPhoto = async (img, index) => {
        setLoading(true);
        try {
            const response = await fetch(img.url);
            const blob = await response.blob();
            const file = new File([blob], `existing-${img.id}.jpg`, { type: 'image/jpeg' });
            setEditingExistingImage({ ...img, file, index });
        } catch (err) {
            console.error(err);
            alert('Error al procesar la imagen para editar');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveEditedImage = async (editedFile) => {
        if (editingExistingImage) {
            const imgId = editingExistingImage.id;
            // Add to pending deletes
            setPendingDeletes(prev => [...prev, imgId]);
            // Remove from existing
            setExistingImages(prev => prev.filter(img => img.id !== imgId));
            // Add as new
            setNewImages(prev => [...prev, editedFile]);
            setPreviewUrls(prev => [...prev, URL.createObjectURL(editedFile)]);
            
            setEditingExistingImage(null);
        } else {
            const updatedImages = [...newImages];
            updatedImages[editingImageIndex] = editedFile;
            setNewImages(updatedImages);

            // Update preview URL
            setPreviewUrls(prev => {
                const updated = [...prev];
                URL.revokeObjectURL(updated[editingImageIndex]);
                updated[editingImageIndex] = URL.createObjectURL(editedFile);
                return updated;
            });

            setEditingImageIndex(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            const uploadData = new FormData();
            uploadData.append('title', formData.title);
            uploadData.append('brand', formData.brand);
            uploadData.append('model', formData.model);
            uploadData.append('year', formData.year);
            uploadData.append('price', formData.price.toString().replace(/\./g, ''));
            uploadData.append('mileage', formData.mileage.toString().replace(/\./g, ''));
            uploadData.append('description', formData.description);
            uploadData.append('contactName', formData.contactName);
            uploadData.append('contactPhone', formData.contactPhone);

            newImages.forEach(file => {
                uploadData.append('images', file);
            });

            const response = await fetch(`${API_URL}/api/listings/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: uploadData
            });

            const data = await response.json();

            if (response.ok) {
                // After successful PUT, execute pending deletes
                if (pendingDeletes.length > 0) {
                    try {
                        await Promise.all(pendingDeletes.map(imgId => 
                            fetch(`${API_URL}/api/images/${imgId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                                }
                            })
                        ));
                    } catch (delErr) {
                        console.error('Error post-save deletions:', delErr);
                        // We still consider the save successful, but maybe notify?
                    }
                }

                alert('¡Publicación actualizada con éxito!');
                navigate(`/auto/${id}`);
            } else {
                setError(data.error || 'Error al actualizar');
            }
        } catch (err) {
            console.error(err);
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
                                <MakeAutocomplete
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                                <ModelAutocomplete
                                    brand={formData.brand}
                                    value={formData.model}
                                    onChange={handleChange}
                                    className="block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2.5 border"
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
                                    type="text"
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

                    {/* Photos */}
                    <div>
                        <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Fotos del Vehículo</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {/* Existing Images */}
                            {existingImages.map((img, index) => (
                                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden group">
                                    <img src={img.url} alt="Vehículo" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => handleEditExistingPhoto(img, index)}
                                            className="p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                            title="Esconder patente"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(img.id)}
                                            className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* New Previews */}
                            {previewUrls.map((url, index) => (
                                <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden group border-2 border-blue-500">
                                    <img src={url} alt="Nuevo preview" className="w-full h-full object-cover" />
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
                                            onClick={() => removeNewImage(index)}
                                            className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                            title="Eliminar"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Upload Button */}
                            {(existingImages.length + newImages.length < 5) && (
                                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                                    <Plus className="h-8 w-8 text-gray-400" />
                                    <span className="text-xs text-gray-500 mt-1">Agregar</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2 italic">Puedes tener hasta 5 fotos en total. Usa el icono de edición (<Edit2 className="inline h-3 w-3" />) en las fotos nuevas para ocultar la patente.</p>
                    </div>

                    {editingImageIndex !== null && (
                        <PhotoEditorModal 
                            imageFile={newImages[editingImageIndex]}
                            onSave={handleSaveEditedImage}
                            onCancel={() => setEditingImageIndex(null)}
                        />
                    )}

                    {editingExistingImage !== null && (
                        <PhotoEditorModal 
                            imageFile={editingExistingImage.file}
                            onSave={handleSaveEditedImage}
                            onCancel={() => setEditingExistingImage(null)}
                        />
                    )}

                    {/* Contact Info */}

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
