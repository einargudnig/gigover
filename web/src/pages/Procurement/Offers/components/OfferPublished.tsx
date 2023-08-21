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
	// Here I should add the Accept/Reject buttons
	// That does make it so that it might be harder to reuse this component
	// I might be able to reuse it if I add a prop that determines if the buttons should be shown or not
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
