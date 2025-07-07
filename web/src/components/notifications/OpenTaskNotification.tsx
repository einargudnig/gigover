import React, { ReactElement, useContext, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { ModalContext } from '../../context/ModalContext';
import { Notification } from '../../hooks/useNotifications';
import { useTaskDetails } from '../../queries/useTaskDetails';
import { FullscreenLoader } from '../FullscreenLoader';

export interface OpenTaskNotificationProps {
	notification: Notification;
}

const notificationPortal = document.createElement('div');
const NotificationPortal = ({ children }: { children: React.ReactNode }) =>
	ReactDOM.createPortal(children as ReactElement, notificationPortal);

export const OpenTaskNotification = ({ notification }: OpenTaskNotificationProps): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const { data, isPending } = useTaskDetails(notification.taskId);

	useLayoutEffect(() => {
		notificationPortal.className = 'gigover-notification-container';
		document.body.appendChild(notificationPortal);
	}, []);

	useEffect(() => {
		if (data && !isPending) {
			setModalContext({
				taskDetails: {
					task: {
						...data.projectTask,
						minutes: 0,
						priority: 1,
						lexoRank: '',
						projectId: data.projectTask.project.projectId
					},
					projectId: data.projectTask.project.projectId
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, isPending]);

	if (isPending) {
		// Show fullscreen loader
		return (
			<NotificationPortal>
				<div
					style={{
						zIndex: 99999999,
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100vw',
						height: '100vh'
					}}
				>
					<FullscreenLoader />
				</div>
			</NotificationPortal>
		);
	}

	return <React.Fragment />;
};
