import {
	Box,
	BoxProps,
	Link as ChakraLink,
	LinkProps as ChakraLinkProps,
	SystemStyleObject,
	useTheme
} from '@chakra-ui/react';
import React from 'react';
import { Link as ReactRouterLink, LinkProps as ReactRouterLinkProps } from 'react-router-dom';

export const CardBase: React.FC<BoxProps> = ({ children, ...rest }) => {
	return (
		<Box
			maxWidth="100%"
			borderRadius="12px"
			bg="white"
			padding="24px"
			transition="all 0.2s linear"
			boxShadow="0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
			{...rest} // Pass down other BoxProps
		>
			{children}
		</Box>
	);
};

// Combine ChakraLinkProps and ReactRouterLinkProps for CardBaseLink
// Omit 'as' from ChakraLinkProps (used internally by Chakra) and 'to' if types conflict (prefer ReactRouterLink's 'to')
type CombinedLinkProps = Omit<ChakraLinkProps, 'as' | 'to'> & ReactRouterLinkProps;

export const CardBaseLink: React.FC<CombinedLinkProps> = ({ children, to, sx, ...rest }) => {
	const theme = useTheme();

	// Define base and hover box shadows
	const baseBoxShadow = theme.shadows.md;
	const hoverBoxShadow = '5px 10px 20px rgba(0, 0, 0, 0.1)';

	const linkStyles: SystemStyleObject = {
		display: 'block',
		maxWidth: '100%',
		borderRadius: '12px',
		bg: 'white',
		padding: '24px',
		marginBottom: '24px',
		transition: 'all 0.2s linear',
		boxShadow: baseBoxShadow,
		_hover: {
			boxShadow: hoverBoxShadow,
			textDecoration: 'none'
		},
		...sx
	};

	return (
		<ChakraLink as={ReactRouterLink} to={to} sx={linkStyles} {...rest}>
			{children}
		</ChakraLink>
	);
};
