import React, { useContext } from 'react';
import { Text, Box, Grid, GridItem, HStack, Heading, Button, Flex } from '@chakra-ui/react';
import { PlusIcon } from '../../../components/icons/PlusIcon';
import { ModalContext } from '../../../context/ModalContext';

export const PropertyInfo = ({ property }): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);

	return (
		<>
			<Box mb={1} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'#EFEFEE'} w="100%">
				<Heading mb={'4'} fontSize={'xl'}>
					Property information
				</Heading>
				<Grid templateColumns="repeat(6, 1fr)" gap={1} width={'full'}>
					<GridItem colSpan={2}>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Property:
							</Text>
							<Text fontSize={'lg'}>{property.name}</Text>
						</HStack>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Address/Location:
							</Text>
							<Text fontSize={'lg'}>{property.name}</Text>
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
						<Text mb={'2'} fontSize={'xl'} fontWeight={'bold'}>
							Drawing/Documents
						</Text>
						{/* <Button>Upload files</Button> */}
						<Text>🚧 Upload files is under construction 🚧</Text>
					</GridItem>
				</Grid>
				<Flex justifyContent={'flex-end'}>
					<Button
						leftIcon={<PlusIcon />}
						onClick={() => setModalContext({ editProperty: { property: property } })}
					>
						Edit property
					</Button>
				</Flex>
			</Box>
		</>
	);
};
