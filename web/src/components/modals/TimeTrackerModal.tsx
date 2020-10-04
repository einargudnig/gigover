import React from 'react';
import { TimeIcon } from '../icons/TimeIcon';
import { Theme } from '../../Theme';
import { TrackerSelect } from '../TrackerSelect';
import { FormActions } from '../FormActions';
import { Modal } from '../Modal';
import { useCloseModal } from '../../hooks/useCloseModal';
import { ITimeTrackerModalContext } from '../../context/ModalContext';

interface TimeTrackerModalProps {
	open: boolean;
	context: ITimeTrackerModalContext;
}

export const TimeTrackerModal = ({ open, context }: TimeTrackerModalProps): JSX.Element => {
	const closeModal = useCloseModal();

	console.log('TimeTrackerModalContext', context);

	return (
		<Modal
			title={
				<>
					<TimeIcon color={Theme.colors.green} />
					<div>Time tracker</div>
				</>
			}
			open={open}
			centerModal={true}
			closeIcon={false}
			onClose={() => closeModal()}
		>
			<>
				{/*<TrackerSelect
					title={'Select a project'}
					value={'Project #1'}
					valueChanged={(newValue) => null}
				/>
				<TrackerSelect
					title={'Select a worker'}
					value={'Adam Viðarsson'}
					valueChanged={(newValue) => null}
				/>
				<TrackerSelect
					title={'Select a task'}
					value={'Select a task'}
					valueChanged={(newValue) => null}
				/>*/}
				<FormActions
					onSubmit={() => console.log('cool')}
					submitText={'Start tracking'}
					onCancel={() => closeModal()}
					cancelText={'Close'}
					style={{ paddingBottom: 0 }}
				/>
			</>
		</Modal>
	);
};
