import { Flex, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import styled from 'styled-components';
import { CardBaseLink } from '../../../../components/CardBase';
import { Center } from '../../../../components/Center';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { ModalContext } from '../../../../context/ModalContext';
import { Bid } from '../../../../models/Tender';
import { useGetBids } from '../../../../queries/procurement/client-bids/useGetBids';
import { formatDateWithoutTime } from '../../../../utils/StringUtils';

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
	console.log({ data });

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
				<Text>🚧 This feature is still in development! 🚧</Text>
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
								} else if (bid.status === 2) {
									bidStatus = 'Rejected';
								} else if (bid.status === 3) {
									bidStatus = 'Accepted';
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
