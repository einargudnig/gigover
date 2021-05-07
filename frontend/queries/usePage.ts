import { useQuery } from 'react-query';
import request, { gql } from 'graphql-request';
import { GraphQLEndpoint } from '../pages/_app';
import { PageBlock } from '../models/PageBlock';
import { Page } from '../models/Page';

export const PageQuery = gql`
	query Page($input: PageWhereUniqueInput!) {
		page(where: $input) {
			id
			name
			slug
			pageId
			pageBlocks {
				heading
				content
				pageBlockColor
				image {
					id
					handle
					fileName
					width
					height
					url
				}
				blockType
			}
		}
	}
`;

interface PageInput {
	slug: string;
}

export type PageWithBlocks = Page & {
	pageBlocks: PageBlock[];
};

export interface PageWithBlocksResponse {
	page: PageWithBlocks;
}

export const usePage = (variables: PageInput) => {
	const { data } = useQuery<any, any, PageWithBlocksResponse>('Page', async () => {
		return await request(GraphQLEndpoint, PageQuery, variables);
	});

	return {
		data
	};
};
