import { Tab, TabList, Tabs, Tooltip, IconButton, useToast, Button, Flex } from '@chakra-ui/react';
import { MinusIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { ProgressStatus } from '../../models/ProgressStatus';
import { ProjectStatus } from '../../models/Project';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useRemoveProgressTab } from '../../mutations/useRemoveProgressTab';
import { Input } from '../../components/forms/Input';

interface DashboardTabsProps {
	activeTab: string | ProgressStatus;
	statuses: ProgressStatus[];
	onChange: (tab: string | ProgressStatus) => void;
}

export const DashboardTabs = ({
	statuses,
	activeTab,
	onChange
}: DashboardTabsProps): JSX.Element => {
	const [dialogOpen, setDialogOpen] = useState(false);
	const { mutate: deleteProgressStatus } = useRemoveProgressTab();
	const toast = useToast();
	return (
		<>
			<Flex mb={4} alignItems={'center'}>
				<Input placeholder="Search for property..." />

				<Button ml={2}>Search</Button>
			</Flex>
			<Tabs defaultIndex={1} variant="soft-rounded" colorScheme="green" size={'sm'}>
				<TabList>
					<Tab
						onClick={() => onChange(ProjectStatus.ALL)}
						isSelected={activeTab === ProjectStatus.ALL}
						style={{ textTransform: 'capitalize' }}
					>
						{ProjectStatus.ALL.toLowerCase()}
					</Tab>
					<Tab
						onClick={() => onChange(ProjectStatus.OPEN)}
						isSelected={activeTab === ProjectStatus.OPEN}
						style={{ textTransform: 'capitalize' }}
					>
						{ProjectStatus.OPEN.toLowerCase()}
					</Tab>
					{statuses.map((status, sIdx) => (
						<Tab
							key={sIdx}
							onClick={() => onChange(status)}
							isSelected={(activeTab as ProgressStatus)?.id === status.id}
						>
							{status.name}
							{activeTab === status && (
								<ConfirmDialog
									header={`Delete progress status named: ${status.name}. Projects will be moved to previous status, You can see it in All tab`}
									setIsOpen={setDialogOpen}
									callback={async (confirmed) => {
										if (confirmed) {
											await deleteProgressStatus(status);
											toast({
												title: 'Progress status deleted',
												description: 'Project moved to Closed',
												status: 'success',
												duration: 5000,
												isClosable: true
											});
										}
										setDialogOpen(false);
									}}
									isOpen={dialogOpen}
								>
									<Tooltip label="Remove stream" aria-label="Remove">
										<IconButton
											aria-label={'Remove'}
											icon={<MinusIcon />}
											variant={'outline'}
											colorScheme={'gray'}
											borderRadius={'24px'}
											size={'xs'}
											ml={'2'}
											onClick={() => {
												setDialogOpen(true);
												console.log(
													`removed this one with id: ${status.id} !`
												);
											}}
										/>
									</Tooltip>
								</ConfirmDialog>
							)}
						</Tab>
					))}
					<Tab
						onClick={() => onChange(ProjectStatus.CLOSED)}
						isSelected={activeTab === ProjectStatus.CLOSED}
						style={{ textTransform: 'capitalize' }}
					>
						{ProjectStatus.CLOSED.toLowerCase()}
					</Tab>
					{/* <IconButton
				aria-label={'Add'}
				icon={<PlusIcon />}
				variant={'outline'}
				colorScheme={'gray'}
				borderRadius={'24px'}
			/> */}
				</TabList>
			</Tabs>
		</>
	);
};
