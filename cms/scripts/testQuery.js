async function testSanityQueries() {
  const url = 'https://6nl927hv.api.sanity.io/v2023-01-01/data/query/production?query=' + encodeURIComponent('*[!(_type match "sanity.*")]{ _id, _type }');
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Sanity Query Status:', res.status);
    console.log('Total Documents Found:', data.result?.length);
    
    // Group by _type
    const types = {};
    data.result?.forEach(d => {
      types[d._type] = (types[d._type] || 0) + 1;
    });
    console.log('Document counts by type:', types);
  } catch (err) {
    console.error('Error fetching Sanity documents:', err.message);
  }
}

testSanityQueries();
