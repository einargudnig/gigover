import EnhancedErrorBoundary, { withErrorBoundary } from './EnhancedErrorBoundary';
import type { FallbackProps } from './EnhancedErrorBoundary';
import RouteErrorBoundary from './RouteErrorBoundary';
import CompactErrorBoundary from './CompactErrorBoundary';
import ModalErrorBoundary from './ModalErrorBoundary';
import DataFetchingErrorBoundary from './DataFetchingErrorBoundary';
import FormErrorBoundary from './FormErrorBoundary';

// Export all error boundary components
export {
	EnhancedErrorBoundary,
	RouteErrorBoundary,
	CompactErrorBoundary,
	ModalErrorBoundary,
	DataFetchingErrorBoundary,
	FormErrorBoundary,
	withErrorBoundary,
	FallbackProps
};

// Default export for backward compatibility
export default EnhancedErrorBoundary;
