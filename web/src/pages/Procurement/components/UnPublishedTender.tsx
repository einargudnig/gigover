import { Box, Button, Flex, Heading, Text, VStack, useToast } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/empty/EmptyState';
import { FileUploadType } from '../../../models/FileUploadType';
import { TenderDocument } from '../../../models/TenderDocument';
import { usePublishTender } from '../../../mutations/procurement/usePublishTender';
import { handleFinishDate } from '../../../utils/HandleFinishDate';
import { OtherGigoverFile } from '../../Files/new/components/OtherFile';
import { DropZone } from '../Offers/components/UploadTenderDocuments';
import { TenderHead } from '../tabs/Tender-Create-Steps/TenderHead';
import { InviteButton } from './InviteButton';
import { NewTenderItemTable } from './NewTenderItemTable';

export function UnpublishedTender({ tender, getTenderLoading }): JSX.Element {
	console.log('tender', tender);
	const tenderDocuments: TenderDocument[] | undefined = tender?.documents || [];
	const { tenderId } = useParams();

	return (
		<Box p={4}>
			<TenderHead tender={tender} getTenderLoading={getTenderLoading} />
			<NewTenderItemTable tender={tender} />
			<HandleTender tender={tender} />
			<TenderDocuments tenderId={tenderId} tenderDocuments={tenderDocuments} />
		</Box>
	);
}

function HandleTender({ tender }) {
	const { mutateAsync: publishTender, isLoading: isPublishLoading } = usePublishTender();
	const tenderDescForEmail = tender?.description;
	const tenderStatus = tender?.status;
	const finishDateStatus = handleFinishDate(tender?.finishDate);

	const toast = useToast();

	const handlePublish = async () => {
		const publishTenderBody = {
			tenderId: Number(tender.tenderId)
		};
		if (tender !== undefined) {
			try {
				await publishTender(publishTenderBody);
				toast({
					title: 'Tender published',
					description: 'Now you can invite people to send offers to your tender!',
					status: 'success',
					duration: 2000,
					isClosable: true
				});
			} catch (error) {
				// console.log('ERROR', { error });
				toast({
					title: 'Error',
					description: 'Something went wrong when we tried to publish your tender.',
					status: 'error',
					duration: 3000,
					isClosable: true
				});
			}
		} else {
			toast({
				title: 'Error',
				description: 'Something went wrong when we tried to publish your tender.',
				status: 'error',
				duration: 5000,
				isClosable: true
			});
		}
	};

	return (
		<Flex alignItems={'center'} justifyContent={'center'}>
			{!finishDateStatus ? (
				<>
					{tenderStatus === 0 ? (
						<Button
							onClick={handlePublish}
							mr={'2'}
							variant={'outline'}
							colorScheme={'black'}
						>
							{isPublishLoading ? <LoadingSpinner /> : 'Publish Tender'}
						</Button>
					) : (
						<Text mr={'2'}>You have already published the Tender</Text>
					)}
					{tenderStatus === 1 ? (
						<InviteButton tenderId={tender.tenderId} tenderDesc={tenderDescForEmail} />
					) : (
						<Text>You need to publish the tender before you can invite people</Text>
					)}
				</>
			) : (
				<Flex alignItems={'center'} justifyContent={'center'}>
					<Text>The finish date has passed, you can not publish the tender.</Text>
				</Flex>
			)}
		</Flex>
	);
}

function TenderDocuments({
	tenderId,
	tenderDocuments
}: {
	tenderId: string | undefined;
	tenderDocuments: TenderDocument[] | undefined;
}) {
	if (!tenderId) {
		return null;
	}

	return (
		<Box>
			<Box p={4}>
				<DropZone
					propertyId={0}
					offerId={0}
					projectId={0}
					uploadType={FileUploadType.Tender}
					tenderId={Number(tenderId)}
				/>
			</Box>
			<Heading size={'md'}>Files you added to this Tender</Heading>
			{!tenderDocuments || tenderDocuments.length === 0 ? (
				<EmptyState
					title={'No files uploaded'}
					text={
						'You have not added any files to this tender. You can add files by dropping them in the box above.'
					}
				/>
			) : (
				<VStack style={{ width: '100%' }} align={'stretch'} spacing={4} mt={4}>
					{tenderDocuments.map((p, pIndex) => (
						<OtherGigoverFile key={pIndex} showDelete={true} file={p} />
					))}
				</VStack>
			)}
		</Box>
	);
}
