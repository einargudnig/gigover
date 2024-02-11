import { useMutation, useQueryClient } from 'react-query';
import { TenderItem } from '../../models/Tender';
import { ApiService } from '../../services/ApiService';
import axios, { AxiosError } from 'axios';
import { useParams } from 'react-router-dom';

interface TenderItemDeleteResponse {
	errorText: 'OK';
}

export const useDeleteTenderItem = () => {
	const { tenderId } = useParams();
	const queryClient = useQueryClient();

	return useMutation<TenderItemDeleteResponse, AxiosError, TenderItem>(async (tender) => {
		try {
			const response = await axios.post(ApiService.deleteTenderItem, tender, {
				withCredentials: true
			});

			// refetch tenderItems after delete
			// console.log('TenderId in delete mutation:', tenderId); // good for debugging
			if (response.status === 200) {
				// for some reason the tender.tenderId is a 0. So we use the useParams hook to get the tenderId
				// the user cannot be on a different page than the tender page when deleting a tender item, so he will always have the tenderId in the url
				// that will help us refetch the tenderItems when we delete one
				await queryClient.refetchQueries(ApiService.getTenderById(Number(tenderId)));
			}
			return response.data;
		} catch (e) {
			throw new Error('Could not delete tender item');
		}
	});
};
