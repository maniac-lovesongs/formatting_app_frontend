const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // 👈🏽 your API endpoint goes here.
    createProxyMiddleware({
      target: 'http://localhost:5000', // 👈🏽 your API URL goes here.
      changeOrigin: true,
    })
  );
};