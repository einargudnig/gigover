import { Box, Button, Flex, Grid, GridItem, HStack, Heading, Text } from '@chakra-ui/react';
import { useState } from 'react';
import styled from 'styled-components';
import { CardBaseLink } from '../../../../components/CardBase';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { useGetBids } from '../../../../queries/procurement/client-bids/useGetBids';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';
import { CreateBidStepper } from './new/CreateBidStepper';

const PropertyCardStyled = styled(CardBaseLink)`
	width: 100%;
	max-width: 100%;
	height: auto;
	margin-top: 8px;
	margin-bottom: 8px;

	h3 {
		margin-bottom: 16px;
		color: #000;
	}

	@media screen and (max-width: 768px) {
		width: 100%;
	}
`;

export const BidsList = (): JSX.Element => {
	const { data, isLoading } = useGetBids();

	return (
		<Box p={4}>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<BidLayout>
					{!data || data.length === 0 ? (
						<Center>
							<Text>No Bids Found</Text>
						</Center>
					) : (
						data
							.slice()
							.reverse()
							.map((bid) => {
								let bidStatus;
								let bidColor;
								if (bid.status === 0) {
									bidStatus = 'Unpublished';
									bidColor = 'gray';
								} else if (bid.status === 1) {
									bidStatus = 'Published';
								} else if (bid.status === 2) {
									bidStatus = 'Rejected';
									bidColor = 'red';
								} else if (bid.status === 3) {
									bidStatus = 'Accepted';
									bidColor = 'green';
								} else {
									bidStatus = 'Unknown';
								}
								return (
									<PropertyCardStyled
										key={bid.bidId}
										to={`/tender/bids/${bid.bidId}`}
									>
										<Flex direction={'column'}>
											<Grid templateColumns="repeat(6, 1fr)" gap={1}>
												<GridItem colSpan={2}>
													<HStack>
														<Text color={'black'}>Description:</Text>
														<Text>{bid.description}</Text>
													</HStack>
													<HStack>
														<Text color={'black'}>Terms: </Text>
														<Text>{bid.terms}</Text>
													</HStack>
													<HStack>
														<Text color={'black'}>Close date: </Text>
														<Text>
															{formatDateWithoutTime(
																new Date(bid.finishDate)
															)}
														</Text>
													</HStack>
												</GridItem>
												<GridItem colSpan={2}>
													<HStack>
														<Text color={'black'}>Status:</Text>
														<Text color={bidColor}>{bidStatus}</Text>
													</HStack>
													<HStack>
														<Text color={'black'}>Delivery: </Text>
														<Text>{bid.delivery ? 'Yes' : 'No'}</Text>
													</HStack>
													<HStack>
														<Text color={'black'}>Address: </Text>
														<Text>{bid.address}</Text>
													</HStack>
												</GridItem>
												<GridItem colSpan={2}>
													<HStack>
														<Text color={'black'}>Client Email:</Text>
														<Text>{bid.clientEmail}</Text>
													</HStack>
													<HStack>
														<Text color={'black'}>Notes:</Text>
														<Text>{bid.notes}</Text>
													</HStack>
												</GridItem>
											</Grid>
										</Flex>
									</PropertyCardStyled>
								);
							})
					)}
				</BidLayout>
			)}
		</Box>
	);
};

function BidLayout({ children }) {
	const [showCreateBid, setShowCreateBid] = useState(false);

	return (
		<Box>
			<Flex justify={'space-between'} align={'center'} mb={2}>
				<Box>
					<Heading size={'md'}>Create bid and send to a single bidder</Heading>
				</Box>

				<Box>
					<Flex>
						{showCreateBid && (
							<Button
								variant={'link'}
								colorScheme={'gray'}
								mr={4}
								onClick={() => setShowCreateBid(false)}
							>
								Bid list
							</Button>
						)}
						<Button
							variant="outline"
							colorScheme="black"
							onClick={() => setShowCreateBid(true)}
						>
							Create bid
						</Button>
					</Flex>
				</Box>
			</Flex>
			{showCreateBid ? <CreateBidStepper setShowCreateBid={setShowCreateBid} /> : children}
		</Box>
	);
}
