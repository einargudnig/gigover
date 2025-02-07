import { Box, Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { IStakeholder } from '../../../models/Property';
import { useRemoveStakeHolder } from '../../../mutations/properties/useRemoveStakeHolder';

export const Stakeholders = ({ stakeHolder }): JSX.Element => {
	const { propertyId } = useParams();
	const [dialogOpen, setDialogOpen] = useState(false);

	const { mutate: removeStakeholder, isLoading } = useRemoveStakeHolder();

	const handleRemove = async (stakeholder: IStakeholder) => {
		console.log('stakeholder in REMOVE', stakeholder);
		try {
			const response = removeStakeholder({
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
					<GridItem colSpan={1}>
						<Text fontSize={'lg'}>{stakeHolder.unitName}</Text>
					</GridItem>
					<GridItem colSpan={2}>
						<Text fontSize={'lg'}>{stakeHolder.name}</Text>
					</GridItem>
					<GridItem colSpan={1}>
						<Text fontSize={'lg'}>{stakeHolder.phoneNumber}</Text>
					</GridItem>
					<GridItem colSpan={2}>
						<Text fontSize={'lg'}>{stakeHolder.email}</Text>
					</GridItem>
					<GridItem colSpan={1}>
						<Text fontSize={'lg'}>{stakeHolder.role}</Text>
					</GridItem>

					<GridItem colSpan={1}>
						<Box>
							<ConfirmDialog
								header={'Remove Stakeholder'}
								setIsOpen={setDialogOpen}
								callback={(b) => {
									if (b) {
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
					</GridItem>
				</Grid>
			</div>
		</>
	);
};
