import { Box, HStack, VStack, Text, Flex } from '@chakra-ui/react';
import { TaskManagementFeatureIcon } from './icons/task-management';
import { TimeTrackingFeatureIcon } from './icons/time-tracking';
import { EstimatesAndReportsFeatureIcon } from './icons/estimates';

export const FeaturesSection = () => {
	return (
		<Box>
			<Flex flexDirection={['column', 'row']} gap={3}>
				<VStack>
					<Box>
						<TaskManagementFeatureIcon />
					</Box>
					<Box>
						<Text as="b">
							Timely, budget-friendly, and high-quality project completion
						</Text>
						<Text>
							Project management ensures that property management projects are
							completed on time, within budget, and to the highest standards, reducing
							delays and cost overruns.
						</Text>
					</Box>
				</VStack>
				<VStack>
					<Box>
						<TimeTrackingFeatureIcon />
					</Box>
					<Box>
						<Text as="b">
							Effective stakeholder communication and progress tracking
						</Text>
						<Text>
							By facilitating ongoing communication with key stakeholders and tracking
							progress, project management keeps everyone aligned and focused on the
							end result, ensuring smooth collaboration and transparency.
						</Text>
					</Box>
				</VStack>
				<VStack>
					<Box>
						<EstimatesAndReportsFeatureIcon />
					</Box>
					<Box>
						<Text as="b">Informed decision-making</Text>
						<Text>
							Project management eliminates rework and mistakes by providing the team
							with all necessary information, enabling them to make informed decisions
							and maintain project efficiency.
						</Text>
					</Box>
				</VStack>
			</Flex>
		</Box>
	);
};
