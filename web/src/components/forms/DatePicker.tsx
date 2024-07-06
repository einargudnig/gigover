import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/date-picker.css';

export const DatePicker = ({
	selected,
	onChange,
	isClearable = false,
	required = false,
	...props
}: ReactDatePickerProps) => {
	return (
		<ReactDatePicker
			selected={selected}
			onChange={onChange}
			isClearable={isClearable}
			required={required}
			{...props}
		/>
	);
};
