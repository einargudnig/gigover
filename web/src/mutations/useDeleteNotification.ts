import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Notification } from '../hooks/useNotifications';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';

export const useDeleteNotification = () => {
	const queryClient = useQueryClient();

	return useMutation<unknown, ErrorResponse, Notification>({
		mutationFn: async (notification: Notification) => {
			const response = await axios.post(
				ApiService.deleteNotification(notification.id),
				{},
				{ withCredentials: true }
			);
			return response.data;
		},

		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: [ApiService.notifications] });
		}
	});
};
