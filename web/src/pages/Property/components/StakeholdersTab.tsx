import {
	Box,
	Flex,
	Heading,
	Spacer,
	Button,
	Text,
	Input,
	Grid,
	GridItem,
	HStack
} from '@chakra-ui/react';
import { Stakeholders } from './Stakeholders';
import { IPropertyUnit, IStakeholder } from '../../../models/Property';
import { useState, useMemo, ChangeEvent } from 'react';
import { Center } from '../../../components/Center';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { ConfirmDialog } from '../../../components/ConfirmDialog';

export function StakeholdersTab({
	stakeHolders,
	setManageStakeholders,
	units,
	isFetching
}: {
	stakeHolders: IStakeholder[];
	setManageStakeholders: (value: boolean) => void;
	units: IPropertyUnit[];
	isFetching: boolean;
}): JSX.Element {
	const [searchTerm, setSearchTerm] = useState('');

	const filteredStakeholders = useMemo(() => {
		const searchTermLower = searchTerm.toLowerCase().trim();

		return stakeHolders
			.filter(
				(stakeholder) =>
					stakeholder.name.toLowerCase().includes(searchTermLower) ||
					stakeholder.email.toLowerCase().includes(searchTermLower)
			)
			.map((stakeholder) => {
				const unit = units.find((u) => u.unitId === stakeholder.unitId);
				return {
					...stakeholder,
					unitName: unit?.name || 'No unit assigned'
				};
			});
	}, [stakeHolders, searchTerm, units]); // Don't forget to add units to the dependency array

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
						<>
							<Box>
								<Grid
									templateColumns="repeat(8, 1fr)"
									gap={1}
									width={'full'}
									m={1}
									alignItems={'center'}
								>
									<GridItem colSpan={1}>
										<Text fontSize={'xl'} fontWeight={'bold'}>
											Unit
										</Text>
									</GridItem>
									<GridItem colSpan={2}>
										<Text fontSize={'xl'} fontWeight={'bold'}>
											Stakeholder name
										</Text>
									</GridItem>
									<GridItem colSpan={1}>
										<Text fontSize={'xl'} fontWeight={'bold'}>
											Phone
										</Text>
									</GridItem>
									<GridItem colSpan={2}>
										<Text fontSize={'xl'} fontWeight={'bold'}>
											Email
										</Text>
									</GridItem>
									<GridItem colSpan={1}>
										<Text fontSize={'xl'} fontWeight={'bold'}>
											Role
										</Text>
									</GridItem>
									<GridItem colSpan={1}></GridItem>
								</Grid>
							</Box>
							{filteredStakeholders?.map((stakeholder) => (
								<Stakeholders
									stakeHolder={stakeholder}
									key={stakeholder.stakeHolderId}
								/>
							))}
						</>
					)}
				</>
			)}
		</Box>
	);
}
