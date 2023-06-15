import React from 'react';
import styled from 'styled-components';
import { Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { CardBaseLink } from '../../../../components/CardBase';
import { useGetOfferForTender } from '../../../../queries/useGetOfferForTender';
import { Offer } from '../../../../models/Tender';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';

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

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

export const OfferForTender = (): JSX.Element => {
	const { tenderId } = useParams();
	const { data, isLoading } = useGetOfferForTender(Number(tenderId));
	const offer: Offer[] | undefined = data;
	// eslint-disable-next-line
	let offerPublished = 'Not Published';

	// const status = () => {
	// 	if (offer?.status === 0) {
	// 		return 'Closed';
	// 	} else if (offer?.status === 1) {
	// 		return 'Published';
	// 	} else if (offer?.status === 2) {
	// 		return 'Accepted';
	// 	} else if (offer?.status === 3) {
	// 		return 'Rejected';
	// 	}
	// 	return 'Unknown';
	// };

	const noOffers = offer?.length === 0;

	return (
		<>
			<Container>
				{noOffers ? <Text>No offers have been published for this tender.</Text> : null}
				{isLoading ? (
					<LoadingSpinner />
				) : (
					<>
						{offer?.map((o) => {
							let offerStatus;
							if (o.status === 0) {
								offerStatus = 'Closed';
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
								<OfferCardStyled
									key={o.tenderId}
									to={`/tender-offers/${o.tenderId}/${o.offerId}`}
								>
									<Text color={'black'} size={'lg'}>
										Status: {offerStatus}
									</Text>
									<Text>Notes: {o.notes}</Text>
									<Text>Offer Id: {o.offerId}</Text>
									<Text>Tender Id: {o.tenderId}</Text>
								</OfferCardStyled>
							);
						})}
					</>
				)}
			</Container>
		</>
	);
};
