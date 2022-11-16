import { Button, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { Page } from '../../components/Page';
import { PlusIcon } from '../../components/icons/PlusIcon';

import { ProcurementHeader } from './components/ProcurementHeader';

export const Procurement = (): JSX.Element => {
	return (
		<Page
			title={'Procurement'}
			actions={
				<>
					<Button leftIcon={<PlusIcon />}>New Procurement</Button>
				</>
			}
		>
			<ProcurementHeader />
			<Flex>
				<Text>Here we will have the procurement</Text>
			</Flex>
		</Page>
	);
};
