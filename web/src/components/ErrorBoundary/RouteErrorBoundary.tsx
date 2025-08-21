import React from 'react';
import EnhancedErrorBoundary from './EnhancedErrorBoundary';
import { ErrorCategory } from '../../sentry';
import { Button, Heading, Text, VStack, Box, Icon, HStack } from '@chakra-ui/react';
import { WarningIcon, ArrowBackIcon, RepeatIcon } from '@chakra-ui/icons';
import { FallbackProps } from './EnhancedErrorBoundary';

interface RouteErrorBoundaryProps {
	children: React.ReactNode;
	routeName?: string;
}

/**
 * Custom fallback component for route errors
 */
const RouteFallback = ({ error, resetError, showFeedback }: FallbackProps) => {
	return (
		<Box maxW="800px" mx="auto" p={8} mt={10} textAlign="center">
			<VStack spacing={6} align="center">
				<Icon as={WarningIcon} w={16} h={16} color="red.500" />

				<Heading size="xl">Page Error</Heading>

				<Text fontSize="lg">
					We encountered a problem loading this page. Our team has been notified.
				</Text>

				<Box fontSize="md" opacity={0.8} maxW="600px">
					<Text>{error?.message || 'An unknown error occurred'}</Text>
				</Box>

				<HStack spacing={4} pt={4}>
					<Button leftIcon={<ArrowBackIcon />} onClick={() => window.history.back()}>
						Go Back
					</Button>

					<Button leftIcon={<RepeatIcon />} colorScheme="blue" onClick={resetError}>
						Try Again
					</Button>

					<Button variant="outline" colorScheme="black" onClick={showFeedback}>
						Report Problem
					</Button>
				</HStack>
			</VStack>
		</Box>
	);
};

/**
 * Error boundary specifically for route components with appropriate styling and behavior
 */
const RouteErrorBoundary: React.FC<RouteErrorBoundaryProps> = ({ children, routeName }) => {
	return (
		<EnhancedErrorBoundary
			errorCategory={ErrorCategory.RENDER}
			name={`Route:${routeName || 'unnamed'}`}
			fallback={RouteFallback}
			retryable={true}
		>
			{children}
		</EnhancedErrorBoundary>
	);
};

export default RouteErrorBoundary;
