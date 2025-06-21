import {
	Box,
	Input,
	InputGroup,
	InputRightElement,
	Popover,
	PopoverBody,
	PopoverContent,
	useOutsideClick
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
	const ref = useRef<HTMLDivElement | null>(null);
	const inputRef = useRef<HTMLInputElement>(null);
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
			<Box
				ref={ref}
				position="absolute"
				top="calc(100% + 8px)"
				width="100%"
				left="0"
				zIndex={9999}
			>
				<Popover
					isOpen={isOpen}
					autoFocus={false}
					initialFocusRef={inputRef}
					placement="bottom-start"
				>
					<PopoverContent width="400px" zIndex="9999">
						<PopoverBody p={0}>
							{searchResults.length > 0 ? (
								searchResults.map((item, index) => (
									<Box
										key={index}
										onClick={() => onSelect(item)}
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
			</Box>
		</InputGroup>
	);
};
