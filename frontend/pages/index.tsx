import React from 'react';
import { HeadTitle } from '../components/HeadTitle';
import { PageBlock } from '../components/PageContainer';
import { PageQuery, PageWithBlocks, PageWithBlocksResponse } from '../queries/usePage';
import request from 'graphql-request';
import { GraphQLEndpoint } from './_app';

interface PageProps {
	page: PageWithBlocks;
}

const Index = ({ page }: PageProps): JSX.Element => {
	return (
		<>
			<HeadTitle title={page.name} />
			{page.pageBlocks.map((pageBlock) => (
				<PageBlock key={pageBlock.id} color={pageBlock.pageBlockColor}>
					<>
						{pageBlock.heading && <h1>{pageBlock.heading}</h1>}
						{pageBlock.content && <p>{pageBlock.content}</p>}
						{pageBlock.image && <img src={pageBlock.image.url} />}
					</>
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
