import {
	Box,
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
import { ClockIcon } from '../../../components/icons/ClockIcon';
import { UsersIcon } from '../../../components/icons/UsersIcon';
import moment from 'moment';
import { ChevronDown } from '../../../components/icons/ChevronDown';

export const RoadmapHeader = (): JSX.Element => {
	const [state, dispatch] = useContext(GantChartContext);

	// TODO
	const hoursLeft = Math.floor(Math.random() * Math.floor(100));

	// Returns a colorScheme for the Project Hours Left Tag
	const getColorScheme = (left: number, hoursTotal: number): string => {
		const percent = left / hoursTotal;

		if (percent > 0.6) {
			return 'green';
		} else if (percent > 0.45) {
			return 'yellow';
		} else if (percent > 0.2) {
			return 'orange';
		} else {
			return 'red';
		}
	};

	return (
		<Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
			<HStack spacing={2}>
				<Tag>
					<TagLeftIcon>
						<UsersIcon color={'#000'} />
					</TagLeftIcon>
					{/* TODO Add contractors length as well */}
					<TagLabel>{(state.project?.workers.length || 0) + 1} people</TagLabel>
				</Tag>
				<Tag colorScheme={getColorScheme(hoursLeft, 100)}>
					<TagLeftIcon as={ClockIcon} />
					<TagLabel>{hoursLeft} hours left</TagLabel>
				</Tag>
			</HStack>
			<Center>
				<Heading as={'h4'} size={'md'}>
					{moment(state.date).format('MMMM yyyy')}
				</Heading>
			</Center>
			<Menu>
				<MenuButton as={Button} colorScheme={'gray'} rightIcon={<ChevronDown />}>
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
		</Box>
	);
};
