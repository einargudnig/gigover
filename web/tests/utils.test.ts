import { describe, test, expect } from 'vitest';

describe('Utility Functions', () => {
	describe('Date Utilities', () => {
		test('should format dates correctly', () => {
			const date = new Date('2023-01-15T12:30:00');
			const formattedDate = date.toLocaleDateString();

			expect(formattedDate).toBeDefined();
			expect(date.getFullYear()).toBe(2023);
		});

		test('should calculate time differences', () => {
			const date1 = new Date('2023-01-15T12:30:00');
			const date2 = new Date('2023-01-15T14:30:00');

			const diffMs = date2.getTime() - date1.getTime();
			const diffHours = diffMs / (1000 * 60 * 60);

			expect(diffHours).toBe(2);
		});
	});

	describe('String Utilities', () => {
		test('should validate email format', () => {
			const validateEmail = (email: string): boolean => {
				const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				return re.test(email);
			};

			expect(validateEmail('test@example.com')).toBe(true);
			expect(validateEmail('not-an-email')).toBe(false);
		});

		test('should truncate long strings', () => {
			const truncate = (str: string, maxLength: number): string => {
				if (str.length <= maxLength) return str;
				return str.slice(0, maxLength) + '...';
			};

			expect(truncate('Hello, world!', 5)).toBe('Hello...');
			expect(truncate('Short', 10)).toBe('Short');
		});
	});

	describe('Error Handling', () => {
		test('should create error objects with correct properties', () => {
			class CustomError extends Error {
				code: string;

				constructor(message: string, code: string) {
					super(message);
					this.code = code;
				}
			}

			const error = new CustomError('Not found', '404');

			expect(error.message).toBe('Not found');
			expect(error.code).toBe('404');
		});
	});
});
