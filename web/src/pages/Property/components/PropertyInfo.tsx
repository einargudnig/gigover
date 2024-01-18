import React, { useContext, useState } from 'react';
import { Text, Box, Grid, GridItem, HStack, Heading, Button, Flex } from '@chakra-ui/react';
import { PlusIcon } from '../../../components/icons/PlusIcon';
import { ModalContext } from '../../../context/ModalContext';
import { UploadPropertyDocuments } from './UploadPropertyDocuments';

export const PropertyInfo = ({ property }): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const [upload, setUpload] = useState(false);

	return (
		<>
			{upload && (
				<UploadPropertyDocuments
					onClose={() => setUpload(false)}
					onComplete={(status) => {
						console.log('status', status);
					}}
					propertyId={property.id}
				/>
			)}
			<Box mb={3} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'#EFEFEE'} w="100%">
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
					</GridItem>
					<GridItem colSpan={2}>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Number of Documents:
							</Text>
							{/* <Text fontSize={'lg'}>{property.documents.length}</Text> */}
							<Text fontSize={'lg'}>0</Text>
						</HStack>
						<Button onClick={() => setUpload(true)}>Upload files</Button>
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
