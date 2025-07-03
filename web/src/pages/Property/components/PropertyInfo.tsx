import { Box, Button, Flex, Grid, GridItem, HStack, Heading, Text } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { TrashIcon } from '../../../components/icons/TrashIcon';
import { ModalContext } from '../../../context/ModalContext';
import { useRemoveProperty } from '../../../mutations/properties/useRemoveProperty';

export const PropertyInfo = ({ property }): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const deleteProperty = useRemoveProperty();
	const navigate = useNavigate();

	console.log('property in PropertyInfo', property);

	return (
		<>
			<Box mb={3} p={4} borderRadius={8} bg={'white'} w="100%">
				<Heading mb={'4'} fontSize={'xl'}>
					Property information
				</Heading>
				<Grid templateColumns="repeat(6, 1fr)" gap={1} width={'full'}>
					<GridItem colSpan={2}>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Name:
							</Text>
							<Text fontSize={'lg'}>{property.name}</Text>
						</HStack>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Address:
							</Text>
							<Text fontSize={'lg'}>{property.address}</Text>
						</HStack>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Zip code:
							</Text>
							<Text fontSize={'lg'}>{property.zipCode}</Text>
						</HStack>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								City:
							</Text>
							<Text fontSize={'lg'}>{property.city}</Text>
						</HStack>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Country:
							</Text>
							<Text fontSize={'lg'}>{property.country}</Text>
						</HStack>
					</GridItem>
					<GridItem colSpan={2}>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Property size:
							</Text>
							<Text fontSize={'lg'}>{property.size}</Text>
						</HStack>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Property type:
							</Text>
							<Text fontSize={'lg'}>{property.type}</Text>
						</HStack>
					</GridItem>
					<GridItem colSpan={2}>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Number of Units:
							</Text>
							<Text fontSize={'lg'}>{property.units.length}</Text>
						</HStack>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Number of Stakeholders:
							</Text>
							<Text fontSize={'lg'}>{property.stakeHolders.length}</Text>
						</HStack>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Number of Projects:
							</Text>
							<Text fontSize={'lg'}>{property.projects.length}</Text>
						</HStack>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Number of Documents:
							</Text>
							<Text fontSize={'lg'}>{property.documents.length}</Text>
						</HStack>
					</GridItem>
				</Grid>
				<Flex justifyContent={'flex-end'}>
					<HStack>
						<ConfirmDialog
							header="Delete property"
							callback={async (b) => {
								if (b) {
									await deleteProperty.mutateAsync(property.propertyId);
									navigate('/property');
								}
								setDeleteDialogOpen(false);
							}}
							isOpen={deleteDialogOpen}
							setIsOpen={setDeleteDialogOpen}
							confirmButtonText="Delete"
						>
							<Button
								variant="outline"
								colorScheme="red"
								leftIcon={<TrashIcon color="red" />}
								onClick={() => setDeleteDialogOpen(true)}
							>
								Delete property
							</Button>
						</ConfirmDialog>
						<Button
							variant="outline"
							colorScheme="black"
							onClick={() =>
								setModalContext({ editProperty: { property: property } })
							}
						>
							Edit property
						</Button>
					</HStack>
				</Flex>
			</Box>
		</>
	);
};
