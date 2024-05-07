import { useQuery } from '@tanstack/react-query';
import request, { gql } from 'graphql-request';
import { Blog } from './useBlogPosts';

export const SingleBlogPost = gql`
	query SingleBlogPost($id: ID!, $slug: String!) {
		blog(where: { id: $id, slug: $slug }) {
			id
			slug
			title
			createdAt
			publishedAt
			image {
				url
			}
			content {
				html
				text
			}
		}
	}
`;

export interface BlogPostVariables {
	id: string;
	slug: string;
}

export interface BlogPostResponse {
	blog: Blog;
}

export const useBlogPost = (variables: BlogPostVariables) => {
	const GraphQLEndpoint = import.meta.env.VITE_GRAPHCMS_CONTENT_URL;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { data, isLoading, isError } = useQuery<any, any, BlogPostResponse>({
		queryKey: ['Blog', variables],
		queryFn: async () => {
			return await request(GraphQLEndpoint, SingleBlogPost, {
				id: variables.id,
				slug: variables.slug
			});
		}
	});

	return {
		data,
		isLoading,
		isError
	};
};
