import { Button, Box, Text, VStack, useToast } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import {
	trackWorkflow,
	captureException,
	captureMessage,
	showFeedbackDialog
} from '../utils/SentryUtils';
import * as Sentry from '@sentry/react';

/**
 * ErrorGenerator component that will break during render
 * This is designed to trigger the ErrorBoundary
 */
const ErrorGenerator = ({ shouldError }: { shouldError: boolean }) => {
	useEffect(() => {
		console.log('ErrorGenerator mounted with shouldError:', shouldError);
	}, [shouldError]);

	if (shouldError) {
		// This will trigger during render and be caught by ErrorBoundary
		throw new Error('This is a render-time error that should be caught by ErrorBoundary');
	}

	return <Text>No error yet. Click the button to trigger an error.</Text>;
};

/**
 * Example component showing how to use Sentry tracking
 * This is for demonstration purposes and can be used to test Sentry integration
 */
export const SentryWorkflowExample = (): JSX.Element => {
	const [eventId, setEventId] = useState<string | null>(null);
	const [shouldError, setShouldError] = useState(false);
	const toast = useToast();

	// Example of tracking a user workflow
	const handleStartWorkflow = () => {
		// Start tracking a workflow
		trackWorkflow('project_creation', 'started', {
			projectType: 'construction',
			templates: ['basic', 'advanced']
		});

		// Later in the process...
		setTimeout(() => {
			trackWorkflow('project_creation', 'details_entered', {
				fields_completed: 5,
				total_fields: 8
			});
		}, 2000);

		// When finishing a workflow
		setTimeout(() => {
			trackWorkflow('project_creation', 'completed', {
				duration_seconds: 45,
				success: true
			});
		}, 4000);

		captureMessage('User started project creation workflow', 'info');

		toast({
			title: 'Workflow tracked',
			description: 'Check Sentry for the workflow events',
			status: 'info',
			duration: 5000,
			isClosable: true
		});
	};

	// Example of capturing and showing feedback
	const handleCaptureFeedback = () => {
		try {
			// Simulate an error
			throw new Error('Example error for feedback');
		} catch (error) {
			// Use captureException instead of captureMessage for errors
			console.log('Capturing exception for error:', error);
			const id = captureException(error as Error);
			setEventId(id);

			toast({
				title: 'Error captured',
				description: 'Error sent to Sentry with ID: ' + id,
				status: 'warning',
				duration: 5000,
				isClosable: true
			});
		}
	};

	// Handle triggering the error boundary
	const triggerErrorBoundary = () => {
		console.log('Setting shouldError to true to trigger ErrorBoundary');
		setShouldError(true);
	};

	// Verify that Sentry is initialized
	const checkSentryStatus = () => {
		const isEnabled = Sentry.getCurrentScope().getClient() !== undefined;
		console.log('Sentry initialization status:', isEnabled);

		toast({
			title: 'Sentry Status',
			description: isEnabled ? 'Sentry is properly initialized' : 'Sentry is NOT initialized',
			status: isEnabled ? 'success' : 'error',
			duration: 5000,
			isClosable: true
		});
	};

	return (
		<VStack spacing={6} align="flex-start" p={4}>
			<Box>
				<Text fontSize="xl" fontWeight="bold" mb={4}>
					Sentry Integration Examples
				</Text>

				<Button onClick={checkSentryStatus} colorScheme="green" mr={4} mb={4}>
					Check Sentry Status
				</Button>

				<Button onClick={handleStartWorkflow} colorScheme="blue" mr={4} mb={4}>
					Track Workflow Example
				</Button>

				<Button onClick={handleCaptureFeedback} colorScheme="yellow" mr={4} mb={4}>
					Capture Exception (with try/catch)
				</Button>

				{eventId && (
					<Button onClick={() => showFeedbackDialog(eventId)} colorScheme="purple" mb={4}>
						Show Feedback Dialog
					</Button>
				)}
			</Box>

			<Box borderWidth={1} p={4} borderRadius="md" w="100%">
				<Text fontWeight="bold" mb={2}>
					Error Boundary Example:
				</Text>

				{!shouldError && (
					<Button onClick={triggerErrorBoundary} colorScheme="red" mb={4}>
						Trigger Error Boundary
					</Button>
				)}

				<Box p={2} bg="gray.50" borderRadius="md">
					<ErrorGenerator shouldError={shouldError} />
				</Box>
			</Box>
		</VStack>
	);
};
