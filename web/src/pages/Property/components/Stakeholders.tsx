import React, { useState } from 'react';
import { Text, Grid, GridItem, HStack, Box, Spacer, Button } from '@chakra-ui/react';
import { IStakeholder } from '../../../models/Property';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { useParams } from 'react-router-dom';

export const Stakeholders = (): JSX.Element => {
	const { propertyId } = useParams();
	const [dialogOpen, setDialogOpen] = useState(false);
	const tempData: IStakeholder[] = [
		{
			uId: 1,
			name: 'Jon Jonsson',
			phoneNumber: '555-5555',
			email: 'jonjonson@email.com',
			role: 'supervisor',
			propertyId: Number(propertyId),
			unitId: 5
		},
		{
			uId: 2,
			name: 'Jon Jonsson',
			phoneNumber: '555-5555',
			email: 'jonjonson@email.com',
			role: 'supervisor',
			propertyId: Number(propertyId),
			unitId: 5
		},
		{
			uId: 3,
			name: 'Jon Jonsson',
			phoneNumber: '555-5555',
			email: 'jonjonson@email.com',
			role: 'supervisor',
			propertyId: Number(propertyId),
			unitId: 5
		},
		{
			uId: 4,
			name: 'Jon Jonsson',
			phoneNumber: '555-5555',
			email: 'jonjonson@email.com',
			role: 'supervisor',
			propertyId: Number(propertyId),
			unitId: 5
		},
		{
			uId: 5,
			name: 'Jon Jonsson',
			phoneNumber: '555-5555',
			email: 'jonjonson@email.com',
			role: 'supervisor',
			propertyId: Number(propertyId),
			unitId: 5
		}
	];

	return (
		<>
			{tempData.map((stakeholder) => (
				<>
					<Grid
						templateColumns="repeat(8, 1fr)"
						gap={1}
						width={'full'}
						m={1}
						alignItems={'center'}
					>
						<GridItem colSpan={2}>
							<HStack>
								<Text fontSize={'xl'} fontWeight={'bold'}>
									Stakeholder:
								</Text>
								<Text fontSize={'lg'}>{stakeholder.name}</Text>
							</HStack>
						</GridItem>
						<GridItem colSpan={2}>
							<HStack>
								<Text fontSize={'xl'} fontWeight={'bold'}>
									Phone number:
								</Text>
								<Text fontSize={'lg'}>{stakeholder.phoneNumber}</Text>
							</HStack>
						</GridItem>
						<GridItem colSpan={2}>
							<HStack>
								<Text fontSize={'xl'} fontWeight={'bold'}>
									Email:
								</Text>
								<Text fontSize={'lg'}>{stakeholder.email}</Text>
							</HStack>
						</GridItem>
						<GridItem colSpan={2}>
							<HStack>
								<Box>
									<HStack>
										<Text fontSize={'xl'} fontWeight={'bold'}>
											Role:
										</Text>
										<Text fontSize={'lg'}>{stakeholder.role}</Text>
									</HStack>
								</Box>
								<Spacer />
								<Box>
									<ConfirmDialog
										header={'Remove Stakeholder'}
										setIsOpen={setDialogOpen}
										callback={(b) => {
											if (b) {
												console.log('Did I press the delete?');
												// remove Stakeholder mutation!
											}
											setDialogOpen(false);
										}}
										isOpen={dialogOpen}
									>
										<Button
											colorScheme={'red'}
											variant={'outline'}
											onClick={() => setDialogOpen(true)}
										>
											Remove
										</Button>
									</ConfirmDialog>
								</Box>
							</HStack>
						</GridItem>
					</Grid>
				</>
			))}
		</>
	);
};
