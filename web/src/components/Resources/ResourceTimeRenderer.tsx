import React from 'react';
import { CountdownRendererFn } from 'react-countdown';

export const ResourceTimeRenderer: CountdownRendererFn = ({ days, hours, minutes, seconds }) => {
	const nd = days;
	const nh = hours;
	const nm = minutes;
	const ns = seconds;

	if (nd < 1) {
		return (
			<span>
				{nh}h {nm}m {ns}s
			</span>
		);
	}

	return (
		<span>
			{nd} days &{' '}
			<span>
				{nh}h {nm}m {ns}s
			</span>
		</span>
	);
};
