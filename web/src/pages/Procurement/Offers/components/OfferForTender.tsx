import React from 'react';
import styled from 'styled-components';
import { Text, Flex, Box, HStack, Spacer } from '@chakra-ui/react';
import { Center } from '../../../../components/Center';
import { useParams } from 'react-router-dom';
import { CardBaseLink } from '../../../../components/CardBase';
import { useGetOfferForTender } from '../../../../queries/procurement/useGetOfferForTender';
import { Offer } from '../../../../models/Tender';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';

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

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(1)};
	overflow-y: auto;
`;

export const OfferForTender = (): JSX.Element => {
	const { tenderId } = useParams();
	const { data, isLoading } = useGetOfferForTender(Number(tenderId));
	const offer: Offer[] | undefined = data;

	const noOffers = offer?.length === 0;

	return (
		<>
			<Container>
				{isLoading ? (
					<Center>
						<LoadingSpinner />
					</Center>
				) : (
					<>
						{noOffers ? (
							<Center>
								<Text>No offers have been published for this tender.</Text>
							</Center>
						) : (
							<>
								{offer
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
												key={o.offerId}
												to={`/tender/tender-offer/${o.tenderId}/${o.offerId}`}
											>
												<Flex>
													<Box>
														<Flex direction={'column'}>
															<HStack>
																<Text as={'b'}>Offer notes:</Text>
																<Text>{o.notes}</Text>
															</HStack>
															<HStack>
																<Text as={'b'}>Offer Id:</Text>
																<Text>{o.offerId}</Text>
															</HStack>
														</Flex>
													</Box>
													<Spacer />
													<Box>
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
		</>
	);
};
