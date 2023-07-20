import React from 'react';
import styled from 'styled-components';
import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { CardBaseLink } from '../../../../components/CardBase';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { useGetUserOffers } from '../../../../queries/useGetUserOffers';
import { Offer } from '../../../../models/Tender';
import { Link } from 'react-router-dom';

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

export const OffersFolder = (): JSX.Element => {
	console.log('TenderFiles at the /files/tender/offers');
	const { data, isLoading } = useGetUserOffers();
	const offers: Offer[] | undefined = data;
	// const noOffers = offers?.length === 0;
	const noOffers = true;

	return (
		<VStack style={{ height: '100%' }}>
			<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
				<Container>
					{noOffers ? (
						<Text>
							There are no files here because you have note opened an offer. You can
							open offer on the{' '}
							<Link to={'/bidder-tenders'}>
								<Text textColor={'black'}>bid invitations page</Text>
							</Link>
							.
						</Text>
					) : null}
					{isLoading ? (
						<LoadingSpinner />
					) : (
						<>
							{offers?.map((o) => {
								let offerStatus;
								if (o.status === 0) {
									offerStatus = 'Unpublished';
								} else if (o.status === 1) {
									offerStatus = 'Published';
								} else if (o.status === 2) {
									offerStatus = 'Accepted';
								} else if (o.status === 3) {
									offerStatus = 'Rejected';
								} else {
									offerStatus = 'Unknown';
								}

								return (
									<>
										<Text>Need to update this one</Text>
										<React.Fragment key={o.offerId}>
											<OfferCardStyled
												to={`/files/tender/offers/${o.offerId}`}
											>
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
									</>
								);
							})}
						</>
					)}
				</Container>
			</HStack>
		</VStack>
	);
};
