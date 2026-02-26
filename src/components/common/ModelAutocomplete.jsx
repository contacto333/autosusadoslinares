import React, { useState, useEffect, useRef } from 'react';

const ModelAutocomplete = ({ brand, value, onChange, className }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [allModels, setAllModels] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const fetchModels = async () => {
            if (!brand) {
                setAllModels([]);
                return;
            }

            setLoading(true);
            try {
                // Try session storage first
                const cacheKey = `models_${brand.toLowerCase().replace(/\s+/g, '_')}`;
                const cached = sessionStorage.getItem(cacheKey);
                if (cached) {
                    setAllModels(JSON.parse(cached));
                    setLoading(false);
                    return;
                }

                const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(brand)}?format=json`);
                const data = await response.json();

                if (data.Results) {
                    const models = data.Results.map(item => item.Model_Name.trim().toUpperCase());
                    const uniqueModels = [...new Set(models)].sort();
                    setAllModels(uniqueModels);
                    sessionStorage.setItem(cacheKey, JSON.stringify(uniqueModels));
                }
            } catch (error) {
                console.error('Error fetching models:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchModels();
    }, [brand]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleInputChange = (e) => {
        const val = e.target.value;
        onChange({ target: { name: 'model', value: val } });

        if (val.length > 0) {
            const filtered = allModels
                .filter(model => model.toLowerCase().includes(val.toLowerCase()))
                .slice(0, 10);
            setSuggestions(filtered);
            setIsOpen(true);
        } else {
            setSuggestions(allModels.slice(0, 10));
            setIsOpen(true);
        }
    };

    const handleFocus = () => {
        if (allModels.length > 0) {
            const val = value || '';
            const filtered = allModels
                .filter(model => model.toLowerCase().includes(val.toLowerCase()))
                .slice(0, 10);
            setSuggestions(filtered);
            setIsOpen(true);
        }
    };

    const selectSuggestion = (suggestion) => {
        onChange({ target: { name: 'model', value: suggestion } });
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <input
                type="text"
                name="model"
                id="model"
                required
                disabled={!brand}
                className={className || "mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 border px-3 disabled:bg-gray-50 disabled:text-gray-400"}
                placeholder={!brand ? "Primero selecciona una marca" : "Ej: Hilux, Corolla..."}
                value={value}
                onChange={handleInputChange}
                onFocus={handleFocus}
                autoComplete="off"
            />
            {isOpen && suggestions.length > 0 && (
                <ul className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border border-gray-200">
                    {suggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-blue-600 hover:text-white text-gray-900 transition-colors"
                            onClick={() => selectSuggestion(suggestion)}
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
            {loading && (
                <div className="absolute z-50 mt-1 w-full bg-white p-2 text-xs text-gray-500 rounded-md shadow-sm border border-gray-100 italic">
                    Cargando modelos...
                </div>
            )}
        </div>
    );
};

export default ModelAutocomplete;
