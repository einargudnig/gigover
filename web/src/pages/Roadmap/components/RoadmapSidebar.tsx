import { Button, Flex, GridItem, HStack, IconButton, Text } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { GantChartContext } from '../contexts/GantChartContext';
import { GRID_ROW_HEIGHT, GRID_SIDEBAR_WIDTH } from '../hooks/useGantChart';
import { ModalContext } from '../../../context/ModalContext';
import { EmptyState } from '../../../components/empty/EmptyState';
import { EmptyProjects } from '../../../components/empty/EmptyProjects';
import { Edit } from '../../../components/icons/Edit';

export const RoadmapSidebar = (): JSX.Element => {
	const [, setModalState] = useContext(ModalContext);
	const [state] = useContext(GantChartContext);

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
						Add a milestone
					</Button>
				</GridItem>
			)}
			<GridItem colStart={1} rowStart={2}>
				{state.milestones.map((m, mIndex) => (
					<Flex
						justifyContent={'space-between'}
						key={mIndex}
						alignItems={'center'}
						height={GRID_ROW_HEIGHT}
					>
						<HStack maxWidth={`calc(${GRID_SIDEBAR_WIDTH} - 40px)`} spacing={4}>
							<IconButton
								size={'xs'}
								aria-label={'milestone-expand'}
								icon={<span>+</span>}
								variant={'outline'}
								colorScheme={'gray'}
							/>
							<Text isTruncated color={'black'} fontSize={'sm'} fontWeight={'bold'}>
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
