import React from 'react';
import { PageQuery, PageWithBlocksResponse } from '../queries/usePage';
import request from 'graphql-request';
import { GraphQLEndpoint } from './_app';
import Index from './index';

export async function getServerSideProps(context) {
	const response = await request<PageWithBlocksResponse>(GraphQLEndpoint, PageQuery, {
		input: {
			slug: context.params.slug
		}
	});

	if (context.params.slug.toLowerCase() === 'blog') {

	}

	return {
		props: {
			page: response.page
		}
	};
}

export default Index;
