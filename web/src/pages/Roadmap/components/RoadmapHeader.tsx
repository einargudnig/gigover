import {
	Button,
	Center,
	Flex,
	HStack,
	Heading,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Tag,
	TagLabel,
	TagLeftIcon
} from '@chakra-ui/react';
import moment from 'moment';
import { useContext } from 'react';
import { ProjectTimeStatus } from '../../../components/ProjectTimeStatus';
import { Chevron } from '../../../components/icons/Chevron';
import { UsersIcon } from '../../../components/icons/UsersIcon';
import { GantChartContext } from '../contexts/GantChartContext';

export const RoadmapHeader = (): JSX.Element => {
	const [state, dispatch] = useContext(GantChartContext);

	return (
		<Flex justifyContent="space-between" alignItems="center">
			<Flex flex="1 1 0px">
				<HStack spacing={2}>
					{state.project && (
						<>
							<Tag>
								<TagLeftIcon>
									<UsersIcon color={'#000'} />
								</TagLeftIcon>
								{/* TODO Add contractors length as well */}
								<TagLabel>
									{(state.project?.workers.length || 0) + 1} people
								</TagLabel>
							</Tag>
							{state.project.endDate && <ProjectTimeStatus project={state.project} />}
						</>
					)}
				</HStack>
			</Flex>
			<Flex flex="1 1 0px" justifyContent="center">
				<Center>
					<Heading as={'h4'} size={'md'}>
						{moment(state.date).format('MMMM yyyy')}
					</Heading>
				</Center>
			</Flex>
			<Flex flex="1 1 0px" justifyContent="flex-end">
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
			</Flex>
		</Flex>
	);
};
