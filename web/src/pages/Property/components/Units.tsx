import { Box, Button, Grid, GridItem, HStack, Spacer, Text } from '@chakra-ui/react';
import { useContext } from 'react';
import { Label } from '../../../components/Label';
import { ModalContext } from '../../../context/ModalContext';

export const Units = ({ unit, propertyId }): JSX.Element => {
	console.log({ unit });
	const [, setModalContext] = useContext(ModalContext);

	return (
		<>
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
		</>
	);
};
