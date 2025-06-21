import {
	Box,
	Input,
	InputGroup,
	InputRightElement,
	Menu,
	MenuItem,
	MenuList,
	useOutsideClick
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CrossIcon } from '../icons/CrossIcon';

interface SearchBarProps<T> {
	data: T[];
	renderResult: (item: T) => React.ReactNode;
	filterPredicate: (item: T, query: string) => boolean;
	placeholder?: string;
	onClose?: () => void;
}

export const SearchBar = <T,>({
	data,
	renderResult,
	filterPredicate,
	placeholder = 'Search...',
	onClose
}: SearchBarProps<T>): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [searchValue, setSearchValue] = useState('');

	useOutsideClick({
		ref: ref,
		handler: () => {
			if (isOpen) {
				setIsOpen(false);
			}
		}
	});

	useEffect(() => {
		if (searchValue.length > 0) {
			setIsOpen(true);
		} else {
			setIsOpen(false);
		}
	}, [searchValue]);

	const searchResults = useMemo(() => {
		if (searchValue.length > 0 && data) {
			return data.filter((item) => filterPredicate(item, searchValue));
		}
		return [];
	}, [data, searchValue, filterPredicate]);

	return (
		<InputGroup position="relative">
			<Input
				autoFocus
				autoComplete={'off'}
				autoCorrect={'off'}
				name="search"
				placeholder={placeholder}
				variant={'filled'}
				style={{ minWidth: '400px' }}
				value={searchValue}
				onChange={(e) => setSearchValue(e.target.value)}
			/>
			{onClose && (
				<InputRightElement>
					<CrossIcon onClick={onClose} />
				</InputRightElement>
			)}
			<Box
				ref={ref}
				position="absolute"
				top="calc(100% + 8px)"
				width="100%"
				left="0"
				zIndex={9999}
			>
				<Menu isOpen={isOpen} autoSelect={false}>
					<MenuList width="100%" zIndex="9999">
						{searchResults.length > 0 ? (
							searchResults.map((item, index) => (
								<Box key={index}>{renderResult(item)}</Box>
							))
						) : (
							<MenuItem>No results found</MenuItem>
						)}
					</MenuList>
				</Menu>
			</Box>
		</InputGroup>
	);
};
