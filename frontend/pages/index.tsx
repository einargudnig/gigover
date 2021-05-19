import React from 'react';
import { HeadTitle } from '../components/HeadTitle';
import { PageBlock } from '../components/PageContainer';
import { PageQuery, PageWithBlocks, PageWithBlocksResponse } from '../queries/usePage';
import request from 'graphql-request';
import { GraphQLEndpoint } from './_app';
import ReactMarkdown from 'react-markdown';
import { PageBlockType } from '../models/PageBlock';
import { Hero } from '../components/page-blocks/Hero';
import { Video } from '../components/page-blocks/Video';
import { Features } from '../components/page-blocks/Features';
import { Reviews } from '../components/page-blocks/Reviews';

interface PageProps {
	page: PageWithBlocks;
}

const Index = ({ page }: PageProps): JSX.Element => {
	return (
		<>
			<HeadTitle title={page.name} />
			{page.pageBlocks.map((pageBlock) => (
				<PageBlock key={pageBlock.id} color={pageBlock.pageBlockColor}>
					{(() => {
						switch (pageBlock.blockType) {
							case PageBlockType.Hero:
								return <Hero pageId={page.pageId} pageBlock={pageBlock} />;
							case PageBlockType.Video:
								return <Video pageId={page.pageId} pageBlock={pageBlock} />;
							case PageBlockType.Features:
								return <Features pageId={page.pageId} pageBlock={pageBlock} />;
							case PageBlockType.Reviews:
								return <Reviews pageId={page.pageId} pageBlock={pageBlock} />;
							default:
								return (
									<>
										{pageBlock.heading && <h1>{pageBlock.heading}</h1>}
										{pageBlock.content && (
											<ReactMarkdown>{pageBlock.content}</ReactMarkdown>
										)}
										{pageBlock.image && <img src={pageBlock.image.url} />}
									</>
								);
						}
					})()}
				</PageBlock>
			))}
		</>
	);
};

export async function getServerSideProps(context) {
	const response = await request<PageWithBlocksResponse>(GraphQLEndpoint, PageQuery, {
		input: {
			slug: 'index'
		}
	});

	return {
		props: {
			page: response.page
		}
	};
}

export default Index;
