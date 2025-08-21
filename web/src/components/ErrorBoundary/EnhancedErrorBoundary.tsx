import { ChevronDownIcon, ChevronUpIcon, RepeatIcon, WarningIcon } from '@chakra-ui/icons';
import {
	Box,
	Button,
	Collapse,
	Divider,
	Flex,
	Heading,
	Icon,
	Text,
	VStack
} from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import React, { Component, ComponentType, ErrorInfo, ReactNode } from 'react';
import { ErrorCategory } from '../../sentry';
import { devError } from '../../utils/ConsoleUtils';

interface ErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode | ((props: FallbackProps) => ReactNode);
	onError?: (error: Error, errorInfo: ErrorInfo) => void;
	onReset?: () => void;
	errorCategory?: ErrorCategory;
	retryable?: boolean;
	resetKeys?: any[];
	showDetails?: boolean;
	name?: string;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
	eventId: string | null;
	showDetails: boolean;
}

export interface FallbackProps {
	error: Error | null;
	errorInfo: ErrorInfo | null;
	eventId: string | null;
	resetError: () => void;
	showFeedback: () => void;
}

/**
 * Enhanced error boundary component with retry capabilities, error reporting, and fallback UI.
 */
class EnhancedErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	static defaultProps = {
		retryable: true,
		showDetails: false,
		errorCategory: ErrorCategory.UNKNOWN,
		resetKeys: []
	};

	state: ErrorBoundaryState = {
		hasError: false,
		error: null,
		errorInfo: null,
		eventId: null,
		showDetails: !!this.props.showDetails
	};

	// Reset error state when resetKeys change
	static getDerivedStateFromProps(
		props: ErrorBoundaryProps,
		state: ErrorBoundaryState
	): ErrorBoundaryState | null {
		// When any resetKey changes, reset the error state
		const { resetKeys = [] } = props;

		if (state.hasError && resetKeys.length > 0) {
			// Check if any key has changed
			const prevKeys = (state as any).prevResetKeys || [];
			const keysChanged =
				resetKeys.length !== prevKeys.length ||
				resetKeys.some((key, i) => key !== prevKeys[i]);

			if (keysChanged) {
				return {
					hasError: false,
					error: null,
					errorInfo: null,
					eventId: null,
					showDetails: !!props.showDetails,
					prevResetKeys: resetKeys
				} as any;
			}
		}

		// Store current resetKeys in state for future comparison
		if (!state.hasError) {
			return {
				...state,
				prevResetKeys: resetKeys
			} as any;
		}

		return null;
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
		const { errorCategory, name, onError } = this.props;

		// Log error to console in development
		devError('Error caught by boundary:', error, errorInfo);

		// Capture error with Sentry
		const eventId = Sentry.captureException(error, {
			tags: {
				errorCategory,
				errorBoundaryName: name || 'unnamed',
				componentStack: 'true'
			},
			extra: { errorInfo }
		});

		// Update state with error details
		this.setState({
			hasError: true,
			error,
			errorInfo,
			eventId
		});

		// Call the optional onError callback
		if (onError) {
			onError(error, errorInfo);
		}
	}

	resetError = (): void => {
		const { onReset } = this.props;

		this.setState({
			hasError: false,
			error: null,
			errorInfo: null,
			eventId: null
		});

		if (onReset) {
			onReset();
		}
	};

	toggleDetails = (): void => {
		this.setState((prevState) => ({
			showDetails: !prevState.showDetails
		}));
	};

	showFeedback = (): void => {
		const { eventId } = this.state;
		if (eventId) {
			Sentry.showReportDialog({ eventId });
		}
	};

	render(): ReactNode {
		const { hasError, error, errorInfo, eventId, showDetails } = this.state;
		const { children, fallback, retryable } = this.props;

		if (!hasError) {
			return children;
		}

		// If a custom fallback is provided, use it
		if (fallback) {
			if (typeof fallback === 'function') {
				return fallback({
					error,
					errorInfo,
					eventId,
					resetError: this.resetError,
					showFeedback: this.showFeedback
				});
			}
			return fallback;
		}

		// Default fallback UI
		return (
			<Box
				p={4}
				bg="white"
				borderRadius="md"
				boxShadow="md"
				width="100%"
				maxWidth="600px"
				mx="auto"
				my={4}
				borderLeft="4px solid"
				borderColor="red.500"
			>
				<VStack spacing={4} align="stretch">
					<Flex align="center" justify="space-between">
						<Flex align="center">
							<Icon as={WarningIcon} color="red.500" boxSize={6} mr={2} />
							<Heading size="md">Something went wrong</Heading>
						</Flex>
					</Flex>

					<Text>
						We&aposve encountered an error and our team has been notified.
						{retryable ? ' You can try again or view details below.' : ''}
					</Text>

					<Divider />

					<Flex gap={2} wrap="wrap">
						{retryable && (
							<Button
								leftIcon={<RepeatIcon />}
								colorScheme="blue"
								onClick={this.resetError}
							>
								Try Again
							</Button>
						)}

						<Button colorScheme="yellow" onClick={this.showFeedback}>
							Report Feedback
						</Button>

						<Button
							variant="ghost"
							rightIcon={showDetails ? <ChevronUpIcon /> : <ChevronDownIcon />}
							onClick={this.toggleDetails}
							ml="auto"
						>
							{showDetails ? 'Hide' : 'Show'} Details
						</Button>
					</Flex>

					<Collapse in={showDetails} animateOpacity>
						<VStack spacing={2} align="stretch" bg="gray.50" p={3} borderRadius="md">
							<Text fontWeight="bold">Error:</Text>
							<Box
								bg="gray.100"
								p={2}
								borderRadius="md"
								fontFamily="monospace"
								fontSize="sm"
								overflowX="auto"
							>
								{error?.toString() || 'Unknown error'}
							</Box>

							{errorInfo && (
								<>
									<Text fontWeight="bold" mt={2}>
										Component Stack:
									</Text>
									<Box
										bg="gray.100"
										p={2}
										borderRadius="md"
										fontFamily="monospace"
										fontSize="sm"
										overflowX="auto"
										whiteSpace="pre-wrap"
									>
										{errorInfo.componentStack}
									</Box>
								</>
							)}

							{eventId && (
								<Text fontSize="sm" color="gray.500" mt={2}>
									Error ID: {eventId}
								</Text>
							)}
						</VStack>
					</Collapse>
				</VStack>
			</Box>
		);
	}
}

/**
 * Higher-order component that wraps a component in an error boundary
 */
export function withErrorBoundary<P extends object>(
	Component: ComponentType<P>,
	errorBoundaryProps: Omit<ErrorBoundaryProps, 'children'> = {}
): React.FC<P> {
	const displayName = Component.displayName || Component.name || 'Component';

	const ComponentWithErrorBoundary = (props: P) => {
		return (
			<EnhancedErrorBoundary {...errorBoundaryProps} name={displayName}>
				<Component {...props} />
			</EnhancedErrorBoundary>
		);
	};

	ComponentWithErrorBoundary.displayName = `WithErrorBoundary(${displayName})`;
	return ComponentWithErrorBoundary;
}

export default EnhancedErrorBoundary;
