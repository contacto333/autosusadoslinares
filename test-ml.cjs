async function test() {
    try {
        const res2 = await fetch(`https://api.mercadolibre.com/sites/MLC/search?category=MLC1744&q=Toyota`);
        console.log('Status Search:', res2.status);
    } catch(e) {
        console.error(e);
    }
}
test();
