import { ApiClient } from '../services/ApiService';
import { trackWorkflow } from '../utils/SentryUtils';

/**
 * Enhanced React Query fetcher that uses the ApiClient with error handling
 * @param param0 Query parameters with the endpoint URL
 */
export const axiosQueryFetcher = async ({ queryKey }: { queryKey: string }) => {
	const endpoint = queryKey;

	// Track query start in Sentry for performance monitoring
	trackWorkflow('api_query', 'started', {
		endpoint
	});

	try {
		// Use our enhanced API client to make the request
		const data = await ApiClient.get(endpoint);

		// Track successful completion
		trackWorkflow('api_query', 'completed', {
			endpoint,
			success: true,
			resultSize: typeof data === 'object' ? JSON.stringify(data).length : 'not_object'
		});

		return data;
	} catch (error) {
		// Error is already handled by ApiClient
		// Just track the failure and rethrow
		trackWorkflow('api_query', 'failed', {
			endpoint,
			errorType: error.type,
			status: error.status
		});

		throw error;
	}
};
