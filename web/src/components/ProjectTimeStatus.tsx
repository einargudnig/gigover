import { Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import moment from 'moment';
import { Project } from '../models/Project';
import { ClockIcon } from './icons/ClockIcon';
import { formatDateWithoutYear } from '../utils/StringUtils';

// This was used to showcase project time left.
// TODO: remove this function
// const hoursToHumanReadable = (hours: number): string => {
// 	const days = Math.floor(hours / 24);
//
// 	if (days === 1) {
// 		return '1 day left';
// 	}
//
// 	return days > 0 ? `${days} days left` : `${hours} hours left`;
// };

// Returns a colorScheme for the Project Hours Left Tag
const getColorScheme = (hoursTotal: number): string => {
	if (hoursTotal > 50) {
		return 'green';
	} else if (hoursTotal > 40) {
		return 'yellow.300';
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
	const dt = new Date(project.endDate);
	const timeWithoutYear = formatDateWithoutYear(dt);

	return (
		<Tag colorScheme={getColorScheme(hoursLeft)}>
			<TagLeftIcon as={ClockIcon} />
			{/* <TagLabel>{hoursLeft < 0 ? 'Finished' : hoursToHumanReadable(hoursLeft)}</TagLabel> */}
			<TagLabel>{timeWithoutYear}</TagLabel>
		</Tag>
	);
};

interface ProjectStatusProps {
	project: Project;
}

export const ProjectStatusTag = ({ project }: ProjectStatusProps): JSX.Element => {
	const status = project.status;

	if (status === 'OPEN') {
		return (
			<Tag colorScheme="green">
				<TagLabel>Open</TagLabel>
			</Tag>
		);
	}

	if (status === 'DONE') {
		return (
			<Tag colorScheme="yellow">
				<TagLabel>Done</TagLabel>
			</Tag>
		);
	}

	if (status === 'CLOSED') {
		return (
			<Tag colorScheme="red">
				<TagLabel>Closed</TagLabel>
			</Tag>
		);
	}

	return (
		<Tag colorScheme="gray">
			<TagLabel>Unknown</TagLabel>
		</Tag>
	);
};
