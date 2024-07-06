import ReactSelect from 'react-select';
import { StateManagerProps } from 'react-select/dist/declarations/src/stateManager';

export const Options = ({
	isMulti,
	onBlur,
	onChange,
	value,
	options,
	getOptionLabel,
	getOptionValue,
	...props
}: StateManagerProps): JSX.Element => {
	return (
		<ReactSelect
			{...props}
			isMulti={isMulti}
			onBlur={onBlur}
			onChange={onChange}
			value={value}
			getOptionLabel={getOptionLabel}
			getOptionValue={getOptionValue}
			options={options}
			theme={(theme) => ({
				...theme,
				borderRadius: 8,
				colors: {
					...theme.colors,
					neutral20: 'var(--chakra-colors-gray-200)',
					neutral30: 'var(--chakra-colors-gray-400)',
					primary25: 'var(--chakra-colors-yellow-100)',
					primary50: 'var(--chakra-colors-yellow-200)',
					primary75: 'var(--chakra-colors-yellow-300)',
					primary: 'var(--chakra-colors-yellow-400)'
				}
			})}
		/>
	);
};
