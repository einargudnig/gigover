import { Box, Button, Input, Text } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { useChangeUid } from '../mutations/useChangeUid';
import { enableMsw, disableMsw, isMswEnabled } from '../mocks/utils/toggle-msw';
import { IS_LOCAL } from '../services/ApiService';

export const DevMenu = (): JSX.Element | null => {
	const { mutate } = useChangeUid();
	const [uid, setUid] = useState('');

	const change = useCallback(() => {
		if (uid.length > 0) {
			mutate(uid);
		}
	}, [uid, mutate]);

	const isEnabled = isMswEnabled();

	if (!IS_LOCAL) {
		return null;
	}

	return (
		<Box
			position="fixed"
			bottom="32px"
			left="32px"
			p="16px"
			bg="#fff"
			border="1px solid red"
			borderRadius="12px"
		>
			<Text>View as</Text>
			<Input
				type={'text'}
				placeholder={'UID'}
				value={uid}
				onChange={(e) => {
					setUid(e.target.value);
				}}
				my={2} // Added some margin for spacing
			/>
			<Button
				onClick={() => {
					change();
				}}
			>
				Disguise
			</Button>

			<Button
				marginLeft={5}
				colorScheme={isEnabled ? 'purple' : 'gray'}
				onClick={isEnabled ? disableMsw : enableMsw}
			>
				MSW: {isEnabled ? 'ON' : 'OFF'}
			</Button>
		</Box>
	);
};
