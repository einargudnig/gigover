import React, { useState } from 'react';
import { Text, Grid, GridItem, HStack, Box, Spacer, Button } from '@chakra-ui/react';
import { ConfirmDialog } from '../../../components/ConfirmDialog';

export const Stakeholders = ({ stakeHolders }): JSX.Element => {
	const [dialogOpen, setDialogOpen] = useState(false);

	return (
		<>
			{!stakeHolders || stakeHolders.length === 0 ? (
				<Text>No Stakeholders found</Text>
			) : (
				stakeHolders.map((stakeholder) => (
					<div key={stakeholder.uId}>
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
										Name:
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
					</div>
				))
			)}
		</>
	);
};
