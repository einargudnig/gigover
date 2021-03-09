import { Tab, TabList, Tabs } from '@chakra-ui/react';
import React from 'react';

interface DashboardTabsProps {
	tabs: string[];
	activeTab: string;
	onChange: (tab: string) => void;
}

export const DashboardTabs = ({ tabs, activeTab, onChange }: DashboardTabsProps): JSX.Element => (
	<Tabs variant="soft-rounded" colorScheme="green">
		<TabList>
			{tabs.map((tab, tabIndex) => (
				<Tab
					key={tabIndex}
					onClick={() => onChange(tab)}
					active={tab === activeTab}
					style={{ textTransform: 'capitalize' }}
				>
					{tab.toLowerCase()}
				</Tab>
			))}
		</TabList>
	</Tabs>
);
