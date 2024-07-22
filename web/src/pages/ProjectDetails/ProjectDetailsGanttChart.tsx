import { Box, Grid, Portal } from '@chakra-ui/react';
import { useCallback, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Center } from '../../components/Center';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { NoProjectsFound } from '../../components/empty/NoProjectsFound';
import { Milestone } from '../../models/Milestone';
import { Project } from '../../models/Project';
import { useMilestones } from '../../queries/useMilestones';
import { useProjectList } from '../../queries/useProjectList';
import { DateAmountSlider } from '../Roadmap/components/DateAmountSlider';
import { GantChart } from '../Roadmap/components/GantChart';
import { RoadmapHeader } from '../Roadmap/components/RoadmapHeader';
import { RoadmapSidebar } from '../Roadmap/components/RoadmapSidebar';
import { GantChartContext } from '../Roadmap/contexts/GantChartContext';
import { GRID_SIDEBAR_WIDTH, useGantChart } from '../Roadmap/hooks/useGantChart';

export const ProjectDetailsGanttChart = (): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);
	const { projectId } = useParams<{ projectId: string }>();
	console.log({ projectId });
	const { data, isLoading, isError, error } = useProjectList();
	console.log({ data });

	const projects: Project[] = data;
	const selectedProject: Project | undefined = projectId
		? data.find((p) => p.projectId === Number(projectId))
		: undefined;
	console.log({ selectedProject });

	const [state, dispatch] = useGantChart({
		initialState: {
			type: 'Days',
			date: new Date(),
			dateOffset: 0,
			project: selectedProject || projects[0], // Add null check here
			tasks: [],
			milestones: []
		}
	});

	// const { data: mileStoneData } = useMilestones(
	// 	state.project?.projectId ?? selectedProject?.projectId ?? projects[0].projectId
	// );
	const { data: mileStoneData } = useMilestones(selectedProject!.projectId);

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
				mileStoneData?.milestones.map((m) => {
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
	}, [mileStoneData, dispatch]);

	if (!isLoading && isError) {
		// TODO Replace with ErrorBoundary
		return <p>{error?.errorText}</p>;
	}

	return !isLoading && data && data.length > 0 ? (
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
	) : (
		<>
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : (
				<NoProjectsFound />
			)}
		</>
	);
};
