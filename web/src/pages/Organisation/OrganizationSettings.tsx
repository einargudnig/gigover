import { useParams } from 'react-router';

export function OrganisationSettings() {
	const { organisationId } = useParams();

	return (
		<div>
			<h1>Organisation Settings</h1>
			<p>Organisation ID: {organisationId}</p>
		</div>
	);
}
