import React from 'react';
import { useParams } from 'react-router-dom';
import { BidIdHeader } from './BidIdHeader';
import { BidIdTable } from './BidIdTable';
import { Box, Button, Flex, Grid, GridItem, Spacer, Text, useToast } from '@chakra-ui/react';
import { ClientBid } from '../../../../models/Tender';
import { usePublishClientBid } from '../../../../mutations/procurement/client-bids/usePublishClientBid';
// import { handleFinishDate } from '../../../utils/HandleFinishDate';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { BidIdText } from './BidIdText';

export const BidId = (): JSX.Element => {
	const { clientBidId } = useParams<{ clientBidId: string }>();
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

	const toast = useToast();

	const finishDateStatus = false;
	// const clientBidStatus = clientBid?.status;
	const clientBidStatus = 1;

	const { mutateAsync: publishClientBid, isLoading: isPublishLoading } = usePublishClientBid();

	const handlePublish = async () => {
		const publishTenderBody = {
			clientBidId: Number(clientBidId)
		};
		// if (clientBid !== undefined) {
		if (clientBids !== undefined) {
			try {
				await publishClientBid(publishTenderBody);
				toast({
					title: 'Tender published',
					description: 'Now you can invite people to send offers to your tender!',
					status: 'success',
					duration: 2000,
					isClosable: true
				});
			} catch (error) {
				// console.log('ERROR', { error });
				toast({
					title: 'Error',
					description: 'Something went wrong when we tried to publish your tender.',
					status: 'error',
					duration: 3000,
					isClosable: true
				});
			}
		} else {
			toast({
				title: 'Error',
				description: 'Something went wrong when we tried to publish your tender.',
				status: 'error',
				duration: 5000,
				isClosable: true
			});
		}
	};

	return (
		<>
			{/* Client Bid header */}
			<div style={{ width: '100%' }}>
				<Flex direction={'column'}>
					<BidIdHeader clientBid={clientBids} />
					<BidIdTable clientBid={clientBids} />
					<Box marginTop={3}>
						<Grid templateColumns="repeat(3, 1fr)" gap={2}>
							<GridItem colSpan={2}>
								<BidIdText />
							</GridItem>
							<GridItem colSpan={1}>
								<Flex alignItems={'center'}>
									<Button>Upload files</Button>
								</Flex>
							</GridItem>
						</Grid>
					</Box>
					<Flex alignItems={'center'} marginTop={'4'}>
						{!finishDateStatus ? (
							<>
								{clientBidStatus === 1 ? (
									<Flex>
										<Box>
											<Button onClick={handlePublish} mr={'2'}>
												{isPublishLoading ? <LoadingSpinner /> : 'Send Bid'}
											</Button>
										</Box>
										<Spacer />
										<Box>
											<Button colorScheme="red">Delete Bid</Button>
										</Box>
									</Flex>
								) : (
									<Text mr={'2'}>You have already published the Tender</Text>
								)}
							</>
						) : (
							<Flex alignItems={'center'} justifyContent={'center'}>
								<Text>
									The finish date has passed, you cannot publish or delete the
									tender.
								</Text>
							</Flex>
						)}
					</Flex>
				</Flex>
			</div>
		</>
	);
};
