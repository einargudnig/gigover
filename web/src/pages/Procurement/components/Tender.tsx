import React from 'react';
import { Text } from '@chakra-ui/react';
import { ProcurementHeader } from './ProcurementHeader';
// import { ProcurementOffer } from './ProcurementOffer';
import { NewTable } from './NewTable';

export const Tender = (): JSX.Element => {
	return (
		<div>
			<ProcurementHeader />
			<Text fontSize={'xl'} as="u">
				Here you can see the various items of your procurement. You can add items to the
				table and edit them.
			</Text>
			{/* <Spacer /> */}
			{/* <TenderTable /> */}
			<NewTable />
			{/* <Spacer /> */}
			{/* <ProcurementOffer /> */}
		</div>
	);
};
