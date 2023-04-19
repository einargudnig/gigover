import React from 'react';
import styled from 'styled-components';
import { HStack, VStack, Text } from '@chakra-ui/react';
import { CardBaseLink } from '../../../components/CardBase';
import { Page } from '../../../components/Page';
import { useGetUserOffers } from '../../../queries/useGetUserOffers';
import { Offer } from '../../../models/Tender';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

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

	// const offerPublished = () => {
	// 	const i = offers?.[0];
	// 	return i.status === 1 ? 'Published' : 'Not Published';
	// };
	// eslint-disable-next-line
	let offerPublished = 'Not Published';

	const noOffers = offers?.length === 0;

	return (
		<>
			<Page title={'User Offers'} contentPadding={false}>
				<VStack style={{ height: '100%' }}>
					<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
						<Container>
							{noOffers ? (
								<Text>
									You have not made any offers. Make sure you open a offer before
									you add to it.
								</Text>
							) : null}
							{isLoading ? (
								<LoadingSpinner />
							) : (
								<>
									<Text mb={'2'}>
										This tab should be used for tracking and managing bids that
										the user has submitted for various projects.
									</Text>
									{offers?.map((i) => (
										<React.Fragment key={i.offerId}>
											<OfferCardStyled
												to={`../tender/offers/${i.tenderId}/${i.offerId}`}
											>
												{
													//eslint-disable-next-line
													(offerPublished =
														i.status === 1
															? 'Published'
															: 'Not Published')
												}
												<HStack>
													<Text as={'b'}>Notes</Text>
													<Text>{i.notes}</Text>
												</HStack>
												<HStack>
													<Text as={'b'}>Offer Id:</Text>
													<Text>{i.offerId}</Text>
												</HStack>
												<HStack>
													<Text as={'b'}>Tender Id:</Text>
													<Text>{i.tenderId}</Text>
												</HStack>
												{/* <Text>New Status: {offerPublished}</Text> */}
												<HStack></HStack>
											</OfferCardStyled>
										</React.Fragment>
									))}
								</>
							)}
						</Container>
					</HStack>
				</VStack>
			</Page>
		</>
	);
};
