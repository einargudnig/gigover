import { Button } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import styled from 'styled-components';
import { useChangeUid } from '../mutations/useChangeUid';
import { IS_LOCAL } from '../services/ApiService';

const DevMenuStyled = styled.div`
	position: fixed;
	bottom: 32px;
	left: 32px;
	padding: 16px;
	background: #fff;
	border: 1px solid red;
	border-radius: 12px;
`;

export const DevMenu = (): JSX.Element | null => {
	const { mutate } = useChangeUid();
	const [uid, setUid] = useState('');

	const change = useCallback(() => {
		if (uid.length > 0) {
			mutate(uid);
		}
	}, [uid, mutate]);

	if (!IS_LOCAL) {
		return null;
	}

	return (
		<DevMenuStyled>
			<p>View as</p>
			<input
				type={'text'}
				placeholder={'UID'}
				value={uid}
				onChange={(e) => {
					setUid(e.target.value);
				}}
			/>
			<Button
				onClick={() => {
					change();
				}}
			>
				Disguise
			</Button>
		</DevMenuStyled>
	);
};
