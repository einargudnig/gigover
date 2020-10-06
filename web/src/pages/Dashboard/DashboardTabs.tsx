import React from 'react';
import styled, { css } from 'styled-components';

const TabContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Tab = styled.div<{ active: boolean }>`
	text-align: center;
	margin: 0 24px;
	cursor: pointer;
	text-transform: capitalize;
	user-select: none;

	${(props) =>
		props.active &&
		css`
			font-weight: bold;
			color: ${props.theme.colors.green};
		`}
`;

interface DashboardTabsProps {
	tabs: string[];
	activeTab: string;
	onChange: (tab: string) => void;
}

export const DashboardTabs = ({ tabs, activeTab, onChange }: DashboardTabsProps): JSX.Element => (
	<TabContainer>
		{tabs.map((tab, tabIndex) => (
			<Tab key={tabIndex} onClick={() => onChange(tab)} active={tab === activeTab}>
				{tab.toLowerCase()}
			</Tab>
		))}
	</TabContainer>
);
