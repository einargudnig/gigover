import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Text, Grid, GridItem, HStack, Box, Spacer, Button } from '@chakra-ui/react';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { useRemoveStakeHolder } from '../../../mutations/properties/useRemoveStakeHolder';
import { IStakeholder } from '../../../models/Property';

export const Stakeholders = ({ stakeHolder }): JSX.Element => {
	const { propertyId } = useParams();
	const [dialogOpen, setDialogOpen] = useState(false);
	// console.log('stakeHolder', stakeHolder);

	const { mutate: removeStakeholder, isLoading } = useRemoveStakeHolder();

	const handleRemove = async (stakeholder: IStakeholder) => {
		console.log('stakeholder in REMOVE', stakeholder);
		try {
			const response = await removeStakeholder({
				stakeHolderId: stakeholder.stakeHolderId,
				propertyId: Number(propertyId),
				unitId: stakeholder.unitId,
				uId: stakeholder.uId,
				role: stakeholder.role,
				name: stakeholder.name,
				email: stakeholder.email,
				phoneNumber: stakeholder.phoneNumber
			});
			console.log('response', response);
		} catch (e) {
			console.log('error', e);
		}
	};

	return (
		<>
			<div key={stakeHolder.stakeHolderId}>
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
							<Text fontSize={'lg'}>{stakeHolder.name}</Text>
						</HStack>
					</GridItem>
					<GridItem colSpan={2}>
						<HStack>
							<Text fontSize={'xl'} fontWeight={'bold'}>
								Phone number:
							</Text>
							<Text fontSize={'lg'}>{stakeHolder.phoneNumber}</Text>
						</HStack>
					</GridItem>
					<GridItem colSpan={2}>
						<HStack>
							<Text fontSize={'xl'} fontWeight={'bold'}>
								Email:
							</Text>
							<Text fontSize={'lg'}>{stakeHolder.email}</Text>
						</HStack>
					</GridItem>
					<GridItem colSpan={2}>
						<HStack>
							<Box>
								<HStack>
									<Text fontSize={'xl'} fontWeight={'bold'}>
										Role:
									</Text>
									<Text fontSize={'lg'}>{stakeHolder.role}</Text>
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
											handleRemove(stakeHolder);
										}
										setDialogOpen(false);
									}}
									isOpen={dialogOpen}
								>
									<Button
										colorScheme={'red'}
										variant={'outline'}
										onClick={() => setDialogOpen(true)}
										isLoading={isLoading}
									>
										Remove
									</Button>
								</ConfirmDialog>
							</Box>
						</HStack>
					</GridItem>
				</Grid>
			</div>
		</>
	);
};
