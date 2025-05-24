import { Button, Flex, GridItem, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import { useContext } from 'react';
import { EmptyProjects } from '../../../components/empty/EmptyProjects';
import { EmptyState } from '../../../components/empty/EmptyState';
import { Edit } from '../../../components/icons/Edit';
import { ModalContext } from '../../../context/ModalContext';
import { displayTaskTitle } from '../../../utils/TaskUtils';
import { GantChartContext } from '../contexts/GantChartContext';
import { GRID_ROW_HEIGHT, GRID_SIDEBAR_WIDTH } from '../hooks/useGantChart';
import { useGetUserPrivileges } from '../../../hooks/useGetUserPrivileges';
import { DisabledComponent } from '../../../components/disabled/DisabledComponent';

export const RoadmapSidebar = (): JSX.Element => {
	const [, setModalState] = useContext(ModalContext);
	const [state, dispatch] = useContext(GantChartContext);
	console.log({ state });

	const { privileges } = useGetUserPrivileges();

	// We shouldn't order be lexoRank here, we should sort by startDate!
	// When we have the gantt chart on a linear date format it doesn't make sense to sort by lexoRank
	// Unluss we could shcange the order on the gantt chart to be based on lexoRank
	// Since that's not possible we should sort by startDate!

	// The tasks object on the GantChartContext do not have their lexoRank property set.
	// So we use the sortedItems to display the tasks from the project on the Context in the correct order.
	// Lets also make sure that if for some reason we are missing the lexoRank we don't crash the app
	// const sortedItems = state.project?.tasks.sort((a, b) => {
	// 	if (a.startDate && b.startDate) {
	// 		return a.startDate - b.startDate; // Subtracting dates gives the difference in milliseconds
	// 	}
	// 	// Check if both lexoRanks are available
	// 	if (a.lexoRank && b.lexoRank) {
	// 		return a.lexoRank.localeCompare(b.lexoRank);
	// 	}
	//
	// 	// Fallback: If lexoRank is missing, sort by another property like title or id
	// 	// Ensure these properties exist or default to an empty string or zero
	// 	return (a.subject || '').localeCompare(b.subject || '');
	// });

	const isViewer = privileges?.includes('VIEWER');

	return (
        <>
            {state.project && (
				<GridItem colStart={1} rowStart={1}>
					<DisabledComponent>
						<Button
							colorScheme={'gray'}
							variant={'outline'}
							width={'100%'}
							onClick={() =>
								setModalState({
									milestone: {
										projectId: state.project!.projectId!,
										callback: () => {
											return;
										}
									}
								})
							}
						>
							Add a deliverable
						</Button>
					</DisabledComponent>
				</GridItem>
			)}
            <GridItem colStart={1} rowStart={2}>
				{state.milestones.map((m, mIndex) => (
					<VStack spacing={0} key={mIndex} alignItems={'flex-start'}>
						<Flex
							justifyContent={'space-between'}
							alignItems={'center'}
							width={'100%'}
							height={GRID_ROW_HEIGHT}
						>
							<HStack maxWidth={`calc(${GRID_SIDEBAR_WIDTH} - 40px)`} spacing={4}>
								{!isViewer ? (
									<IconButton
										size={'xs'}
										aria-label={'milestone-expand'}
										icon={
											<span>
												{state.expanded.has(m.milestoneId) ? '-' : '+'}
											</span>
										}
										onClick={() => {
											dispatch({
												type: 'ToggleMilestone',
												payload: m
											});
										}}
										variant={'outline'}
										colorScheme={'gray'}
									/>
								) : null}
								<Text
									isTruncated
									color={'black'}
									fontSize={'sm'}
									fontWeight={'bold'}
								>
									{m.title}
								</Text>
							</HStack>
							{!isViewer ? (
								<IconButton
									size={'xs'}
									aria-label={'milestone-actions'}
									icon={<Edit size={14} color={'black'} />}
									variant={'ghost'}
									colorScheme={'gray'}
									onClick={() => {
										setModalState({
											milestone: {
												projectId: state.project!.projectId!,
												milestone: m,
												callback: () => {
													return;
												}
											}
										});
									}}
								/>
							) : null}
						</Flex>
						{state.expanded.has(m.milestoneId) &&
							m.projectTasks.map((mTask, mTaskIndex) => (
								<Flex
									key={mTaskIndex}
									width={'100%'}
									justifyContent={'space-between'}
									alignItems={'center'}
									height={GRID_ROW_HEIGHT}
								>
									<HStack
										maxWidth={`calc(${GRID_SIDEBAR_WIDTH} - 40px)`}
										spacing={4}
									>
										<Text isTruncated color={'black'} fontSize={'sm'}>
											{displayTaskTitle(mTask)}
										</Text>
									</HStack>
									{!isViewer ? (
										<IconButton
											size={'xs'}
											aria-label={'milestone-actions'}
											icon={<Edit size={14} color={'black'} />}
											variant={'ghost'}
											colorScheme={'gray'}
											onClick={() => {
												setModalState({
													taskDetails: {
														projectId: state.project!.projectId!,
														task: mTask
													}
												});
											}}
										/>
									) : null}
								</Flex>
							))}
					</VStack>
				))}
				{state.tasks.length > 0 && (
					<Flex
						justifyContent={'space-between'}
						alignItems={'center'}
						width={'100%'}
						height={GRID_ROW_HEIGHT}
					>
						<HStack maxWidth={`calc(${GRID_SIDEBAR_WIDTH} - 40px)`} spacing={4}>
							<Text isTruncated color={'black'} fontSize={'sm'} fontWeight={'bold'}>
								Other tasks
							</Text>
						</HStack>
					</Flex>
				)}
				{state.tasks.map((t, tIndex) => (
					// {sortedItems?.map((t, tIndex) => (
					(<Flex
						key={tIndex}
						justifyContent={'space-between'}
						alignItems={'center'}
						width={'100%'}
						height={GRID_ROW_HEIGHT}
					>
                        <HStack maxWidth={`calc(${GRID_SIDEBAR_WIDTH} - 40px)`} spacing={4}>
							<Text isTruncated color={'black'} fontSize={'sm'}>
								{displayTaskTitle(t)}
							</Text>
						</HStack>
                        {!isViewer ? (
							<IconButton
								size={'xs'}
								aria-label={'milestone-actions'}
								icon={<Edit size={14} color={'black'} />}
								variant={'ghost'}
								colorScheme={'gray'}
								onClick={() => {
									setModalState({
										taskDetails: {
											projectId: state.project!.projectId!,
											task: t
										}
									});
								}}
							/>
						) : null}
                    </Flex>)
				))}
				{state.tasks.length === 0 && state.milestones.length === 0 && (
					<EmptyState
						icon={<EmptyProjects scale={0.5} />}
						title={'No deliverables'}
						text={
							'No deliverables have been added, create one to see it on the gant chart.'
						}
					/>
				)}
			</GridItem>
        </>
    );
};
