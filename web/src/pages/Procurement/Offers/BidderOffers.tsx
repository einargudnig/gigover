import React from 'react';
import styled from 'styled-components';
import { HStack, VStack, Text } from '@chakra-ui/react';
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
	display: flex;
	justify-content: space-between;
	flex-direction: column;
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
												if (o.status === 0) {
													offerStatus = 'Unpublished';
													url = `/tender/offers/${o.tenderId}/${o.offerId}`;
												} else if (o.status === 1) {
													offerStatus = 'Published';
													url = `/published-offer/${o.tenderId}/${o.offerId}`;
												} else if (o.status === 2) {
													offerStatus = 'Accepted';
													url = `/published-offer/${o.tenderId}/${o.offerId}`;
												} else if (o.status === 3) {
													offerStatus = 'Rejected';
													url = `/published-offer/${o.tenderId}/${o.offerId}`;
												} else {
													offerStatus = 'Unknown';
												}

												return (
													<React.Fragment key={o.offerId}>
														<OfferCardStyled to={url}>
															<HStack>
																<Text as={'b'}>Notes:</Text>
																<Text>{o.notes}</Text>
															</HStack>
															<HStack>
																<Text as={'b'}>Offer Id:</Text>
																<Text>{o.offerId}</Text>
															</HStack>
															<HStack>
																<Text as={'b'}>Tender Id:</Text>
																<Text>{o.tenderId}</Text>
															</HStack>
															<Text as={'b'} size={'lg'}>
																Status: {offerStatus}
															</Text>
															<HStack></HStack>
														</OfferCardStyled>
													</React.Fragment>
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
