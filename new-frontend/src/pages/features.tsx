import { Grid, GridItem, Text, VStack, Image } from '@chakra-ui/react';

export const Features = (): JSX.Element => {
	return (
		<>
			<Text fontSize="4xl">Features</Text>
			<Grid marginTop={10} templateColumns="repeat(6, 1fr)" gap={2}>
				<GridItem colSpan={4}>
					<Image
						src="/public/feature1.jpeg"
						alt="Project dashboard"
						width={'800px'}
						height={'400px'}
					/>
				</GridItem>
				<GridItem colSpan={2} marginTop={20}>
					<VStack>
						<Text fontSize={'2xl'}>Project dashboard</Text>
						<Text>
							Create Projects - See all your projects on the dashboard, and view
							up-to-date status. Create your own boards to suit your workflow
						</Text>
					</VStack>
				</GridItem>
				<GridItem colSpan={4} marginTop={20}>
					<Image
						src="/public/feature2.jpeg"
						alt="Property"
						width={'800px'}
						height={'400px'}
					/>
				</GridItem>
				<GridItem colSpan={2} marginTop={20}>
					<VStack>
						<Text fontSize={'2xl'}>Property</Text>
						<Text>
							Create Property and have all projects for same property in the same
							place. Create units under property - create stakeholders for units and
							properties.
						</Text>
					</VStack>
				</GridItem>
				<GridItem colSpan={4} marginTop={20}>
					<Image
						src="/public/feature3.jpeg"
						alt="Task-Kanban"
						width={'800px'}
						height={'400px'}
					/>
				</GridItem>
				<GridItem colSpan={2} marginTop={20}>
					<VStack>
						<Text fontSize={'2xl'}>Task / Kanban Board</Text>
						<Text>
							Create tasks for Kanban board. Invite stakeholders or/and your workers
							to teh projects. Assign tasks to team members. Add information to tasks,
							start and end dates, pictures, resources, or comments. You can
							communicate with everybody involved in the task and keep all
							communication for your record. Add pictures to communication if needed.
							You can also have team members clock into individual tasks.
						</Text>
					</VStack>
				</GridItem>
				<GridItem colSpan={4} marginTop={20}>
					<Image
						src="/public/feature4.jpeg"
						alt="Gantt chart"
						width={'800px'}
						height={'400px'}
					/>
				</GridItem>
				<GridItem colSpan={2} marginTop={20}>
					<VStack>
						<Text fontSize={'2xl'}>Gantt Chart</Text>
						<Text>
							Get an instant overview of the timeline of your project. See all tasks
							involved in your project and their order. You can group tasks under
							deliverables if preferred.
						</Text>
					</VStack>
				</GridItem>
				<GridItem colSpan={4} marginTop={20}>
					<Image
						src="/public/feature5.jpeg"
						alt="File system"
						width={'800px'}
						height={'400px'}
					/>
				</GridItem>
				<GridItem colSpan={2} marginTop={20}>
					<VStack>
						<Text fontSize={'2xl'}>File system</Text>
						<Text>
							Upload files, share them with your co-workers/stakeholders, keep
							everything in one place and stop searching for files in your inbox. Add
							comments to drawings/pictures. Zoom in on drawings when needed.
						</Text>
					</VStack>
				</GridItem>
				<GridItem colSpan={4} marginTop={20}>
					<Image
						src="/public/feature6.jpeg"
						alt="time tracking reports"
						width={'800px'}
						height={'400px'}
					/>
				</GridItem>
				<GridItem colSpan={2} marginTop={20}>
					<VStack>
						<Text fontSize={'2xl'}>Time tracking reports</Text>
						<Text>
							View tracked hours of your employees on a task and/or project level. You
							can also start timers for your workers. You can view reports on screen
							and download them to print or share with payroll or other stakeholders.
						</Text>
					</VStack>
				</GridItem>
				<GridItem colSpan={4} marginTop={20}>
					<Image
						src="/public/feature7.jpeg"
						alt="Tender - Procurement"
						width={'800px'}
						height={'400px'}
					/>
				</GridItem>
				<GridItem colSpan={2} marginTop={20}>
					<VStack>
						<Text fontSize={'2xl'}>Tender - Procurement</Text>
						<Text>
							Get offers from professionals and suppliers. Keep all information about
							material for projects in one place.
						</Text>
					</VStack>
				</GridItem>
			</Grid>
		</>
	);
};
