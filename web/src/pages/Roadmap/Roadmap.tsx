import { Box, Button, Grid, Portal } from '@chakra-ui/react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useEffect, useRef } from 'react';
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
	console.log('Roadmap', { projects, selectedProject });
	const ref = useRef<HTMLDivElement | null>(null);

	console.log({ projects, selectedProject });

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
	console.log({ data });

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

	const handleDownloadPdf = async () => {
		const element = ref.current;
		if (!element) {
			console.error('Element not found for PDF generation');
			return;
		}

		try {
			const canvas = await html2canvas(element, {
				scale: 2, // Improves quality
				useCORS: true // If you have external images/resources
				// It might be necessary to set a higher scrollY if content is off-screen
				// scrollY: -window.scrollY
			});

			const imgData = canvas.toDataURL('image/png');

			const pdfWidth = element.offsetWidth;
			const pdfHeight = element.offsetHeight;

			// Determine orientation: 'l' for landscape, 'p' for portrait
			const orientation = pdfWidth > pdfHeight ? 'l' : 'p';

			const pdf = new jsPDF({
				orientation: orientation,
				unit: 'px',
				format: [pdfWidth, pdfHeight],
				hotfixes: ['px_scaling']
			});

			pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
			pdf.save(`Gigover-gantt-${state.project?.projectId}.pdf`);
		} catch (error) {
			console.error('Error generating PDF:', error);
			// You might want to add some user-facing error notification here
		}
	};

	return (
		<Page
			title={'Gantt chart'}
			backgroundColor={'#fff'}
			actions={state.project && <Button onClick={handleDownloadPdf}>Download as PDF</Button>}
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
