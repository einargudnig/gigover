import { Tab, TabList, Tabs } from '@chakra-ui/react';
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
}: DashboardTabsProps): JSX.Element => (
	<Tabs defaultIndex={1} variant="soft-rounded" colorScheme="green" size={'sm'}>
		<TabList>
			<Tab
				onClick={() => onChange(ProjectStatus.ALL)}
				active={activeTab === ProjectStatus.ALL}
				style={{ textTransform: 'capitalize' }}
			>
				{ProjectStatus.ALL.toLowerCase()}
			</Tab>
			<Tab
				onClick={() => onChange(ProjectStatus.OPEN)}
				active={activeTab === ProjectStatus.OPEN}
				style={{ textTransform: 'capitalize' }}
			>
				{ProjectStatus.OPEN.toLowerCase()}
			</Tab>
			{statuses.map((s, sIdx) => (
				<Tab
					key={sIdx}
					onClick={() => onChange(s)}
					active={(activeTab as ProgressStatus)?.id === s.id}
				>
					{s.name}
				</Tab>
			))}
			<Tab
				onClick={() => onChange(ProjectStatus.CLOSED)}
				active={activeTab === ProjectStatus.CLOSED}
				style={{ textTransform: 'capitalize' }}
			>
				{ProjectStatus.CLOSED.toLowerCase()}
			</Tab>
			{/*<IconButton*/}
			{/*	aria-label={'Add'}*/}
			{/*	icon={<PlusIcon />}*/}
			{/*	variant={'outline'}*/}
			{/*	colorScheme={'gray'}*/}
			{/*	borderRadius={'24px'}*/}
			{/*/>*/}
		</TabList>
	</Tabs>
);
