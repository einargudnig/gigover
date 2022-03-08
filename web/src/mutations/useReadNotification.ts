import { useMutation, useQueryClient } from 'react-query';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';
import axios from 'axios';
import { Notification } from '../hooks/useNotifications';

export const useReadNotification = () => {
	const queryClient = useQueryClient();

	return useMutation<ErrorResponse, ErrorResponse, Notification>(
		async (notification: Notification) =>
			await axios.post(
				ApiService.readNotification(notification.id),
				{},
				{ withCredentials: true }
			),
		{
			onSuccess: async () => {
				await queryClient.invalidateQueries(ApiService.notifications);
			}
		}
	);
};
