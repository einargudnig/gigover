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

interface RoadmapProps {
	projects: Project[];
}

export const Roadmap = ({ projects }: RoadmapProps): JSX.Element => {
	const [state, dispatch] = useGantChart({
		initialState: {
			type: 'Days',
			date: new Date(),
			dateOffset: 0,
			project: projects[0],
			milestones: []
		}
	});
	const { data } = useMilestones(state.project?.projectId ?? projects[0].projectId);

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
			title={'Gant chart'}
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
						}
					}}
					icon={<Chevron />}
					colorScheme={'green'}
					variant="filled"
					placeholder="Select a project"
				>
					{projects.length > 0 &&
						projects.map((p) => (
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
