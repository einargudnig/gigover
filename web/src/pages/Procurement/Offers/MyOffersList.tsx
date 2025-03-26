import { Box, Flex, Grid, GridItem, HStack, Heading, Text } from '@chakra-ui/react';
import styled from 'styled-components';
import { CardBaseLink } from '../../../components/CardBase';
import { Offer } from '../../../models/Tender';
import { useGetUserOffers } from '../../../queries/procurement/useGetUserOffers';
import { ProcurementListSkeleton } from '../ProcurementListSkeleton';

const OfferCardStyled = styled(CardBaseLink)`
	width: 100%;
	max-width: 100%;
	height: auto;
	margin-bottom: 8px;
	margin-top: 8px;

	h3 {
		margin-bottom: 16px;
		color: #000;
	}

	@media screen and (max-width: 768px) {
		width: 100%;
	}
`;

export const MyOffersList = (): JSX.Element => {
	const { data, isLoading } = useGetUserOffers();
	const offers: Offer[] | undefined = data;
	const noOffers = offers?.length === 0;

	return (
		<Box p={4}>
			<Flex justify={'start'}>
				<Heading size={'md'}>Offers that you have submitted</Heading>
			</Flex>

			{isLoading ? (
				<ProcurementListSkeleton />
			) : (
				<>
					{noOffers ? (
						<Text>
							You have not made any offers. Make sure you open a offer before you add
							to it.
						</Text>
					) : (
						<>
							{offers
								?.slice()
								.reverse()
								.map((o) => {
									let offerStatus;
									let statusColor;
									if (o.status === 0) {
										offerStatus = 'Unpublished';
									} else if (o.status === 1) {
										offerStatus = 'Published';
									} else if (o.status === 2) {
										offerStatus = 'Accepted';
										statusColor = 'green';
									} else if (o.status === 3) {
										offerStatus = 'Rejected';
										statusColor = 'red';
									} else {
										offerStatus = 'Unknown';
									}

									return (
										<OfferCardStyled
											to={`/tender/my-offer/${o.tenderId}/${o.offerId}`}
											key={o.offerId}
										>
											<Flex direction={'column'}>
												<Grid templateColumns="repeat(4, 1fr)" gap={1}>
													<GridItem colSpan={2}>
														<HStack>
															<Text as={'b'}>Offer notes:</Text>
															<Text color={'black'}>{o.notes}</Text>
														</HStack>
														<HStack>
															<Text as={'b'}>
																Tender description:
															</Text>
															<Text color={'black'}>
																{o.tender.description}
															</Text>
														</HStack>
													</GridItem>
													<GridItem colSpan={1} />

													<GridItem colSpan={1}>
														<HStack>
															<Text as={'b'} fontSize={'lg'}>
																Offer status:
															</Text>
															<Text
																color={statusColor}
																fontSize={'xl'}
															>
																{offerStatus}
															</Text>
														</HStack>
														<HStack>
															<Text as={'b'}>Tender</Text>
															<Text as={'b'}>owner:</Text>

															<Text>{o.tender.email}</Text>
														</HStack>
													</GridItem>
												</Grid>
											</Flex>
										</OfferCardStyled>
									);
								})}
						</>
					)}
				</>
			)}
		</Box>
	);
};
