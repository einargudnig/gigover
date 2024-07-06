import { Center, Heading, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { LoadingSpinner } from '../../../../components/LoadingSpinner';
import { EmptyState } from '../../../../components/empty/EmptyState';
import { useGetOfferByOfferId } from '../../../../queries/procurement/useGetOfferByOfferId';
import { OtherGigoverFile } from './OtherFile';
// import { OfferDocument } from '../../../../models/Tender';
// import { EditPhotoModal } from '../../../../components/modals/EditPhotoModal';

export const OfferFile = (): JSX.Element => {
	const params = useParams();
	const offerId = params.offerId ? params.offerId : -1;
	// const [selectedFile, setSelectedFile] = useState<OfferDocument | null>(null);
	const { data, isLoading, isError, error } = useGetOfferByOfferId(Number(offerId));
	const offerDocuments = data?.offer.documents;

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
				<Center>
					<LoadingSpinner />
				</Center>
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
									<OtherGigoverFile key={pIndex} showDelete={false} file={p} />
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
