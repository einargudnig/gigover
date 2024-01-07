import React from 'react';
import styled from 'styled-components';
import { IPropertyUnit } from '../../../models/Property';
import { Text, Box, Flex, Spacer } from '@chakra-ui/react';
import { InviteStakeholder } from '../../InviteUser/InviteStakeholder';
import { Modal } from '../../Modal';

interface StakeholderModalProps {
	propertyId: number;
	units?: IPropertyUnit[];
	onClose: () => void;
}

const StakeHolderModalStyled = styled.div`
	h3 {
		display: flex;
		align-items: center;
		margin-bottom: ${(props) => props.theme.padding(2)};
		border-bottom: 1px solid ${(props) => props.theme.colors.border};
		padding-bottom: ${(props) => props.theme.padding(2)};

		svg {
			margin-left: 8px;
		}
	}

	ul {
		list-style-type: none;
		margin: 0;
		padding-left: 0;

		li {
			padding: 12px 0;
			display: flex;
			justify-content: space-between;

			&:not(:last-child) {
				border-bottom: 1px solid ${(props) => props.theme.colors.border};
			}
		}
	}
`;

export const StakeholderModal = ({
	propertyId,
	units,
	onClose
}: StakeholderModalProps): JSX.Element => {
	return (
		<Modal title={'Add StakeHolder'} open={true} onClose={onClose}>
			<StakeHolderModalStyled>
				<Text marginBottom={'4'} as={'h4'}>
					To add team members, they must have signed up for GigOver.
				</Text>
				<Flex justifyContent={'stretch'} alignItems={'start'}>
					<Box flexGrow={1}>
						<InviteStakeholder units={units} propertyId={propertyId} />
					</Box>
					<Spacer />
				</Flex>
			</StakeHolderModalStyled>
		</Modal>
	);
};
