import React, { useState } from 'react';
import { TimeIcon } from '../icons/TimeIcon';
import { Theme } from '../../Theme';
import { TrackerSelect } from '../TrackerSelect';
import { FormActions } from '../FormActions';
import { Modal } from '../Modal';
import { useCloseModal } from '../../hooks/useCloseModal';
import { IEditTimeTrackerModalContext } from '../../context/ModalContext';
import { useModifyTimeRecord } from '../../queries/useModifyTimeRecord';
import { LoadingSpinner } from '../LoadingSpinner';
import styled from 'styled-components';
import { range } from '../../utils/ArrayUtils';

const MultiSelectWrapper = styled.div`
	display: flex;
	justify-content: stretch;

	> div {
		flex: 1;
	}

	> div:first-child {
		margin-right: ${(props) => props.theme.padding(2)};
	}
`;

interface TimeTrackerModalProps {
	open: boolean;
	context: IEditTimeTrackerModalContext;
}

export const EditTimeTrackerModal = ({ open, context }: TimeTrackerModalProps): JSX.Element => {
	const closeModal = useCloseModal(context.callback);
	const [hours, setHours] = useState(context.hours);
	const [minutes, setMinutes] = useState(context.minutes);
	const { mutateAsync: modifyTimeRecord, isLoading } = useModifyTimeRecord();

	const update = async () => {
		const newMins = hours * 60 + minutes;

		await modifyTimeRecord({
			workId: context.workId,
			minutes: newMins
		});

		closeModal();
	};

	return (
		<Modal
			title={
				<>
					<TimeIcon color={Theme.colors.green} />
					<div>Edit Time Record</div>
					{isLoading && <LoadingSpinner />}
				</>
			}
			open={open}
			centerModal={true}
			closeIcon={false}
			onClose={() => closeModal()}
		>
			<TrackerSelect
				title={'Project'}
				value={context.projectName}
				disabled={true}
				options={[{ value: context.projectName, label: context.projectName }]}
				valueChanged={() => null}
			/>
			<TrackerSelect
				title={'Worker'}
				value={context.workerName}
				disabled={true}
				options={[{ value: context.workerName, label: context.workerName }]}
				isNumber={false}
				valueChanged={() => null}
			/>
			<TrackerSelect
				title={'Task'}
				value={context.taskName}
				disabled={true}
				options={[{ value: context.taskName, label: context.taskName }]}
				valueChanged={() => null}
			/>
			<MultiSelectWrapper>
				<TrackerSelect
					title={'Hours'}
					value={hours}
					isNumber={true}
					options={range(-1, 22).map((i) => ({
						value: i + 1,
						label: (i + 1).toString()
					}))}
					valueChanged={(newValue) => setHours(newValue as number)}
				/>
				<TrackerSelect
					title={'Minutes'}
					value={minutes}
					isNumber={true}
					options={range(-1, 58).map((i) => ({
						value: i + 1,
						label: (i + 1).toString()
					}))}
					valueChanged={(newValue) => setMinutes(newValue as number)}
				/>
			</MultiSelectWrapper>
			<FormActions
				submitDisabled={false}
				onSubmit={() => update()}
				submitText={'Change'}
				onCancel={() => closeModal()}
				cancelText={'Close'}
				style={{ paddingBottom: 0 }}
			/>
		</Modal>
	);
};
