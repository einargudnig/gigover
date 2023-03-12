import React from 'react';
import styled from 'styled-components';
import { Box, HStack, VStack, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useGetOfferForTender } from '../../../queries/useGetOfferForTender';
import { Offer } from '../../../models/Tender';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

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
	return (
		<>
			<VStack style={{ height: '100%' }}>
				<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
					<Container>
						{isLoading ? (
							<LoadingSpinner />
						) : (
							<>
								<Text>This is the page where all Offers for this tenderId</Text>
								<Box>
									{offer?.map((i) => (
										<>
											<Text>Notes: {i.notes}</Text>
											<Text>Offer Id: {i.offerId}</Text>
											<Text>Tender Id: {i.tenderId}</Text>
											<Text>Status: {i.status}</Text>
											<Text>Status Text: {i.statusText}</Text>
										</>
									))}
								</Box>
							</>
						)}
					</Container>
				</HStack>
			</VStack>
		</>
	);
};
