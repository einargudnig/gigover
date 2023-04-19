import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import { Task } from '../models/Task';
import { useProjectTypes } from '../queries/useProjectTypes';
import { Options } from './forms/Options';
import { FormControl, HStack, Button } from '@chakra-ui/react';
import { ProjectType } from '../models/ProjectType';
import { ErrorMessage } from '@hookform/error-message';

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
	task,
	value = '',
	error,
	loading = false,
	onChange,
	onSubmit
}: TaskCardInputProps): JSX.Element => {
	const { data } = useProjectTypes();
	const textInputRef = useRef<HTMLTextAreaElement>();
	const [text, setText] = useState(value);
	const [textAreaHeight, setTextAreaHeight] = useState('auto');
	const [parentHeight, setParentHeight] = useState('auto');
	const {
		control,
		register,
		handleSubmit,
		formState: { errors }
	} = useForm<Pick<Task, 'typeId' | 'subject'>>({
		defaultValues: {
			subject: value,
			typeId: task?.typeId
		}
	});

	const submit = handleSubmit(async (values) => {
		if (onSubmit) {
			if (values.subject.length > 600) {
				throw new Error('Subject cannot be longer than 600 characters');
			}

			onSubmit({
				subject: values.subject,
				// Sending string because of the select value..
				typeId: values.typeId ? parseInt(values.typeId?.toString()) : undefined
			});
		}
	});

	useEffect(() => {
		setParentHeight(`${textInputRef.current!.scrollHeight}px`);
		setTextAreaHeight(`${textInputRef.current!.scrollHeight}px`);
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
					name={'subject'}
					maxLength={599}
					required={true}
					placeholder={'Write the task name'}
					onChange={onChangeHandler}
					style={{ height: textAreaHeight }}
					ref={(e) => {
						register(e, { required: true });

						if (e) {
							textInputRef.current = e;
						}
					}}
				/>
			</div>
			<HStack>
				<FormControl id={'typeId'}>
					<Controller
						name={'typeId'}
						control={control}
						render={({ field: { onChange: ptChange, value: ptValue, onBlur } }) => (
							<Options
								isMulti={false}
								onBlur={onBlur}
								onChange={(newValue) => {
									const v = (newValue as ProjectType).typeId;
									ptChange(parseInt(`${v}`));
								}}
								value={data?.projectTypes.find((pt) => pt.typeId === ptValue)}
								getOptionLabel={(option: unknown) => (option as ProjectType).name}
								getOptionValue={(option: unknown) =>
									(option as ProjectType).typeId as unknown as string
								}
								options={data?.projectTypes || []}
							/>
						)}
					/>
				</FormControl>
				<Button
					type={'submit'}
					colorScheme={'yellow'}
					loadingText={'Saving'}
					loading={loading}
					disabled={loading}
				>
					Save
				</Button>
			</HStack>
		</form>
	);
};
