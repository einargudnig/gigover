import { HttpResponse, delay, http } from 'msw';

// Types
interface User {
	id: string;
	name: string;
	email: string;
	role: string;
	createdAt: string;
}

interface UserUpdateRequest {
	name?: string;
	email?: string;
}

// Mock data
const users: User[] = [
	{
		id: '1',
		name: 'John Doe',
		email: 'john@example.com',
		role: 'admin',
		createdAt: '2023-01-01T00:00:00Z'
	},
	{
		id: '2',
		name: 'Jane Smith',
		email: 'jane@example.com',
		role: 'user',
		createdAt: '2023-01-02T00:00:00Z'
	}
];

// Helper to check for auth token
const isAuthenticated = (request: Request): boolean => {
	const authHeader = request.headers.get('Authorization');
	return authHeader?.startsWith('Bearer ') ?? false;
};

export const userHandlers = [
	// GET all users
	http.get('/api/users', async ({ request }) => {
		// Simulate auth check
		if (!isAuthenticated(request)) {
			return new HttpResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
		}

		await delay(300);
		return HttpResponse.json(users);
	}),

	// GET user by ID
	http.get<{ userId: string }>('/api/users/:userId', async ({ params, request }) => {
		if (!isAuthenticated(request)) {
			return new HttpResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
		}

		const { userId } = params;
		const user = users.find((u) => u.id === userId);

		await delay(300);

		if (!user) {
			return new HttpResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
		}

		return HttpResponse.json(user);
	}),

	// PUT update user
	http.put<{ userId: string }, UserUpdateRequest>(
		'/api/users/:userId',
		async ({ params, request }) => {
			if (!isAuthenticated(request)) {
				return new HttpResponse(JSON.stringify({ message: 'Unauthorized' }), {
					status: 401
				});
			}

			const { userId } = params;
			const userIndex = users.findIndex((u) => u.id === userId);

			if (userIndex === -1) {
				return new HttpResponse(JSON.stringify({ message: 'User not found' }), {
					status: 404
				});
			}

			const body = await request.json();

			// Update user (immutably)
			const updatedUser = {
				...users[userIndex],
				...body
			};

			// In a real handler, we would update the database here

			await delay(400);
			return HttpResponse.json(updatedUser);
		}
	),

	// DELETE user
	http.delete<{ userId: string }>('/api/users/:userId', async ({ params, request }) => {
		if (!isAuthenticated(request)) {
			return new HttpResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
		}

		const { userId } = params;
		const userExists = users.some((u) => u.id === userId);

		if (!userExists) {
			return new HttpResponse(JSON.stringify({ message: 'User not found' }), { status: 404 });
		}

		// In a real handler, we would delete from database here

		await delay(500);
		return new HttpResponse(null, { status: 204 });
	})
];
