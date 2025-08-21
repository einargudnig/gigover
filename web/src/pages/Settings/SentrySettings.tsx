import {
	Box,
	Heading,
	Divider,
	Text,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel
} from '@chakra-ui/react';
import { SentryWorkflowExample } from '../../components/SentryExamples';
import { ErrorBoundaryExample } from '../../components/ErrorBoundary/ErrorBoundaryExample';
import EnhancedErrorBoundary from '../../components/ErrorBoundary/EnhancedErrorBoundary';

/**
 * Settings page for Sentry configuration and testing
 */
export function SentrySettings() {
	return (
		<Box p={4} bg="white" borderRadius="md" boxShadow="sm" mb={6} w="100%">
			<Heading as="h2" size="lg" mb={4}>
				Sentry Monitoring Tools
			</Heading>

			<Text mb={6}>
				This page contains tools for testing and demonstrating Sentry error monitoring
				integration. Use these components to verify that your Sentry setup is working
				correctly.
			</Text>

			<Tabs variant="enclosed" colorScheme="yellow">
				<TabList>
					<Tab>Manual Testing</Tab>
					<Tab>Error Boundaries</Tab>
				</TabList>

				<TabPanels>
					<TabPanel>
						<Box mb={6}>
							<Heading as="h3" size="md" mb={2}>
								Manual Error Tracking
							</Heading>
							<Divider mb={4} />
							<Text mb={4}>
								This section allows you to manually trigger various types of errors
								and events to verify that they are being properly captured in
								Sentry.
							</Text>

							<EnhancedErrorBoundary>
								<SentryWorkflowExample />
							</EnhancedErrorBoundary>
						</Box>
					</TabPanel>

					<TabPanel>
						<Box mb={6}>
							<Heading as="h3" size="md" mb={2}>
								Error Boundary Examples
							</Heading>
							<Divider mb={4} />
							<Text mb={4}>
								This section demonstrates the different types of error boundaries
								available and how to use them in your components.
							</Text>

							<EnhancedErrorBoundary>
								<ErrorBoundaryExample />
							</EnhancedErrorBoundary>
						</Box>
					</TabPanel>
				</TabPanels>
			</Tabs>
		</Box>
	);
}
