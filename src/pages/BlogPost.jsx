import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, BookOpen } from 'lucide-react';
import { API_URL } from '../api';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        const staticPosts = ['articulo_dummy', 'camionetas_maule', 'guia_transferencia', 'autos_economicos_2026', 'primer_auto_chile'];

        if (staticPosts.includes(slug)) {
            // Cargar artículo estático desde carpeta public
            fetch(`/blog/${slug}.html`)
                .then(res => {
                    if (!res.ok) throw new Error('Error al cargar el archivo estático');
                    return res.text();
                })
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    const title = doc.querySelector('title')?.innerText || 'Artículo';
                    const bodyContent = doc.body.innerHTML;

                    let metadata = {
                        title: title,
                        content: bodyContent,
                        created_at: new Date().toISOString(),
                        excerpt: '',
                        cover_image: null
                    };

                    if (slug === 'camionetas_maule') {
                        metadata.created_at = '2026-02-27T15:00:00Z';
                        metadata.excerpt = 'Descubre cuáles son los modelos preferidos por los agricultores de la región del Maule para las faenas más exigentes.';
                        metadata.cover_image = '/blog/images/hilux.png';
                    } else if (slug === 'guia_transferencia') {
                        metadata.created_at = '2026-02-27T15:20:00Z';
                        metadata.excerpt = 'Toda la información legal y administrativa que necesitas para comprar o vender tu vehículo en la ciudad de Linares.';
                        metadata.cover_image = '/blog/images/notaria.png';
                    } else if (slug === 'autos_economicos_2026') {
                        metadata.created_at = '2026-02-28T20:00:00Z';
                        metadata.excerpt = 'Descubre los modelos que mejor equilibran precio, mantenimiento y ahorro de combustible para este año.';
                        metadata.cover_image = '/blog/images/swift.jpg';
                    } else if (slug === 'primer_auto_chile') {
                        metadata.created_at = '2026-03-01T11:00:00Z';
                        metadata.excerpt = 'Elegir tu primer vehículo es una decisión clave. Te mostramos los modelos más recomendados por su economía y confiabilidad.';
                        metadata.cover_image = '/blog/images/primer_auto_vibe.jpg';
                    } else {
                        metadata.excerpt = 'Este es un artículo de prueba cargado desde un archivo HTML estático en el servidor.';
                    }

                    setPost(metadata);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
            return;
        }

        fetch(`${API_URL}/api/blog/${slug}`)
            .then(res => { if (!res.ok) throw new Error('Artículo no encontrado'); return res.json(); })
            .then(data => { setPost(data); setLoading(false); })
            .catch(err => { setError(err.message); setLoading(false); });
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
                    <p className="mt-3 text-gray-500">Cargando artículo...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <BookOpen className="h-14 w-14 text-gray-300 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-gray-700 mb-2">Artículo no encontrado</h1>
                    <p className="text-gray-400 mb-6">{error || 'Este artículo no está disponible.'}</p>
                    <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                        <ArrowLeft className="h-4 w-4" /> Volver al Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Cover Image */}
            {post.cover_image && (
                <div className="w-full h-72 md:h-96 overflow-hidden relative">
                    <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
            )}

            {/* Article */}
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Back */}
                <Link
                    to="/blog"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-8 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al Blog
                </Link>

                {/* Header */}
                <header className="mb-8">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                        <Calendar className="h-4 w-4" />
                        <time>
                            {new Date(post.created_at).toLocaleDateString('es-CL', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </time>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                        {post.title}
                    </h1>
                    {post.excerpt && (
                        <p className="text-xl text-gray-500 leading-relaxed border-l-4 border-blue-500 pl-4">
                            {post.excerpt}
                        </p>
                    )}
                </header>

                {/* Divider */}
                <hr className="border-gray-200 mb-8" />

                {/* HTML Content */}
                <article
                    className="blog-content text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <Link
                        to="/blog"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Ver más artículos
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default BlogPost;
