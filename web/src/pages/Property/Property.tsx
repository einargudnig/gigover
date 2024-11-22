import { Flex, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
import styled from 'styled-components';
import { CardBaseLink } from '../../components/CardBase';
import { Center } from '../../components/Center';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useGetProperties } from '../../queries/properties/useGetPoperties';

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

export const Property = (): JSX.Element => {
	const { data, isLoading, isFetching } = useGetProperties();

	return (
		<>
			{isLoading || isFetching ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					{!data || data.length === 0 ? (
						<Center>
							<Text>No Property Found</Text>
						</Center>
					) : (
						data
							.slice()
							.reverse()
							.map((property) => (
								<PropertyCardStyled
									key={property.propertyId}
									to={`/property/${property.propertyId}`}
								>
									<Flex direction={'column'}>
										<Grid templateColumns="repeat(4, 1fr)" gap={1}>
											<GridItem colSpan={2}>
												<HStack>
													<Text color={'black'}>Name:</Text>
													<Text>{property.name}</Text>
												</HStack>
												<HStack>
													<Text color={'black'}>Address: </Text>
													<Text>{property.address}</Text>
												</HStack>
												<HStack>
													<Text color={'black'}>City: </Text>
													<Text>{property.city}</Text>
												</HStack>
											</GridItem>
											<GridItem colSpan={2}>
												<HStack>
													<Text color={'black'}>Zip Code: </Text>
													<Text>{property.zipCode}</Text>
												</HStack>
												<HStack>
													<Text color={'black'}>Country:</Text>
													<Text>{property.country}</Text>
												</HStack>
												<HStack>
													<Text color={'black'}>Size:</Text>
													<Text>{property.size}</Text>
												</HStack>
												<HStack>
													<Text color={'black'}>Type:</Text>
													<Text>{property.type}</Text>
												</HStack>
											</GridItem>
										</Grid>
									</Flex>
								</PropertyCardStyled>
							))
					)}
				</>
			)}
		</>
	);
};
