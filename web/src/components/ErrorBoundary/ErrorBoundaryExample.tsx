import React, { useState } from 'react';
import {
	Box,
	Heading,
	Text,
	VStack,
	Button,
	Divider,
	SimpleGrid,
	useToast,
	Code
} from '@chakra-ui/react';
import { EnhancedErrorBoundary, CompactErrorBoundary } from './index';
import { ErrorCategory } from '../../sentry';

// Component that will trigger an error when the flag is set
const BuggyCounter = ({ shouldError }: { shouldError: boolean }) => {
	const [count, setCount] = useState(0);

	const increment = () => setCount(count + 1);

	// This will cause a render error
	if (shouldError) {
		throw new Error('This is a simulated render error!');
	}

	return (
		<Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
			<Text>Count: {count}</Text>
			<Button onClick={increment} size="sm" mt={2}>
				Increment
			</Button>
		</Box>
	);
};

// Component that will cause an async error
const AsyncErrorComponent = () => {
	const [hasError, setHasError] = useState(false);

	const triggerAsyncError = () => {
		// Simulate an async error
		setTimeout(() => {
			try {
				// This will cause a runtime error
				const obj: any = null;
				obj.nonExistentMethod();
			} catch (error) {
				setHasError(true);
				throw error;
			}
		}, 500);
	};

	return (
		<Box p={4} border="1px" borderColor="gray.200" borderRadius="md">
			<Text>Status: {hasError ? 'Error occurred' : 'Normal'}</Text>
			<Button onClick={triggerAsyncError} size="sm" mt={2} colorScheme="red">
				Trigger Async Error
			</Button>
		</Box>
	);
};

/**
 * Example component showing different error boundary usage patterns
 */
