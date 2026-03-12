const url = require('url');

/**
 * Generates various search queries based on user input.
 * @param {Object} params 
 * @param {string} params.brand 
 * @param {string} params.model 
 * @param {string|number} params.year - Can be a single year, or year_from/year_to. In this case, single year.
 * @param {string} [params.text] - Free text
 * @returns {string[]} Array of queries to attempt
 */
const generateQueries = ({ brand, model, year, text }) => {
    const base = `${brand} ${model}`.trim();
    const queries = [];
    
    // Most specific
    const parts = [brand, model, year, text].filter(Boolean);
    queries.push(parts.join(' '));
    
    // Without free text if provided
    if (text) {
        queries.push([brand, model, year].filter(Boolean).join(' '));
    }
    
    // Just brand and model
    if (year || text) {
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
        const response = await fetch(`https://api.mercadolibre.com/sites/MLC/category_predictor/predict?title=${encodeURIComponent(query)}`);
        if (!response.ok) return null;
        const data = await response.json();
        return data.id || null;
    } catch (err) {
        console.error('Predict Category Error:', err);
        return null;
    }
};

/**
 * Searches items in Mercado Libre API
 * @param {string} query 
 * @param {string} [categoryId] 
 * @returns {Promise<Object[]>}
 */
const searchItems = async (query, categoryId) => {
    try {
        let apiUrl = `https://api.mercadolibre.com/sites/MLC/search?q=${encodeURIComponent(query)}&condition=used`;
        if (categoryId) {
            apiUrl += `&category=${categoryId}`;
        }
        
        const response = await fetch(apiUrl);
        if (!response.ok) return [];
        const data = await response.json();
        return data.results || [];
    } catch (err) {
        console.error('Search Items Error:', err);
        return [];
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
    if (params.year && itemTitle.includes(params.year.toString())) score += 5;
    if (params.text && itemTitle.includes(params.text.toLowerCase())) score += 3;
    
    // Matching attributes is even better
    if (params.brand && item.brand.toLowerCase() === params.brand.toLowerCase()) score += 15;
    if (params.model && item.model.toLowerCase() === params.model.toLowerCase()) score += 15;
    if (params.year && item.year.toString() === params.year.toString()) score += 10;

    return score;
};

/**
 * Executes the full search flow
 * @param {Object} params 
 */
const executeSearch = async (params) => {
    const queries = generateQueries(params);
    
    const resultsLists = await Promise.all(queries.map(async (query) => {
        const categoryId = await predictCategory(query);
        return await searchItems(query, categoryId);
    }));

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
