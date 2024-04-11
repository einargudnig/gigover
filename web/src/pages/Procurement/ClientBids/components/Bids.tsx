import React, { useContext } from 'react';
import styled from 'styled-components';
import { ModalContext } from '../../../../context/ModalContext';
import { Text, Flex, Grid, GridItem, HStack, Box, Spacer, Button } from '@chakra-ui/react';
import { PlusIcon } from '../../../../components/icons/PlusIcon';
import { CardBaseLink } from '../../../../components/CardBase';
import { Center } from '../../../../components/Center';
import { useGetBids } from '../../../../queries/procurement/client-bids/useGetBids';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { Bid } from '../../../../models/Tender';

const PropertyCardStyled = styled(CardBaseLink)`
	width: 100%;
	max-width: 100%;
	height: auto;

	h3 {
		margin-bottom: 16px;
		color: #000;
	}

	@media screen and (max-width: 768px) {
		width: 100%;
	}
`;

export const Bids = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const { data, isLoading } = useGetBids();

	const shouldDeliver = (bid: Bid) => {
		if (bid.delivery === 1) {
			return (
				<HStack>
					<Text as={'b'}>Deliver to:</Text>
					<Text color={'black'}>{bid.address}</Text>
				</HStack>
			);
		}
		return (
			<HStack>
				<Text as={'b'}>Address:</Text>
				<Text color={'black'}>{bid.address}</Text>
			</HStack>
		);
	};

	return (
		<>
			<Flex justifyContent={'center'} alignItems={'center'} mb={'2'}>
				<Box>
					<Text>This tab is used to create bids that can be sent out to users</Text>
				</Box>
				<Spacer />
				<Box>
					<Button
						onClick={() => setModalContext({ addBid: { bid: undefined } })}
						leftIcon={<PlusIcon />}
					>
						Create new bid
					</Button>
				</Box>
			</Flex>

			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					{!data || data.length === 0 ? (
						<Center>
							<Text>No Bids Found</Text>
						</Center>
					) : (
						data
							.slice()
							.reverse()
							.map((bid) => {
								let bidStatus;
								if (bid.status === 0) {
									bidStatus = 'Unpublished';
								} else if (bid.status === 1) {
									bidStatus = 'Published';
								} else {
									bidStatus = 'Unknown';
								}
								return (
									<PropertyCardStyled
										key={bid.bidId}
										to={`/tender/create-bid/${bid.bidId}`}
									>
										<Flex direction={'column'}>
											<Grid templateColumns="repeat(6, 1fr)" gap={1}>
												<GridItem colSpan={2}>
													<HStack>
														<Text color={'black'}>Description:</Text>
														<Text>{bid.description}</Text>
													</HStack>
													<HStack>
														<Text color={'black'}>Terms: </Text>
														<Text>{bid.terms}</Text>
													</HStack>
													<HStack>
														<Text color={'black'}>Address: </Text>
														<Text>{bid.address}</Text>
													</HStack>
												</GridItem>
												<GridItem colSpan={2}>
													<HStack>
														<Text color={'black'}>Status:</Text>
														<Text>{bidStatus}</Text>
													</HStack>
													{shouldDeliver(bid)}
													<HStack>
														<Text color={'black'}>Close date: </Text>
														<Text>
															{formatDateWithoutTime(
																new Date(bid.finishDate)
															)}
														</Text>
													</HStack>
												</GridItem>
												<GridItem colSpan={2}>
													<HStack>
														<Text color={'black'}>Client Email:</Text>
														<Text>{bid.clientEmail}</Text>
													</HStack>
													<HStack>
														<Text color={'black'}>Notes:</Text>
														<Text>{bid.notes}</Text>
													</HStack>
												</GridItem>
											</Grid>
										</Flex>
									</PropertyCardStyled>
								);
							})
					)}
				</>
			)}
		</>
	);
};
