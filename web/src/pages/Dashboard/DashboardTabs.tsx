import { Tab, TabList, Tabs, IconButton } from '@chakra-ui/react';
import { MinusIcon } from '@chakra-ui/icons';
import React from 'react';
import { ProgressStatus } from '../../models/ProgressStatus';
import { ProjectStatus } from '../../models/Project';

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
							<IconButton
								aria-label={'Remove'}
								icon={<MinusIcon />}
								variant={'outline'}
								colorScheme={'gray'}
								borderRadius={'24px'}
								size={'xs'}
								onClick={() => {
									console.log('removed this one!');
								}}
							/>
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
