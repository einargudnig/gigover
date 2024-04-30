import { useQuery } from '@tanstack/react-query';
import request, { gql } from 'graphql-request';
import { PageBlock } from '../types';
import { Page } from '../types';

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
				features {
					title
					icon
					description
				}
				testimonials {
					testimonial
					name
					company
					image {
						id
						handle
						fileName
						width
						height
						url
					}
				}
			}
			pricePlans {
				name
				description
				monthlyPrice
				pricePlanFields {
					fieldKey
					fieldValue
				}
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
	const GraphQLEndpoint = import.meta.env.VITE_GRAPHCMS_CONTENT_URL;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data, isLoading } = useQuery<any, any, PageWithBlocksResponse>({
		queryKey: ['Page', variables],
		queryFn: async () => {
			return await request(GraphQLEndpoint, PageQuery, {
				input: {
					slug: variables.slug
				}
			});
		}
	});

	return {
		data,
		isLoading
	};
};
