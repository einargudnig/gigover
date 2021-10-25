import React, { useEffect } from 'react';
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
import { Testimonial } from '../components/page-blocks/Testimonial';
import { Image } from '../components/page-blocks/Image';
import { PageId } from '../models/Page';
import { PricePlans } from '../components/page-blocks/PricePlans';
import { loadIntercom } from 'next-intercom';

interface PageProps {
	page: PageWithBlocks;
}

const Index = ({ page }: PageProps): JSX.Element => {
	useEffect(() => {
		loadIntercom({
			appId: process.env.INTERCOM_ID, // default : ''
			ssr: true, // default: false
			initWindow: true, // default: true
			delay: 0 // default: 0  - usefull for mobile devices to prevent blocking the main thread
		});
	}, []);

	return (
		<>
			<HeadTitle
				title={page?.name ?? ''}
				description={
					'Gigover allows you to create projects, assign tasks seamlessly, keep track of what needs to be done versus what’s completed.'
				}
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
									return (
										<Testimonial pageId={page.pageId} pageBlock={pageBlock} />
									);
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
			{page.pageId === PageId.Blog && <p>blog page</p>}
			{page.pageId === PageId.Pricing && page.pricePlans.length > 0 && (
				<PricePlans pricePlans={page.pricePlans} />
			)}
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
