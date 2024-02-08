import React from 'react';
import { BidIdHeader } from './BidIdHeader';
import { BidIdTable } from './BidIdTable';
import { Flex } from '@chakra-ui/react';

export const BidId = (): JSX.Element => {
	return (
		<>
			{/* Client Bid header */}
			<div style={{ width: '100%' }}>
				<Flex direction={'column'}>
					<BidIdHeader />
					{/* Client Bid Table */}
					<BidIdTable />
				</Flex>
			</div>
		</>
	);
};
