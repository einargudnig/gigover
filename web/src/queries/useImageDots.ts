import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';
import { ProjectType } from '../models/ProjectType';
import { IImageDot } from '../components/modals/EditPhotoModal';

interface ImageDotResponse {
	projectTypes: IImageDot[];
}

export const useImageDots = (id: number) =>
	useQuery<ImageDotResponse, ErrorResponse>(ApiService.getImageDots(id), {
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true
	});
