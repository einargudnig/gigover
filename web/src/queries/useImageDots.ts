import { useQuery } from 'react-query';
import { ApiService } from '../services/ApiService';
import { ErrorResponse } from '../models/ErrorResponse';
import { IImageDot } from '../components/modals/EditPhotoModal';

interface ImageDotResponse {
	dots: IImageDot[];
}

export const useImageDots = (id: number) =>
	useQuery<ImageDotResponse, ErrorResponse>(ApiService.getImageDots(id), {
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: true
	});
