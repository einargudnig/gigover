import React from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { Box, Button, Text } from '@chakra-ui/react';
import { PublishedOffer } from './PublishedOffer';
import { useGetOfferByOfferId } from '../../../../queries/useGetOfferByOfferId';
import { OfferFile } from '../../../Files/new/components/OfferFile';

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
			<Container>
				<PublishedOffer
					offerData={offerData}
					isOfferLoading={isLoading}
					showResultsButtons={false}
				/>
				<Box marginTop={'2'}>
					<OfferFile />
				</Box>
				<Box marginTop={'3'}>
					<Link to={`/files/tender/offers/${offerId}`}>
						<Button ml={'1'}>
							<Text textColor={'black'}>View files</Text>
						</Button>
					</Link>
				</Box>
			</Container>
		</>
	);
};
