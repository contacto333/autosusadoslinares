const url = require('url');

/**
 * Generates various search queries based on user input.
 * @param {Object} params 
 * @param {string} params.brand 
 * @param {string} params.model 
 * @param {string|number} [params.yearFrom] 
 * @param {string|number} [params.yearTo] 
 * @param {string} [params.text] - Free text
 * @returns {string[]} Array of queries to attempt
 */
const generateQueries = ({ brand, model, yearFrom, yearTo, text }) => {
    const base = `${brand} ${model}`.trim();
    const queries = [];
    
    // Most specific
    const parts = [brand, model, text].filter(Boolean);
    queries.push(parts.join(' '));
    
    // Without free text if provided
    if (text) {
        queries.push([brand, model].filter(Boolean).join(' '));
    }
    
    // Just brand and model
    if (text || yearFrom || yearTo) {
        queries.push(base);
    }
    
    // Deduplicate
    return [...new Set(queries)];
};

/**
 * Gets category prediction from Mercado Libre API
 * @param {string} query 
 * @returns {Promise<string|null>} category_id
 */
const predictCategory = async (query) => {
    try {
        const response = await fetch(`https://api.mercadolibre.com/sites/MLC/domain_discovery/search?limit=1&q=${encodeURIComponent(query)}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data[0]?.category_id || null;
    } catch (err) {
        console.error('Predict Category Error:', err);
        return null;
    }
};

/**
 * Searches items in Mercado Libre API
 * @param {string} query 
 * @param {string} [categoryId] 
 * @param {Object} [dateRange]
 * @returns {Promise<Object[]>}
 */
const searchItems = async (query, categoryId, { yearFrom, yearTo }) => {
    try {
        let apiUrl = `https://api.mercadolibre.com/sites/MLC/search?q=${encodeURIComponent(query)}&condition=used`;
        if (categoryId) {
            apiUrl += `&category=${categoryId}`;
        }
        
        // Agregar filtro de año si ambos existen
        if (yearFrom && yearTo) {
            apiUrl += `&VEHICLE_YEAR=${yearFrom}-${yearTo}`;
        }

        const headers = process.env.ML_ACCESS_TOKEN ? {
            'Authorization': `Bearer ${process.env.ML_ACCESS_TOKEN}`
        } : {};
        
        const response = await fetch(apiUrl, { headers });
        const data = await response.json();
        if (!response.ok) {
            if (response.status === 403) {
                console.warn('API de Mercado Libre bloqueó la solicitud (403 Forbidden). Puede requerirse un ML_ACCESS_TOKEN válido.');
            }
            throw new Error(data.message || 'Error from ML API');
        }
        return data.results || [];
    } catch (err) {
        console.error('Search Items Error:', err.message);
        throw err;
    }
};

/**
 * Merges and deduplicates item lists based on item id
 * @param {Object[][]} resultsList Array of result arrays
 * @returns {Object[]}
 */
const mergeAndDeduplicate = (resultsList) => {
    const map = new Map();
    for (const results of resultsList) {
        for (const item of results) {
            if (!map.has(item.id)) {
                map.set(item.id, item);
            }
        }
    }
    return Array.from(map.values());
};

/**
 * Normalizes a Mercado Libre item to our app format
 * @param {Object} item 
 * @returns {Object}
 */
const normalizeItem = (item) => {
    const brandAttr = item.attributes?.find(a => a.id === 'BRAND')?.value_name || '';
    const modelAttr = item.attributes?.find(a => a.id === 'MODEL')?.value_name || '';
    const yearAttr = item.attributes?.find(a => a.id === 'VEHICLE_YEAR')?.value_name || '';
    const mileageAttr = item.attributes?.find(a => a.id === 'KILOMETERS')?.value_name || '';

    // Extaer kilometraje como número
    const mileageMatch = typeof mileageAttr === 'string' ? mileageAttr.match(/\d+/g) : null;
    const mileage = mileageMatch ? parseInt(mileageMatch.join(''), 10) : 0;

    return {
        id: item.id,
        title: item.title,
        price: item.price,
        currency_id: item.currency_id,
        year: yearAttr,
        brand: brandAttr,
        model: modelAttr,
        mileage: mileage,
        main_image: item.thumbnail ? item.thumbnail.replace(/-I\.jpg$/, '-O.jpg') : null, // Intento de imagen original
        url: item.permalink,
        location: item.location?.city?.name || item.address?.city_name || 'Desconocido',
        origin: 'MLC'
    };
};

/**
 * Calculates a basic relevance score
 * @param {Object} item 
 * @param {Object} params 
 * @returns {number}
 */
const calculateRelevanceScore = (item, params) => {
    let score = 0;
    const itemTitle = item.title.toLowerCase();
    
    if (params.brand && itemTitle.includes(params.brand.toLowerCase())) score += 10;
    if (params.model && itemTitle.includes(params.model.toLowerCase())) score += 10;
    
    // Check if item.year falls within range
    const parsedYear = parseInt(item.year, 10);
    if (!isNaN(parsedYear)) {
        if (params.yearFrom && params.yearTo) {
            if (parsedYear >= parseInt(params.yearFrom, 10) && parsedYear <= parseInt(params.yearTo, 10)) {
                score += 15;
            } else {
                score -= 20; // Penalización por estar fuera de rango
            }
        }
    }
    
    if (params.text && itemTitle.includes(params.text.toLowerCase())) score += 3;
    
    // Matching attributes is even better
    if (params.brand && item.brand.toLowerCase() === params.brand.toLowerCase()) score += 15;
    if (params.model && item.model.toLowerCase() === params.model.toLowerCase()) score += 15;

    return score;
};

/**
 * Executes the full search flow
 * @param {Object} params 
 */
const executeSearch = async (params) => {
    const queries = generateQueries(params);
    let apiError = null;
    
    const resultsLists = await Promise.all(queries.map(async (query) => {
        const categoryId = await predictCategory(query);
        try {
            return await searchItems(query, categoryId, { yearFrom: params.yearFrom, yearTo: params.yearTo });
        } catch (err) {
            apiError = err.message;
            return [];
        }
    }));

    if (apiError && resultsLists.every(list => list.length === 0)) {
        throw new Error(apiError);
    }

    const deduplicated = mergeAndDeduplicate(resultsLists);
    
    const normalized = deduplicated.map(normalizeItem);
    
    const withScores = normalized.map(item => ({
        ...item,
        score: calculateRelevanceScore(item, params)
    }));

    // Sort by score desc
    withScores.sort((a, b) => b.score - a.score);

    // Limit to top 50
    return withScores.slice(0, 50);
};

module.exports = {
    generateQueries,
    predictCategory,
    searchItems,
    mergeAndDeduplicate,
    normalizeItem,
    calculateRelevanceScore,
    executeSearch
};
