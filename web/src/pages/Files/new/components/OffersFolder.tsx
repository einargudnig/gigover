import React from 'react';
import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { HStack, VStack, Text, Heading, Center } from '@chakra-ui/react';
import { CardBaseLink } from '../../../../components/CardBase';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { useGetUserOffers } from '../../../../queries/useGetUserOffers';
import { Offer } from '../../../../models/Tender';
import { FolderIcon } from '../../../../components/icons/FolderIcon';
import { colorGenerator } from '../../../../hooks/colorGenerator';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	padding: ${(props) => props.theme.padding(3)};
	overflow-y: auto;
`;

const FolderCard = styled(CardBaseLink)<{ selected?: boolean }>`
	${(props) =>
		props.selected &&
		css`
			background: #000;
			color: #fff !important;
			box-shadow: none;
		`};
`;

export const OffersFolder = (): JSX.Element => {
	const { data, isLoading } = useGetUserOffers();
	const offers: Offer[] | undefined = data;
	console.log('data', data);
	const noOffers = offers?.length === 0;

	return (
		<VStack style={{ height: '100%' }}>
			<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
				<Container>
					{noOffers ? (
						<Text>
							There are no files here because you have not opened an offer. You can
							open offer on the{' '}
							<Link to={'/bidder-tenders'}>
								<Text textColor={'black'}>bid invitations page</Text>
							</Link>
							.
						</Text>
					) : null}
					{isLoading ? (
						<Center>
							<LoadingSpinner />
						</Center>
					) : (
						<>
							{offers?.map((o) => {
								return (
									<>
										<FolderCard
											to={`/files/tender/offers/${o.offerId}`}
											key={o.offerId}
										>
											<VStack align={'stretch'} spacing={4}>
												<HStack justify={'space-between'} align={'center'}>
													<FolderIcon
														color={
															colorGenerator(
																`${o.tender.description}`,
																150,
																50
															).backgroundColor
														}
														size={32}
													/>
													{/* <Text>{o.tender.description}</Text> */}
												</HStack>
												<HStack>
													<Heading
														as={'h4'}
														size={'sm'}
														fontWeight={'bold'}
													>
														Tender Description:
													</Heading>
													<Heading
														as={'h4'}
														size={'sm'}
														fontWeight={'normal'}
													>
														{o.tender.description}
													</Heading>
												</HStack>
												<HStack>
													<Text as={'b'}>Offer Id:</Text>
													<Text>{o.offerId}</Text>
												</HStack>
												<HStack>
													<Text as={'b'}>Offer notes:</Text>
													<Text>{o.notes}</Text>
												</HStack>
											</VStack>
										</FolderCard>
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
