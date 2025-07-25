import { HttpResponse, delay, http } from 'msw';

// Types
interface FileUploadResponse {
	fileId: string;
	fileName: string;
	fileUrl: string;
	uploadedAt: string;
}

export const dataHandlers = [
	// Handle multipart/form-data file upload
	http.post('/api/upload', async ({ request }) => {
		if (!request.headers.get('Authorization')) {
			return new HttpResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
		}

		try {
			// Check if it's a FormData request
			const contentType = request.headers.get('Content-Type') || '';

			if (!contentType.includes('multipart/form-data')) {
				return new HttpResponse(
					JSON.stringify({
						message: 'Invalid request format. Expected multipart/form-data'
					}),
					{ status: 400 }
				);
			}

			// Parse the FormData (in a real implementation)
			const formData = await request.formData();
			const file = formData.get('file') as File;

			if (!file) {
				return new HttpResponse(JSON.stringify({ message: 'No file provided' }), {
					status: 400
				});
			}

			// Simulate upload delay
			await delay(1000);

			// Return a mock successful response
			return HttpResponse.json<FileUploadResponse>({
				fileId: 'mock-file-123',
				fileName: file.name,
				fileUrl: `https://mockcdn.example.com/files/${file.name}`,
				uploadedAt: new Date().toISOString()
			});
		} catch (error) {
			return new HttpResponse(
				JSON.stringify({ message: 'Server error processing file upload' }),
				{ status: 500 }
			);
		}
	})
];
