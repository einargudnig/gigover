import { Box, Heading, Divider, Text } from '@chakra-ui/react';
import { SentryWorkflowExample } from '../../components/SentryExamples';
import ErrorBoundary from '../../ErrorBoundary';

export function SentrySettings() {
  return (
    <Box p={4} bg="white" borderRadius="md" boxShadow="sm" mb={6} w="100%">
      <Heading as="h3" size="md" mb={2}>
        Sentry Monitoring Tools
      </Heading>
      <Divider mb={4} />
      <Text mb={4}>
        This page contains tools for testing and demonstrating Sentry error monitoring integration. 
        Use these components to verify that your Sentry setup is working correctly.
      </Text>
      
      <ErrorBoundary>
        <SentryWorkflowExample />
      </ErrorBoundary>
    </Box>
  );
}
