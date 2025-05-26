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
import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { SearchIcon } from '../../components/icons/SearchIcon';
import { TenderWithItems } from '../../models/Tender';

interface SearchBarProps {
	tenders: TenderWithItems[];
}

export const ProcurementSearchBar = ({ tenders }: SearchBarProps): JSX.Element => {
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
		} else {
			setIsOpen(false);
		}
	}, [searchValue]);

	const searchResults = useMemo<TenderWithItems[]>(() => {
		if (searchValue.length > 0) {
			const results = tenders.filter((res) =>
				JSON.stringify(res).toLowerCase().includes(searchValue.toLowerCase())
			);
			return results.slice(0, 4);
		}

		return [];
	}, [tenders, searchValue]);

	return (
		<InputGroup>
			<Input
				autoComplete={'off'}
				autoCorrect={'off'}
				name="search"
				placeholder="Search tender"
				variant={'filled'}
				style={{ minWidth: '400px' }}
				value={searchValue}
				ref={refInput}
				onChange={(e) => {
					setSearchValue(e.target.value);
				}}
			/>
			<InputRightElement pointerEvents={'none'}>
				<SearchIcon />
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
					<MenuList width="400px">
						{searchResults.length > 0 ? (
							searchResults.map((r, key) => (
								<NavLink key={key} to={`/tender/${r.tenderId}`}>
									<MenuItem onClick={() => setSearchValue('')}>
										{r.description}
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
	);
};
