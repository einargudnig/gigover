import React, { useContext } from 'react';
import { ModalContext } from '../../context/ModalContext';
import { Box, Button, Heading, Flex, Spacer } from '@chakra-ui/react';
import { PlusIcon } from '../../components/icons/PlusIcon';
import { PropertyInfo } from './components/PropertyInfo';
import { Stakeholders } from './components/Stakeholders';
import { Units } from './components/Units';
import { useGetPropertyById } from '../../queries/properties/useGetPropertyById';
import { useParams } from 'react-router-dom';
import { Center } from '../../components/Center';
import { LoadingSpinner } from '../../components/LoadingSpinner';

export const PropertyId = (): JSX.Element => {
	const { propertyId } = useParams();
	const [, setModalContext] = useContext(ModalContext);

	const { data, isLoading } = useGetPropertyById(Number(propertyId));
	const property = data?.property;
	// console.log(property);
	const units = data?.property.units;
	const stakeholders = data?.property.stakeholders;

	return (
		<>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<>
					<PropertyInfo property={property} />
					<hr />
					<Box
						mb={1}
						p={4}
						borderRadius={8}
						borderColor={'#EFEFEE'}
						bg={'#EFEFEE'}
						w="100%"
					>
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
									onClick={() =>
										setModalContext({
											addUnit: {
												unit: undefined,
												propertyId: Number(propertyId)
											}
										})
									}
								>
									Add unit
								</Button>
							</Box>
						</Flex>
						<Units units={units} propertyId={Number(propertyId)} />
					</Box>
					<Box
						mb={1}
						p={4}
						borderRadius={8}
						borderColor={'#EFEFEE'}
						bg={'#EFEFEE'}
						w="100%"
					>
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
										setModalContext({
											stakeholder: {
												stakeholder: undefined,
												propertyId: Number(propertyId)
											}
										})
									}
								>
									Add stakeholders
								</Button>
							</Box>
						</Flex>
						<Stakeholders stakeholders={stakeholders} />
					</Box>
				</>
			)}
		</>
	);
};
