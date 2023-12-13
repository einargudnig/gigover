import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { IProperty } from '../../../models/Property';
import { SearchIcon } from '@chakra-ui/icons';
import {
	Input,
	InputGroup,
	InputRightElement,
	Menu,
	MenuItem,
	MenuList,
	useOutsideClick
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

interface SearchBarProps {
	property: IProperty[];
}

const SearchResults = styled.div`
	position: absolute;
	top: 100%;
	top: calc(100% + 8px);
	width: 100%;
	left: 0;
	right: 0;
`;

const StyledMenuList = styled(MenuList)`
	width: 400px;
`;

export const SearchBar = ({ property }: SearchBarProps): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);
	const refInput = useRef<HTMLInputElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [searchValue, setSearchValue] = useState('');

	useOutsideClick({
		ref: ref,
		handler: () => setIsOpen(false)
	});

	useEffect(() => {
		if (searchValue.length > 0) {
			setIsOpen(true);

			if (refInput.current) {
				// Keep focus on the input element
				setTimeout(() => {
					refInput.current!.focus();
				}, 0);
			}
		} else {
			setIsOpen(false);
		}
	}, [searchValue, refInput]);

	const searchResults = useMemo<IProperty[]>(() => {
		if (searchValue.length > 0) {
			const results = property.filter((res) =>
				JSON.stringify(res).toLowerCase().includes(searchValue.toLowerCase())
			);
			return results.slice(0, 4);
		}

		return [];
	}, [property, searchValue]);

	// const searchResults = [
	// 	{ id: 1, name: 'Property 1' },
	// 	{ id: 2, name: 'Property 2' },
	// 	{ id: 3, name: 'Property 3' },
	// 	{ id: 4, name: 'Property 4' }
	// ];

	return (
		<InputGroup>
			<Input
				autoComplete={'off'}
				autoCorrect={'off'}
				name="property"
				placeholder="Search for property.."
				variant={'filled'}
				style={{ minWidth: '400px' }}
				value={searchValue}
				ref={refInput}
				onChange={(e) => {
					setSearchValue(e.target.value);
					e.target.focus(); // Keep the focus on the input
				}}
			/>
			<InputRightElement pointerEvents={'none'}>
				<SearchIcon />
			</InputRightElement>
			<SearchResults ref={ref}>
				<Menu isOpen={isOpen} autoSelect={false}>
					<StyledMenuList>
						{searchResults.length > 0 ? (
							searchResults.map((r, key) => (
								<NavLink key={key} to={`/property/${r.id}`}>
									<MenuItem onClick={() => setSearchValue('')}>{r.name}</MenuItem>
								</NavLink>
							))
						) : (
							<MenuItem>No results found</MenuItem>
						)}
					</StyledMenuList>
				</Menu>
			</SearchResults>
		</InputGroup>
	);
};
