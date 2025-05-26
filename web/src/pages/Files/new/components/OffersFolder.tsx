import { Box, Center, HStack, Heading, Text, VStack } from '@chakra-ui/react';
import { Link, useParams } from 'react-router-dom';
import { CardBaseLink } from '../../../../components/CardBase';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { FolderIcon } from '../../../../components/icons/FolderIcon';
import { colorGenerator } from '../../../../hooks/colorGenerator';
import { Offer } from '../../../../models/Tender';
import { useGetUserOffers } from '../../../../queries/procurement/useGetUserOffers';

export const OffersFolder = (): JSX.Element => {
	const { data, isPending } = useGetUserOffers();
	const offers: Offer[] | undefined = data;
	const noOffers = offers?.length === 0;
	const { offerId: selectedOfferId } = useParams<{ tenderId: string; offerId: string }>();

	return (
		<VStack style={{ height: '100%' }}>
			<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
				<Box flex="1 0" height="100%" p={3} overflowY="auto">
					{isPending ? (
						<Center>
							<LoadingSpinner />
						</Center>
					) : (
						<>
							{noOffers ? (
								<Text>
									There are no files here because you have not opened an offer.
									You can open offer on the{' '}
									<Link to={'/bidder-tenders'}>
										<Text textColor={'black'}>bid invitations page</Text>
									</Link>
									.
								</Text>
							) : (
								<>
									<Heading size={'md'} marginBottom={2}>
										Offers
									</Heading>
									{offers?.map((o) => {
										const selected = o.offerId === Number(selectedOfferId);
										return (
											<>
												<CardBaseLink
													to={`/files/tender/offers/${o.offerId}`}
													key={o.offerId}
													sx={
														selected
															? {
																	bg: 'black',
																	color: 'white !important',
																	boxShadow: 'none'
															  }
															: {}
													}
												>
													<VStack align={'stretch'} spacing={4}>
														<HStack
															justify={'space-between'}
															align={'center'}
														>
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
												</CardBaseLink>
											</>
										);
									})}
								</>
							)}
						</>
					)}
				</Box>
			</HStack>
		</VStack>
	);
};
