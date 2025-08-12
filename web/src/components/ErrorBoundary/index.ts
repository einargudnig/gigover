import EnhancedErrorBoundary, { withErrorBoundary } from './EnhancedErrorBoundary';
import type { FallbackProps } from './EnhancedErrorBoundary';
import RouteErrorBoundary from './RouteErrorBoundary';
import CompactErrorBoundary from './CompactErrorBoundary';

// Export all error boundary components
export {
	EnhancedErrorBoundary,
	RouteErrorBoundary,
	CompactErrorBoundary,
	withErrorBoundary,
	FallbackProps
};

// Default export for backward compatibility
export default EnhancedErrorBoundary;
