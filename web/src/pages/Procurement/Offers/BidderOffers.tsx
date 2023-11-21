import React from 'react';
import styled from 'styled-components';
import { Grid, GridItem, HStack, Text, Flex } from '@chakra-ui/react';
import { CardBaseLink } from '../../../components/CardBase';
import { useGetUserOffers } from '../../../queries/useGetUserOffers';
import { Offer } from '../../../models/Tender';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { Center } from '../../../components/Center';

const OfferCardStyled = styled(CardBaseLink)`
	width: 100%;
	max-width: 100%;
	height: auto;
	margin-bottom: 8px;

	h3 {
		margin-bottom: 16px;
		color: #000;
	}

	@media screen and (max-width: 768px) {
		width: 100%;
	}
`;

export const BidderOffers = (): JSX.Element => {
	const { data, isLoading } = useGetUserOffers();
	const offers: Offer[] | undefined = data;
	const noOffers = offers?.length === 0;

	return (
		<>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
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
									let url;
									let statusColor;
									if (o.status === 0) {
										offerStatus = 'Unpublished';
										url = `/tender/offers/${o.tenderId}/${o.offerId}`;
									} else if (o.status === 1) {
										offerStatus = 'Published';
										url = `/tender/published-offer/${o.tenderId}/${o.offerId}`;
									} else if (o.status === 2) {
										offerStatus = 'Accepted';
										url = `/tender/published-offer/${o.tenderId}/${o.offerId}`;
										statusColor = 'green';
									} else if (o.status === 3) {
										offerStatus = 'Rejected';
										url = `/tender/published-offer/${o.tenderId}/${o.offerId}`;
										statusColor = 'red';
									} else {
										offerStatus = 'Unknown';
									}

									return (
										<OfferCardStyled to={url} key={o.offerId}>
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
		</>
	);
};
