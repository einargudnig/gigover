import React from 'react';
import ReactSelect from 'react-select';
import { SelectComponentsProps } from 'react-select/base';

export const Options = (props: SelectComponentsProps): JSX.Element => {
	const { isMulti, onBlur, onChange, value, options, getOptionLabel, getOptionValue } = props;

	return (
		<ReactSelect
			isMulti={isMulti}
			onBlur={onBlur}
			onChange={onChange}
			value={value}
			getOptionLabel={getOptionLabel}
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
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
			{...props}
		/>
	);
};
