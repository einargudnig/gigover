import { MenuItem, Text } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
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

	const filterPredicate = (property: IProperties, query: string) => {
		return JSON.stringify(property).toLowerCase().includes(query.toLowerCase());
	};

	const renderResult = (property: IProperties) => (
		<NavLink key={property.propertyId} to={`/property/${property.propertyId}`}>
			<MenuItem>{property.name}</MenuItem>
		</NavLink>
	);

	if (isPending) {
		return <Text>Loading...</Text>;
	}

	return (
		<SearchBar<IProperties>
			data={properties}
			filterPredicate={filterPredicate}
			renderResult={renderResult}
			placeholder="Search for property.."
			onClose={() => setShowSearch(false)}
		/>
	);
};
