import React from 'react';
import { Text } from '@chakra-ui/react';
// import { useProjectTenders } from '../../../queries/useProjectTenders';
import { ProcurementHeader } from './ProcurementHeader';
// import { ProcurementOffer } from './ProcurementOffer';
// import { TenderTable } from './TenderTable';
import { NewTable } from './NewTable';

export const Tender = (): JSX.Element => {
	// const testData = useProjectTenders(977);
	// test the endpoint with a known Id
	// console.log(testData)

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
