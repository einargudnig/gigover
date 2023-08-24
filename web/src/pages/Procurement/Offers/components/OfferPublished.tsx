import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { VStack, HStack } from '@chakra-ui/react';
import { Page } from '../../../../components/Page';
import { PublishedOffer } from './PublishedOffer';
import { useGetOfferByOfferId } from '../../../../queries/useGetOfferByOfferId';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

export const OfferPublished = (): JSX.Element => {
	// ! This is the page where the bidder can see his published offer
	const { offerId } = useParams();
	const { data: offerData, isLoading } = useGetOfferByOfferId(Number(offerId));

	return (
		<>
			<Page title={'Published offer'} contentPadding={true}>
				<VStack style={{ height: '100%' }}>
					<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
						<Container>
							<PublishedOffer
								offerData={offerData}
								isOfferLoading={isLoading}
								showResultsButtons={false}
							/>
						</Container>
					</HStack>
				</VStack>
			</Page>
		</>
	);
};
