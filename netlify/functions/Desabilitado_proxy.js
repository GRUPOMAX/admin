const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const urls = [,
    // ... outras URLs
  ];

  try {
    const responses = await Promise.all(urls.map(url =>
      fetch(url, { headers: { 'X-Token': 'f521276c4128483a9ba0bdd6f2574408' } })
    ));

    const dataPromises = responses.map(async response => {
      if (!response.ok) {
        console.error(`Erro ao buscar dados de ${response.url}: ${response.statusText}`);
        return [];
      }
      const data = await response.json();
      return data;
    });

    const data = await Promise.all(dataPromises);

    const losData = data.flat().filter(equipamento => equipamento.status === 'LOS');

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify(losData)
    };
  } catch (error) {
    console.error('Erro ao buscar dados:', error.message);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
