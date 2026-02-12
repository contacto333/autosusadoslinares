import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { API_URL } from '../api';

const Admin = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchListings = () => {
        fetch(`${API_URL}/api/admin/listings`) // Uses the admin endpoint
            .then(res => res.json())
            .then(data => {
                setListings(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este aviso?')) return;
        try {
            await fetch(`${API_URL}/api/admin/listings/${id}`, { method: 'DELETE' });
            fetchListings(); // Refresh
        } catch (err) {
            alert('Error al eliminar');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Administración</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {listings.map((item) => (
                        <li key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                                <p className="text-sm text-gray-500">
                                    ID: {item.id} | {item.status} | {new Date(item.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-900 p-2"
                            >
                                <Trash2 className="h-5 w-5" />
                            </button>
                        </li>
                    ))}
                    {listings.length === 0 && !loading && (
                        <li className="px-6 py-4 text-gray-500">No hay publicaciones.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Admin;
