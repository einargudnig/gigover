import { useMutation } from 'react-query';
import axios from 'axios';
import { ApiService } from '../services/ApiService';
import { ICommentChord, IImageDot } from '../components/modals/EditPhotoModal';

export const useAddImageDotComment = () => {
	return useMutation('useAddImageDotComment', async (dotComment: DotComment) => {
		console.log(dotComment, 'dot');
		return await axios.post(
			ApiService.addDotComment,
			{ dotComment },
			{ withCredentials: true }
		);
	});
};

export const useRemoveDotComment = () => {
	return useMutation('useRemoveDotComment', async (dotComment: DotComment) => {
		return await axios.post(
			ApiService.removeDotComment,
			{ dotComment },
			{ withCredentials: true }
		);
	});
};

export const useEditDotComment = () => {
	return useMutation('useEditDotComment', async (dotComment: DotComment) => {
		return await axios.post(
			ApiService.editDotComment,
			{ dotComment },
			{ withCredentials: true }
		);
	});
};

export const useAddImageDot = () => {
	return useMutation(
		'addImageDot',
		async (dotChord: { chord: ICommentChord; comment: string }) => {
			return await axios.post(
				ApiService.addImageDot,
				{ dotChord },
				{ withCredentials: true }
			);
		}
	);
};
export const useRemoveImageDot = () => {
	return useMutation('useRemoveImageDot', async (dotChord: ICommentChord) => {
		return await axios.post(ApiService.removeImageDot, { dotChord }, { withCredentials: true });
	});
};

export interface DotComment {
	dotId: number;
	comment: string;
	commentId?: number;
}
