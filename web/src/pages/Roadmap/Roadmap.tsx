import { Box, Button, Grid, Portal } from '@chakra-ui/react';
import { useCallback, useEffect, useRef } from 'react';
import ReactToPdf from 'react-to-pdf';
import { NumberParam, useQueryParam } from 'use-query-params';
import { Page } from '../../components/Page';
import { Milestone } from '../../models/Milestone';
import { Project } from '../../models/Project';
import { useMilestones } from '../../queries/useMilestones';
import { DateAmountSlider } from './components/DateAmountSlider';
import { GantChart } from './components/GantChart';
import { RoadmapHeader } from './components/RoadmapHeader';
import { RoadmapSidebar } from './components/RoadmapSidebar';
import { GantChartContext } from './contexts/GantChartContext';
import { GRID_SIDEBAR_WIDTH, useGantChart } from './hooks/useGantChart';

interface RoadmapProps {
	projects: Project[];
	selectedProject?: Project;
}

export const Roadmap = ({ projects, selectedProject }: RoadmapProps): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);

	const [, setProjectQuery] = useQueryParam('project', NumberParam);
	const [state, dispatch] = useGantChart({
		initialState: {
			type: 'Days',
			date: new Date(),
			dateOffset: 0,
			project: selectedProject ?? projects[0],
			tasks: [],
			milestones: []
		}
	});
	const { data } = useMilestones(
		state.project?.projectId ?? selectedProject?.projectId ?? projects[0].projectId
	);

	const setProject = useCallback(
		(project: Project) =>
			dispatch({
				type: 'SetProject',
				payload: project
			}),
		[dispatch]
	);

	useEffect(() => {
		// Map to Milestone class
		dispatch({
			type: 'SetMilestones',
			payload:
				data?.milestones.map((m) => {
					return new Milestone(
						m.milestoneId,
						m.title,
						m.description,
						m.estimatedHours,
						m.startDate,
						m.endDate,
						m.projectId,
						m.projectTasks
					);
				}) ?? []
		});
	}, [data, dispatch]);

	// Should I put the "setCalendarType" in a callback or useEffect?

	return (
		<Page
			title={'Gantt chart'}
			backgroundColor={'#fff'}
			actions={
				state.project && (
					<ReactToPdf
						targetRef={ref}
						filename={`Gigover-gantt-${state.project?.projectId}.pdf`}
						options={
							ref.current && {
								orientation: 'landscape',
								unit: 'px',
								hotfixes: ['px_scaling'],
								format: [
									ref.current?.clientWidth ?? 1920,
									ref.current?.clientHeight ?? 1080
								]
							}
						}
					>
						{({ toPdf }) => <Button onClick={toPdf}>Download as PDF</Button>}
					</ReactToPdf>
				)
			}
			// tabs={
			// 	<Select
			// 		value={state.project?.projectId}
			// 		onChange={(e) => {
			// 			const project = projects.find(
			// 				(p) => p.projectId === parseInt(e.target.value)
			// 			);
			// 			if (project) {
			// 				setProject(project);
			// 				setProjectQuery(project.projectId);
			// 			}
			// 		}}
			// 		icon={<Chevron />}
			// 		colorScheme={'yellow'}
			// 		variant="filled"
			// 		placeholder="Select a project"
			// 	>
			// 		{projects.length > 0 &&
			// 			projects
			// 				.filter((p) => p.status === 'OPEN')
			// 				.map((p) => (
			// 					<option key={p.projectId} value={p.projectId}>
			// 						{p.name}
			// 					</option>
			// 				))}
			// 	</Select>
			// }
			extraNav={
				<Flex
					borderBottom={'1px'}
					backgroundColor={'white'}
					borderColor={'gray.400'}
					alignItems={'center'}
					px={3}
					py={1}
				>
					<Box>
						<HStack>
							<NavLink to={`/project/${projectId}`}>
								{({ isActive }) => (
									<Box as="button" borderBottom={isActive ? '1px' : 'hidden	'}>
										Board
									</Box>
								)}
							</NavLink>
							<NavLink to={`/roadmap?project=${projectId}`}>Gantt</NavLink>
							<NavLink to={`/files/${projectId}`}>Files</NavLink>
						</HStack>
					</Box>
					<Spacer />
					<Box>
						{showSearch ? (
							// <SearchBar />
							<Text>Test</Text>
						) : (
							<IconButton
								variant={'outline'}
								aria-label={'Search'}
								colorScheme={'gray'}
								icon={<SearchIcon color={'black'} />}
								onClick={() => setShowSearch((v) => !v)}
							/>
						)}
						<IconButton
							variant={'outline'}
							colorScheme={'gray'}
							aria-label={'Filter'}
							icon={<FilterIcon color={'black'} />}
							marginLeft={3}
						/>
					</Box>
				</Flex>
			}
		>
			<>
				<GantChartContext.Provider value={[state, dispatch]}>
					<div ref={ref} id={'gc-container'}>
						<RoadmapHeader />
						<Box mt={8}>
							<Grid
								templateColumns={`${GRID_SIDEBAR_WIDTH} 1fr`}
								templateRows={'auto 1fr'}
								rowGap={4}
								columnGap={8}
							>
								<RoadmapSidebar />
								<GantChart />
							</Grid>
						</Box>
					</div>
					<Portal>
						<DateAmountSlider />
					</Portal>
				</GantChartContext.Provider>
			</>
		</Page>
	);
};
