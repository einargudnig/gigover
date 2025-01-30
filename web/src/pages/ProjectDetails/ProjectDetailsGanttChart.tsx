import { Box, Grid, Portal } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Center } from '../../components/Center';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { NoProjectsFound } from '../../components/empty/NoProjectsFound';
import { Milestone } from '../../models/Milestone';
import { Project } from '../../models/Project';
import { useMilestones } from '../../queries/useMilestones';
import { useProjectDetails } from '../../queries/useProjectDetails';
import { DateAmountSlider } from '../Roadmap/components/DateAmountSlider';
import { GantChart } from '../Roadmap/components/GantChart';
import { RoadmapHeader } from '../Roadmap/components/RoadmapHeader';
import { RoadmapSidebar } from '../Roadmap/components/RoadmapSidebar';
import { GantChartContext } from '../Roadmap/contexts/GantChartContext';
import { GRID_SIDEBAR_WIDTH, useGantChart } from '../Roadmap/hooks/useGantChart';
import { DisabledPage } from '../../components/DisbledPage';

export const ProjectDetailsGanttChart = (): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);
	const { projectId } = useParams<{ projectId: string }>();

	const { data, isLoading, isError, error } = useProjectDetails(Number(projectId));

	const project: Project | undefined = data?.project;

	const [state, dispatch] = useGantChart({
		initialState: {
			type: 'Days',
			date: new Date(),
			dateOffset: 0,
			project: project || null, // Add null check here
			tasks: [],
			milestones: []
		}
	});

	const { data: mileStoneData } = useMilestones(project?.projectId ?? Number(projectId));

	useEffect(() => {
		// Map to Milestone class
		if (mileStoneData && mileStoneData.milestones) {
			const milestones = mileStoneData.milestones.map(
				(m) =>
					new Milestone(
						m.milestoneId,
						m.title,
						m.description,
						m.estimatedHours,
						m.startDate,
						m.endDate,
						m.projectId,
						m.projectTasks
					)
			);
			dispatch({
				type: 'SetMilestones',
				payload: milestones
			});
		}
	}, [projectId, dispatch, mileStoneData]);

	if (isError) {
		return (
			<Center>
				<p>Error: {error?.errorText || 'An unexpected error occurred.'}</p>
			</Center>
		);
	}

	if (!project) {
		return (
			<DisabledPage>
				<Center>
					<NoProjectsFound />
				</Center>
			</DisabledPage>
		);
	}

	return (
		<>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<DisabledPage>
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
				</DisabledPage>
			)}
		</>
	);
};
