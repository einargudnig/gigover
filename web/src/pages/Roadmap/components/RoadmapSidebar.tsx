import { Button, Flex, GridItem, HStack, IconButton, Text, VStack } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { GantChartContext } from '../contexts/GantChartContext';
import { GRID_ROW_HEIGHT, GRID_SIDEBAR_WIDTH } from '../hooks/useGantChart';
import { ModalContext } from '../../../context/ModalContext';
import { EmptyState } from '../../../components/empty/EmptyState';
import { EmptyProjects } from '../../../components/empty/EmptyProjects';
import { Edit } from '../../../components/icons/Edit';

export const RoadmapSidebar = (): JSX.Element => {
	const [, setModalState] = useContext(ModalContext);
	const [state, dispatch] = useContext(GantChartContext);

	return (
		<>
			{state.project && (
				<GridItem colStart={1} rowStart={1}>
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
								<IconButton
									size={'xs'}
									aria-label={'milestone-expand'}
									icon={
										<span>{state.expanded.has(m.milestoneId) ? '-' : '+'}</span>
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
								<Text
									isTruncated
									color={'black'}
									fontSize={'sm'}
									fontWeight={'bold'}
								>
									{m.title}
								</Text>
							</HStack>
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
											{mTask.text}
										</Text>
									</HStack>
									<IconButton
										size={'xs'}
										aria-label={'milestone-actions'}
										icon={<Edit size={14} color={'black'} />}
										variant={'ghost'}
										colorScheme={'gray'}
										onClick={() => {
											setModalState({
												taskDetails: {
													projectId: mTask.projectId,
													task: mTask
												}
											});
										}}
									/>
								</Flex>
							))}
					</VStack>
				))}
				{state.milestones.length === 0 && (
					<EmptyState
						icon={<EmptyProjects scale={0.5} />}
						title={'No milestones'}
						text={
							'No milestones have been added, create one to see it on the gant chart.'
						}
					/>
				)}
			</GridItem>
		</>
	);
};
