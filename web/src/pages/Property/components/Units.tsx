import React from 'react';
import { Text, Grid, GridItem, HStack, Button } from '@chakra-ui/react';
import { PlusIcon } from '../../../components/icons/PlusIcon';

export const Units = (): JSX.Element => {
	return (
		<>
			<Grid templateColumns="repeat(6, 1fr)" gap={1} width={'full'} m={1}>
				<GridItem colSpan={2}>
					<HStack>
						<Text fontSize={'xl'} fontWeight={'bold'}>
							Unit name:
						</Text>
						<Text fontSize={'lg'}>Bilastæði</Text>
					</HStack>
				</GridItem>
				<GridItem colSpan={2}>
					<HStack>
						<Text fontSize={'xl'} fontWeight={'bold'}>
							Unit size:
						</Text>
						<Text fontSize={'lg'}>800m</Text>
					</HStack>
				</GridItem>
				<GridItem colSpan={2}>
					<HStack>
						<Text fontSize={'xl'} fontWeight={'bold'}>
							Property type:
						</Text>
						<Text fontSize={'lg'}>Parking lot</Text>
					</HStack>
				</GridItem>
				<GridItem colSpan={2}>
					<HStack>
						<Text fontSize={'xl'} fontWeight={'bold'}>
							Stakeholder:
						</Text>
						<Text fontSize={'lg'}>Guðmundur</Text>
					</HStack>
				</GridItem>
				<GridItem colSpan={2}>
					<HStack>
						<Text fontSize={'xl'} fontWeight={'bold'}>
							Phone number:
						</Text>
						<Text fontSize={'lg'}>663-3839</Text>
					</HStack>
				</GridItem>
				<GridItem colSpan={2}>
					<HStack>
						<Text fontSize={'xl'} fontWeight={'bold'}>
							Role:
						</Text>
						<Text fontSize={'lg'}>Snjómokstur</Text>
					</HStack>
				</GridItem>
				<GridItem colSpan={2}>
					<Button leftIcon={<PlusIcon />}>Add stakeholder to unit</Button>
				</GridItem>
			</Grid>
		</>
	);
};
