import React from 'react';
import { useParams } from 'react-router-dom';
import { BidIdHeader } from './BidIdHeader';
import { BidIdTable } from './BidIdTable';
import { Box, Button, Flex, Grid, GridItem, Spacer, Text, useToast } from '@chakra-ui/react';
import { useGetBidById } from '../../../../queries/procurement/client-bids/useGetBidById';
import { usePublishClientBid } from '../../../../mutations/procurement/client-bids/usePublishBid';
// import { handleFinishDate } from '../../../utils/HandleFinishDate';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { BidIdText } from './BidIdText';

export const BidId = (): JSX.Element => {
	const { bidId } = useParams<{ bidId: string }>();
	const { data, isLoading } = useGetBidById(Number(bidId));
	console.log({ data });
	const bid = data?.clientBid;
	const bidItems = bid?.items;
	console.log({ bidItems });

	const toast = useToast();

	const finishDateStatus = false;
	const clientBidStatus = bid?.status;

	const { mutateAsync: publishClientBid, isLoading: isPublishLoading } = usePublishClientBid();

	const handlePublish = async () => {
		const publishTenderBody = {
			bidId: Number(bidId)
		};

		if (data !== undefined) {
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
			<div style={{ width: '100%' }}>
				<Flex direction={'column'}>
					<BidIdHeader bid={bid} />
					<BidIdTable bidItems={bidItems} />
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
