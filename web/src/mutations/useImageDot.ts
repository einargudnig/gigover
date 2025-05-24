import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { ICommentChord } from '../components/modals/EditPhotoModal';
import { ApiService } from '../services/ApiService';
// import { devInfo } from '../utils/ConsoleUtils';

export interface DotCommentResponse {
	dotId: number;
	comment: string;
	commentId: number;
	created: string;
	uId: string;
	userName: string;
}

export interface ImageDotResponse {
	dotId: number;
	imageId: string;
	status: number;
	// Assuming comments might be part of the response, but can be simplified if not.
	// comments: DotCommentResponse[]; // Or a simpler type if comments are not returned here.
	coordinateX: number;
	coordinateY: number;
	height: number;
	width: number;
	pageNumber?: number;
}

export const useAddImageDotComment = () => {
	return useMutation<DotCommentResponse, AxiosError, DotComment>({
		mutationFn: async (dotComment: DotComment) => {
			// devInfo(dotComment, 'dot');
			console.log(dotComment, 'dot');
			const response = await axios.post(
				ApiService.addDotComment,
				{ ...dotComment },
				{ withCredentials: true }
			);
			return response.data;
		}
	});
};

export const useChangeImageDotStatus = () => {
	return useMutation<
		{ dotId: number; status: number },
		AxiosError,
		{ dotId: number; status: number }
	>({
		mutationFn: async ({ dotId, status }: { dotId: number; status: number }) => {
			const response = await axios.post(
				ApiService.updateDotStatus,
				{ dotId: dotId, status: status },
				{ withCredentials: true }
			);
			return response.data;
		}
	});
};

export const useRemoveDotComment = () => {
	return useMutation<DotComment, AxiosError, DotComment>({
		mutationFn: async (dotComment: DotComment) => {
			const response = await axios.post(
				ApiService.removeDotComment,
				{ ...dotComment },
				{ withCredentials: true }
			);
			return response.data;
		}
	});
};

export const useEditDotComment = () => {
	return useMutation<DotCommentResponse, AxiosError, DotComment>({
		mutationFn: async (dotComment: DotComment) => {
			const response = await axios.post(
				ApiService.editDotComment,
				{ ...dotComment },
				{ withCredentials: true }
			);
			return response.data;
		}
	});
};

export interface AddDotInput {
	coordinateX: number;
	coordinateY: number;
	height: number;
	width: number;
	pageNumber?: number;
	imageId?: number | string;
}
export const useAddImageDot = () => {
	return useMutation<{ id: number }, AxiosError, AddDotInput>({
		mutationFn: async (dotChord: AddDotInput) => {
			const response = await axios.post(
				ApiService.addImageDot,
				{ ...dotChord },
				{ withCredentials: true }
			);
			return response.data;
		}
	});
};
export const useRemoveImageDot = () => {
	return useMutation<ICommentChord, AxiosError, ICommentChord>({
		mutationFn: async (dotChord: ICommentChord) => {
			const response = await axios.post(
				ApiService.removeImageDot,
				{ ...dotChord },
				{ withCredentials: true }
			);
			return response.data;
		}
	});
};

export interface DotComment {
	dotId: number;
	comment: string;
	commentId?: number;
}
