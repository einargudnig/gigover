import { useQuery } from '@tanstack/react-query';
import { IImageDot } from '../components/modals/EditPhotoModal';
import { ErrorResponse } from '../models/ErrorResponse';
import { ApiService } from '../services/ApiService';

interface ImageDotResponse {
	dots: IImageDot[];
}

export const useImageDots = (id: number) =>
	useQuery<ImageDotResponse, ErrorResponse>({
		queryKey: [ApiService.getImageDots(id)],
		enabled: !!id,
		refetchOnWindowFocus: false
	});
