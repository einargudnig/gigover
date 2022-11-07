import {
	Button,
	Center,
	Heading,
	HStack,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Tag,
	TagLabel,
	TagLeftIcon
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { GantChartContext } from '../contexts/GantChartContext';
import { UsersIcon } from '../../../components/icons/UsersIcon';
import moment from 'moment';
import { Chevron } from '../../../components/icons/Chevron';
import styled from 'styled-components';
import { ProjectTimeStatus } from '../../../components/ProjectTimeStatus';

const EqualFlex = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;

	> * {
		flex: 1 1 0;

		&:last-child {
			display: flex;
			justify-content: flex-end;
		}
	}
`;

export const RoadmapHeader = (): JSX.Element => {
	const [state, dispatch] = useContext(GantChartContext);

	return (
		<EqualFlex>
			<HStack spacing={2}>
				{state.project && (
					<>
						<Tag>
							<TagLeftIcon>
								<UsersIcon color={'#000'} />
							</TagLeftIcon>
							{/* TODO Add contractors length as well */}
							<TagLabel>{(state.project?.workers.length || 0) + 1} people</TagLabel>
						</Tag>
						{state.project.endDate && <ProjectTimeStatus project={state.project} />}
					</>
				)}
			</HStack>
			<Center>
				<Heading as={'h4'} size={'md'}>
					{moment(state.date).format('MMMM yyyy')}
				</Heading>
			</Center>
			<div>
				{/* I want the value to hold. So I select weeks, and that is the default value. */}
				<Menu>
					<MenuButton as={Button} colorScheme={'gray'} rightIcon={<Chevron />}>
						{state.type}
					</MenuButton>
					<MenuList>
						<MenuItem
							onClick={() => dispatch({ type: 'SetCalendarType', payload: 'Days' })}
						>
							Days
						</MenuItem>
						<MenuItem
							onClick={() => dispatch({ type: 'SetCalendarType', payload: 'Weeks' })}
						>
							Weeks
						</MenuItem>
						<MenuItem
							onClick={() => dispatch({ type: 'SetCalendarType', payload: 'Months' })}
						>
							Months
						</MenuItem>
					</MenuList>
				</Menu>
			</div>
		</EqualFlex>
	);
};
