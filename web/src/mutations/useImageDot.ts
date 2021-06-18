import { useMutation } from 'react-query';
import axios from 'axios';
import { ApiService } from '../services/ApiService';
import { ICommentChord } from '../components/modals/EditPhotoModal';
import { devInfo } from '../utils/ConsoleUtils';

export const useAddImageDotComment = () => {
	return useMutation('useAddImageDotComment', async (dotComment: DotComment) => {
		devInfo(dotComment, 'dot');
		return await axios.post(
			ApiService.addDotComment,
			{ ...dotComment },
			{ withCredentials: true }
		);
	});
};

export const useChangeImageDotStatus = () => {
	return useMutation(
		'updateDotStatus',
		async ({ dotId, status }: { dotId: number; status: number }) => {
			return await axios.post(
				ApiService.updateDotStatus,
				{ dotId: dotId, status: status },
				{ withCredentials: true }
			);
		}
	);
};

export const useRemoveDotComment = () => {
	return useMutation('useRemoveDotComment', async (dotComment: DotComment) => {
		return await axios.post(
			ApiService.removeDotComment,
			{ ...dotComment },
			{ withCredentials: true }
		);
	});
};

export const useEditDotComment = () => {
	return useMutation('useEditDotComment', async (dotComment: DotComment) => {
		return await axios.post(
			ApiService.editDotComment,
			{ ...dotComment },
			{ withCredentials: true }
		);
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
	return useMutation('addImageDot', async (dotChord: AddDotInput) => {
		return await axios.post(ApiService.addImageDot, { ...dotChord }, { withCredentials: true });
	});
};
export const useRemoveImageDot = () => {
	return useMutation('useRemoveImageDot', async (dotChord: ICommentChord) => {
		return await axios.post(
			ApiService.removeImageDot,
			{ ...dotChord },
			{ withCredentials: true }
		);
	});
};

export interface DotComment {
	dotId: number;
	comment: string;
	commentId?: number;
}
