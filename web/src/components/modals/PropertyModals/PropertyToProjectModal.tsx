import React from 'react';
import { IProperties } from '../../../models/Property';
import { TrackerSelect } from '../../TrackerSelect';

export const PropertyToProjectModal = ({
	properties
}: {
	properties: IProperties[];
}): JSX.Element => {
	return (
		<>
			<p>1. Select a property</p>
			<TrackerSelect title={'Select a property'} />
		</>
	);
};
