import { Box, Flex, Spacer, Text } from '@chakra-ui/react';
import { IPropertyUnit } from '../../../models/Property';
import { InviteStakeholder } from '../../InviteUser/InviteStakeholder';
import { Modal } from '../../Modal';

interface StakeholderModalProps {
	propertyId: number;
	propertyName?: string;
	units?: IPropertyUnit[];
	onClose: () => void;
}

export const StakeholderModal = ({
	propertyId,
	propertyName,
	units,
	onClose
}: StakeholderModalProps): JSX.Element => {
	return (
		<Modal title={'Add StakeHolder'} open={true} onClose={onClose}>
			<Text
				as="h3"
				display="flex"
				alignItems="center"
				mb={2}
				borderBottomWidth="1px"
				borderColor="gray.200"
				pb={2}
			>
				To add team members, they must have signed up for GigOver.
			</Text>
			<Flex justifyContent={'stretch'} alignItems={'start'}>
				<Box flexGrow={1}>
					<InviteStakeholder
						units={units}
						propertyId={propertyId}
						propertyName={propertyName}
						onClose={onClose}
					/>
				</Box>
				<Spacer />
			</Flex>
		</Modal>
	);
};
