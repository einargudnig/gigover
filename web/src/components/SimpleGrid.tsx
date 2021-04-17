import React from 'react';
import styled from 'styled-components';
import { Theme } from '../Theme';

interface SimpleGridProps {
	spacing?: string;
	itemWidth: number;
	children: React.ReactNode;
}

const SimpleGridStyled = styled.div<Omit<SimpleGridProps, 'children'>>`
	display: grid;
	width: 100%;
	grid-gap: ${(props) => props.spacing};
	grid-template-columns: repeat(auto-fit, minmax(${(props) => `${props.itemWidth}px`}, auto));
`;

export const SimpleGrid = ({
	spacing = Theme.padding(3),
	itemWidth,
	children
}: SimpleGridProps): JSX.Element => {
	return (
		<SimpleGridStyled itemWidth={itemWidth} spacing={spacing}>
			{children}
		</SimpleGridStyled>
	);
};
