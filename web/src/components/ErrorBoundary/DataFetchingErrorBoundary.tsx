import React from 'react';
import {
	Alert,
	AlertIcon,
	AlertTitle,
	AlertDescription,
	Box,
	Button,
	Skeleton,
	Stack,
	Text,
	Tooltip
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import EnhancedErrorBoundary from './EnhancedErrorBoundary';
import { ErrorCategory } from '../../sentry';
import { FallbackProps } from './EnhancedErrorBoundary';

interface DataFetchingErrorBoundaryProps {
	children: React.ReactNode;
	name?: string;
	fallbackComponent?: React.ReactNode | ((props: FallbackProps) => React.ReactNode);
	skeletonHeight?: string | number;
	skeletonWidth?: string | number;
	skeletonCount?: number;
	apiEndpoint?: string;
	loadingState?: boolean;
	onRetry?: () => void;
}

/**
 * Specialized fallback component for data fetching errors
 */
const DataFetchingFallback: React.FC<
	FallbackProps & {
		apiEndpoint?: string;
		onRetry?: () => void;
	}
> = ({ error, resetError, apiEndpoint, onRetry }) => {
	const handleRetry = () => {
		resetError();
		if (onRetry) onRetry();
	};

	const statusCode = error?.message?.match(/(\d{3})/)?.[0];
	const isServerError = statusCode && parseInt(statusCode) >= 500;
	const isClientError = statusCode && parseInt(statusCode) >= 400 && parseInt(statusCode) < 500;

	return (
		<Box width="100%" py={4}>
			<Alert
				status={isServerError ? 'error' : isClientError ? 'warning' : 'error'}
				variant="subtle"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				textAlign="center"
				borderRadius="md"
				py={6}
			>
				<AlertIcon boxSize="30px" mr={0} />
				<AlertTitle mt={4} mb={1} fontSize="lg">
					{isServerError
						? 'Server Error'
						: isClientError
							? 'Request Error'
							: 'Data Loading Error'}
				</AlertTitle>
				<AlertDescription maxWidth="sm">
					<Text fontSize="md" mb={4}>
						{isServerError
							? "We're having trouble connecting to our servers."
							: isClientError
								? 'There was a problem with this request.'
								: 'Failed to load the requested data.'}
						{apiEndpoint && (
							<Tooltip label={apiEndpoint}>
								<Text
									as="span"
									cursor="help"
									textDecoration="underline"
									fontSize="sm"
								>
									{' '}
									(Details)
								</Text>
							</Tooltip>
						)}
					</Text>

					{statusCode && (
						<Text fontSize="sm" mb={4} opacity={0.8}>
							Status Code: {statusCode}
						</Text>
					)}

					<Button
						leftIcon={<RepeatIcon />}
						onClick={handleRetry}
						colorScheme={isServerError ? 'red' : isClientError ? 'orange' : 'blue'}
						mt={2}
					>
						Try Again
					</Button>
				</AlertDescription>
			</Alert>
		</Box>
	);
};

/**
 * Skeleton loader component for data loading states
 */
const DataLoadingSkeleton: React.FC<{
	count?: number;
	height?: string | number;
	width?: string | number;
}> = ({ count = 3, height = '60px', width = '100%' }) => {
	return (
		<Stack spacing={4} width="100%">
			{Array.from({ length: count }).map((_, i) => (
				<Skeleton key={i} height={height} width={width} borderRadius="md" />
			))}
		</Stack>
	);
};

/**
 * Error boundary specifically designed for data fetching components
 * Provides appropriate error handling for API and data-related errors
 */
const DataFetchingErrorBoundary: React.FC<DataFetchingErrorBoundaryProps> = ({
	children,
	name = 'unnamed',
	fallbackComponent,
	skeletonHeight = '60px',
	skeletonWidth = '100%',
	skeletonCount = 3,
	apiEndpoint,
	loadingState = false,
	onRetry
}) => {
	// If loading, show skeleton loader
	if (loadingState) {
		return (
			<DataLoadingSkeleton
				height={skeletonHeight}
				width={skeletonWidth}
				count={skeletonCount}
			/>
		);
	}

	return (
		<EnhancedErrorBoundary
			errorCategory={ErrorCategory.API}
			name={`DataFetching:${name}`}
			fallback={
				fallbackComponent ||
				((props) => (
					<DataFetchingFallback {...props} apiEndpoint={apiEndpoint} onRetry={onRetry} />
				))
			}
			retryable={true}
			resetKeys={[apiEndpoint]} // Reset when endpoint changes
		>
			{children}
		</EnhancedErrorBoundary>
	);
};

export default DataFetchingErrorBoundary;
