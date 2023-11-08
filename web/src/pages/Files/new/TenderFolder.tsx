import React from 'react';
import { Outlet } from 'react-router-dom';

export const TenderFolder = (): JSX.Element => {
	// I can add something more to this route/component.
	// Lets focus on the uploading first.
	return (
		<>
			<Outlet />
		</>
	);
};
