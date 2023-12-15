import React, { useContext } from 'react';
import styled from 'styled-components';
import { Page } from '../../components/Page';
import { Button, Flex, Grid, GridItem } from '@chakra-ui/react';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { SearchBar } from './components/SearchBar';
import { CardBaseLink } from '../../components/CardBase';
import { ModalContext } from '../../context/ModalContext';

const ProcurementCardStyled = styled(CardBaseLink)`
	width: 100%;
	max-width: 100%;
	height: auto;
	margin-bottom: 8px;

	h3 {
		margin-bottom: 16px;
		color: #000;
	}

	@media screen and (max-width: 768px) {
		width: 100%;
	}
`;

export const Property = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);

	const tempData = [
		{
			id: 1,
			name: 'Lundur 1',
			address: 'Lundur 1',
			city: '200 Kopavogur',
			contact: 'Jon Jonsson',
			phoneNumber: '555-5555',
			email: 'jon@email.com',
			occupation: 'Formadur husfelags'
		},
		{
			id: 2,
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
		<Page
			title={'Property'}
			actions={
				<Button
					onClick={() => setModalContext({ addProperty: { property: undefined } })}
					leftIcon={<PlusIcon />}
				>
					New Property
				</Button>
			}
			tabs={<SearchBar property={[]} />}
		>
			<>
				{tempData
					.slice()
					.reverse()
					.map((property) => (
						<ProcurementCardStyled key={property.id} to={`/property/${property.id}`}>
							<Flex direction={'column'}>
								<Grid templateColumns="repeat(4, 1fr)" gap={1}>
									<GridItem colSpan={2}>
										<h3>{property.name}</h3>
										<p>{property.address}</p>
										<p>{property.city}</p>
									</GridItem>
									<GridItem colSpan={2}>
										<p>{property.contact}</p>
										<p>{property.phoneNumber}</p>
										<p>{property.email}</p>
										<p>{property.occupation}</p>
									</GridItem>
								</Grid>
							</Flex>
						</ProcurementCardStyled>
					))}
			</>
		</Page>
	);
};
