import { Box, Button, Flex, HStack, Heading, Text, VStack, useToast } from '@chakra-ui/react';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { EmptyState } from '../../../components/empty/EmptyState';
import { usePublishTender } from '../../../mutations/procurement/usePublishTender';
import { TenderDocument } from '../../../services/ProcurementService';
import { handleFinishDate } from '../../../utils/functions';
import { InviteButton } from './InviteButton';
import { NewTenderItemTable } from './NewTenderItemTable';

export function UnpublishedTender({ tender, getTenderLoading }): JSX.Element {
	console.log('tender', tender);
	const tenderDocuments: TenderDocument[] | undefined = tender?.documents || [];

	return (
		<Box>
			{getTenderLoading ? (
				<LoadingSpinner />
			) : (
				<VStack spacing={4} align="stretch">
					<Heading size="md">Tender Details</Heading>
					<Text>Description: {tender?.description}</Text>
					<Text>Status: {tender?.status === 1 ? 'Published' : 'Draft'}</Text>
					<Text>Address: {tender?.address}</Text>
					<Text>Finish Date: {tender?.finishDate}</Text>
					<Text>Delivery: {tender?.delivery ? 'Yes' : 'No'}</Text>
					<Text>Contact Person: {tender?.contactPerson}</Text>
					<Text>Email: {tender?.email}</Text>
					<Text>Phone: {tender?.phone}</Text>

					<NewTenderItemTable tender={tender} />
					<TenderDocumentsTable tenderId={tender?.tenderId} documents={tenderDocuments} />
					<HandleTender tender={tender} />
					<InviteButton tender={tender} />
				</VStack>
			)}
		</Box>
	);
}

function HandleTender({ tender }) {
	const { mutateAsync: publishTender, isPending: isPublishPending } = usePublishTender();
	const tenderDescForEmail = tender?.description;
	const tenderStatus = tender?.status;
	const finishDateStatus = handleFinishDate(tender?.finishDate);
	const toast = useToast();

	const handlePublish = async () => {
		const publishTenderBody = {
			tenderId: Number(tender.tenderId),
			emailBody: tenderDescForEmail
		};
		try {
			await publishTender(publishTenderBody);
			toast({
				title: 'Tender Published',
				description: 'Tender has been published successfully!',
				status: 'success',
				duration: 9000,
				isClosable: true
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Something went wrong when publishing the tender.',
				status: 'error',
				duration: 9000,
				isClosable: true
			});
		}
	};

	return (
		<Flex justify={'end'} pr={2} pt={2}>
			<HStack spacing={2}>
				{tenderStatus === 0 ? (
					<Button
						onClick={handlePublish}
						mr={'2'}
						variant={'outline'}
						colorScheme={'black'}
						isLoading={isPublishPending}
						isDisabled={finishDateStatus || tender?.items?.length === 0}
					>
						{isPublishPending ? <LoadingSpinner /> : 'Publish Tender'}
					</Button>
				) : (
					<Text>Tender is already published</Text>
				)}
				{tender?.items?.length === 0 && tenderStatus === 0 && (
					<Text color="orange.500" fontSize="sm">
						Cannot publish: Add items to the tender first.
					</Text>
				)}
			</HStack>
		</Flex>
	);
}

function TenderDocumentsTable({ tenderId, documents }) {
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
			{!documents || documents.length === 0 ? (
				<EmptyState
					title={'No files uploaded'}
					text={
						'You have not added any files to this tender. You can add files by dropping them in the box above.'
					}
				/>
			) : (
				<VStack style={{ width: '100%' }} align={'stretch'} spacing={4} mt={4}>
					{documents.map((p, pIndex) => (
						<OtherGigoverFile key={pIndex} showDelete={true} file={p} />
					))}
				</VStack>
			)}
		</Box>
	);
}
