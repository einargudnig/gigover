import React from 'react';
import styled from 'styled-components';
import { Button } from './forms/Button';

const FormActionsContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: ${(props) => props.theme.padding(3)} 0;
`;

interface FormActionsProps {
	submitText: string | React.ReactNode;
	submitDisabled?: boolean;
	submitLoading?: boolean;
	cancelText?: string | React.ReactNode;
	cancelDisabled?: boolean;

	onCancel?(): void;

	onSubmit?(): void;
}

export const FormActions = ({
	submitText,
	submitDisabled = false,
	submitLoading = false,
	onCancel,
	onSubmit,
	cancelText,
	cancelDisabled = false
}: FormActionsProps): JSX.Element => (
	<FormActionsContainer>
		{onCancel ? (
			<Button
				appearance={'outline'}
				size={'normal'}
				onClick={onCancel}
				disabled={cancelDisabled}
			>
				{cancelText}
			</Button>
		) : (
			<div />
		)}
		<Button
			type={'submit'}
			size={'normal'}
			onClick={onSubmit}
			loading={submitLoading}
			disabled={submitDisabled}
		>
			{submitText}
		</Button>
	</FormActionsContainer>
);
