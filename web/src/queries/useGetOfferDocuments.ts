import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { AxiosError } from 'axios';
// import { ProjectImage } from '../models/ProjectImage';
import { TenderDocument } from '../models/TenderDocument';

interface FolderFilesResponse {
	offerDocuments: TenderDocument[];
}

export const useOfferDocuments = (offerId: number) => {
	const { data, isLoading, isError, error } = useQuery<FolderFilesResponse, AxiosError>(
		ApiService.offerDocuments(offerId)
	);

	return {
		data: (data && data.offerDocuments) || [],
		isLoading,
		isError,
		error
	};
};
