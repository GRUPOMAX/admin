const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/clientesAtivos',
    createProxyMiddleware({
      target: 'http://apidoixc.nexusnerds.com.br:8080',
      changeOrigin: true,
    })
  );

  app.use(
    '/filtered_count',
    createProxyMiddleware({
      target: 'http://apidoixc.nexusnerds.com.br:8080',
      changeOrigin: true,
    })
  );
};