export const ErrorBoundaryExample: React.FC = () => {
	const [shouldError, setShouldError] = useState(false);
	const toast = useToast();

	const triggerError = () => {
		setShouldError(true);
	};

	const resetError = () => {
		setShouldError(false);
	};

	const showApiExample = () => {
		// This demonstrates how API errors would work
		toast({
			title: 'API Error Example',
			description: 'Open your console to see how API errors would be handled',
			status: 'info',
			duration: 5000
		});

		// Simulate an API error
		console.log('Example API error handling:');
		console.log('import { ApiClient } from "../services/ApiService";');
		console.log('try {');
		console.log('  const data = await ApiClient.get("/some/endpoint");');
		console.log('  // Handle success');
		console.log('} catch (error) {');
		console.log('  // Error is already handled and reported to Sentry');
		console.log('  console.error(error.getFriendlyMessage());');
		console.log('}');
	};

	return (
		<Box p={6}>
			<Heading size="lg" mb={4}>
				Error Boundary Examples
			</Heading>
			<Text mb={6}>
				This page demonstrates different error boundary implementations and usage patterns.
				Each example below shows a different way to handle errors in your application.
			</Text>

			<SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
				{/* Basic Error Boundary */}
				<Box p={5} borderWidth={1} borderRadius="lg" bg="white">
					<Heading size="md" mb={3}>
						Basic Error Boundary
					</Heading>
					<Text fontSize="sm" mb={4}>
						The most common implementation that handles component errors and provides a
						fallback UI.
					</Text>

					<EnhancedErrorBoundary errorCategory={ErrorCategory.RENDER} name="ExampleBasic">
						<VStack spacing={4} align="stretch">
							<BuggyCounter shouldError={shouldError} />
							<Button colorScheme="red" onClick={triggerError} disabled={shouldError}>
								Trigger Error
							</Button>
							<Button onClick={resetError}>Reset</Button>
						</VStack>
					</EnhancedErrorBoundary>

					<Divider my={4} />

					<Code
						p={2}
						fontSize="xs"
						width="100%"
						display="block"
						whiteSpace="pre"
						borderRadius="md"
					>
						{`<EnhancedErrorBoundary 
  errorCategory={ErrorCategory.RENDER}
  name="ExampleBasic"
>
  <YourComponent />
</EnhancedErrorBoundary>`}
					</Code>
				</Box>

				{/* Compact Error Boundary */}
				<Box p={5} borderWidth={1} borderRadius="lg" bg="white">
					<Heading size="md" mb={3}>
						Compact Error Boundary
					</Heading>
					<Text fontSize="sm" mb={4}>
						A smaller UI for handling errors in widgets or subcomponents where space is
						limited.
					</Text>

					<CompactErrorBoundary
						componentName="CompactExample"
						errorCategory={ErrorCategory.RENDER}
					>
						<VStack spacing={4} align="stretch">
							<BuggyCounter shouldError={shouldError} />
							<Button colorScheme="red" onClick={triggerError} disabled={shouldError}>
								Trigger Error
							</Button>
							<Button onClick={resetError}>Reset</Button>
						</VStack>
					</CompactErrorBoundary>

					<Divider my={4} />

					<Code
						p={2}
						fontSize="xs"
						width="100%"
						display="block"
						whiteSpace="pre"
						borderRadius="md"
					>
						{`<CompactErrorBoundary 
  componentName="WidgetName" 
  errorCategory={ErrorCategory.RENDER}
>
  <YourWidget />
</CompactErrorBoundary>`}
					</Code>
				</Box>

				{/* Error Boundary with Custom Fallback */}
				<Box p={5} borderWidth={1} borderRadius="lg" bg="white">
					<Heading size="md" mb={3}>
						Custom Fallback UI
					</Heading>
					<Text fontSize="sm" mb={4}>
						Customize the error UI completely by providing your own fallback component.
					</Text>

					<EnhancedErrorBoundary
						errorCategory={ErrorCategory.RENDER}
						name="CustomFallbackExample"
						fallback={({ resetError }) => (
							<VStack p={4} bg="red.50" borderRadius="md" spacing={3}>
								<Heading size="sm">Custom Error View</Heading>
								<Text>Something went wrong in this component!</Text>
								<Button size="sm" onClick={resetError}>
									Try Again
								</Button>
							</VStack>
						)}
					>
						<VStack spacing={4} align="stretch">
							<BuggyCounter shouldError={shouldError} />
							<Button colorScheme="red" onClick={triggerError} disabled={shouldError}>
								Trigger Error
							</Button>
							<Button onClick={resetError}>Reset</Button>
						</VStack>
					</EnhancedErrorBoundary>

					<Divider my={4} />

					<Code
						p={2}
						fontSize="xs"
						width="100%"
						display="block"
						whiteSpace="pre"
						borderRadius="md"
					>
						{`<EnhancedErrorBoundary 
  fallback={({ resetError }) => (
    <YourCustomErrorUI onRetry={resetError} />
  )}
>
  <YourComponent />
</EnhancedErrorBoundary>`}
					</Code>
				</Box>

				{/* API Error Handling */}
				<Box p={5} borderWidth={1} borderRadius="lg" bg="white">
					<Heading size="md" mb={3}>
						API Error Handling
					</Heading>
					<Text fontSize="sm" mb={4}>
						The ApiClient handles API errors automatically, captures them in Sentry, and
						provides friendly error messages.
					</Text>

					<VStack spacing={4} align="stretch">
						<Text>
							All API calls made through the ApiClient will automatically handle
							errors, report them to Sentry, and provide consistent error messages.
						</Text>

						<Button onClick={showApiExample} colorScheme="blue">
							Show API Example
						</Button>
					</VStack>

					<Divider my={4} />

					<Code
						p={2}
						fontSize="xs"
						width="100%"
						display="block"
						whiteSpace="pre"
						borderRadius="md"
					>
						{`try {
  const data = await ApiClient.get("/api/endpoint");
  // Success handling
} catch (error) {
  // Error already reported to Sentry
  alert(error.getFriendlyMessage());
}`}
					</Code>
				</Box>
			</SimpleGrid>
		</Box>
	);
};

export default ErrorBoundaryExample;
