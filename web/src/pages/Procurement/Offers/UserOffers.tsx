import React from 'react';
import styled from 'styled-components';
import { Button, HStack, VStack, Text, Box } from '@chakra-ui/react';
import { Page } from '../../../components/Page';
import { useGetUserOffers } from '../../../queries/useGetUserOffers';
import { Offer } from '../../../models/Tender';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

// List of all the offers that I've made as a user!
// /tender/offers

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

export const UserOffers = (): JSX.Element => {
	const { data, isLoading } = useGetUserOffers();
	const offers: Offer[] | undefined = data;
	return (
		<>
			<Page
				title={'User Offers'}
				contentPadding={false}
				actions={
					<>
						<Button>Button</Button>
					</>
				}
			>
				<VStack style={{ height: '100%' }}>
					<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
						<Container>
							{isLoading ? (
								<LoadingSpinner />
							) : (
								<>
									<Text>
										This is the page where the user will see all of his Offers
									</Text>
									<Box>
										{offers?.map((i) => (
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
			</Page>
		</>
	);
};
