import { Box, Portal, Select } from '@chakra-ui/react';
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
import { useGantChart } from './hooks/useGantChart';

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
					colorScheme={'green'}
					variant="unstyled"
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
				<Box>
					<GantChartContext.Provider value={[state, dispatch]}>
						<RoadmapHeader />
						<Box display={'flex'} mt={8}>
							<RoadmapSidebar />
							<GantChart />
						</Box>
						<Portal>
							<DateAmountSlider />
						</Portal>
					</GantChartContext.Provider>
				</Box>
			)}
		</Page>
	);
};
