import { Button } from '@chakra-ui/react';
import React from 'react';
import styled from 'styled-components';

const FormActionsContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: ${(props) => props.theme.padding(3)} 0;
`;

interface FormActionsProps {
	submitText?: string | React.ReactNode;
	submitDisabled?: boolean;
	submitLoading?: boolean;
	cancelText?: string | React.ReactNode;
	cancelDisabled?: boolean;
	style?: React.CSSProperties;
	hideSubmitButton?: boolean;

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
	cancelDisabled = false,
	hideSubmitButton = false,
	...props
}: FormActionsProps): JSX.Element => (
	<FormActionsContainer {...props}>
		{onCancel ? (
			<Button
				variant={'outline'}
				colorScheme={'black'}
				onClick={onCancel}
				disabled={cancelDisabled}
			>
				{cancelText}
			</Button>
		) : (
			<div />
		)}
		{!hideSubmitButton && (
			<Button
				type={'submit'}
				onClick={onSubmit}
				isLoading={submitLoading}
				loadingText={'Submitting'}
				disabled={submitDisabled}
			>
				{submitText}
			</Button>
		)}
	</FormActionsContainer>
);
