import { Box, Text, Flex, HStack, IconButton } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { GantChartContext } from '../contexts/GantChartContext';
import { TimeIcon } from '../../../components/icons/TimeIcon';

export const RoadmapSidebar = (): JSX.Element => {
	const [state] = useContext(GantChartContext);

	return (
		<Box flexShrink={0} flexGrow={0} flexBasis={'300px'} maxWidth={'300px'}>
			{state.project?.tasks.map((t) => (
				<Flex justifyContent={'space-between'} key={t.taskId} mt={4} mb={4}>
					<HStack maxWidth={'calc(300px - 40px)'} spacing={4}>
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
		</Box>
	);
};
