import { Box, VStack, Text, Grid, GridItem } from '@chakra-ui/react';
import { TaskManagementFeatureIcon } from './icons/task-management';
import { TimeTrackingFeatureIcon } from './icons/time-tracking';
import { EstimatesAndReportsFeatureIcon } from './icons/estimates';

export const FeaturesSection = () => {
	return (
		<Box paddingX={['10px', '165px']} marginBottom={10}>
			<Text fontSize={'32px'} textAlign="center" marginY={10}>
				Everything you need to run your maintenance and construction projects efficiently:
			</Text>
			<Grid templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }} gap={3}>
				<GridItem colSpan={1}>
					<VStack>
						<Box marginTop={[10, 0]} rounded={'md'} p={10}>
							<TaskManagementFeatureIcon />
						</Box>
						<Box marginTop={[4, 0]}>
							<Text as="b">
								Timely, budget-friendly, and high-quality project completion
							</Text>
							<Text>
								Project management ensures that property management projects are
								completed on time, within budget, and to the highest standards,
								reducing delays and cost overruns.
							</Text>
						</Box>
					</VStack>
				</GridItem>
				<GridItem colSpan={1}>
					<VStack>
						<Box marginTop={[10, 0]} rounded={'md'} p={10}>
							<TimeTrackingFeatureIcon />
						</Box>
						<Box marginTop={[4, 0]}>
							<Text as="b">
								Effective stakeholder communication and progress tracking
							</Text>
							<Text>
								By facilitating ongoing communication with key stakeholders and
								tracking progress, project management keeps everyone aligned and
								focused on the end result, ensuring smooth collaboration and
								transparency.
							</Text>
						</Box>
					</VStack>
				</GridItem>
				<GridItem colSpan={1}>
					<VStack>
						<Box marginTop={[10, 0]} rounded={'md'} p={10}>
							<EstimatesAndReportsFeatureIcon />
						</Box>
						<Box marginTop={[4, 0]}>
							<Text as="b">Informed decision-making</Text>
							<Text>
								Project management eliminates rework and mistakes by providing the
								team with all necessary information, enabling them to make informed
								decisions and maintain project efficiency.
							</Text>
						</Box>
					</VStack>
				</GridItem>
			</Grid>
		</Box>
	);
};
