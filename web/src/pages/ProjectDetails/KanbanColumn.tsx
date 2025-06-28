import { Box, Button, Flex, Heading, IconButton, Text } from '@chakra-ui/react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { TaskCardInput } from '../../components/TaskCardInput';
import { PlusIcon } from '../../components/icons/PlusIcon';
import type { Task } from '../../models/Task';
import { useAddTask } from '../../queries/useAddTask';
import { GetNextLexoRank } from '../../utils/GetNextLexoRank';
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
	const [isAdding, setIsAdding] = useState(false);
	const [inputValue, setInputValue] = useState('');
	const [error, setError] = useState<string | undefined>(undefined);
	const { mutateAsync: addTask, isPending: isLoading } = useAddTask();

	const handleShowInput = () => {
		setIsAdding(true);
		setError(undefined);
	};

	const handleAddTask = async ({ subject }: { subject: string }) => {
		setError(undefined);
		try {
			await addTask({
				projectId,
				status: parseInt(columnId) as import('../../models/Task').TaskStatusType,
				lexoRank: GetNextLexoRank(tasks, -1, tasks.length - 1).toString(),
				subject,
				typeId: undefined // or set a default typeId if needed
			});
			setIsAdding(false);
			setInputValue('');
		} catch (e: any) {
			setError(e.message || 'Failed to add task');
		}
	};

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
				<Heading size="md">{title}</Heading>
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
					onClick={handleShowInput}
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
					{isAdding && (
						<Box mt={2}>
							<TaskCardInput
								value={inputValue}
								onChange={setInputValue}
								onSubmit={handleAddTask}
								loading={isLoading}
								error={error}
							/>
						</Box>
					)}
				</SortableContext>
			</div>
			{isHovered && !isAdding && (
				<Button
					leftIcon={<PlusIcon />}
					variant="outline"
					w="100%"
					colorScheme="gray"
					fontWeight="bold"
					onClick={handleShowInput}
				>
					Add Task
				</Button>
			)}
		</Box>
	);
};

export default KanbanColumn;
