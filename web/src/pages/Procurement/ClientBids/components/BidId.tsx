import React from 'react';
import { BidIdHeader } from './BidIdHeader';
import { BidIdTable } from './BidIdTable';
import { Flex } from '@chakra-ui/react';
import { ClientBid } from '../../../../models/Tender';

export const BidId = (): JSX.Element => {
	//? FakeData to help me build UI
	const clientBids: ClientBid[] = [
		{
			clientBidId: 1,
			description: 'Looking for a supplier for construction materials',
			terms: 'Payment due in 30 days',
			address: '456 Park Avenue',
			delivery: 1,
			// finishDate: 1644537600000, // Feb 11, 2022
			finishDate: 1703199600000,
			status: 1,
			bidItems: [
				{
					clientBidId: 1,
					clientBidItemId: 1,
					nr: 'CM001',
					description: '10 tons of cement',
					volume: 10,
					cost: 1000
				},
				{
					clientBidId: 1,
					clientBidItemId: 2,
					nr: 'BM001',
					description: '100 bricks',
					volume: 100,
					cost: 500
				}
			],
			bidder: {
				bidderId: 2,
				name: 'Jane Doe',
				email: 'janedoe@example.com',
				company: 'XYZ Inc.',
				address: '456 Park Avenue',
				phoneNumber: '555-987-6543',
				companyId: 2
			},
			client: {
				clientId: 1,
				clientNumber: 'CL001',
				address: '123 Main Street',
				phoneNumber: '555-123-4567',
				email: 'johnsmith@example.com',
				other: ''
			}
		}
	];

	return (
		<>
			{/* Client Bid header */}
			<div style={{ width: '100%' }}>
				<Flex direction={'column'}>
					<BidIdHeader clientBid={clientBids} />
					{/* Client Bid Table */}
					<BidIdTable clientBid={clientBids} />
				</Flex>
			</div>
		</>
	);
};
