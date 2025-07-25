import { HttpResponse, PathParams, delay, http } from 'msw';

// Types for the authentication responses
interface LoginResponse {
	token: string;
	user: {
		id: string;
		email: string;
		name: string;
		role: string;
	};
}

interface LoginRequest {
	email: string;
	password: string;
}

// Mock user data
const users = [
	{
		id: '1',
		email: 'user@example.com',
		name: 'Test User',
		role: 'user',
		password: 'password123' // Never store plaintext passwords in real apps!
	}
];

export const authHandlers = [
	// POST Login Handler
	http.post<PathParams, LoginRequest>('/api/auth/login', async ({ request }) => {
		// Add some realistic delay
		await delay(500);

		const body = await request.json();

		// Check credentials
		const user = users.find((u) => u.email === body.email);

		if (!user || user.password !== body.password) {
			return new HttpResponse(JSON.stringify({ message: 'Invalid credentials' }), {
				status: 401
			});
		}

		// Return successful login response
		return HttpResponse.json<LoginResponse>({
			token: 'mock-jwt-token-xyz',
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role: user.role
			}
		});
	}),

	// GET Logout Handler
	http.post('/api/auth/logout', async () => {
		await delay(300);
		return new HttpResponse(null, { status: 204 });
	})
];
