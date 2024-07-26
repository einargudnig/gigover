import { useContext } from 'react';
import { ModalContext } from '../../context/ModalContext';
import { EmptyProjects } from './EmptyProjects';
import { EmptyState } from './EmptyState';

export const NoProcurementFound = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);

	return (
		<EmptyState
			icon={<EmptyProjects />}
			title={'Nothing is here'}
			text={'Seems that you haven’t created a anything'}
		/>
	);
};
