import {
	Box,
	Input,
	InputGroup,
	InputRightElement,
	Popover,
	PopoverAnchor,
	PopoverBody,
	PopoverContent
} from '@chakra-ui/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CrossIcon } from '../icons/CrossIcon';

interface SearchBarProps<T> {
	data: T[];
	renderResult: (item: T) => React.ReactNode;
	filterPredicate: (item: T, query: string) => boolean;
	onSelect: (item: T) => void;
	placeholder?: string;
	onClose?: () => void;
}

export const SearchBar = <T,>({
	data,
	renderResult,
	filterPredicate,
	onSelect,
	placeholder = 'Search...',
	onClose
}: SearchBarProps<T>): JSX.Element => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [searchValue, setSearchValue] = useState('');

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
		<Popover
			isOpen={isOpen}
			onClose={() => setIsOpen(false)}
			autoFocus={false}
			initialFocusRef={inputRef}
			placement="bottom-start"
			isLazy
		>
			<PopoverAnchor>
				<InputGroup>
					<Input
						ref={inputRef}
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
				</InputGroup>
			</PopoverAnchor>
			<PopoverContent bg="white" width="400px">
				<PopoverBody p={0}>
					{searchResults.length > 0 ? (
						searchResults.map((item, index) => (
							<Box
								key={index}
								onClick={() => {
									onSelect(item);
									setIsOpen(false);
									setSearchValue('');
								}}
								p="8px 12px"
								_hover={{ bg: 'gray.100', cursor: 'pointer' }}
							>
								{renderResult(item)}
							</Box>
						))
					) : (
						<Box p="8px 12px">No results found</Box>
					)}
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};
