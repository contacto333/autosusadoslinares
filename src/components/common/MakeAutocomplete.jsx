import React, { useState, useEffect, useRef } from 'react';

const MakeAutocomplete = ({ value, onChange, className }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [allMakes, setAllMakes] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const fetchMakes = async () => {
            setLoading(true);
            try {
                // Try to get from session storage first
                const cached = sessionStorage.getItem('nhtsa_makes');
                if (cached) {
                    setAllMakes(JSON.parse(cached));
                    setLoading(false);
                    return;
                }

                const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json');
                const data = await response.json();
                if (data.Results) {
                    const makes = data.Results.map(item => item.Make_Name.trim().toUpperCase());
                    const uniqueMakes = [...new Set(makes)].sort();
                    setAllMakes(uniqueMakes);
                    sessionStorage.setItem('nhtsa_makes', JSON.stringify(uniqueMakes));
                }
            } catch (error) {
                console.error('Error fetching makes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMakes();
    }, []);

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
        onChange({ target: { name: 'brand', value: val } });

        if (val.length > 1) {
            const filtered = allMakes
                .filter(make => make.toLowerCase().includes(val.toLowerCase()))
                .slice(0, 10);
            setSuggestions(filtered);
            setIsOpen(true);
        } else {
            setSuggestions([]);
            setIsOpen(false);
        }
    };

    const selectSuggestion = (suggestion) => {
        onChange({ target: { name: 'brand', value: suggestion } });
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <input
                type="text"
                name="brand"
                id="brand"
                required
                className={className || "mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 border px-3"}
                value={value}
                onChange={handleInputChange}
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
            {loading && value.length > 1 && suggestions.length === 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white p-2 text-xs text-gray-500 rounded-md shadow-sm border border-gray-100">
                    Cargando marcas...
                </div>
            )}
        </div>
    );
};

export default MakeAutocomplete;
