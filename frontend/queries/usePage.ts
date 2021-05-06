import { useQuery } from 'react-query';
import request, { gql } from 'graphql-request';
import { GraphQLEndpoint, Page } from '../pages/_app';
import {ColorKey} from '../styles/theme';

export const PageQuery = gql`
	query Page($input: PageWhereUniqueInput!) {
		page(where: $input) {
			id
			name
			slug
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

interface Asset {
	id: string;
	handle: string;
	fileName: string;
	width: number;
	height: number;
	url: string;
}

enum PageBlockType {
	Hero = 'Hero'
}

interface PageBlock {
	id: string;
	heading: string | null;
	content: string | null;
	image: Asset | null;
	pageBlockColor: ColorKey;
	blockType: PageBlockType;
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
