import { Tab, TabList, Tabs, IconButton, useToast } from '@chakra-ui/react';
import { MinusIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { ProgressStatus } from '../../models/ProgressStatus';
import { ProjectStatus } from '../../models/Project';
import { ConfirmDialog } from '../../components/ConfirmDialog';
// import { useRemoveProgressTab } from '../../queries/useRemoveProgressTab';

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
	// const { mutate: deleteProgressStatus } = useRemoveProgressTab();
	const toast = useToast();
	return (
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
				{statuses.map((s, sIdx) => (
					<Tab
						key={sIdx}
						onClick={() => onChange(s)}
						isSelected={(activeTab as ProgressStatus)?.id === s.id}
					>
						{s.name}
						{activeTab === s && (
							<ConfirmDialog
								header={'Delete progress status, project will be moved to Closed'}
								setIsOpen={setDialogOpen}
								callback={(confirmed) => {
									if (confirmed) {
										console.log('confirmed');
										// await deleteProgressStatus({ id: s.id });
									}
									setDialogOpen(false);
									toast({
										title: 'Progress status deleted',
										description: 'Project moved to Closed',
										status: 'success',
										duration: 5000,
										isClosable: true
									});
								}}
								isOpen={dialogOpen}
							>
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
										console.log(`removed this one with id: ${s.id} !`);
									}}
								/>
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
	);
};
