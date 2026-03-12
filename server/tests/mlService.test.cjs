const test = require('node:test');
const assert = require('node:assert');
const {
    generateQueries,
    mergeAndDeduplicate,
    calculateRelevanceScore,
    normalizeItem
} = require('../services/mlService.cjs');

test('generateQueries should generate multiple descending specific queries', () => {
    const queries = generateQueries({
        brand: 'Toyota',
        model: 'Yaris',
        yearFrom: 2015,
        yearTo: 2020,
        text: 'rojo'
    });
    
    assert.deepStrictEqual(queries, [
        'Toyota Yaris rojo',
        'Toyota Yaris'
    ]);
});

test('generateQueries should filter out empty fields', () => {
    const queries = generateQueries({
        brand: 'Kia',
        model: 'Rio',
        text: ''
    });
    
    assert.deepStrictEqual(queries, [
        'Kia Rio'
    ]);
});

test('mergeAndDeduplicate should remove duplicates by id', () => {
    const list1 = [
        { id: 'MLC1', title: 'Auto 1' },
        { id: 'MLC2', title: 'Auto 2' }
    ];
    const list2 = [
        { id: 'MLC2', title: 'Auto 2 duplicated' }, // different object, same id
        { id: 'MLC3', title: 'Auto 3' }
    ];
    
    const merged = mergeAndDeduplicate([list1, list2]);
    assert.strictEqual(merged.length, 3);
    assert.strictEqual(merged[0].id, 'MLC1');
    assert.strictEqual(merged[1].id, 'MLC2');
    assert.strictEqual(merged[1].title, 'Auto 2'); // Keeps first seen
    assert.strictEqual(merged[2].id, 'MLC3');
});

test('calculateRelevanceScore should give higher score to better matches', () => {
    const params = { brand: 'Mazda', model: '3', yearFrom: 2014, yearTo: 2016 };
    
    const itemPerfectMatch = {
        title: 'Mazda 3 2015 full equipo',
        brand: 'Mazda',
        model: '3',
        year: '2015'
    };
    
    const itemPartialMatch = {
        title: 'Mazda CX-5 2015',
        brand: 'Mazda',
        model: 'CX-5',
        year: '2015'
    };
    
    const itemOutOfRange = {
        title: 'Mazda 3 2010',
        brand: 'Mazda',
        model: '3',
        year: '2010'
    };
    
    const scorePerfect = calculateRelevanceScore(itemPerfectMatch, params);
    const scorePartial = calculateRelevanceScore(itemPartialMatch, params);
    const scoreOut = calculateRelevanceScore(itemOutOfRange, params);
    
    assert.ok(scorePerfect > scorePartial, 'Perfect match should have higher score');
    assert.ok(scorePerfect > scoreOut, 'In range should score higher than out of range');
});

test('normalizeItem should extract attributes correctly', () => {
    const rawMLItem = {
        id: 'MLC111',
        title: 'Subaru Impreza 2020',
        price: 15000000,
        currency_id: 'CLP',
        permalink: 'https://...',
        thumbnail: 'http://img.com/image-I.jpg',
        attributes: [
            { id: 'BRAND', value_name: 'Subaru' },
            { id: 'MODEL', value_name: 'Impreza' },
            { id: 'VEHICLE_YEAR', value_name: '2020' },
            { id: 'KILOMETERS', value_name: '45000 km' }
        ]
    };
    
    const normalized = normalizeItem(rawMLItem);
    
    assert.strictEqual(normalized.id, 'MLC111');
    assert.strictEqual(normalized.brand, 'Subaru');
    assert.strictEqual(normalized.year, '2020');
    assert.strictEqual(normalized.mileage, 45000);
    assert.strictEqual(normalized.main_image, 'http://img.com/image-O.jpg');
});
