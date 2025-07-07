import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, HStack, Spacer, Text } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { CardBaseLink } from '../../../../components/CardBase';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { Offer } from '../../../../models/Tender';
import { useGetOfferForTender } from '../../../../queries/procurement/useGetOfferForTender';

export const TenderOfferDetails = (): JSX.Element => {
	const { tenderId } = useParams();
	const { data, isPending } = useGetOfferForTender(Number(tenderId));
	const offer: Offer[] | undefined = data;
	const navigate = useNavigate();

	const noOffers = offer?.length === 0;

	return (
		<Box p={4}>
			<Button
				onClick={() => navigate(-1)}
				variant={'link'}
				colorScheme={'gray'}
				fontSize={'lg'}
			>
				<ArrowBackIcon />
			</Button>
			<Box flex="1 0" height="100%" p={1} overflowY="auto">
				{isPending ? (
					<Center>
						<LoadingSpinner />
					</Center>
				) : (
					<>
						{noOffers ? (
							<Center>
								<Text>No offers have been published for this tender.</Text>
							</Center>
						) : (
							<>
								{offer
									?.slice()
									.reverse()
									.map((o) => {
										let offerStatus;
										let statusColor;
										if (o.status === 0) {
											offerStatus = 'Unpublished';
										} else if (o.status === 1) {
											offerStatus = 'Published';
										} else if (o.status === 2) {
											offerStatus = 'Accepted';
											statusColor = 'green';
										} else if (o.status === 3) {
											offerStatus = 'Rejected';
											statusColor = 'red';
										} else {
											offerStatus = 'Unknown';
										}

										return (
											<CardBaseLink
												key={o.offerId}
												to={`/tender/tender-offer/${o.tenderId}/${o.offerId}`}
												w="100%"
												maxW="100%"
												h="auto"
												mb="8px"
												sx={{
													h3: {
														marginBottom: '16px',
														color: '#000'
													},
													'@media screen and (max-width: 768px)': {
														width: '100%'
													}
												}}
											>
												<Flex>
													<Box>
														<Flex direction={'column'}>
															<HStack>
																<Text as={'b'}>Offer notes:</Text>
																<Text>{o.notes}</Text>
															</HStack>
															<HStack>
																<Text as={'b'}>Offer Id:</Text>
																<Text>{o.offerId}</Text>
															</HStack>
														</Flex>
													</Box>
													<Spacer />
													<Box>
														<HStack>
															<Text as={'b'} fontSize={'lg'}>
																Offer status:
															</Text>
															<Text
																fontSize={'xl'}
																color={statusColor}
															>
																{offerStatus}
															</Text>
														</HStack>
													</Box>
												</Flex>
											</CardBaseLink>
										);
									})}
							</>
						)}
					</>
				)}
			</Box>
		</Box>
	);
};
