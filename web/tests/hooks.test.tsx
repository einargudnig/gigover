import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import axios from 'axios';
import { useAddProperty } from '../src/mutations/properties/useAddProperty';
import { ApiService } from '../src/services/ApiService';

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

// Mock console.log to avoid noise in tests
const originalLog = console.log;
beforeEach(() => {
  console.log = vi.fn();
  vi.clearAllMocks();
});

afterEach(() => {
  console.log = originalLog;
});

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  return { Wrapper, queryClient };
};

describe('React Query Hooks', () => {
  describe('useAddProperty', () => {
    test('should call API with correct data when mutate is called', async () => {
      const mockPost = vi.mocked(axios.post);
      const mockResponse = { data: { id: 1, name: 'Test Property' } };
      mockPost.mockResolvedValueOnce(mockResponse);

      const { Wrapper } = createWrapper();

      const { result } = renderHook(() => useAddProperty(), {
        wrapper: Wrapper,
      });

      const propertyData = {
        name: 'Test Property',
        address: '123 Test St',
        zipCode: '12345',
        city: 'Test City',
        country: 'Test Country',
        size: 1000,
        type: 'Residential',
      };

      // Call the mutation
      result.current.mutate(propertyData);

      // Wait for the mutation to complete
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify axios was called with correct parameters
      expect(mockPost).toHaveBeenCalledWith(
        ApiService.addProperty,
        propertyData,
        { withCredentials: true }
      );
    });

    test('should handle API errors correctly', async () => {
      const mockPost = vi.mocked(axios.post);
      const mockError = new Error('API Error');
      mockPost.mockRejectedValueOnce(mockError);

      const { Wrapper } = createWrapper();

      const { result } = renderHook(() => useAddProperty(), {
        wrapper: Wrapper,
      });

      const propertyData = {
        name: 'Test Property',
        address: '123 Test St',
        zipCode: '12345',
        city: 'Test City',
        country: 'Test Country',
        size: 1000,
        type: 'Residential',
      };

      // Call the mutation
      result.current.mutate(propertyData);

      // Wait for the mutation to complete with error
      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBe(mockError);
    });

    test('should invalidate queries on successful mutation', async () => {
      const mockPost = vi.mocked(axios.post);
      const mockResponse = { data: { id: 1, name: 'Test Property' } };
      mockPost.mockResolvedValueOnce(mockResponse);

      const { Wrapper, queryClient } = createWrapper();
      const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');

      const { result } = renderHook(() => useAddProperty(), {
        wrapper: Wrapper,
      });

      const propertyData = {
        name: 'Test Property',
        address: '123 Test St',
        zipCode: '12345',
        city: 'Test City',
        country: 'Test Country',
        size: 1000,
        type: 'Residential',
      };

      // Call the mutation
      result.current.mutate(propertyData);

      // Wait for the mutation to complete
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify that queries were invalidated
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: [ApiService.getProperties],
      });
    });

    test('should have correct initial state', () => {
      const { Wrapper } = createWrapper();

      const { result } = renderHook(() => useAddProperty(), {
        wrapper: Wrapper,
      });

      expect(result.current.isIdle).toBe(true);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.isPending).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
    });

    test('should update states correctly during mutation lifecycle', async () => {
      const mockPost = vi.mocked(axios.post);
      
      // Create a promise that we can control
      let resolvePromise: (value: any) => void;
      const controlledPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      
      mockPost.mockReturnValueOnce(controlledPromise);

      const { Wrapper } = createWrapper();

      const { result } = renderHook(() => useAddProperty(), {
        wrapper: Wrapper,
      });

      const propertyData = {
        name: 'Test Property',
        address: '123 Test St',
        zipCode: '12345',
        city: 'Test City',
        country: 'Test Country',
        size: 1000,
        type: 'Residential',
      };

      // Initial state
      expect(result.current.isIdle).toBe(true);

      // Call the mutation
      result.current.mutate(propertyData);

      // Should be pending
      await waitFor(() => {
        expect(result.current.isPending).toBe(true);
      });

      expect(result.current.isIdle).toBe(false);
      expect(result.current.isError).toBe(false);
      expect(result.current.isSuccess).toBe(false);

      // Resolve the promise
      resolvePromise!({ data: { id: 1, name: 'Test Property' } });

      // Should be successful
      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.isPending).toBe(false);
      expect(result.current.isError).toBe(false);
    });
  });
});
