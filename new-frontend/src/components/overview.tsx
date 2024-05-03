import { Box, Flex, Text, Image, Spacer } from '@chakra-ui/react';

export const Overview = () => {
	return (
		<Box marginTop={[12, 36]} paddingX={'6px'}>
			<Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
				<Box textAlign={'center'}>
					<Text fontSize="2xl" as="b">
						Help your maintenance and construction projects stay on schedule and on
						budget!
					</Text>
				</Box>

				<Box marginTop={10}>
					<Flex
						flexDirection={['column', 'row']}
						justifyContent={'space-between'}
						alignItems={'center'}
					>
						<Box>
							<Image
								src="https://placehold.co/400x200"
								alt="App screenshot"
								rounded="md"
							/>
						</Box>
						<Spacer />
						<Box marginLeft={[0, 10]} marginTop={[5, 0]} textAlign={'center'}>
							<Text fontSize="2xl" as="b">
								Avoid guesswork about project's status
							</Text>
							<Text fontSize="xl" marginTop={4}>
								Track your construction project's status in real-time, eliminating
								uncertainty about timelines, and gain visibility into any issues or
								delays.
							</Text>
						</Box>
					</Flex>
				</Box>

				<Box marginTop={10}>
					<Flex
						flexDirection={['column', 'row']}
						justifyContent={'space-between'}
						alignItems={'center'}
					>
						<Box>
							<Image
								src="https://placehold.co/400x200"
								alt="App screenshot"
								rounded="md"
							/>
						</Box>
						<Spacer />
						<Box marginLeft={[0, 10]} marginTop={[5, 0]} textAlign={'center'}>
							<Text fontSize="2xl" as="b">
								Clarify everyone's responsibilities
							</Text>
							<Text fontSize="xl" marginTop={4}>
								Create projects and break them down into tasks, ensuring everyone is
								clear about their responsibilities and stays accountable for their
								work.
							</Text>
						</Box>
					</Flex>
				</Box>

				<Box marginTop={10}>
					<Flex
						flexDirection={['column', 'row']}
						justifyContent={'space-between'}
						alignItems={'center'}
					>
						<Box>
							<Image
								src="https://placehold.co/400x200"
								alt="App screenshot"
								rounded="md"
							/>
						</Box>
						<Spacer />
						<Box marginLeft={[0, 10]} marginTop={[5, 0]} textAlign={'center'}>
							<Text fontSize="2xl" as="b">
								Keep everyone in the loop
							</Text>
							<Text fontSize="xl" marginTop={4}>
								Invite stakeholders to collaborate on projects, keeping everyone
								aligned and informed, and helping teams to stay productive and
								succeed.
							</Text>
						</Box>
					</Flex>
				</Box>

				<Box marginTop={10}>
					<Flex
						flexDirection={['column', 'row']}
						justifyContent={'space-between'}
						alignItems={'center'}
					>
						<Box>
							<Image
								src="https://placehold.co/400x200"
								alt="App screenshot"
								rounded="md"
							/>
						</Box>
						<Spacer />
						<Box marginLeft={[0, 10]} marginTop={[5, 0]} textAlign={'center'}>
							<Text fontSize="2xl" as="b">
								Simplify time tracking and payroll
							</Text>
							<Text fontSize="xl" marginTop={4}>
								track employee hours, keeping an eye on when and where employees are
								working, and export reports for seamless payroll processing.
							</Text>
						</Box>
					</Flex>
				</Box>

				<Box marginTop={10}>
					<Flex
						flexDirection={['column', 'row']}
						justifyContent={'space-between'}
						alignItems={'center'}
					>
						<Box>
							<Image
								src="https://placehold.co/400x200"
								alt="App screenshot"
								rounded="md"
							/>
						</Box>
						<Spacer />
						<Box marginLeft={[0, 10]} marginTop={[5, 0]} textAlign={'center'}>
							<Text fontSize="2xl" as="b">
								Improve team communication
							</Text>
							<Text fontSize="xl" marginTop={4}>
								Centralize and streamline communication between your contractors and
								workers, creating a collaborative environment.
							</Text>
						</Box>
					</Flex>
				</Box>

				<Box marginTop={10}>
					<Flex
						flexDirection={['column', 'row']}
						justifyContent={'space-between'}
						alignItems={'center'}
					>
						<Box>
							<Image
								src="https://placehold.co/400x200"
								alt="App screenshot"
								rounded="md"
							/>
						</Box>
						<Spacer />
						<Box marginLeft={[0, 10]} marginTop={[5, 0]} textAlign={'center'}>
							<Text fontSize="2xl" as="b">
								Take control of your data
							</Text>
							<Text fontSize="xl" marginTop={4}>
								View and download project reports and milestones estimates, staying
								on top of your data, and never missing a beat.
							</Text>
						</Box>
					</Flex>
				</Box>
			</Flex>
		</Box>
	);
};
