import React, { useContext } from 'react';
import { ModalContext } from '../../context/ModalContext';
import { Button, HStack, VStack } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { Page } from '../../components/Page';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { SearchBar } from './components/SearchBar';
import styled from 'styled-components';

const Container = styled.div`
	flex: 1 0;
	height: 100%;
	overflow-y: auto;
`;

export const PropertyOutlet = (): JSX.Element => {
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

	const [, setModalContext] = useContext(ModalContext);
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
			// tabs={<SearchBar property={tempData} />}
		>
			<VStack style={{ height: '100%' }}>
				<HStack style={{ flex: 1, height: '100%', width: '100%' }}>
					<Container>
						<Outlet />
					</Container>
				</HStack>
			</VStack>
		</Page>
	);
};
