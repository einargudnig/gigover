import React from 'react';
import { Project } from '../models/Project';
import { Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import { ClockIcon } from './icons/ClockIcon';
import moment from 'moment';

const hoursToHumanReadable = (hours: number): string => {
	const days = Math.floor(hours / 24);

	if (days === 1) {
		return '1 day left';
	}

	return days > 0 ? `${days} days left` : `${hours} hours left`;
};

// Returns a colorScheme for the Project Hours Left Tag
const getColorScheme = (hoursTotal: number): string => {
	if (hoursTotal > 50) {
		return 'green';
	} else if (hoursTotal > 40) {
		return 'yellow';
	} else if (hoursTotal > 25) {
		return 'orange';
	} else if (hoursTotal < 0) {
		return 'gray';
	} else {
		return 'red';
	}
};

interface ProjectTimeStatusProps {
	project: Project;
}

export const ProjectTimeStatus = ({ project }: ProjectTimeStatusProps): JSX.Element => {
	const now = moment(new Date());
	const end = moment(project.endDate > 0 ? project.endDate : now);
	const hoursLeft = end.diff(now, 'hours');

	return (
		<Tag colorScheme={getColorScheme(hoursLeft)}>
			<TagLeftIcon as={ClockIcon} />
			<TagLabel>{hoursLeft < 0 ? 'Finished' : hoursToHumanReadable(hoursLeft)}</TagLabel>
		</Tag>
	);
};
