import { HttpResponse, delay, http } from 'msw';
import { Task, TaskStatus } from '../../models/Task';
import { TaskFormData } from '../../queries/useAddTask';
import { ApiService } from '../../services/ApiService';

// Mock data store for tasks
const mockTasks: Task[] = [
	{
		taskId: 1,
		projectId: 100,
		typeId: 1,
		text: 'This is a sample task description',
		subject: 'Sample Task',
		status: TaskStatus.Todo,
		minutes: 0,
		comments: [],
		priority: 1,
		startDate: Date.now(),
		endDate: null,
		images: [],
		lexoRank: 'i0000000000000'
	}
];

// Get the next task ID (simulating auto-increment)
const getNextTaskId = (): number => {
	return Math.max(0, ...mockTasks.map((task) => task.taskId)) + 1;
};

// You'll need to replace this with your actual API endpoint from ApiService
const ADD_TASK_ENDPOINT = ApiService.addTask;
// const TASK_DETAILS_ENDPOINT = '/api/tasks/:taskId'; // Replace with your actual endpoint

export const taskHandlers = [
	// Handler for adding a task
	http.post(ADD_TASK_ENDPOINT, async ({ request }) => {
		// Simulate network delay
		await delay(300);

		try {
			// Parse the request body
			const taskData = (await request.json()) as TaskFormData;

			// Validate required fields
			if (!taskData.subject || taskData.subject.trim() === '') {
				return HttpResponse.json(
					{ errorText: 'Task subject cannot be empty' },
					{ status: 400 }
				);
			}

			// Create a new task or update existing one
			const newTask: Task = {
				taskId: taskData.taskId || getNextTaskId(),
				projectId: taskData.projectId,
				typeId: taskData.typeId,
				subject: taskData.subject,
				text: '', // Default empty text
				status: taskData.status,
				minutes: 0,
				comments: [],
				priority: 1,
				startDate: null,
				endDate: null,
				images: [],
				lexoRank: taskData.lexoRank
			};

			// If updating existing task
			if (taskData.taskId) {
				const taskIndex = mockTasks.findIndex((t) => t.taskId === taskData.taskId);
				if (taskIndex >= 0) {
					mockTasks[taskIndex] = {
						...mockTasks[taskIndex],
						...newTask
					};
				} else {
					// Task not found
					return HttpResponse.json(
						{ errorText: `Task with ID ${taskData.taskId} not found` },
						{ status: 404 }
					);
				}
			} else {
				// Add new task to mock data store
				mockTasks.push(newTask);
			}

			// Return successful response
			return HttpResponse.json({ task: newTask });
		} catch (error) {
			console.error('Error in task handler:', error);
			return HttpResponse.json(
				{ errorText: 'Server error occurred while processing your request' },
				{ status: 500 }
			);
		}
	})
];
