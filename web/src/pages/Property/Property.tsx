import React from 'react';
import styled from 'styled-components';
import { Text, Flex, Grid, GridItem, HStack } from '@chakra-ui/react';
import { CardBaseLink } from '../../components/CardBase';

const ProcurementCardStyled = styled(CardBaseLink)`
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
	const tempData = [
		{
			propertyId: 1,
			name: 'Lundur 1',
			address: 'Lundur 1',
			city: '200 Kopavogur',
			contact: 'Jon Jonsson',
			phoneNumber: '555-5555',
			email: 'jon@email.com',
			occupation: 'Formadur husfelags'
		},
		{
			propertyId: 2,
			name: 'Hagkaup Smaralind',
			address: 'Hagasmari 1',
			city: '200 Kopavogur',
			contact: 'Hannes Palsson',
			phoneNumber: '663-789',
			email: 'hannes@smahagkaup.is',
			occupation: 'Verslunarstjori'
		}
	];

	return (
		<>
			{tempData
				.slice()
				.reverse()
				.map((property) => (
					<ProcurementCardStyled
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
										<Text color={'black'}>Contact: </Text>
										<Text>{property.contact}</Text>
									</HStack>
									<HStack>
										<Text color={'black'}>Phone number</Text>
										<Text>{property.phoneNumber}</Text>
									</HStack>
									<HStack>
										<Text color={'black'}>Email</Text>
										<Text>{property.email}</Text>
									</HStack>
									<HStack>
										<Text color={'black'}>Occupation</Text>
										<Text>{property.occupation}</Text>
									</HStack>
								</GridItem>
							</Grid>
						</Flex>
					</ProcurementCardStyled>
				))}
		</>
	);
};
