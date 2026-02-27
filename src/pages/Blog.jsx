import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { API_URL } from '../api';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch(`${API_URL}/api/blog`)
            .then(res => { if (!res.ok) throw new Error('Error al cargar el blog'); return res.json(); })
            .then(data => { setPosts(data); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 rounded-2xl mb-4">
                        <BookOpen className="h-7 w-7" />
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Blog de AutosLinares</h1>
                    <p className="text-blue-100 text-lg max-w-xl mx-auto">
                        Consejos, noticias y guías para compradores y vendedores de vehículos en la región del Maule.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading && (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
                        <p className="mt-3 text-gray-500">Cargando artículos...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-20">
                        <p className="text-red-500">{error}</p>
                    </div>
                )}

                {!loading && !error && posts.length === 0 && (
                    <div className="text-center py-20">
                        <BookOpen className="h-14 w-14 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-600 mb-1">Todavía no hay artículos</h2>
                        <p className="text-gray-400">Vuelve pronto, estamos preparando contenido para ti.</p>
                    </div>
                )}

                {!loading && posts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map(post => (
                            <Link
                                key={post.id}
                                to={`/blog/${post.slug}`}
                                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                                {/* Cover */}
                                <div className="relative overflow-hidden h-48 bg-gradient-to-br from-blue-100 to-blue-200">
                                    {post.cover_image ? (
                                        <img
                                            src={post.cover_image}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <BookOpen className="h-12 w-12 text-blue-400" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {new Date(post.created_at).toLocaleDateString('es-CL', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </div>
                                    <h2 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
                                        {post.title}
                                    </h2>
                                    {post.excerpt && (
                                        <p className="text-sm text-gray-500 leading-relaxed flex-1 line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-1 text-blue-600 text-sm font-semibold mt-4">
                                        Leer artículo
                                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
