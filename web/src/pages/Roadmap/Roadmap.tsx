import { Box, Grid, Portal, Select } from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';
import { Page } from '../../components/Page';
import { Project } from '../../models/Project';
import { RoadmapHeader } from './components/RoadmapHeader';
import { DateAmountSlider } from './components/DateAmountSlider';
import { RoadmapSidebar } from './components/RoadmapSidebar';
import { GantChart } from './components/GantChart';
import { GantChartContext } from './contexts/GantChartContext';
import { GRID_SIDEBAR_WIDTH, useGantChart } from './hooks/useGantChart';
import { Chevron } from '../../components/icons/Chevron';
import { useMilestones } from '../../queries/useMilestones';
import { Milestone } from '../../models/Milestone';
import { useQueryParam, NumberParam } from 'use-query-params';

interface RoadmapProps {
	projects: Project[];
	selectedProject?: Project;
}

export const Roadmap = ({ projects, selectedProject }: RoadmapProps): JSX.Element => {
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

	return (
		<Page
			title={'Gantt chart'}
			backgroundColor={'#fff'}
			tabs={
				<Select
					value={state.project?.projectId}
					onChange={(e) => {
						const project = projects.find(
							(p) => p.projectId === parseInt(e.target.value)
						);
						if (project) {
							setProject(project);
							setProjectQuery(project.projectId);
						}
					}}
					icon={<Chevron />}
					colorScheme={'yellow'}
					variant="filled"
					placeholder="Select a project"
				>
					{projects.length > 0 &&
						projects
							.filter((p) => p.status === 'OPEN')
							.map((p) => (
								<option key={p.projectId} value={p.projectId}>
									{p.name}
								</option>
							))}
				</Select>
			}
		>
			<>
				<GantChartContext.Provider value={[state, dispatch]}>
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
					<Portal>
						<DateAmountSlider />
					</Portal>
				</GantChartContext.Provider>
			</>
		</Page>
	);
};
