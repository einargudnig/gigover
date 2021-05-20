import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { DocumentContext, DocumentInitialProps } from 'next/dist/next-server/lib/utils';

class GigoverDocument extends Document<{ pageUrl: string }> {
	static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
		const sheet = new ServerStyleSheet();
		const originalRenderPage = ctx.renderPage;
		const request = ctx.req;

		try {
			ctx.renderPage = () =>
				originalRenderPage({
					enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />)
				});

			const initialProps = await Document.getInitialProps(ctx);

			return {
				...initialProps,
				pageUrl: request?.url,
				styles: (
					<>
						{initialProps.styles}
						{sheet.getStyleElement()}
					</>
				)
			} as DocumentInitialProps;
		} finally {
			sheet.seal();
		}
	}

	render() {
		const { pageUrl } = this.props;

		return (
			<Html lang="en">
				<Head>
					<link rel="icon" type="image/png" href="/favicon.png" />
					<meta property="og:type" content="website" />
					<meta
						property="og:description"
						content=" Gigover allows you to create projects, assign tasks seamlessly, keep track of what needs to be done versus what’s completed."
					/>
					<meta property="og:url" content={pageUrl} />
				</Head>
				<body>
					<Main />
					<div id={'go-portal'} />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default GigoverDocument;
