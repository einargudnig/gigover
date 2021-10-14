import React from 'react';

export type TabType = { value: string | number; label: string };

export interface TabProps<T> {
	tab: T;
	labelKey: keyof T;
	onClick: (tab: T) => void;
	selected?: boolean;
}

const selectedTabClasses =
	'border-heimkaup whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none';
const unselectedTabClasses =
	'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none';

export function Tab<T>({ tab, labelKey, onClick, selected }: TabProps<T>) {
	return (
		<button
			className={selected ? selectedTabClasses : unselectedTabClasses}
			onClick={() => onClick(tab)}
		>
			{tab[labelKey]}
		</button>
	);
}
