import { Box, Flex, Heading, Spacer, Button, Text } from '@chakra-ui/react';
import { Stakeholders } from './Stakeholders';
import { IStakeholder } from '../../../models/Property';

export function StakeholdersTab({
	stakeHolders,
	setManageStakeholders
}: {
	stakeHolders: IStakeholder[];
	setManageStakeholders: (value: boolean) => void;
}): JSX.Element {
	return (
		<Box mb={3} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'white'} w="100%">
			<Flex mb={8} alignItems={'center'}>
				<Box>
					<Heading fontSize={'xl'}>Stakeholders</Heading>
				</Box>
				<Spacer />
				<Box>
					<Button
						variant="outline"
						colorScheme="black"
						onClick={() => setManageStakeholders(true)}
					>
						Add stakeholders
					</Button>
				</Box>
			</Flex>
			{!stakeHolders || stakeHolders.length === 0 ? (
				<Text m={4}>No stakeholders!</Text>
			) : (
				stakeHolders?.map((stakeholder) => (
					<Stakeholders stakeHolder={stakeholder} key={stakeholder.stakeHolderId} />
				))
			)}
		</Box>
	);
}
