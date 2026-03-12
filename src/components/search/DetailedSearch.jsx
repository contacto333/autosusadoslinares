import React, { useState } from 'react';
import { Search } from 'lucide-react';

const DetailedSearch = ({ onSearch, isLoading }) => {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [yearFrom, setYearFrom] = useState('');
    const [yearTo, setYearTo] = useState('');
    const [text, setText] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!brand.trim() || !model.trim() || !yearFrom.trim() || !yearTo.trim()) {
            setError('Marca, modelo y el rango de años son obligatorios.');
            return;
        }
        if (parseInt(yearFrom) > parseInt(yearTo)) {
            setError('El año desde no puede ser mayor al año hasta.');
            return;
        }
        setError('');
        onSearch({ brand, model, yearFrom, yearTo, text });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/20 mt-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                    <input 
                        className="w-full px-4 py-3 rounded-xl bg-white border-0 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                        placeholder="Marca (Ej: Toyota) *" 
                        value={brand} 
                        onChange={e => setBrand(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input 
                        className="w-full px-4 py-3 rounded-xl bg-white border-0 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                        placeholder="Modelo (Ej: Yaris) *" 
                        value={model} 
                        onChange={e => setModel(e.target.value)}
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <input 
                        type="number"
                        className="w-full px-4 py-3 rounded-xl bg-white border-0 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                        placeholder="Año desde *" 
                        value={yearFrom} 
                        onChange={e => setYearFrom(e.target.value)}
                        required
                    />
                    <input 
                        type="number"
                        className="w-full px-4 py-3 rounded-xl bg-white border-0 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                        placeholder="Año hasta *" 
                        value={yearTo} 
                        onChange={e => setYearTo(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input 
                        className="w-full px-4 py-3 rounded-xl bg-white border-0 text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
                        placeholder="Extras (Ej: rojo, full)" 
                        value={text} 
                        onChange={e => setText(e.target.value)}
                    />
                </div>
            </div>
            
            {error && <p className="text-red-300 mt-3 text-sm font-medium">{error}</p>}
            
            <div className="mt-4 flex justify-end">
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-blue-600 outline outline-2 outline-offset-2 outline-white text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md disabled:bg-blue-400 group"
                >
                    <Search className={`h-5 w-5 ${isLoading ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                    {isLoading ? 'Buscando en Mercado Libre...' : 'Buscar'}
                </button>
            </div>
        </form>
    );
};

export default DetailedSearch;
