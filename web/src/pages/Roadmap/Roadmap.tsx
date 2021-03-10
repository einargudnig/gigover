import { Box, Grid, Portal, Select } from '@chakra-ui/react';
import React, { useEffect, useMemo } from 'react';
import { Page } from '../../components/Page';
import { useProjectList } from '../../queries/useProjectList';
import { Project } from '../../models/Project';
import { NoProjectsFound } from '../../components/empty/NoProjectsFound';
import { Center } from '../../components/Center';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { RoadmapHeader } from './components/RoadmapHeader';
import { DateAmountSlider } from './components/DateAmountSlider';
import { RoadmapSidebar } from './components/RoadmapSidebar';
import { GantChart } from './components/GantChart';
import { GantChartContext } from './contexts/GantChartContext';
import { GRID_SIDEBAR_WIDTH, useGantChart } from './hooks/useGantChart';
import { Chevron } from '../../components/icons/Chevron';

// https://dribbble.com/shots/6363405/attachments/6363405-Project-management-tool-Project-roadmap-Gantt-chart?mode=media
// https://dribbble.com/shots/6363405/attachments/6363405-Project-management-tool-Project-roadmap-Gantt-chart?mode=media
// https://dribbble.com/shots/6363405/attachments/6363405-Project-management-tool-Project-roadmap-Gantt-chart?mode=media
// https://dribbble.com/shots/6363405/attachments/6363405-Project-management-tool-Project-roadmap-Gantt-chart?mode=media
// https://dribbble.com/shots/6363405/attachments/6363405-Project-management-tool-Project-roadmap-Gantt-chart?mode=media

export const Roadmap = (): JSX.Element => {
	const { data, isLoading } = useProjectList();
	const projects = useMemo(() => data?.projects || [], [data]);
	const [state, dispatch] = useGantChart({
		initialState: {
			type: 'Days',
			date: new Date(),
			dateOffset: 0,
			project: null
		}
	});

	const setProject = (project: Project) =>
		dispatch({
			type: 'SetProject',
			payload: project
		});

	useEffect(() => {
		if (projects.length > 0 && state.project === null) {
			setProject(projects[0]);
		}
	}, [setProject, projects, state.project]);

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
			{isLoading ? (
				<Center>
					<LoadingSpinner />
				</Center>
			) : projects.length === 0 ? (
				<NoProjectsFound />
			) : (
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
			)}
		</Page>
	);
};
