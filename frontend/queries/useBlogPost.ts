import { useQuery } from 'react-query';
import request, { gql } from 'graphql-request';
import { GraphQLEndpoint } from '../pages/_app';
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
	const { data } = useQuery<any, any, BlogPostResponse>('Blog', async () => {
		return await request(GraphQLEndpoint, SingleBlogPost, {
			id: variables.id,
			slug: variables.slug
		});
	});

	return {
		data
	};
};
