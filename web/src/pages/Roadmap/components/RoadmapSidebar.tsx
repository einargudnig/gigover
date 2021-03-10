import { Flex, GridItem, HStack, IconButton, Text, Button } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { GantChartContext } from '../contexts/GantChartContext';
import { TimeIcon } from '../../../components/icons/TimeIcon';
import { GRID_ROW_HEIGHT, GRID_SIDEBAR_WIDTH } from '../hooks/useGantChart';

export const RoadmapSidebar = (): JSX.Element => {
	const [state] = useContext(GantChartContext);

	return (
		<>
			<GridItem colStart={1} rowStart={1}>
				<Button colorScheme={'gray'} variant={'outline'} width={'100%'}>
					Add a milestone
				</Button>
			</GridItem>
			<GridItem colStart={1} rowStart={2}>
				{state.project?.tasks.map((t) => (
					<Flex
						justifyContent={'space-between'}
						key={t.taskId}
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
								{t.text}
							</Text>
						</HStack>
						<IconButton
							size={'xs'}
							aria-label={'milestone-actions'}
							icon={<TimeIcon color={'black'} scale={0.6} />}
							variant={'ghost'}
							colorScheme={'gray'}
						/>
					</Flex>
				))}
			</GridItem>
		</>
	);
};
