// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	app.use(
		'/rest',
		createProxyMiddleware({
			target: 'http://localhost:8080/gigover-sdk-2.6.0-SNAPSHOT/',
			changeOrigin: true
		})
	);
};
