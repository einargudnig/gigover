import React from 'react';
import EnhancedErrorBoundary from './EnhancedErrorBoundary';
import { ErrorCategory } from '../../sentry';
import { Button, Box, Text, Flex, Icon } from '@chakra-ui/react';
import { WarningIcon, RepeatIcon } from '@chakra-ui/icons';
import { FallbackProps } from './EnhancedErrorBoundary';

interface CompactErrorBoundaryProps {
	children: React.ReactNode;
	componentName?: string;
	errorCategory?: ErrorCategory;
	showErrorMessage?: boolean;
	minHeight?: string | number;
}

/**
 * Compact fallback component for widget or component errors
 */
const CompactFallback = ({
	error,
	resetError,
	showFeedback
}: FallbackProps & { showErrorMessage?: boolean; minHeight?: string | number }) => {
	return (
		<Box
			p={3}
			bg="gray.50"
			borderRadius="md"
			borderLeft="3px solid"
			borderColor="red.400"
			width="100%"
		>
			<Flex direction="column" gap={2}>
				<Flex align="center">
					<Icon as={WarningIcon} color="red.500" mr={2} />
					<Text fontWeight="medium">Component Error</Text>
				</Flex>

				<Text fontSize="sm" color="gray.600">
					This component encountered an error.
				</Text>

				<Flex mt={1} gap={2}>
					<Button
						size="sm"
						leftIcon={<RepeatIcon />}
						colorScheme="blue"
						onClick={resetError}
					>
						Reload
					</Button>

					<Button size="sm" variant="ghost" onClick={showFeedback}>
						Report
					</Button>
				</Flex>
			</Flex>
		</Box>
	);
};

/**
 * Compact error boundary for widgets or components that should not break the entire page
 */
const CompactErrorBoundary: React.FC<CompactErrorBoundaryProps> = ({
	children,
	componentName,
	errorCategory = ErrorCategory.RENDER,
	showErrorMessage = false,
	minHeight
}) => {
	return (
		<EnhancedErrorBoundary
			errorCategory={errorCategory}
			name={`Component:${componentName || 'unnamed'}`}
			fallback={(props) => (
				<CompactFallback
					{...props}
					showErrorMessage={showErrorMessage}
					minHeight={minHeight}
				/>
			)}
			retryable={true}
			showDetails={false}
		>
			{children}
		</EnhancedErrorBoundary>
	);
};

export default CompactErrorBoundary;
