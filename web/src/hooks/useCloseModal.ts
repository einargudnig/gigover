import { useContext } from 'react';
import { ModalContext } from '../context/ModalContext';

export const useCloseModal = (callback?: () => void) => {
	const [, setModalContext] = useContext(ModalContext);

	return () => {
		setModalContext({});
		if (callback) {
			callback();
		}
	};
};
