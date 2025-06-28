import { Box, Button, Flex, Textarea } from '@chakra-ui/react';
import { ErrorMessage } from '@hookform/error-message';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Task } from '../models/Task';

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
	const textInputRef = useRef<HTMLTextAreaElement | null>(null);
	const [text, setText] = useState(value);
	const [textAreaHeight, setTextAreaHeight] = useState('auto');
	const [parentHeight, setParentHeight] = useState('auto');

	const onChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		if (textInputRef.current) {
			setTextAreaHeight('auto');
			setParentHeight(`${textInputRef.current!.scrollHeight}px`);
		}
		setText(event.target.value);

		if (onChange) {
			onChange(event.target.value);
		}
	};

	const {
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<Pick<Task, 'subject'>>({
		defaultValues: {
			subject: value
		}
	});

	const { ref: registerRef, ...subjectRegister } = register('subject', {
		required: true,
		onChange: onChangeHandler
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

	return (
		<Box bg="white" p={2} borderRadius={8} border="1px solid #e0e0e0">
			<form onSubmit={submit}>
				{error && <div style={{ color: 'red' }}>{error}</div>}
				<div style={{ minHeight: parentHeight }}>
					<ErrorMessage errors={errors} name="subject" />
					<Textarea
						{...subjectRegister}
						ref={(e) => {
							registerRef(e);
							textInputRef.current = e;
						}}
						maxLength={599}
						required={true}
						placeholder={'Add task name'}
						bg="transparent"
						border="none"
						outline="none"
						_focus={{ boxShadow: 'none', border: 'none' }}
						_hover={{ border: 'none' }}
						boxShadow="none"
						p={0}
						mb={2}
						wordBreak="break-all"
						width="100%"
						resize="none"
						display="block"
						style={{ height: textAreaHeight }}
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
		</Box>
	);
};
