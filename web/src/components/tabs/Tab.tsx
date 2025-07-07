import { Button } from '@chakra-ui/react'; // Added Button
import React from 'react';

export type TabType = { value: string | number; label: string };

export interface TabProps<T extends Record<K, React.ReactNode>, K extends keyof T> {
	tab: T;
	labelKey: K;
	onClick: (tab: T) => void;
	selected?: boolean;
}

export function Tab<T extends Record<K, React.ReactNode>, K extends keyof T>({
	tab,
	labelKey,
	onClick,
	selected
}: TabProps<T, K>) {
	return (
		// Replaced TabButton with Chakra Button and style props
		<Button
			type={'button'}
			variant="unstyled" // To remove default button styling
			borderBottomWidth="2px"
			borderColor={selected ? 'yellow.500' : 'transparent'} // Assuming theme.colors.yellow maps to yellow.500
			outline={0}
			px={4} // 16px padding
			py={2} // 8px padding
			color="black"
			opacity={selected ? 1 : 0.5}
			transition="all 0.2s linear"
			_focus={{ boxShadow: 'none' }} // Remove focus outline if not desired
			onClick={() => onClick(tab)}
			borderRadius={0} // Remove default border radius from button
		>
			{tab[labelKey]}
		</Button>
	);
}
