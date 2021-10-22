import React, { useContext } from 'react';
import { TimeIcon } from '../../components/icons/TimeIcon';
import { Theme } from '../../Theme';
import { Button } from '@chakra-ui/react';
import { ModalContext } from '../../context/ModalContext';

export interface StartTimeTrackerButtonProps {
	isDisabled?: boolean;
}

export const StartTimeTrackerButton = ({
	isDisabled = true,
}: StartTimeTrackerButtonProps): JSX.Element => {
	const [, setModalContext] = useContext(ModalContext);

	return (
		<>
			<Button
				disabled={isDisabled}
				leftIcon={<TimeIcon color={Theme.colors.black} />}
				onClick={() => {
					if (!isDisabled) {
						// Fix a strange issue when starting a timer it sometimes crashes
						// due to "too many rerenders" if the page has not finished rendering..
						setTimeout(() => {
							setModalContext({
								timeTracker: {
									callback: () => {
										// setNow(new Date());
										// setRefetch(refetch + 1);
									}
								}
							});
						}, 0);
					}
				}}
			>
				<span>Start timer</span>
			</Button>
		</>
	);
};
