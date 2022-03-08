import React, { ReactElement, useContext, useEffect, useLayoutEffect } from 'react';
import { Notification } from '../../hooks/useNotifications';
import { useTaskDetails } from '../../queries/useTaskDetails';
import { ModalContext } from '../../context/ModalContext';
import { FullscreenLoader } from '../FullscreenLoader';
import ReactDOM from 'react-dom';

export interface OpenTaskNotificationProps {
	notification: Notification;
}

const notificationPortal = document.createElement('div');
const NotificationPortal = ({ children }: { children: React.ReactNode }) =>
	ReactDOM.createPortal(children as ReactElement, notificationPortal);

export const OpenTaskNotification = ({ notification }: OpenTaskNotificationProps): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);
	const { data, isLoading } = useTaskDetails(notification.taskId);

	useLayoutEffect(() => {
		notificationPortal.className = 'gigover-notification-container';
		document.body.appendChild(notificationPortal);
	}, []);

	useEffect(() => {
		if (data && !isLoading) {
			setModalContext({
				taskDetails: {
					task: {
						...data.projectTask,
						minutes: 0,
						priority: 1,
						projectId: data.projectTask.project.projectId
					},
					projectId: data.projectTask.project.projectId
				}
			});
		}
	}, [data, isLoading]);

	if (isLoading) {
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
