import { Button } from '@chakra-ui/react';
import { useContext } from 'react';
import { ModalContext } from '../../context/ModalContext';
import { EmptyProjects } from './EmptyProjects';
import { EmptyState } from './EmptyState';

export const NoProcurementFound = (): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);

	return (
		<EmptyState
			icon={<EmptyProjects />}
			title={'No Tender found'}
			text={
				'Seems that you haven’t created a tendert\n' +
				'for you and your organisation yet. Why don’t you add a new tender.'
			}
			action={
				<Button onClick={() => setModalContext({ addTender: { tender: undefined } })}>
					Create a Tender
				</Button>
			}
		/>
	);
};
