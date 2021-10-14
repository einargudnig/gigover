import React from 'react';
import styled, { css } from 'styled-components';

const TabButton = styled.button<{ selected: boolean }>`
	border-bottom: 2px solid transparent;
	outline: 0;
	padding: 8px 16px;
	color: #000;
	opacity: 0.5;
	transition: all 0.2s linear;

	${(props) =>
		props.selected &&
		css`
			opacity: 1;
			border-bottom: 2px solid ${props.theme.colors.yellow};
		`};
`;

export type TabType = { value: string | number; label: string };

export interface TabProps<T> {
	tab: T;
	labelKey: keyof T;
	onClick: (tab: T) => void;
	selected?: boolean;
}

export function Tab<T>({ tab, labelKey, onClick, selected }: TabProps<T>) {
	return (
		<TabButton selected={selected ?? false} onClick={() => onClick(tab)}>
			{tab[labelKey]}
		</TabButton>
	);
}
