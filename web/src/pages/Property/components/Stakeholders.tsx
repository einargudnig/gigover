import React from 'react';
import { Text, Grid, GridItem, HStack } from '@chakra-ui/react';

export const Stakeholders = (): JSX.Element => {
	return (
		<>
			<Grid templateColumns="repeat(8, 1fr)" gap={1} width={'full'} m={1}>
				<GridItem colSpan={2}>
					<HStack>
						<Text fontSize={'xl'} fontWeight={'bold'}>
							Stakeholder:
						</Text>
						<Text fontSize={'lg'}>Jon Jonsson</Text>
					</HStack>
				</GridItem>
				<GridItem colSpan={2}>
					<HStack>
						<Text fontSize={'xl'} fontWeight={'bold'}>
							Phone number:
						</Text>
						<Text fontSize={'lg'}>555-5555</Text>
					</HStack>
				</GridItem>
				<GridItem colSpan={2}>
					<HStack>
						<Text fontSize={'xl'} fontWeight={'bold'}>
							Email:
						</Text>
						<Text fontSize={'lg'}>jonjonsson@email.com</Text>
					</HStack>
				</GridItem>
				<GridItem colSpan={2}>
					<HStack>
						<Text fontSize={'xl'} fontWeight={'bold'}>
							Role:
						</Text>
						<Text fontSize={'lg'}>Formadur husfelagsins</Text>
					</HStack>
				</GridItem>
			</Grid>
		</>
	);
};
