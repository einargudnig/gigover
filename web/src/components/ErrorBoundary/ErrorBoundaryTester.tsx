import React, { useState } from 'react';
import { Button, VStack, HStack, Box, Text, Select, Code, Heading } from '@chakra-ui/react';

interface ErrorBoundaryTesterProps {
	location?: 'app' | 'route' | 'component' | 'data' | 'third-party';
}

/**
 * Component for testing error boundaries by intentionally throwing different types of errors
 */
const ErrorBoundaryTester: React.FC<ErrorBoundaryTesterProps> = ({ location = 'component' }) => {
	const [errorType, setErrorType] = useState<string>('render');
	const [delay, setDelay] = useState<number>(0);

	const throwError = () => {
		if (delay > 0) {
			setTimeout(() => {
				triggerError();
			}, delay);
		} else {
			triggerError();
		}
	};

	const triggerError = () => {
		// Force React to notice this error by using useState function incorrectly
		const forceError = () => {
			// @ts-ignore - intentionally causing an error
			setErrorType(() => {
				throw new Error(
					`${location} error - intentionally thrown for testing (${errorType})`
				);
			});
		};

		switch (errorType) {
			case 'render':
				// Direct error throwing in render
				throw new Error(`${location} render error - intentionally thrown for testing`);

			case 'async':
				// Immediately throw the async error rather than just rejecting it
				setTimeout(() => {
					forceError();
				}, 0);
				break;

			case 'event':
				// Use setTimeout to move out of event context and throw error
				setTimeout(() => {
					forceError();
				}, 0);
				break;

			case 'network':
				// Mock a network error
				const networkError = new Error(
					`${location} network error - intentionally thrown for testing`
				);
				networkError.name = 'NetworkError';
				throw networkError;

			case 'component-state':
				// Directly manipulate state in an invalid way to cause error
				// @ts-ignore - intentionally causing an error
				setErrorType(null.invalid);
				break;

			default:
				throw new Error(`${location} unknown error - intentionally thrown for testing`);
		}
	};

	return (
		<Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
			<VStack spacing={4} align="stretch">
				<Heading size="md">Error Boundary Tester ({location})</Heading>

				<Text>Use this component to test error boundary behavior.</Text>

				<HStack>
					<Select
						value={errorType}
						onChange={(e) => setErrorType(e.target.value)}
						width="200px"
					>
						<option value="render">Render Error</option>
						<option value="async">Async Error</option>
						<option value="event">Event Error</option>
						<option value="network">Network Error</option>
						<option value="component-state">Component State Error</option>
					</Select>

					<Select
						value={delay}
						onChange={(e) => setDelay(parseInt(e.target.value))}
						width="200px"
					>
						<option value="0">Immediate</option>
						<option value="1000">After 1 second</option>
						<option value="3000">After 3 seconds</option>
					</Select>
				</HStack>

				<Button colorScheme="red" onClick={throwError}>
					Trigger Error
				</Button>

				<Box fontSize="sm">
					<Text fontWeight="bold">How to use:</Text>
					<Code p={2} display="block" whiteSpace="pre" mt={2}>
						{`// Wrap in any error boundary component
<EnhancedErrorBoundary>
  <ErrorBoundaryTester location="component" />
</EnhancedErrorBoundary>`}
					</Code>
				</Box>
			</VStack>
		</Box>
	);
};

export default ErrorBoundaryTester;
