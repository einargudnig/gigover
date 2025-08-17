import { Flex, Grid, GridItem, HStack, LinkBox, LinkOverlay, Text } from '@chakra-ui/react';
import { CardBaseLink } from '../../components/CardBase';
import { Center } from '../../components/Center';
import { DataFetchingErrorBoundary } from '../../components/ErrorBoundary';
import { useGetProperties } from '../../queries/properties/useGetPoperties';
import { ApiService } from '../../services/ApiService';
import { PropertyLayout } from './PropertyLayout';

export const Property = (): JSX.Element => {
	const { data, isPending, isFetching, isError, error } = useGetProperties();

	return (
		<PropertyLayout>
			<DataFetchingErrorBoundary
				name="PropertyList"
				apiEndpoint={ApiService.getProperties}
				loadingState={isPending || isFetching}
				onRetry={() => {}}
			>
				{isError ? (
					(() => {
						throw error;
					})()
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
									<LinkBox
										as={CardBaseLink}
										to={`/property/${property.propertyId}`}
										key={property.propertyId}
										w="100%"
										maxW="100%"
										h="auto"
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
										<LinkOverlay href={`/property/${property.propertyId}`}>
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
										</LinkOverlay>
									</LinkBox>
								))
						)}
					</>
				)}
			</DataFetchingErrorBoundary>
		</PropertyLayout>
	);
};
