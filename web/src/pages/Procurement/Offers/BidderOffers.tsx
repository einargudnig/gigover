import React from 'react';
import styled from 'styled-components';
import { HStack, VStack, Text, Flex, Box, Spacer } from '@chakra-ui/react';
import { CardBaseLink } from '../../../components/CardBase';
import { Page } from '../../../components/Page';
import { useGetUserOffers } from '../../../queries/useGetUserOffers';
import { Offer } from '../../../models/Tender';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { Center } from '../../../components/Center';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

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
	// console.log(offers);
	const noOffers = offers?.length === 0;

	return (
		<>
			<Page title={'User Offers'} contentPadding={false}>
				<VStack style={{ height: '100%' }}>
					<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
						<Container>
							{isLoading ? (
								<Center>
									<LoadingSpinner />
								</Center>
							) : (
								<>
									{noOffers ? (
										<Text>
											You have not made any offers. Make sure you open a offer
											before you add to it.
										</Text>
									) : (
										<>
											{offers?.map((o) => {
												let offerStatus;
												let url;
												let statusColor;
												if (o.status === 0) {
													offerStatus = 'Unpublished';
													url = `/tender/offers/${o.tenderId}/${o.offerId}`;
												} else if (o.status === 1) {
													offerStatus = 'Published';
													url = `/published-offer/${o.tenderId}/${o.offerId}`;
												} else if (o.status === 2) {
													offerStatus = 'Accepted';
													url = `/published-offer/${o.tenderId}/${o.offerId}`;
													statusColor = 'green';
												} else if (o.status === 3) {
													offerStatus = 'Rejected';
													url = `/published-offer/${o.tenderId}/${o.offerId}`;
													statusColor = 'red';
												} else {
													offerStatus = 'Unknown';
												}

												return (
													<OfferCardStyled to={url} key={o.offerId}>
														<Flex>
															<Box>
																<Flex direction={'column'}>
																	<HStack>
																		<Text as={'b'}>
																			Offer notes:
																		</Text>
																		<Text>{o.notes}</Text>
																	</HStack>
																	<HStack>
																		<Text as={'b'}>
																			Tender description:
																		</Text>
																		<Text>
																			{o.tender.description}
																		</Text>
																	</HStack>
																	<HStack>
																		<Text as={'b'}>
																			Project name:
																		</Text>
																		<Text>
																			{o.tender.projectName}
																		</Text>
																	</HStack>
																</Flex>
															</Box>
															<Spacer />
															<Box
																justifyContent={'center'}
																alignContent={'center'}
															>
																<HStack>
																	<Text as={'b'} fontSize={'lg'}>
																		Offer status:
																	</Text>
																	<Text
																		fontSize={'xl'}
																		color={statusColor}
																	>
																		{offerStatus}
																	</Text>
																</HStack>
															</Box>
														</Flex>
													</OfferCardStyled>
												);
											})}
										</>
									)}
								</>
							)}
						</Container>
					</HStack>
				</VStack>
			</Page>
		</>
	);
};
