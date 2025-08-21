import {
	Box,
	Button,
	Flex,
	Grid,
	GridItem,
	HStack,
	Heading,
	LinkBox,
	LinkOverlay,
	Text
} from '@chakra-ui/react';
import { useState } from 'react';
import { CardBaseLink } from '../../../../components/CardBase';
import { Center } from '../../../../components/Center';
import { useGetBids } from '../../../../queries/procurement/client-bids/useGetBids';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';
import { CreateBidStepper } from './new/CreateBidStepper';
import { DataFetchingErrorBoundary } from '../../../../components/ErrorBoundary';
import { ApiService } from '../../../../services/ApiService';
import { useQueryClient } from '@tanstack/react-query';

export const BidsList = (): JSX.Element => {
	const { data, isPending, isError, error } = useGetBids();

	const queryClient = useQueryClient();

	return (
		<Box p={4}>
			<DataFetchingErrorBoundary
				name="BidsList"
				apiEndpoint={ApiService.getBids}
				loadingState={isPending}
				onRetry={() => {
					queryClient.invalidateQueries({ queryKey: [ApiService.getBids] });
				}}
				skeletonCount={8}
			>
				{isError ? (
					(() => {
						throw error;
					})()
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
										<LinkBox
											as={CardBaseLink}
											key={bid.bidId}
											to={`/tender/bids/${bid.bidId}`}
											w="100%"
											maxW="100%"
											h="auto"
											mt="8px"
											mb="8px"
											sx={{
												h3: {
													marginBottom: '16px',
													color: '#000'
												},
												'@media screen and (max-width: 768px)': {
													width: '100%'
												}
											}}
										>
											<LinkOverlay href={`/tender/bids/${bid.bidId}`}>
												<Flex direction={'column'}>
													<Grid templateColumns="repeat(6, 1fr)" gap={1}>
														<GridItem colSpan={2}>
															<HStack>
																<Text color={'black'}>
																	Description:
																</Text>
																<Text>{bid.description}</Text>
															</HStack>
															<HStack>
																<Text color={'black'}>Terms: </Text>
																<Text>{bid.terms}</Text>
															</HStack>
															<HStack>
																<Text color={'black'}>
																	Close date:{' '}
																</Text>
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
																<Text color={bidColor}>
																	{bidStatus}
																</Text>
															</HStack>
															<HStack>
																<Text color={'black'}>
																	Delivery:{' '}
																</Text>
																<Text>
																	{bid.delivery ? 'Yes' : 'No'}
																</Text>
															</HStack>
															<HStack>
																<Text color={'black'}>
																	Address:{' '}
																</Text>
																<Text>{bid.address}</Text>
															</HStack>
														</GridItem>
														<GridItem colSpan={2}>
															<HStack>
																<Text color={'black'}>
																	Client Email:
																</Text>
																<Text>{bid.clientEmail}</Text>
															</HStack>
															<HStack>
																<Text color={'black'}>Notes:</Text>
																<Text>{bid.notes}</Text>
															</HStack>
														</GridItem>
													</Grid>
												</Flex>
											</LinkOverlay>
										</LinkBox>
									);
								})
						)}
					</BidLayout>
				)}
			</DataFetchingErrorBoundary>
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
