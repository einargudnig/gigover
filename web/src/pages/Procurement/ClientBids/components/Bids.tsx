import React from 'react';
import styled from 'styled-components';
import { Text, Flex, Grid, GridItem, HStack } from '@chakra-ui/react';
import { CardBaseLink } from '../../../../components/CardBase';
import { Center } from '../../../../components/Center';
import { useGetBids } from '../../../../queries/procurement/client-bids/useGetBids';
// import { LoadingSpinner } from '../../../../components/LoadingSpinner';

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
	const { data, isLoading } = useGetBids();
	console.log({ data });

	return (
		<>
			<>
				{!data || data.length === 0 ? (
					<Center>
						<Text>No Bids Found</Text>
					</Center>
				) : (
					data
						.slice()
						.reverse()
						.map((bid) => (
							<PropertyCardStyled
								key={bid.bidId}
								to={`/tender/create-bid/${bid.bidId}`}
							>
								<Flex direction={'column'}>
									<Grid templateColumns="repeat(4, 1fr)" gap={1}>
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
												<Text>{bid.status}</Text>
											</HStack>

											<HStack>
												<Text color={'black'}>Status: </Text>
												<Text>{bid.status}</Text>
											</HStack>
										</GridItem>
									</Grid>
								</Flex>
							</PropertyCardStyled>
						))
				)}
			</>
		</>
	);
};
