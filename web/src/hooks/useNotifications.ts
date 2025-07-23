import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ApiService } from '../services/ApiService';
import { devError } from '../utils/ConsoleUtils';

export type Notification = {
	id: number;
	address: string | null;
	commentId: number;
	created: number;
	orgId: number;
	status: number;
	subject: string | null;
	taskId: number;
	text: string | null;
	typeNotification: 'C' | 'P' | 'O';
	typeSend: string | null;
};

interface NotificationHook {
	notifications: Notification[];
	isLoading: boolean;
	unread: number;
}

const useNotificationQuery = () => {
	return useQuery<Notification[]>({
		queryKey: [ApiService.notifications],
		queryFn: async () => {
			try {
				const res = await axios.get(ApiService.notifications, { withCredentials: true });

				if (!(res.data && res.data.notifications)) {
					throw new Error(res.data);
				}

				return res.data.notifications.sort((a, b) => b.created - a.created);
			} catch (e) {
				devError(e);
				throw e;
			}
		}
	});
};

export const useNotifications = (): NotificationHook => {
	const { data, isLoading } = useNotificationQuery();

	return {
		notifications: data ?? [],
		isLoading,
		unread: data?.filter((n) => n.status === 0).length ?? 0
	};
};
