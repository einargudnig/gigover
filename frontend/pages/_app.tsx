import { ThemeProvider } from 'styled-components';
import 'normalize.css';
import '../styles/gigover.css';
import theme from '../styles/theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import request, { request as GraphQLRequest } from 'graphql-request';
import { DocumentNode } from 'graphql';
import { PagesQuery } from '../queries/usePages';
import App from 'next/app';
import { AppProps } from 'next/dist/pages/_app';
import { Navigation } from '../components/Navigation';

export const GraphQLEndpoint = process.env.GRAPHCMS_CONTENT_URL;

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryFn: async (context) => {
				const { queryKey } = context;
				return await request(GraphQLEndpoint, queryKey as string | DocumentNode);
			}
		}
	}
});

export interface GigoverAppProps extends AppProps {
	pages: Page[];
}

const GigoverApp = ({ Component, pageProps, pages }: GigoverAppProps) => {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<Navigation pages={pages} />
				<Component {...pageProps} />
			</ThemeProvider>
		</QueryClientProvider>
	);
};

export enum PageId {
	Frontpage = 'Frontpage',
	Pricing = 'Pricing',
	Help = 'Help',
	MobileApp = 'MobileApp',
	Features = 'Features',
	Learn = 'Learn'
}

export type Page = {
	id: string;
	name: string;
	slug: string;
	inNavigation: boolean;
	pageId: PageId;
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
