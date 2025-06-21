import { Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../../../components/forms/SearchBar';
import { IProperties } from '../../../models/Property';
import { useGetProperties } from '../../../queries/properties/useGetPoperties';

export const PropertySearchBar = ({
	setShowSearch
}: {
	setShowSearch: (value: boolean) => void;
}): JSX.Element => {
	const { data, isPending } = useGetProperties();
	const properties = data || [];
	const navigate = useNavigate();

	const filterPredicate = (property: IProperties, query: string) => {
		return JSON.stringify(property).toLowerCase().includes(query.toLowerCase());
	};

	const renderResult = (property: IProperties) => property.name;

	const handleSelect = (property: IProperties) => {
		navigate(`/property/${property.propertyId}`);
	};

	if (isPending) {
		return <Text>Loading...</Text>;
	}

	return (
		<SearchBar<IProperties>
			data={properties}
			filterPredicate={filterPredicate}
			renderResult={renderResult}
			onSelect={handleSelect}
			placeholder="Search for property.."
			onClose={() => setShowSearch(false)}
		/>
	);
};
