import React, { useState, useEffect } from 'react';
import { X, Upload, Eye, EyeOff, Save, Loader } from 'lucide-react';
import { API_URL } from '../../api';

const BlogEditor = ({ post, onClose, onSaved }) => {
    const [form, setForm] = useState({
        title: '',
        excerpt: '',
        content: '',
        published: false,
    });
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [previewMode, setPreviewMode] = useState(false);

    const token = localStorage.getItem('token');
    const isEditing = !!post;

    useEffect(() => {
        if (post) {
            setForm({
                title: post.title || '',
                excerpt: post.excerpt || '',
                content: post.content || '',
                published: !!post.published,
            });
            setCoverPreview(post.cover_image || null);
        }
    }, [post]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.content.trim()) {
            setError('El título y el contenido son obligatorios.');
            return;
        }
        setSaving(true);
        setError('');

        const data = new FormData();
        data.append('title', form.title);
        data.append('excerpt', form.excerpt);
        data.append('content', form.content);
        data.append('published', form.published ? '1' : '0');
        if (coverFile) data.append('cover_image', coverFile);

        const url = isEditing
            ? `${API_URL}/api/admin/blog/${post.id}`
            : `${API_URL}/api/admin/blog`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}` },
                body: data,
            });

            let json;
            try {
                json = await res.json();
            } catch {
                throw new Error('El servidor no respondió correctamente. Verifica que el servidor esté corriendo y reinícialo si es necesario.');
            }

            if (!res.ok) throw new Error(json.error || 'Error al guardar');
            onSaved();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {isEditing ? 'Editar artículo' : 'Nuevo artículo'}
                    </h2>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setPreviewMode(p => !p)}
                            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all"
                        >
                            {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            {previewMode ? 'Editor' : 'Preview'}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1">
                    {previewMode ? (
                        <div className="px-8 py-6">
                            {coverPreview && (
                                <img src={coverPreview} alt="Portada" className="w-full h-64 object-cover rounded-xl mb-6" />
                            )}
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{form.title || 'Sin título'}</h1>
                            {form.excerpt && (
                                <p className="text-lg text-gray-500 mb-6 border-l-4 border-blue-500 pl-4">{form.excerpt}</p>
                            )}
                            <div
                                className="prose prose-lg max-w-none text-gray-700"
                                dangerouslySetInnerHTML={{ __html: form.content }}
                            />
                        </div>
                    ) : (
                        <form id="blog-form" onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Título <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="ej: 5 Consejos para comprar tu primer auto usado"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {form.title && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Slug: <span className="font-mono text-blue-600">
                                            {form.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')}
                                        </span>
                                    </p>
                                )}
                            </div>

                            {/* Excerpt */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Extracto</label>
                                <textarea
                                    name="excerpt"
                                    value={form.excerpt}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="Breve descripción del artículo (aparece en las tarjetas del blog)"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Cover Image */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Imagen de portada</label>
                                <div className="flex items-start gap-4">
                                    {coverPreview ? (
                                        <div className="relative">
                                            <img src={coverPreview} alt="Portada" className="h-24 w-40 object-cover rounded-xl border border-gray-200" />
                                            <button
                                                type="button"
                                                onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center h-24 w-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                                            <Upload className="h-6 w-6 text-gray-400" />
                                            <span className="text-xs text-gray-500 mt-1">Subir imagen</span>
                                            <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                                        </label>
                                    )}
                                </div>
                            </div>

                            {/* HTML Content */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Contenido HTML <span className="text-red-500">*</span>
                                    <span className="ml-2 text-xs font-normal text-gray-400">(puedes usar etiquetas HTML como &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;img&gt;, etc.)</span>
                                </label>
                                <textarea
                                    name="content"
                                    value={form.content}
                                    onChange={handleChange}
                                    rows={16}
                                    placeholder="<h2>Introducción</h2>&#10;<p>Escribe tu artículo aquí...</p>"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-mono text-gray-800 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                />
                            </div>

                            {/* Published toggle */}
                            <div className="flex items-center gap-3 py-2">
                                <button
                                    type="button"
                                    onClick={() => setForm(p => ({ ...p, published: !p.published }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.published ? 'bg-green-500' : 'bg-gray-300'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${form.published ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                                <span className="text-sm font-medium text-gray-700">
                                    {form.published ? 'Publicado' : 'Borrador'}
                                </span>
                                {!form.published && (
                                    <span className="text-xs text-gray-400">(No visible en el blog público)</span>
                                )}
                            </div>
                        </form>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        form="blog-form"
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all disabled:opacity-60"
                    >
                        {saving ? (
                            <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {saving ? 'Guardando...' : (isEditing ? 'Guardar cambios' : 'Publicar artículo')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BlogEditor;
