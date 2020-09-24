import React, { useContext } from 'react';
import { ModalContext } from '../context/ModalContext';
import { Modal } from './Modal';
import { RegistrationModal } from './modals/RegistrationModal';

export const GlobalModals = ({ children }: { children: React.ReactNode }): JSX.Element => {
	const [modalContext] = useContext(ModalContext);
	return (
		<>
			{children}
			<Modal open={!!modalContext.registered} title={'Setup your account'}>
				<RegistrationModal />
			</Modal>
		</>
	);
};
