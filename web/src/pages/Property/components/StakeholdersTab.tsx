import { Box, Flex, Heading, Spacer, Button, Text, Input } from '@chakra-ui/react';
import { Stakeholders } from './Stakeholders';
import { IStakeholder } from '../../../models/Property';
import { useState, useMemo, ChangeEvent } from 'react';
import { Center } from '../../../components/Center';
import { LoadingSpinner } from '../../../components/LoadingSpinner';

export function StakeholdersTab({
	stakeHolders,
	setManageStakeholders,
	isFetching
}: {
	stakeHolders: IStakeholder[];
	setManageStakeholders: (value: boolean) => void;
	isFetching: boolean;
}): JSX.Element {
	const [searchTerm, setSearchTerm] = useState('');

	// Use useMemo to prevent unnecessary filtering on every render
	const filteredStakeholders = useMemo(() => {
		const searchTermLower = searchTerm.toLowerCase().trim();

		return stakeHolders.filter(
			(stakeholder) =>
				stakeholder.name.toLowerCase().includes(searchTermLower) ||
				stakeholder.email.toLowerCase().includes(searchTermLower)
		);
	}, [stakeHolders, searchTerm]);

	const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};
	return (
		<Box mb={3} p={4} borderRadius={8} borderColor={'#EFEFEE'} bg={'white'} w="100%">
			<Flex mb={8} alignItems={'center'}>
				<Box>
					<Heading fontSize={'xl'}>Stakeholders</Heading>
				</Box>
				<Spacer />
				<Box>
					<Flex align="center">
						<Input
							placeholder="Search for name or email.."
							size="md"
							rounded="md"
							borderColor={'black'}
							mr={4}
							value={searchTerm}
							onChange={handleSearch}
						/>
						<Button
							variant="outline"
							width="220px"
							colorScheme="black"
							onClick={() => setManageStakeholders(true)}
						>
							Add stakeholder
						</Button>
					</Flex>
				</Box>
			</Flex>
			{!stakeHolders || stakeHolders.length === 0 ? (
				<Text m={4}>No stakeholders!</Text>
			) : (
				<>
					{isFetching ? (
						<Center>
							<LoadingSpinner />
						</Center>
					) : (
						filteredStakeholders?.map((stakeholder) => (
							<Stakeholders
								stakeHolder={stakeholder}
								key={stakeholder.stakeHolderId}
							/>
						))
					)}
				</>
			)}
		</Box>
	);
}
