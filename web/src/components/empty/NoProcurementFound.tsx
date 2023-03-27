import React, { useContext } from 'react';
import { EmptyState } from './EmptyState';
import { EmptyProjects } from './EmptyProjects';
import { Button } from '@chakra-ui/react';
import { ModalContext } from '../../context/ModalContext';

export const NoProcurementFound = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);

	return (
		<EmptyState
			icon={<EmptyProjects />}
			title={'No procurement found'}
			text={
				'Seems that you haven’t created a procurement\n' +
				'for you and your organisation yet. Why don’t you add a new procurement.'
			}
			action={
				<Button onClick={() => setModalContext({ addTender: { tender: undefined } })}>
					Create a procurement
				</Button>
			}
		/>
	);
};
