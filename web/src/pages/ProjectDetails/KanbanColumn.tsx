import { Box, Button, Flex, Heading, IconButton, Text } from '@chakra-ui/react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { PlusIcon } from '../../components/icons/PlusIcon';
import type { Task } from '../../models/Task';
import KanbanTaskCard from './KanbanTaskCard';

interface KanbanColumnProps {
	columnId: string;
	title: string;
	tasks: Task[];
	activeTask: string | null;
	projectId: number;
}

const KanbanColumn = ({ columnId, title, tasks, activeTask, projectId }: KanbanColumnProps) => {
	const { setNodeRef, isOver } = useDroppable({ id: columnId });
	const [isHovered, setIsHovered] = useState(false);
	return (
		<Box
			flex={1}
			minW="220px"
			bg="#f7f7fa"
			borderRadius={8}
			p={3}
			boxShadow="sm"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			position="relative"
		>
			<Flex align="center" mb={3}>
				<Heading size="sm">{title}</Heading>
				<Text ml={2} size="sm">
					({tasks.length})
				</Text>
				<IconButton
					aria-label="Add task"
					icon={<PlusIcon />}
					size="xs"
					variant="ghost"
					ml="auto"
					colorScheme={'black'}
					onClick={() => {
						/* handle add task */
					}}
				/>
			</Flex>
			<div
				ref={setNodeRef}
				style={{
					minHeight: 40,
					background: isOver ? '#e0e7ff' : undefined,
					borderRadius: 6,
					transition: 'background 0.2s'
				}}
			>
				<SortableContext
					items={tasks.map((t) => t.taskId.toString())}
					strategy={verticalListSortingStrategy}
				>
					{tasks.length === 0 ? (
						<Box textAlign="center" color="gray.400" py={4}>
							{isOver ? 'Release to drop here' : 'No tasks'}
						</Box>
					) : (
						tasks.map((task) => (
							<KanbanTaskCard task={task} key={task.taskId} projectId={projectId} />
						))
					)}
				</SortableContext>
			</div>
			{isHovered && (
				<Button
					leftIcon={<PlusIcon />}
					variant="outline"
					w="100%"
					colorScheme="gray"
					fontWeight="bold"
					onClick={() => {
						/* handle add task */
					}}
				>
					Add Task
				</Button>
			)}
		</Box>
	);
};

export default KanbanColumn;
