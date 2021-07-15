import { useQuery } from 'react-query';
import request, { gql } from 'graphql-request';
import { GraphQLEndpoint } from '../pages/_app';

export const BlogPosts = gql`
	query Blogs {
		blogs(orderBy: publishedAt_ASC) {
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
	const { data } = useQuery<any, any, BlogsResponse>('Blogs', async () => {
		return await request(GraphQLEndpoint, BlogPosts);
	});

	return {
		data
	};
};
