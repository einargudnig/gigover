import { Box, Flex, Text, Image, Spacer } from '@chakra-ui/react';

export const Overview = () => {
	return (
		<Box marginTop={[12, 36]} width={['100%', '65%']}>
			<Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
				<Text fontSize="2xl" textAlign={'center'}>
					Help your maintenance and construction projects stay on schedule and on budget!
				</Text>

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
						<Box marginLeft={[0, 10]} marginTop={[5, 0]}>
							<Text fontSize="2xl" as="b" textAlign={'center'}>
								Avoid guesswork about project's status
							</Text>
							<Text fontSize="xl" marginTop={4} textAlign={'center'}>
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
						<Box marginLeft={[0, 10]} marginTop={[5, 0]}>
							<Text fontSize="2xl" as="b" textAlign={'center'}>
								Clarify everyone's responsibilities
							</Text>
							<Text fontSize="xl" marginTop={4} textAlign={'center'}>
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
						<Box marginLeft={[0, 10]} marginTop={[5, 0]}>
							<Text fontSize="2xl" as="b" textAlign={'center'}>
								Keep everyone in the loop
							</Text>
							<Text fontSize="xl" marginTop={4} textAlign={'center'}>
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
						<Box marginLeft={[0, 10]} marginTop={[5, 0]}>
							<Text fontSize="2xl" as="b" textAlign={'center'}>
								Simplify time tracking and payroll
							</Text>
							<Text fontSize="xl" marginTop={4} textAlign={'center'}>
								track eployee hours, keeping an eye on when and where employees are
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
						<Box marginLeft={[0, 10]} marginTop={[5, 0]}>
							<Text fontSize="2xl" as="b" textAlign={'center'}>
								Improve team communication
							</Text>
							<Text fontSize="xl" marginTop={4} textAlign={'center'}>
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
						<Box marginLeft={[0, 10]} marginTop={[5, 0]}>
							<Text fontSize="2xl" as="b" textAlign={'center'}>
								Take control of your data
							</Text>
							<Text fontSize="xl" marginTop={4} textAlign={'center'}>
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
