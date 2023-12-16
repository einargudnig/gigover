import React from 'react';
import { Text, Grid, GridItem, HStack, Box, Button, Heading } from '@chakra-ui/react';

export const PropertyId = (): JSX.Element => {
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
							<Text fontSize={'lg'}>Lundur 1</Text>
						</HStack>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Address/Location:
							</Text>
							<Text fontSize={'lg'}>Lundur 1</Text>
						</HStack>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Zip code:
							</Text>
							<Text fontSize={'lg'}>200</Text>
						</HStack>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								City:
							</Text>
							<Text fontSize={'lg'}>Kopavogur</Text>
						</HStack>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Country:
							</Text>
							<Text fontSize={'lg'}>Iceland</Text>
						</HStack>
					</GridItem>
					<GridItem colSpan={2}>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Property size:
							</Text>
							<Text fontSize={'lg'}>5000 m2</Text>
						</HStack>
						<HStack m={'1'}>
							<Text fontWeight={'bold'} fontSize={'xl'}>
								Property type:
							</Text>
							<Text fontSize={'lg'}>apartment building</Text>
						</HStack>
					</GridItem>
					<GridItem colSpan={2}>
						<Text mb={'2'} fontSize={'xl'} fontWeight={'bold'}>
							Drawing/Documents
						</Text>
						<Button>Upload files</Button>
					</GridItem>
				</Grid>
			</Box>
			<hr />
		</>
	);
};
