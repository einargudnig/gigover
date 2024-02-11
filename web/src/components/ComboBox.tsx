import React, { useState } from 'react';
import {
	Input,
	InputGroup,
	InputRightElement,
	Menu,
	MenuButton,
	MenuItem,
	MenuList
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

export const ComboBox = (): JSX.Element => {
	const options = [
		{ value: 'option1', label: 'Option 1' },
		{ value: 'option2', label: 'Option 2' },
		{ value: 'option3', label: 'Option 3' }
	];

	const [searchInput, setSearchInput] = useState('');
	const [selectedOption, setSelectedOption] = useState(null);

	const handleInputChange = (e) => {
		setSearchInput(e.target.value);
	};

	const handleSelectOption = (option) => {
		setSelectedOption(option);
		setSearchInput(option.label);
		console.log(option);
	};

	return (
		<InputGroup>
			<Input
				value={searchInput}
				onChange={handleInputChange}
				placeholder="Search or select an option"
				pr="4.5rem"
			/>
			<InputRightElement width="4.5rem">
				<Menu isLazy>
					<MenuButton
						as={InputGroup}
						right="0"
						p="0"
						h="100%"
						backgroundColor="transparent"
						_hover={{ backgroundColor: 'transparent' }}
					>
						<ChevronDownIcon />
					</MenuButton>
					<MenuList>
						{options.map((option) => (
							<MenuItem key={option.value} onClick={() => handleSelectOption(option)}>
								{option.label}
							</MenuItem>
						))}
					</MenuList>
				</Menu>
			</InputRightElement>
		</InputGroup>
	);
};
