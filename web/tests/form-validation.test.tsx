import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AddPropertyModal } from '../src/components/modals/PropertyModals/AddPropertyModal';

// Mock the mutation hook
vi.mock('../src/mutations/properties/useAddProperty', () => ({
  useAddProperty: () => ({
    mutate: vi.fn(),
    isError: false,
    error: null,
  }),
}));

// Mock the close modal hook
vi.mock('../src/hooks/useCloseModal', () => ({
  useCloseModal: () => vi.fn(),
}));

// Test wrapper with necessary providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>{children}</ChakraProvider>
    </QueryClientProvider>
  );
};

describe('Property Form Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('shows validation errors for required fields', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <AddPropertyModal />
      </TestWrapper>
    );

    // Find the submit button and click it without filling any fields
    const submitButton = screen.getByText('Create property');
    await user.click(submitButton);

    // Check that required field errors appear
    await waitFor(() => {
      expect(screen.getByText('Property name is required')).toBeInTheDocument();
      expect(screen.getByText('Address is required')).toBeInTheDocument();
      expect(screen.getByText('Zip code is required')).toBeInTheDocument();
      expect(screen.getByText('City is required')).toBeInTheDocument();
      expect(screen.getByText('Country is required')).toBeInTheDocument();
      expect(screen.getByText('Size is required')).toBeInTheDocument();
      expect(screen.getByText('Type code is required')).toBeInTheDocument();
    });
  });

  test('validates size field must be a number', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <AddPropertyModal />
      </TestWrapper>
    );

    // Fill the size field with non-numeric value
    const sizeInput = screen.getByLabelText('Property size');
    await user.type(sizeInput, 'not-a-number');

    // Trigger validation by blurring the field
    await user.tab();

    // Check that numeric validation error appears
    await waitFor(() => {
      expect(screen.getByText('Size must be a number')).toBeInTheDocument();
    });
  });

  test('accepts valid numeric value for size field', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <AddPropertyModal />
      </TestWrapper>
    );

    // Fill the size field with valid numeric value
    const sizeInput = screen.getByLabelText('Property size');
    await user.type(sizeInput, '1200');

    // Trigger validation by blurring the field
    await user.tab();

    // Check that no validation error appears
    await waitFor(() => {
      expect(screen.queryByText('Size must be a number')).not.toBeInTheDocument();
    });
  });

  test('clears validation errors when fields are filled correctly', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <AddPropertyModal />
      </TestWrapper>
    );

    // First trigger validation errors
    const submitButton = screen.getByText('Create property');
    await user.click(submitButton);

    // Wait for errors to appear
    await waitFor(() => {
      expect(screen.getByText('Property name is required')).toBeInTheDocument();
    });

    // Now fill the property name field
    const nameInput = screen.getByLabelText('Property name');
    await user.type(nameInput, 'Test Property');

    // Blur the field to trigger validation
    await user.tab();

    // Check that the error is cleared
    await waitFor(() => {
      expect(screen.queryByText('Property name is required')).not.toBeInTheDocument();
    });
  });

  test('form submission is prevented when validation fails', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <AddPropertyModal />
      </TestWrapper>
    );

    // Try to submit with empty form
    const submitButton = screen.getByText('Create property');
    await user.click(submitButton);

    // Check that form doesn't submit and errors are shown
    await waitFor(() => {
      expect(screen.getByText('Property name is required')).toBeInTheDocument();
    });

    // Verify we're still on the form (modal hasn't closed)
    expect(screen.getByText('Create a property here. You can add more info after you creat the property.')).toBeInTheDocument();
  });

  test('validates all required fields correctly with valid data', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <AddPropertyModal />
      </TestWrapper>
    );

    // Fill all required fields with valid data
    await user.type(screen.getByLabelText('Property name'), 'Test Property');
    await user.type(screen.getByLabelText('Address/Location'), '123 Test Street');
    await user.type(screen.getByLabelText('Zip code'), '12345');
    await user.type(screen.getByLabelText('City'), 'Test City');
    await user.type(screen.getByLabelText('Country'), 'Test Country');
    await user.type(screen.getByLabelText('Property size'), '1200');
    await user.type(screen.getByLabelText('Property type'), 'Residential');

    // Submit the form
    const submitButton = screen.getByText('Create property');
    await user.click(submitButton);

    // Check that no validation errors are shown
    await waitFor(() => {
      expect(screen.queryByText('Property name is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Address is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Zip code is required')).not.toBeInTheDocument();
      expect(screen.queryByText('City is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Country is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Size is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Type code is required')).not.toBeInTheDocument();
      expect(screen.queryByText('Size must be a number')).not.toBeInTheDocument();
    });
  });

  test('handles edge cases for size validation', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <AddPropertyModal />
      </TestWrapper>
    );

    const sizeInput = screen.getByLabelText('Property size');

    // Test with zero
    await user.clear(sizeInput);
    await user.type(sizeInput, '0');
    await user.tab();

    await waitFor(() => {
      expect(screen.queryByText('Size must be a number')).not.toBeInTheDocument();
    });

    // Test with decimal number
    await user.clear(sizeInput);
    await user.type(sizeInput, '123.45');
    await user.tab();

    await waitFor(() => {
      expect(screen.queryByText('Size must be a number')).not.toBeInTheDocument();
    });

    // Test with negative number
    await user.clear(sizeInput);
    await user.type(sizeInput, '-100');
    await user.tab();

    await waitFor(() => {
      expect(screen.queryByText('Size must be a number')).not.toBeInTheDocument();
    });
  });
});
