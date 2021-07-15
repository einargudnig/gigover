import React from 'react';
import request from 'graphql-request';
import { Blog } from '../../../queries/useBlogPosts';
import { HeadTitle } from '../../../components/HeadTitle';
import { PageBlock } from '../../../components/PageContainer';
import { BlogPostResponse, BlogPostVariables, SingleBlogPost } from '../../../queries/useBlogPost';
import { GraphQLEndpoint } from '../../_app';
import { BlogArticle } from '../../../components/blog/BlogArticle';
import { PageBlockWithBackground } from '../../../components/PageContainerWithBackground';

export interface BlogProps {
	blog: Blog | null;
}

const SingleBlog = ({ blog }: BlogProps): JSX.Element => {
	if (blog === null) {
		throw new Error('Blog post not found');
	}

	return (
		<>
			<HeadTitle title={blog.title} description={blog.content.text.substr(0, 150)} />
			<PageBlockWithBackground imageUrl={blog.image.url}>
				<h4 style={{ marginTop: 60, marginBottom: -24 }}>By the Gigover Team</h4>
				<h1 style={{ maxWidth: '70%' }}>{blog.title}</h1>
			</PageBlockWithBackground>
			<PageBlock color={'white'}>
				<BlogArticle dangerouslySetInnerHTML={{ __html: blog.content.html }} />
			</PageBlock>
		</>
	);
};

export async function getServerSideProps(context) {
	const blogs = await request<BlogPostResponse, BlogPostVariables>(
		GraphQLEndpoint,
		SingleBlogPost,
		{
			id: context.params.blogId,
			slug: context.params.slug
		}
	);

	return {
		props: {
			blog: blogs.blog
		}
	};
}

export default SingleBlog;
