// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	app.use(
		'/rest',
		createProxyMiddleware({
			//target: 'http://localhost:8080/gigover-sdk-2.7.0-SNAPSHOT/',
			target: 'https://rest.gigover.com/',
			changeOrigin: true
		})
	);
};
