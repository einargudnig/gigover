import { useMutation, useQueryClient } from 'react-query';
import axios, { AxiosError } from 'axios';
import { devError } from '../../utils/ConsoleUtils';
import { ApiService } from '../../services/ApiService';
import { PropertyToProject } from '../../models/Property';

interface AddProjectToPropertyResponse {
	errorText: 'OK';
}

export const useAddProjectToProperty = () => {
	const client = useQueryClient();

	return useMutation<AddProjectToPropertyResponse, AxiosError, PropertyToProject>(
		async (variables) => {
			try {
				console.log('variable in mutation: ', variables);
				const response = await axios.post(
					ApiService.addProject(variables.propertyId, variables.projectId),
					variables,
					{
						withCredentials: true
					}
				);

				await client.refetchQueries(ApiService.getProperties);
				console.log('response.data: ', response.data);
				return response.data;
			} catch (e) {
				devError(e);
				throw new Error('Could not add project to property`');
			}
		}
	);
};
