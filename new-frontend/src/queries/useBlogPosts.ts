import { useQuery } from '@tanstack/react-query';
import request, { gql } from 'graphql-request';

export const BlogPosts = gql`
	query Blogs {
		blogs(orderBy: publishedAt_DESC) {
			id
			createdAt
			publishedAt
			slug
			title
			image {
				url
			}
			content {
				text
				html
			}
		}
	}
`;

export interface Blog {
	id: string;
	createdAt: string;
	publishedAt: string;
	slug: string;
	title: string;
	image: {
		url: string;
	};
	content: {
		text: string;
		html: string;
	};
}

export interface BlogsResponse {
	blogs: Blog[];
}

export const useBlogPosts = () => {
	const GraphQLEndpoint = import.meta.env.VITE_GRAPHCMS_CONTENT_URL;

	if (!GraphQLEndpoint) {
		throw new Error('GraphQLEndpoint is not defined.');
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data } = useQuery<BlogsResponse, any, any>({
		queryKey: ['Blogs'],
		queryFn: async () => {
			return await request(GraphQLEndpoint, BlogPosts);
		}
	});

	return {
		data
	};
};
