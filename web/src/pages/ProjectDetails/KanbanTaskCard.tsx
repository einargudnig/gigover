import { Avatar } from '@chakra-ui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useContext } from 'react';
import { Label } from '../../components/Label';
import { DragDropIcon } from '../../components/icons/DragDropIcons';
import { ModalContext } from '../../context/ModalContext';
import type { Task } from '../../models/Task';
import { useProjectTypes } from '../../queries/useProjectTypes';

interface KanbanTaskCardProps {
	task: Task;
	projectId: number;
	index: number;
}

const KanbanTaskCard = ({ task, projectId, index }: KanbanTaskCardProps) => {
	const { taskId, subject, typeId, worker } = task;
	const id = taskId.toString();
	const name = subject;
	const type = typeId;
	const [, setModalContext] = useContext(ModalContext);
	const { data: projectTypesData } = useProjectTypes();
	const typeName =
		typeof type === 'number'
			? projectTypesData?.projectTypes.find((pt) => pt.typeId === type)?.name || 'unknown'
			: 'unknown';

	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
		data: { columnId: task.status.toString(), index }
	});
	const style: React.CSSProperties = {
		position: 'relative',
		transform: CSS.Transform.toString(transform),
		transition,
		background: isDragging ? '#e0e7ff' : 'white',
		borderRadius: 8,
		boxShadow: isDragging ? '0 4px 16px rgba(0,0,0,0.12)' : '0 1px 2px rgba(0,0,0,0.04)',
		opacity: isDragging ? 0.85 : 1,
		marginBottom: 8,
		padding: 12,
		cursor: 'pointer',
		fontWeight: 600,
		border: isDragging ? '2px solid #6366f1' : '1px solid #e5e7eb',
		minHeight: 80,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between'
	};
	// Open modal on card click, but not when clicking the drag icon
	const handleCardClick = (e: React.MouseEvent) => {
		if ((e.target as HTMLElement).closest('.drag-handle')) return;
		setModalContext({
			taskDetails: {
				projectId: projectId,
				task: task
			}
		});
	};
	return (
		<div ref={setNodeRef} style={style} {...attributes} onClick={handleCardClick}>
			{/* Top row: name left, drag icon right */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-start'
				}}
			>
				<div style={{ fontWeight: 600, fontSize: 15, wordBreak: 'break-word' }}>{name}</div>
				<span
					className="drag-handle"
					style={{ cursor: 'grab', marginLeft: 8 }}
					{...listeners}
				>
					<DragDropIcon />
				</span>
			</div>
			{/* Bottom row: type label left, avatar right */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'flex-end',
					marginTop: 12
				}}
			>
				<Label text={typeName} />
				{worker && worker.name && <Avatar size="xs" name={worker.name} />}
			</div>
		</div>
	);
};

export default KanbanTaskCard;
