import { SearchIcon } from '@chakra-ui/icons';
import {
	Input,
	InputGroup,
	InputRightElement,
	Menu,
	MenuItem,
	MenuList,
	Text,
	useOutsideClick
} from '@chakra-ui/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { IProperties } from '../../../models/Property';
import { useGetProperties } from '../../../queries/properties/useGetPoperties';

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

export const SearchBar = (): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);
	const refInput = useRef<HTMLInputElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [searchValue, setSearchValue] = useState('');

	const { data, isLoading } = useGetProperties();
	const properties = data;

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

	const searchResults = useMemo<IProperties[]>(() => {
		if (searchValue.length > 0) {
			const results = properties.filter((res) =>
				JSON.stringify(res).toLowerCase().includes(searchValue.toLowerCase())
			);
			return results.slice(0, 4);
		}

		return [];
	}, [properties, searchValue]);

	return (
		<>
			{isLoading ? (
				<Text>Loading...</Text>
			) : (
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
										<NavLink key={key} to={`/property/${r.propertyId}`}>
											<MenuItem onClick={() => setSearchValue('')}>
												{r.name}
											</MenuItem>
										</NavLink>
									))
								) : (
									<MenuItem>No results found</MenuItem>
								)}
							</StyledMenuList>
						</Menu>
					</SearchResults>
				</InputGroup>
			)}
		</>
	);
};
