import React, { useEffect, useState } from 'react';
import { Trash2, Edit, Car, Eye, Plus, BookOpen, FileText, Globe, FilePen } from 'lucide-react';
import { API_URL } from '../api';
import { Link, useNavigate } from 'react-router-dom';
import BlogEditor from '../components/common/BlogEditor';

const Admin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('listings');

    // Listings state
    const [listings, setListings] = useState([]);
    const [listingsLoading, setListingsLoading] = useState(true);
    const [listingsError, setListingsError] = useState('');

    // Blog state
    const [blogPosts, setBlogPosts] = useState([]);
    const [blogLoading, setBlogLoading] = useState(false);
    const [blogError, setBlogError] = useState('');
    const [editorOpen, setEditorOpen] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
        }
    }, [user, navigate]);

    // --- Listings ---
    const fetchListings = () => {
        setListingsError('');
        fetch(`${API_URL}/api/admin/listings`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => { if (!res.ok) throw new Error('Error al cargar publicaciones'); return res.json(); })
            .then(data => { setListings(data); setListingsLoading(false); })
            .catch(err => { setListingsError(err.message); setListingsLoading(false); });
    };

    useEffect(() => { fetchListings(); }, []);

    const handleDeleteListing = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta publicación permanentemente?')) return;
        try {
            const response = await fetch(`${API_URL}/api/admin/listings/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) { fetchListings(); }
            else { const d = await response.json(); alert(d.error || 'Error al eliminar'); }
        } catch { alert('Error de conexión'); }
    };

    // --- Blog ---
    const fetchBlogPosts = () => {
        setBlogError('');
        setBlogLoading(true);
        fetch(`${API_URL}/api/admin/blog`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => { if (!res.ok) throw new Error('Error al cargar artículos'); return res.json(); })
            .then(data => { setBlogPosts(data); setBlogLoading(false); })
            .catch(err => { setBlogError(err.message); setBlogLoading(false); });
    };

    useEffect(() => { if (activeTab === 'blog') fetchBlogPosts(); }, [activeTab]);

    const handleDeletePost = async (id) => {
        if (!window.confirm('¿Eliminar este artículo permanentemente?')) return;
        try {
            const res = await fetch(`${API_URL}/api/admin/blog/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) fetchBlogPosts();
            else { const d = await res.json(); alert(d.error || 'Error al eliminar'); }
        } catch { alert('Error de conexión'); }
    };

    const openNewPost = () => { setEditingPost(null); setEditorOpen(true); };
    const openEditPost = (post) => { setEditingPost(post); setEditorOpen(true); };
    const handleEditorSaved = () => { setEditorOpen(false); fetchBlogPosts(); };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
                <p className="text-sm text-gray-500">Sesión como: {user?.email}</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
                <button
                    onClick={() => setActiveTab('listings')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'listings'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <Car className="h-4 w-4" />
                    Publicaciones
                    <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">{listings.length}</span>
                </button>
                <button
                    onClick={() => setActiveTab('blog')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'blog'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    <BookOpen className="h-4 w-4" />
                    Blog
                    <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full">{blogPosts.length}</span>
                </button>
            </div>

            {/* ===== TAB: LISTINGS ===== */}
            {activeTab === 'listings' && (
                <>
                    {listingsError && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
                            <p className="text-sm text-red-700">{listingsError}</p>
                        </div>
                    )}
                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vehículo</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {listings.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                        <Car className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-bold text-gray-900">{item.title}</div>
                                                        <div className="text-xs text-gray-500">{item.brand} {item.model} ({item.year})</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">
                                                    ${new Intl.NumberFormat('es-CL').format(item.price)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'sold' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                                    {item.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <Link to={`/auto/${item.id}`} className="inline-flex items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Ver">
                                                    <Eye className="h-5 w-5" />
                                                </Link>
                                                <Link to={`/editar/${item.id}`} className="inline-flex items-center p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all" title="Editar">
                                                    <Edit className="h-5 w-5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteListing(item.id)}
                                                    className="inline-flex items-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {listings.length === 0 && !listingsLoading && (
                            <div className="px-6 py-12 text-center text-gray-500">No hay publicaciones registradas.</div>
                        )}
                        {listingsLoading && (
                            <div className="px-6 py-12 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                                <p className="mt-2 text-gray-500">Cargando publicaciones...</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* ===== TAB: BLOG ===== */}
            {activeTab === 'blog' && (
                <>
                    <div className="flex justify-between items-center mb-4">
                        <p className="text-sm text-gray-500">Gestiona los artículos del blog</p>
                        <button
                            onClick={openNewPost}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow transition-all"
                        >
                            <Plus className="h-4 w-4" />
                            Nuevo artículo
                        </button>
                    </div>

                    {blogError && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 rounded-md">
                            <p className="text-sm text-red-700">{blogError}</p>
                        </div>
                    )}

                    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Artículo</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Fecha</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {blogPosts.map((post) => (
                                        <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {post.cover_image ? (
                                                        <img src={post.cover_image} alt="" className="h-12 w-20 object-cover rounded-lg flex-shrink-0" />
                                                    ) : (
                                                        <div className="h-12 w-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <FileText className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-bold text-gray-900">{post.title}</div>
                                                        <div className="text-xs text-gray-400 font-mono">/blog/{post.slug}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {post.published ? 'Publicado' : 'Borrador'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                {post.published && (
                                                    <Link to={`/blog/${post.slug}`} className="inline-flex items-center p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Ver en blog">
                                                        <Globe className="h-5 w-5" />
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => openEditPost(post)}
                                                    className="inline-flex items-center p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all"
                                                    title="Editar"
                                                >
                                                    <FilePen className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePost(post.id)}
                                                    className="inline-flex items-center p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {blogPosts.length === 0 && !blogLoading && (
                            <div className="px-6 py-16 text-center">
                                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 font-medium">No hay artículos todavía</p>
                                <p className="text-gray-400 text-sm">Crea tu primer artículo con el botón "Nuevo artículo"</p>
                            </div>
                        )}
                        {blogLoading && (
                            <div className="px-6 py-12 text-center">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                                <p className="mt-2 text-gray-500">Cargando artículos...</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Blog Editor Modal */}
            {editorOpen && (
                <BlogEditor
                    post={editingPost}
                    onClose={() => setEditorOpen(false)}
                    onSaved={handleEditorSaved}
                />
            )}
        </div>
    );
};

export default Admin;
