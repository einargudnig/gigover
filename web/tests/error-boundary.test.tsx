import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import EnhancedErrorBoundary, { withErrorBoundary } from '../src/components/ErrorBoundary/EnhancedErrorBoundary';
import { ErrorCategory } from '../src/sentry';
import * as Sentry from '@sentry/react';

// Mock Sentry
vi.mock('@sentry/react', () => ({
  init: vi.fn(),
  captureException: vi.fn(() => 'test-event-id'),
  showReportDialog: vi.fn(),
  addBreadcrumb: vi.fn(),
  setTag: vi.fn(),
  getClient: vi.fn(),
}));

// Mock globals needed by sentry.ts
Object.defineProperty(globalThis, '__APP_VERSION__', {
  value: '1.0.0',
  writable: true
});

Object.defineProperty(globalThis, '__APP_ENV__', {
  value: 'test',
  writable: true
});

// Mock console.error to avoid noise in tests
const originalError = console.error;
beforeEach(() => {
  console.error = vi.fn();
  vi.clearAllMocks();
});

afterEach(() => {
  console.error = originalError;
});

// Component that throws an error
const ThrowError: React.FC<{ shouldThrow?: boolean; errorMessage?: string }> = ({ 
  shouldThrow = true, 
  errorMessage = 'Test error' 
}) => {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return <div>No error</div>;
};

// Test wrapper with Chakra UI
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider>{children}</ChakraProvider>
);

describe('EnhancedErrorBoundary', () => {
  test('renders children when there is no error', () => {
    render(
      <TestWrapper>
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={false} />
        </EnhancedErrorBoundary>
      </TestWrapper>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  test('renders error UI when child component throws', () => {
    render(
      <TestWrapper>
        <EnhancedErrorBoundary>
          <ThrowError />
        </EnhancedErrorBoundary>
      </TestWrapper>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We've encountered an error and our team has been notified/)).toBeInTheDocument();
  });

  test('shows and hides error details when toggle is clicked', async () => {
    render(
      <TestWrapper>
        <EnhancedErrorBoundary>
          <ThrowError errorMessage="Detailed test error" />
        </EnhancedErrorBoundary>
      </TestWrapper>
    );

    // Initially details should be hidden
    expect(screen.queryByText('Error:')).not.toBeInTheDocument();

    // Click to show details
    fireEvent.click(screen.getByText('Show Details'));

    // Wait for details to appear
    await waitFor(() => {
      expect(screen.getByText('Error:')).toBeInTheDocument();
      expect(screen.getByText('Detailed test error')).toBeInTheDocument();
    });

    // Click to hide details
    fireEvent.click(screen.getByText('Hide Details'));

    // Wait for details to disappear
    await waitFor(() => {
      expect(screen.queryByText('Error:')).not.toBeInTheDocument();
    });
  });

  test('calls Sentry.captureException when error occurs', () => {
    const mockCaptureException = vi.mocked(Sentry.captureException);

    render(
      <TestWrapper>
        <EnhancedErrorBoundary errorCategory={ErrorCategory.API} name="TestBoundary">
          <ThrowError errorMessage="Sentry test error" />
        </EnhancedErrorBoundary>
      </TestWrapper>
    );

    expect(mockCaptureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        tags: expect.objectContaining({
          errorCategory: ErrorCategory.API,
          errorBoundaryName: 'TestBoundary',
          componentStack: 'true'
        }),
        extra: expect.objectContaining({
          errorInfo: expect.any(Object)
        })
      })
    );
  });

  test('calls onError callback when provided', () => {
    const mockOnError = vi.fn();

    render(
      <TestWrapper>
        <EnhancedErrorBoundary onError={mockOnError}>
          <ThrowError />
        </EnhancedErrorBoundary>
      </TestWrapper>
    );

    expect(mockOnError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object)
    );
  });

  test('retry button resets error state', () => {
    let shouldThrow = true;
    const ToggleError: React.FC = () => {
      if (shouldThrow) {
        throw new Error('Retriable error');
      }
      return <div>Error resolved</div>;
    };

    render(
      <TestWrapper>
        <EnhancedErrorBoundary retryable={true}>
          <ToggleError />
        </EnhancedErrorBoundary>
      </TestWrapper>
    );

    // Error should be displayed
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Reset the error
    shouldThrow = false;

    // Click retry button
    fireEvent.click(screen.getByText('Try Again'));

    // Component should re-render and show resolved state
    expect(screen.getByText('Error resolved')).toBeInTheDocument();
  });

  test('shows feedback dialog when Report Feedback is clicked', () => {
    const mockShowReportDialog = vi.mocked(Sentry.showReportDialog);

    render(
      <TestWrapper>
        <EnhancedErrorBoundary>
          <ThrowError />
        </EnhancedErrorBoundary>
      </TestWrapper>
    );

    fireEvent.click(screen.getByText('Report Feedback'));

    expect(mockShowReportDialog).toHaveBeenCalledWith({
      eventId: 'test-event-id'
    });
  });

  test('uses custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;

    render(
      <TestWrapper>
        <EnhancedErrorBoundary fallback={customFallback}>
          <ThrowError />
        </EnhancedErrorBoundary>
      </TestWrapper>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  test('calls custom fallback function with correct props', () => {
    const mockFallback = vi.fn(() => <div>Function fallback</div>);

    render(
      <TestWrapper>
        <EnhancedErrorBoundary fallback={mockFallback}>
          <ThrowError errorMessage="Function test error" />
        </EnhancedErrorBoundary>
      </TestWrapper>
    );

    expect(mockFallback).toHaveBeenCalledWith({
      error: expect.any(Error),
      errorInfo: expect.any(Object),
      eventId: 'test-event-id',
      resetError: expect.any(Function),
      showFeedback: expect.any(Function)
    });

    expect(screen.getByText('Function fallback')).toBeInTheDocument();
  });

  test('withErrorBoundary HOC wraps component correctly', () => {
    const TestComponent: React.FC<{ message: string }> = ({ message }) => (
      <div>{message}</div>
    );

    const WrappedComponent = withErrorBoundary(TestComponent, {
      name: 'HOCTest',
      retryable: false
    });

    render(
      <TestWrapper>
        <WrappedComponent message="HOC test" />
      </TestWrapper>
    );

    expect(screen.getByText('HOC test')).toBeInTheDocument();
  });

  test('withErrorBoundary HOC handles errors in wrapped component', () => {
    const ErrorComponent: React.FC = () => {
      throw new Error('HOC error test');
    };

    const WrappedComponent = withErrorBoundary(ErrorComponent, {
      name: 'HOCErrorTest'
    });

    render(
      <TestWrapper>
        <WrappedComponent />
      </TestWrapper>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});