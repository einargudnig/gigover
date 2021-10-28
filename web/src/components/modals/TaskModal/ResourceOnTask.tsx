import React, { useMemo } from 'react';
import { Resource } from '../../../models/Resource';
import { Task } from '../../../models/Task';
import { useResourceHistory } from '../../../queries/useResourceHistory';
import { Flex, HStack, Text } from '@chakra-ui/react';
import Countdown from 'react-countdown';
import { ResourceTimeRenderer } from '../../Resources/ResourceTimeRenderer';
import { ToolsIcon } from '../../icons/ToolsIcon';
import { BorderDiv } from '../../BorderDiv';
import { Link } from 'react-router-dom';
import { useCloseModal } from '../../../hooks/useCloseModal';

export interface ResourceOnTaskProps {
	resource: Resource;
	task: Task;
}

export const ResourceOnTask = ({ resource }: ResourceOnTaskProps): JSX.Element | null => {
	const closeModal = useCloseModal();
	const { data } = useResourceHistory(resource);
	const latestFirst = useMemo(() => {
		if (data?.resources) {
			return data.resources.sort((a, b) => (a.id > b.id ? -1 : 1));
		}
		return [];
	}, [data]);

	if (latestFirst.length <= 0) {
		return null;
	}

	return (
		<Link to="/resources" onClick={() => closeModal()}>
			<BorderDiv style={{ marginBottom: 16 }}>
				<HStack width={'100%'} justify="space-between" align="center" py={2} px={4}>
					<ToolsIcon />
					<Text>{resource.name} is being used on this task</Text>
					<Flex flex="1" justify="flex-end" align="center">
						<span>Timer:&nbsp;</span>
						<Countdown
							date={new Date(latestFirst[0].start)}
							daysInHours={false}
							overtime={true}
							renderer={ResourceTimeRenderer}
						/>
					</Flex>
				</HStack>
			</BorderDiv>
		</Link>
	);
};
