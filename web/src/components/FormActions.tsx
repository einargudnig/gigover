import { Button, Flex } from '@chakra-ui/react';
import React from 'react';

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
	style
}: FormActionsProps): JSX.Element => (
	<Flex
		justifyContent="space-between"
		alignItems="center"
		py={3}
		px={0}
		position="sticky"
		bottom="0px"
		right="0px"
		bg="white"
		style={style}
	>
		{onCancel ? (
			<Button
				variant={'outline'}
				colorScheme={'gray'}
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
	</Flex>
);
