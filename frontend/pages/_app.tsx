import { ThemeProvider } from 'styled-components';
import 'normalize.css';
import '../styles/gigover.css';
import theme from '../styles/theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { request as GraphQLRequest } from 'graphql-request';
import { PagesQuery } from '../queries/usePages';
import App from 'next/app';
import { AppProps } from 'next/dist/pages/_app';
import { Navigation } from '../components/Navigation';
import { Page } from '../models/Page';
import {Footer} from '../components/Footer';

export const GraphQLEndpoint = process.env.GRAPHCMS_CONTENT_URL;

const queryClient = new QueryClient();

export interface GigoverAppProps extends AppProps {
	pages: Page[];
}

const GigoverApp = ({ Component, pageProps, pages }: GigoverAppProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<Navigation pages={pages} />
				<Component {...pageProps} />
				<Footer pages={pages} />
			</ThemeProvider>
		</QueryClientProvider>
	);
};

interface PageResponse {
	pages: Page[];
}

GigoverApp.getInitialProps = async (appContext) => {
	const appProps = await App.getInitialProps(appContext);
	const response = await GraphQLRequest<PageResponse>(GraphQLEndpoint, PagesQuery);

	if (!response.pages) {
		throw new Error('Could not load pages');
	}

	return {
		...appProps,
		pages: response.pages
	};
};

export default GigoverApp;
