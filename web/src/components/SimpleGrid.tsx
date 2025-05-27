import { SimpleGrid as ChakraSimpleGrid } from '@chakra-ui/react'; // Imported Chakra's SimpleGrid
import React from 'react';
import { Theme } from '../Theme';

interface SimpleGridProps {
	spacing?: string;
	itemWidth: number;
	children: React.ReactNode;
}

export const SimpleGrid = ({
	spacing = Theme.padding(3), // Assuming Theme.padding(3) resolves to a Chakra theme-compatible spacing value (e.g., '12px' or 3 for theme scale)
	itemWidth,
	children
}: SimpleGridProps): JSX.Element => {
	return (
		<ChakraSimpleGrid minChildWidth={`${itemWidth}px`} spacing={spacing} width="100%">
			{children}
		</ChakraSimpleGrid>
	);
};
