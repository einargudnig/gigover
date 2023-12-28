import React, { useContext } from 'react';
import { Text, Grid, GridItem, HStack, Button, Box, Spacer } from '@chakra-ui/react';
import { Label } from '../../../components/Label';
import { ModalContext } from '../../../context/ModalContext';

export const Units = ({ units, propertyId }): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);

	return (
		<>
			{!units || units.length === 0 ? (
				<Text>No units found</Text>
			) : (
				units.map((unit) => (
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
				))
			)}
		</>
	);
};
