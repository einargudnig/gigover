import {
	Box,
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
import { CrossIcon } from '../../../components/icons/CrossIcon';
import { IProperties } from '../../../models/Property';
import { useGetProperties } from '../../../queries/properties/useGetPoperties';

export const PropertySearchBar = ({
	setShowSearch
}: {
	setShowSearch: (value: boolean) => void;
}): JSX.Element => {
	const ref = useRef<HTMLDivElement | null>(null);
	const refInput = useRef<HTMLInputElement | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [searchValue, setSearchValue] = useState('');

	const { data, isPending } = useGetProperties();
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
			{isPending ? (
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
					<InputRightElement>
						<CrossIcon onClick={() => setShowSearch(false)} />
					</InputRightElement>
					<Box
						ref={ref}
						position="absolute"
						top="calc(100% + 8px)"
						width="100%"
						left="0"
						right="0"
					>
						<Menu isOpen={isOpen} autoSelect={false}>
							<MenuList width="400px" zIndex={1000}>
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
							</MenuList>
						</Menu>
					</Box>
				</InputGroup>
			)}
		</>
	);
};
