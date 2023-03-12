import React from 'react';
import styled from 'styled-components';
import { Page } from '../../../components/Page';
import { Box, Heading, HStack, VStack, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useGetOfferForTender } from '../../../queries/useGetOfferForTender';
import { Offer } from '../../../models/Tender';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { useTenderById } from '../../../queries/useGetTenderById';
import { Tender } from '../../../models/Tender';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

export const OfferForTender = (): JSX.Element => {
	const { tenderId } = useParams();
	const { data, isLoading } = useGetOfferForTender(Number(tenderId));
	const { data: tenderById, isError } = useTenderById(Number(tenderId));
	const tender: Tender | undefined = tenderById?.tender;
	const tenderDescription = tender?.description;
	const offer: Offer[] | undefined = data;
	return (
		<>
			<Page
				title={
					isError
						? 'Offer for Procurement'
						: `Offer for Procurement - ${tenderDescription}`
				}
				contentPadding={false}
			>
				<VStack style={{ height: '100%' }}>
					<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
						<Container>
							{isLoading ? (
								<LoadingSpinner />
							) : (
								<>
									<Text fontSize={'lg'} mb={'4'}>
										This is the page where all offers for this procurement are
										visible. Note that the offer has to be published so it can
										be visible here.
									</Text>
									<Box>
										{offer.length === 0 ? (
											<Text>No offers have been published!</Text>
										) : (
											offer?.map((i) => (
												<>
													<Text>Notes: {i.notes}</Text>
													<Text>Offer Id: {i.offerId}</Text>
													<Text>Tender Id: {i.tenderId}</Text>
													<Text>Status: {i.status}</Text>
													<Text>Status Text: {i.statusText}</Text>
												</>
											))
										)}
									</Box>
								</>
							)}
						</Container>
					</HStack>
				</VStack>
			</Page>
		</>
	);
};
