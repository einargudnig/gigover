import React from 'react';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/date-picker.css';

export const DatePicker = ({
	selected,
	onChange,
	isClearable = false,
	...props
}: ReactDatePickerProps) => {
	return (
		<ReactDatePicker
			selected={selected}
			onChange={onChange}
			isClearable={isClearable}
			{...props}
		/>
	);
};
