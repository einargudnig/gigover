import { EmptyProjects } from './EmptyProjects';
import { EmptyState } from './EmptyState';

export const NoProcurementFound = (): JSX.Element => {
	return (
		<EmptyState
			icon={<EmptyProjects />}
			title={'Nothing is here'}
			text={'Seems that you haven’t created a anything'}
		/>
	);
};
