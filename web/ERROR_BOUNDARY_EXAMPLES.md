# Error Boundary Implementation Examples

This document provides code examples for implementing error boundaries at different levels in the Gigover application.

## App-Level Error Boundary

```tsx
// In App.tsx
import EnhancedErrorBoundary, { ErrorCategory } from './components/ErrorBoundary/EnhancedErrorBoundary';

// Replace the existing ErrorBoundary with EnhancedErrorBoundary
<EnhancedErrorBoundary 
  errorCategory={ErrorCategory.APP} 
  retryable={true} 
  name="AppRoot"
  onError={(error, errorInfo) => {
    console.error("App-level error:", error);
    // Additional logging or recovery logic
  }}
>
  <Routes>
    {/* Routes content */}
  </Routes>
</EnhancedErrorBoundary>
```

## Route-Level Error Boundaries

```tsx
// In AuthenticatedRoutes.tsx
import EnhancedErrorBoundary, { ErrorCategory, withErrorBoundary } from './components/ErrorBoundary/EnhancedErrorBoundary';

// Example for a specific route section
<Route path={'files'} element={
  <EnhancedErrorBoundary 
    errorCategory={ErrorCategory.FILE_SYSTEM} 
    retryable={true} 
    name="FileSystemRoutes"
  >
    <LazyFiles />
  </EnhancedErrorBoundary>
} />

// For lazy-loaded components using withErrorBoundary HOC
const LazyDashboardWithErrorBoundary = withErrorBoundary(LazyDashboard, {
  errorCategory: ErrorCategory.DASHBOARD,
  retryable: true,
  name: "DashboardComponent"
});

<Route index element={<LazyDashboardWithErrorBoundary />} />
```

## Feature-Level Error Boundaries

```tsx
// For specific components like modals
// In ProjectModal.tsx
import EnhancedErrorBoundary, { ErrorCategory } from '../ErrorBoundary/EnhancedErrorBoundary';

export const ProjectModal = (props) => {
  return (
    <EnhancedErrorBoundary 
      errorCategory={ErrorCategory.PROJECT} 
      retryable={true} 
      name="ProjectModal"
    >
      {/* Modal content */}
    </EnhancedErrorBoundary>
  );
};
```

## Data Fetching Error Boundaries

```tsx
// For components with data fetching
// Example component wrapper
import EnhancedErrorBoundary, { ErrorCategory } from './components/ErrorBoundary/EnhancedErrorBoundary';

const DataFetchingErrorBoundary = ({ children }) => (
  <EnhancedErrorBoundary 
    errorCategory={ErrorCategory.API} 
    retryable={true} 
    name="DataFetching"
    fallback={({ resetError }) => (
      <Box p={4} bg="white" borderRadius="md" boxShadow="md">
        <Heading size="md">Failed to load data</Heading>
        <Text mb={4}>We couldn't retrieve the requested information.</Text>
        <Button onClick={resetError} colorScheme="blue">
          Try Again
        </Button>
      </Box>
    )}
  >
    {children}
  </EnhancedErrorBoundary>
);

// Usage
<DataFetchingErrorBoundary>
  <ResourcesList />
</DataFetchingErrorBoundary>
```

## Reset Keys for Error Boundaries

```tsx
// Using resetKeys for automatic recovery when props change
// For components with changing data dependencies
import { useState, useEffect } from 'react';
import EnhancedErrorBoundary from './components/ErrorBoundary/EnhancedErrorBoundary';

const DataDependentComponent = ({ dataId }) => {
  return (
    <EnhancedErrorBoundary 
      resetKeys={[dataId]} // Boundary will reset when dataId changes
      name="DataComponent"
    >
      <ComponentThatUsesData id={dataId} />
    </EnhancedErrorBoundary>
  );
};
```