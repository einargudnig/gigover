import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetOfferByOfferId } from '../../../../queries/useGetOfferByOfferId';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { VStack, Heading } from '@chakra-ui/react';
import { OtherGigoverFile } from './OtherFile';
import { EmptyState } from '../../../../components/empty/EmptyState';
// import { OfferDocument } from '../../../../models/Tender';
// import { EditPhotoModal } from '../../../../components/modals/EditPhotoModal';

export const OfferFile = (): JSX.Element => {
	const params = useParams();
	const offerId = params.offerId ? params.offerId : -1;
	// const [selectedFile, setSelectedFile] = useState<OfferDocument | null>(null);
	const { data, isLoading, isError, error } = useGetOfferByOfferId(Number(offerId));
	// const navigate = useNavigate();
	// console.log(data, 'DATA');
	const offerDocuments = data?.offer.documents;

	// useEffect(() => {
	// 	if (offerDocuments && offerDocuments.length > 0 && params.fileId) {
	// 		const index = offerDocuments.findIndex(
	// 			(d: OfferDocument) => d.id === parseInt(params.fileId || '-1')
	// 		);
	// 		const file = offerDocuments[index];

	// 		if (file) {
	// 			// setSelectedIndex(index);
	// 			setSelectedFile(file);
	// 			return;
	// 		}
	// 	}
	// 	setSelectedFile(null);
	// 	// setSelectedIndex(-1);
	// }, [offerDocuments, params.fileId]);

	if (isLoading) {
		return <LoadingSpinner />;
	}

	if (isError && error) {
		console.log(error);
		return <div>Error</div>;
	}

	if (!offerId) {
		return <div>Missing Offer Id</div>;
	}

	return (
		<>
			{/* {selectedFile && (
				<EditPhotoModal
					projectId={0}
					file={selectedFile}
					onClose={() => navigate(-1)}
					moveFile={moveFile}
				/>
			)} */}
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					{offerDocuments!.length > 0 ? (
						<VStack style={{ width: '100%' }} align={'stretch'} spacing={4} mt={4}>
							<Heading size={'md'}>Files for your offer</Heading>
							{offerDocuments!
								.sort((a, b) =>
									b.created && a.created ? b.created - a.created : -1
								)
								.map((p, pIndex) => (
									<OtherGigoverFile key={pIndex} file={p} />
								))}
						</VStack>
					) : (
						<EmptyState
							title={'No files uploaded'}
							text={'Upload files to this offer to share them with the client'}
						/>
					)}
				</>
			)}
		</>
	);
};
