import {
	Box,
	Flex,
	Grid,
	GridItem,
	HStack,
	Heading,
	LinkBox,
	LinkOverlay,
	Text
} from '@chakra-ui/react';
import { CardBaseLink } from '../../../../components/CardBase';
import { Center } from '../../../../components/Center';
import { Bid } from '../../../../models/Tender';
import { useGetClientBids } from '../../../../queries/procurement/client-bids/useGetClientBids';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';
import { ProcurementListSkeleton } from '../../ProcurementListSkeleton';

export const BidResponsesList = (): JSX.Element => {
	const { data, isPending: isLoading } = useGetClientBids();

	const status = (bid: Bid) => {
		if (bid?.status === 0 || bid?.status === 1) {
			return <Text color={'gray'}>Unanswered</Text>;
		} else if (bid?.status === 2) {
			return (
				<Text fontSize={'lg'} color={'red'}>
					Rejected
				</Text>
			);
		} else if (bid?.status === 3) {
			return (
				<Text fontSize={'lg'} color={'green'}>
					Accepted
				</Text>
			);
		}
		return 'Unknown';
	};

	return (
		<Box p={4}>
			<Flex justify={'start'}>
				<Heading size={'md'}>Bids that you have answered</Heading>
			</Flex>

			{isLoading ? (
				<ProcurementListSkeleton />
			) : (
				<>
					{!data || data.length === 0 ? (
						<Center>
							<Text>No Bids Found</Text>
						</Center>
					) : (
						data
							.slice()
							.reverse()
							.map((bid) => {
								return (
									<LinkBox
										as={CardBaseLink}
										key={bid.bidId}
										to={`/tender/bid-responses/${bid.bidId}`}
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
										<LinkOverlay href={`/tender/bid-responses/${bid.bidId}`}>
											<Flex direction={'column'}>
												<Grid templateColumns="repeat(4, 1fr)" gap={1}>
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
															<Text color={'black'}>Address: </Text>
															<Text>{bid.address}</Text>
														</HStack>
														<HStack>
															<Text color={'black'}>Status: </Text>
															<Text>{status(bid)}</Text>
														</HStack>
													</GridItem>
													<GridItem colSpan={2}>
														<HStack>
															<Text color={'black'}>Deliver:</Text>
															<Text>
																{bid.delivery ? 'Yes' : 'No'}
															</Text>
														</HStack>
														<HStack>
															<Text color={'black'}>
																Close Date:{' '}
															</Text>
															<Text>
																{formatDateWithoutTime(
																	new Date(bid.finishDate)
																)}
															</Text>
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
				</>
			)}
		</Box>
	);
};
