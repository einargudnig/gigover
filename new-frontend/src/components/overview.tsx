import { Box, Flex, Text, Image, VStack } from '@chakra-ui/react';

type ContentBlock = {
	id: number;
	image: string;
	alt: string;
	title: string;
	description: string;
};

export const Overview = () => {
	const contentBlocks: ContentBlock[] = [
		{
			id: 1,
			image: '/project-status.jpeg',
			alt: 'App screenshot',
			title: 'Avoid guesswork about project status',
			description:
				'Track your construction project status in real-time, eliminating uncertainty about timelines, and gain visibility into any issues or delays.'
		},
		{
			id: 2,
			image: '/responsibilities.jpeg',
			alt: 'App screenshot',
			title: "Clarify everyone's responsibilities",
			description:
				'Create projects and break them down into tasks, ensuring everyone is clear about their responsibilities and stays accountable for their work.'
		},
		{
			id: 3,
			image: '/keep-in-loop.jpeg',
			alt: 'App screenshot',
			title: 'Keep everyone in the loop',
			description:
				'Invite stakeholders to collaborate on projects, keeping everyone aligned and informed, and helping teams to stay productive and succeed.'
		},
		{
			id: 4,
			image: '/time-tracker.jpeg',
			alt: 'App screenshot',
			title: 'Simplify time tracking and payroll',
			description:
				'Track employee hours, keeping an eye on when and where employees are working, and export reports for seamless payroll processing.'
		},
		{
			id: 5,
			image: '/team-communication.jpeg',
			alt: 'App screenshot',
			title: 'Improve team communication',
			description:
				'Centralize and streamline communication between your contractors and workers, creating a collaborative environment.'
		},
		{
			id: 6,
			image: '/control-of-data.jpeg',
			alt: 'App screenshot',
			title: 'Take control of your data',
			description:
				'View and download project reports and milestones estimates, staying on top of your data, and never missing a beat.'
		}
	];

	return (
		<Box marginTop={[12, 36]} paddingX={'6px'}>
			<VStack spacing={10}>
				{contentBlocks.map((block, index) => (
					<Flex
						key={block.id}
						flexDirection={{
							base: 'column',
							md: index % 2 === 0 ? 'row-reverse' : 'row'
						}}
						justifyContent={'space-between'}
						alignItems={'center'}
					>
						<Box>
							<Image
								src={block.image}
								alt={block.alt}
								rounded="md"
								mb={{ base: 5, md: 0 }}
							/>
						</Box>
						<Box textAlign={'center'} paddingX={{ md: 10 }}>
							<Text fontSize="2xl" as="b">
								{block.title}
							</Text>
							<Text fontSize="xl" mt={4}>
								{block.description}
							</Text>
						</Box>
					</Flex>
				))}
			</VStack>
		</Box>
	);
};
