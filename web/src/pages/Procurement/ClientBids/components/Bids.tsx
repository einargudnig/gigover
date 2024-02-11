import React from 'react';
import styled from 'styled-components';
import { Text, Flex, Grid, GridItem, HStack } from '@chakra-ui/react';
import { CardBaseLink } from '../../../../components/CardBase';
import { Center } from '../../../../components/Center';
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

const data = [
	{
		id: 1,
		name: 'bid A',
		address: 'address A',
		city: 'city A',
		country: 'country A',
		createdAt: 'createdAt A',
		updatedAt: 'updatedAt A',
		status: 'status A',
		tender: 'tender A'
	}
];

export const Bids = (): JSX.Element => {
	// const { data, isLoading } = useGetClientBids();

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
							<PropertyCardStyled key={bid.id} to={`/tender/create-bid/${bid.id}`}>
								<Flex direction={'column'}>
									<Grid templateColumns="repeat(4, 1fr)" gap={1}>
										<GridItem colSpan={2}>
											<HStack>
												<Text color={'black'}>Name:</Text>
												<Text>{bid.name}</Text>
											</HStack>
											<HStack>
												<Text color={'black'}>Address: </Text>
												<Text>{bid.address}</Text>
											</HStack>
											<HStack>
												<Text color={'black'}>City: </Text>
												<Text>{bid.city}</Text>
											</HStack>
											<HStack>
												<Text color={'black'}>Country: </Text>
												<Text>{bid.country}</Text>
											</HStack>
										</GridItem>
										<GridItem colSpan={2}>
											<HStack>
												<Text color={'black'}>Created At:</Text>
												<Text>{bid.createdAt}</Text>
											</HStack>
											<HStack>
												<Text color={'black'}>Updated At:</Text>
												<Text>{bid.updatedAt}</Text>
											</HStack>
											<HStack>
												<Text color={'black'}>Status: </Text>
												<Text>{bid.status}</Text>
											</HStack>
											<HStack>
												<Text color={'black'}>Tender: </Text>
												<Text>{bid.tender}</Text>
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
