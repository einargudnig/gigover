import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Task } from '../models/Task';
import { useProjectTypes } from '../queries/useProjectTypes';
import { Button } from './forms/Button';

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
	value?: string;
	error?: string;
	loading?: boolean;
	onSubmit?: (taskValues: Pick<Task, 'typeId' | 'text'>) => void;
}

export const TaskCardInput = ({
	value = '',
	error,
	loading = false,
	onSubmit
}: TaskCardInputProps): JSX.Element => {
	const { data } = useProjectTypes();
	const textInputRef = useRef<HTMLTextAreaElement>();
	const [text, setText] = useState(value);
	const [textAreaHeight, setTextAreaHeight] = useState('auto');
	const [parentHeight, setParentHeight] = useState('auto');
	const { register, handleSubmit } = useForm<Pick<Task, 'typeId' | 'text'>>({
		defaultValues: {
			text: value
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
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}
			>
				<select name="typeId" ref={register}>
					{data?.projectTypes.map((projectType) => (
						<option key={projectType.typeId} value={projectType.typeId}>
							{projectType.name}
						</option>
					))}
				</select>
				<Button
					size={'tiny'}
					type={'submit'}
					appearance={'outline'}
					loading={loading}
					disabled={loading}
				>
					Save
				</Button>
			</div>
		</form>
	);
};
