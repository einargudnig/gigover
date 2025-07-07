import {
	Box,
	BoxProps,
	Input as ChakraInput,
	InputProps as ChakraInputProps,
	useTheme
} from '@chakra-ui/react';
import { forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, ChakraInputProps>((props, ref) => {
	const theme = useTheme();
	return (
		<ChakraInput
			ref={ref}
			borderWidth="1px"
			borderColor={theme.colors.gray[300]} // Assuming 'border' maps to a gray color
			background="#fff"
			borderRadius="6px"
			boxShadow="4px 4px 10px rgba(0, 0, 0, 0.06)"
			padding="12px 16px"
			width="100%"
			transition="all 0.2s linear"
			_focus={{
				outlineColor: theme.colors.green[500], // Assuming 'green' maps to a green color
				borderColor: theme.colors.green[500], // Chakra typically uses borderColor for focus ring
				boxShadow: `0 0 0 1px ${theme.colors.green[500]}` // Optional: for a more Chakra-like focus
			}}
			{...props}
		/>
	);
});

Input.displayName = 'Input';

export const InputWrapper = (props: BoxProps): JSX.Element => (
	<Box marginBottom="24px" {...props} />
);
