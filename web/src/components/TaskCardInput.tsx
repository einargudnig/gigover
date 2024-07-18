import { Button, Flex } from '@chakra-ui/react';
import { ErrorMessage } from '@hookform/error-message';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Task } from '../models/Task';

const TaskInput = styled.textarea`
	background: transparent;
	border: none;
	outline: none;
	box-shadow: none;
	padding: 0;
	margin-bottom: ${(props) => props.theme.padding(2)};
	word-wrap: break-word;
	word-break: break-all;
	width: 100%;
	resize: none;
	display: block;
`;

interface TaskCardInputProps {
	task?: Task;
	value?: string;
	error?: string;
	loading?: boolean;
	onChange?: (newValue: string) => void;
	onSubmit?: (taskValues: Pick<Task, 'typeId' | 'subject'>) => void;
}

export const TaskCardInput = ({
	value = '',
	error,
	loading = false,
	onChange,
	onSubmit
}: TaskCardInputProps): JSX.Element => {
	const textInputRef = useRef<HTMLTextAreaElement>();
	const [text, setText] = useState(value);
	const [textAreaHeight, setTextAreaHeight] = useState('auto');
	const [parentHeight, setParentHeight] = useState('auto');
	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<Pick<Task, 'subject'>>({
		defaultValues: {
			subject: value
		}
	});

	const submit = handleSubmit(async (values) => {
		if (onSubmit) {
			if (values.subject.length > 600) {
				throw new Error('Subject cannot be longer than 600 characters');
			}

			onSubmit({
				subject: values.subject
			});
		}
	});

	useEffect(() => {
		if (textInputRef.current) {
			setParentHeight(`${textInputRef.current!.scrollHeight}px`);
			setTextAreaHeight(`${textInputRef.current!.scrollHeight}px`);
		}
	}, [text]);

	useEffect(() => {
		if (textInputRef.current) {
			textInputRef.current.focus();
		}
	}, []);

	const onChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTextAreaHeight('auto');
		setParentHeight(`${textInputRef.current!.scrollHeight}px`);
		setText(event.target.value);

		if (onChange) {
			onChange(event.target.value);
		}
	};

	return (
		<form onSubmit={submit}>
			{error && <div style={{ color: 'red' }}>{error}</div>}
			<div style={{ minHeight: parentHeight }}>
				<ErrorMessage errors={errors} name="subject" />
				<TaskInput
					maxLength={599}
					required={true}
					placeholder={'Add task name'}
					style={{ height: textAreaHeight }}
					{...register('subject', { required: true, onChange: onChangeHandler })}
				/>
			</div>
			<Flex justifyContent={'end'}>
				<Button
					type={'submit'}
					colorScheme={'gray'}
					loadingText={'Saving'}
					isLoading={loading}
					disabled={loading}
				>
					Save
				</Button>
			</Flex>
		</form>
	);
};
