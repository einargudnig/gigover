import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../../components/forms/SearchBar';
import { TenderWithItems } from '../../models/Tender';

interface SearchBarProps {
	tenders: TenderWithItems[];
}

export const ProcurementSearchBar = ({ tenders }: SearchBarProps): JSX.Element => {
	const navigate = useNavigate();

	const filterPredicate = (tender: TenderWithItems, query: string) => {
		return JSON.stringify(tender).toLowerCase().includes(query.toLowerCase());
	};

	const renderResult = (tender: TenderWithItems) => tender.description;

	const handleSelect = (tender: TenderWithItems) => {
		navigate(`/tender/${tender.tenderId}`);
	};

	return (
		<SearchBar<TenderWithItems>
			data={tenders}
			filterPredicate={filterPredicate}
			renderResult={renderResult}
			onSelect={handleSelect}
			placeholder="Search tender"
		/>
	);
};
