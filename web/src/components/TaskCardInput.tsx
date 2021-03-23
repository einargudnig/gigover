import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Controller, useForm } from 'react-hook-form';
import { Task } from '../models/Task';
import { useProjectTypes } from '../queries/useProjectTypes';
import { Options } from './forms/Options';
import { FormControl, HStack, Button } from '@chakra-ui/react';
import { ProjectType } from '../models/ProjectType';

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
	onSubmit?: (taskValues: Pick<Task, 'typeId' | 'text'>) => void;
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
	const { control, register, handleSubmit } = useForm<Pick<Task, 'typeId' | 'text'>>({
		defaultValues: {
			text: value,
			typeId: task?.typeId
		}
	});

	const submit = handleSubmit(async (values) => {
		if (onSubmit) {
			onSubmit({
				text: values.text,
				// Sending string because of the select value..
				typeId: parseInt(values.typeId.toString())
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
				<TaskInput
					name={'text'}
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
						render={({ onChange: ptChange, value: ptValue, onBlur }) => (
							<Options
								isMulti={false}
								onBlur={onBlur}
								onChange={(v: ProjectType) => {
									ptChange(v.typeId);
								}}
								value={data?.projectTypes.find((pt) => pt.typeId === ptValue)}
								getOptionLabel={(option: ProjectType) => option.name}
								getOptionValue={(option: ProjectType) => option.typeId}
								options={data?.projectTypes || []}
							/>
						)}
					/>
				</FormControl>
				<Button
					type={'submit'}
					colorScheme={'green'}
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
