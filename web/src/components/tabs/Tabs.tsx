import { Box, Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Tab } from './Tab';

export interface TabsProps<T extends Record<K, React.ReactNode>, K extends keyof T> {
	labelKey: K;
	valueKey?: K;
	tabs: T[];
	defaultTab?: T;
	onChange?: (tab?: T | undefined) => void;
	children?: (props: { tab: T }) => React.ReactNode;
	valueCompare?: boolean;
	tabActions?: React.ReactNode;
}

export function Tabs<T extends Record<K, React.ReactNode>, K extends keyof T>({
	tabs,
	children,
	onChange,
	labelKey,
	valueKey,
	defaultTab,
	valueCompare,
	tabActions
}: TabsProps<T, K>) {
	const comparator = (a: T, b?: T) =>
		valueCompare && valueKey
			? b && a[valueKey] === b[valueKey]
			: a && b && JSON.stringify(a) === JSON.stringify(b);
	const [selectedTab, setSelectedTab] = useState<T | undefined>(defaultTab);

	useEffect(() => {
		if (onChange) {
			onChange(selectedTab);
		}
	}, [onChange, selectedTab]);

	return (
		<>
			<Flex justify="space-between" borderBottomWidth="1px" borderColor="#e5e5e5">
				<Flex as="nav">
					{tabs.map((t, tabIndex) => (
						<Tab
							key={tabIndex}
							tab={t}
							onClick={(selected) => setSelectedTab(selected as T)}
							labelKey={labelKey}
							selected={comparator(t, selectedTab)}
						/>
					))}
				</Flex>
				{tabActions && (
					<Box alignSelf="center">
						<div>{tabActions}</div>
					</Box>
				)}
			</Flex>
			{children && (
				<div>
					{selectedTab && children && children({ tab: selectedTab })}
					{/* {typeof children === 'function' && selectedTab
						? React.createElement(children as React.ReactNode, {
								tab: selectedTab
						  })
						: children} */}
				</div>
			)}
		</>
	);
}
