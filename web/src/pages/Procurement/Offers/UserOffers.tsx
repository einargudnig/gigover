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
	// console.log('HERE', offers);

	// const offerPublished = () => {
	// 	const i = offers?.[0];
	// 	return i.status === 1 ? 'Published' : 'Not Published';
	// };
	let offerPublished = 'Not Published';

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
									<Box my={'2'}>
										{offers?.map((i) => (
											<>
												<Box
													my={'2'}
													p={'4'}
													borderRadius={6}
													borderColor={'#EFEFEE'}
													bg={'#EFEFEE'}
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
													<HStack>
														<Text as={'b'}>Status text:</Text>
														<Text>{i.statusText}</Text>
													</HStack>
												</Box>
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
