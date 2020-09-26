import { useContext } from 'react';
import { ModalContext } from '../context/ModalContext';

export const useCloseModal = () => {
	const [, setModalContext] = useContext(ModalContext);
	return () => setModalContext({});
};
