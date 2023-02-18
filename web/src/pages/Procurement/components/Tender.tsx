import React from 'react';
import { ProcurementHeader } from './ProcurementHeader';
import { TenderItemTable } from './TenderItemTable';

export const Tender = (): JSX.Element => {
	return (
		<div>
			<ProcurementHeader />
			<TenderItemTable />
		</div>
	);
};
