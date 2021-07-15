import React from 'react';
import request from 'graphql-request';
import { PageQuery, PageWithBlocks, PageWithBlocksResponse } from '../queries/usePage';
import { GraphQLEndpoint } from './_app';
import { HeadTitle } from '../components/HeadTitle';
import { PageBlockType } from '../models/PageBlock';
import { PageBlock } from '../components/PageContainer';
import { Hero } from '../components/page-blocks/Hero';
import { PageId } from '../models/Page';
import { Video } from '../components/page-blocks/Video';
import { Features } from '../components/page-blocks/Features';
import { Reviews } from '../components/page-blocks/Reviews';
import { Testimonial } from '../components/page-blocks/Testimonial';
import { Image } from '../components/page-blocks/Image';
import ReactMarkdown from 'react-markdown';
import { BlogPosts, BlogsResponse } from '../queries/useBlogPosts';
import Link from 'next/link';
import { BlogGrid } from '../components/blog/BlogGrid';

export interface BlogProps {
	page: PageWithBlocks;
	blogs: BlogsResponse;
}

const Blog = ({ page, blogs }: BlogProps): JSX.Element => (
	<>
		<HeadTitle
			title={page.name}
			description={'Tips for running a successful construction business'}
		/>
		{page.pageBlocks.map((pageBlock) => {
			// Validation methods
			if (
				pageBlock.blockType === PageBlockType.Testimonial &&
				pageBlock.testimonials.length === 0
			) {
				return null;
			}

			// Components
			return (
				<PageBlock key={pageBlock.id} color={pageBlock.pageBlockColor}>
					{(() => {
						switch (pageBlock.blockType) {
							case PageBlockType.Hero:
								return (
									<Hero
										pageId={page.pageId}
										pageBlock={pageBlock}
										centerText={page.pageId === PageId.Pricing}
									/>
								);
							case PageBlockType.Video:
								return <Video pageId={page.pageId} pageBlock={pageBlock} />;
							case PageBlockType.Features:
								return <Features pageId={page.pageId} pageBlock={pageBlock} />;
							case PageBlockType.Reviews:
								return <Reviews pageId={page.pageId} pageBlock={pageBlock} />;
							case PageBlockType.Testimonial:
								return <Testimonial pageId={page.pageId} pageBlock={pageBlock} />;
							case PageBlockType.Image:
								return <Image pageId={page.pageId} pageBlock={pageBlock} />;
							default:
								return (
									<>
										{pageBlock.heading && <h2>{pageBlock.heading}</h2>}
										{pageBlock.content && (
											<ReactMarkdown>{pageBlock.content}</ReactMarkdown>
										)}
										{pageBlock.image && <img src={pageBlock.image.url} />}
									</>
								);
						}
					})()}
				</PageBlock>
			);
		})}
		{page.pageId === PageId.Blog && (
			<PageBlock color={'white'}>
				<BlogGrid blogs={blogs.blogs} />
			</PageBlock>
		)}
	</>
);

export async function getServerSideProps(context) {
	const response = await request<PageWithBlocksResponse>(GraphQLEndpoint, PageQuery, {
		input: {
			slug: 'blog'
		}
	});

	const blogs = await request<BlogsResponse>(GraphQLEndpoint, BlogPosts);

	return {
		props: {
			page: response.page,
			blogs: blogs
		}
	};
}

export default Blog;
