import { Box } from '@chakra-ui/react';
import { NewTenderList } from './tabs/NewTenderList';

export const ProcurementHome = (): JSX.Element => {
	return (
		<Box p={3}>
			<NewTenderList />
		</Box>
	);
};
