const { executeSearch, predictCategory, searchItems } = require('./server/services/mlService.cjs');

async function test() {
    console.log('Predicting category...');
    const cat = await predictCategory('Toyota Yaris 2020');
    console.log('Cat:', cat);
    
    console.log('Searching...');
    const items = await searchItems('Toyota Yaris 2020', cat);
    console.log('Items found:', items.length);
    if (items.length > 0) {
        console.log('First item:', items[0].title);
    }
    
    console.log('Executing full search...');
    const results = await executeSearch({ brand: 'Toyota', model: 'Yaris', year: '2020' });
    console.log('Full search results:', results.length);
    if (results.length > 0) {
        console.log('First result:', results[0].title, results[0].year);
    }
}

test();
