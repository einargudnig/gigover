import { Box } from '@chakra-ui/react';
import React from 'react';

interface CenterProps {
	children: React.ReactNode;
}

export const Center = ({ children }: CenterProps) => {
	return (
		<Box
			display="flex"
			flex={1}
			width="100%"
			height="100%"
			alignItems="center"
			justifyContent="center"
		>
			{children}
		</Box>
	);
};
