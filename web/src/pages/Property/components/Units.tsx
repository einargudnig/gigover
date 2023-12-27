import React, { useContext } from 'react';
import { Text, Grid, GridItem, HStack, Button, Box, Spacer } from '@chakra-ui/react';
import { IPropertyUnit } from '../../../models/Property';
import { Label } from '../../../components/Label';
import { ModalContext } from '../../../context/ModalContext';

export const Units = ({ propertyId }): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const tempaData: IPropertyUnit[] = [
		{
			unitId: 1,
			name: 'Bilastæði',
			size: '800m',
			type: 'Parking lot',
			propertyId: propertyId
		},
		{
			unitId: 2,
			name: 'Bilastæði',
			size: '1000m',
			type: 'Parking lot',
			propertyId: propertyId
		},
		{
			unitId: 3,
			name: 'Hjólageymslur',
			size: '100fm',
			type: 'Other',
			propertyId: propertyId
		},
		{
			unitId: 4,
			name: 'Stærri lyfta',
			size: '10',
			type: 'Elevator',
			propertyId: propertyId
		},
		{
			unitId: 5,
			name: 'Minni lyfta',
			size: '5',
			type: 'Elevator',
			propertyId: propertyId
		}
	];

	return (
		<>
			{tempaData.map((unit) => (
				<div key={unit.unitId}>
					<Grid templateColumns="repeat(6, 1fr)" gap={1} width={'full'} m={1}>
						<GridItem colSpan={2}>
							<HStack>
								<Text fontSize={'xl'} fontWeight={'bold'}>
									Name:
								</Text>
								<Text fontSize={'lg'}>{unit.name}</Text>
							</HStack>
						</GridItem>
						<GridItem colSpan={2}>
							<HStack>
								<Text fontSize={'xl'} fontWeight={'bold'}>
									Size:
								</Text>
								<Text fontSize={'lg'}>{unit.size}</Text>
							</HStack>
						</GridItem>
						<GridItem colSpan={2}>
							<HStack>
								<Box>
									<HStack>
										<Text fontSize={'xl'} fontWeight={'bold'}>
											Type:
										</Text>
										{/* <Text fontSize={'lg'}>{unit.type}</Text> */}
										<Label text={unit.type} />
									</HStack>
								</Box>
								<Spacer />
								<Box>
									<Button
										variant={'outline'}
										colorScheme={'black'}
										onClick={() =>
											setModalContext({
												editUnit: { unit: unit, propertyId: propertyId }
											})
										}
									>
										Edit
									</Button>
								</Box>
							</HStack>
						</GridItem>
					</Grid>
				</div>
			))}
		</>
	);
};
