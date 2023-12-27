import React, { useContext } from 'react';
import { ModalContext } from '../../context/ModalContext';
import { Box, Button, Heading, Flex, Spacer } from '@chakra-ui/react';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { PropertyInfo } from './components/PropertyInfo';
import { Stakeholders } from './components/Stakeholders';
import { Units } from './components/Units';
import { useParams } from 'react-router-dom';

export const PropertyId = (): JSX.Element => {
	const params = useParams();
	console.log('In propertyId', params);
	const [, setModalContext] = useContext(ModalContext);

	const tempdata = {
		// propertyId: Number(propertyId),
		propertyId: Number(params.propertyId),
		name: 'Hagkaup Smaralind',
		address: 'Hagasmari 1',
		city: '200 Kopavogur',
		country: 'Iceland',
		zipCode: '200',
		size: '2000',
		type: 'Retail'
	};

	return (
		<>
			<PropertyInfo property={tempdata} />
			<hr />
			<Box mb={1} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'#EFEFEE'} w="100%">
				<Flex mb={8} alignItems={'center'}>
					<Box>
						<Heading mb={'4'} fontSize={'xl'}>
							Units
						</Heading>
					</Box>
					<Spacer />
					<Box>
						<Button
							leftIcon={<PlusIcon />}
							onClick={() => setModalContext({ addUnit: { unit: undefined } })}
						>
							Add unit
						</Button>
					</Box>
				</Flex>
				<Units propertyId={Number(params.propertyId)} />
			</Box>
			<Box mb={1} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'#EFEFEE'} w="100%">
				<hr />
				<Flex mb={8} alignItems={'center'}>
					<Box>
						<Heading fontSize={'xl'}>Stakeholders</Heading>
					</Box>
					<Spacer />
					<Box>
						<Button
							leftIcon={<PlusIcon />}
							onClick={() =>
								setModalContext({ stakeholder: { stakeholder: undefined } })
							}
						>
							Add stakeholders
						</Button>
					</Box>
				</Flex>
				<Stakeholders />
			</Box>
		</>
	);
};
