import { Box, Button, Flex, Heading, Spacer, VStack, Text, useToast } from '@chakra-ui/react';
import { ProcurementHeader } from './ProcurementHeader';
import { NewTenderItemTable } from './NewTenderItemTable';
import { TenderDocument } from '../../../models/TenderDocument';
import { EmptyState } from '../../../components/empty/EmptyState';
import { OtherGigoverFile } from '../../Files/new/components/OtherFile';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { InviteButton } from './InviteButton';
import { useParams, Link } from 'react-router-dom';
import { usePublishTender } from '../../../mutations/procurement/usePublishTender';
import { handleFinishDate } from '../../../utils/HandleFinishDate';
import { useState } from 'react';
import { UploadTenderDocuments } from '../Offers/components/UploadTenderDocuments';

export function UnpublishedTender({ tender }): JSX.Element {
	const [upload, setUpload] = useState(false); // for the uploadModal
	const { mutateAsync: publishTender, isLoading: isPublishLoading } = usePublishTender(); // Publishing a tender
	const tenderDocuments: TenderDocument[] | undefined = tender?.documents || [];
	const { tenderId } = useParams();

	const toast = useToast();

	const tenderDescForEmail = tender?.description;
	const tenderStatus = tender?.status;
	const finishDateStatus = handleFinishDate(tender?.finishDate);

	const handlePublish = async () => {
		const publishTenderBody = {
			tenderId: Number(tenderId)
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
		<>
			{upload && (
				<UploadTenderDocuments
					onClose={() => setUpload(false)}
					onComplete={(status) => {
						console.log('status', status);
					}}
					tenderId={Number(tenderId)}
				/>
			)}

			<Box p={4}>
				<ProcurementHeader tender={tender} />
				<NewTenderItemTable tender={tender} />
				<Box>
					<Flex alignItems={'center'} justifyContent={'center'}>
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
											{isPublishLoading ? (
												<LoadingSpinner />
											) : (
												'Publish Tender'
											)}
										</Button>
									) : (
										<Text mr={'2'}>You have already published the Tender</Text>
									)}
									{tenderStatus === 1 ? (
										<InviteButton
											tenderId={tenderId}
											tenderDesc={tenderDescForEmail}
										/>
									) : (
										<Text>
											You need to publish the tender before you can invite
											people
										</Text>
									)}
								</>
							) : (
								<Flex alignItems={'center'} justifyContent={'center'}>
									<Text>
										The finish date has passed, you can not publish the tender.
									</Text>
								</Flex>
							)}
						</Flex>
						<Spacer />
						{/* This button is for the tenderOwner to go to the offerPage */}
						<Flex>
							<Box>
								<Button
									onClick={() => setUpload(true)}
									ml={'1'}
									variant={'outline'}
									colorScheme={'black'}
								>
									Upload files
								</Button>
							</Box>
						</Flex>
					</Flex>
				</Box>
				<Box>
					{tenderDocuments!.length > 0 ? (
						<VStack style={{ width: '100%' }} align={'stretch'} spacing={4} mt={4}>
							<Heading size={'md'}>Files you added to this Tender</Heading>
							{tenderDocuments?.map((p, pIndex) => (
								<OtherGigoverFile key={pIndex} showDelete={true} file={p} />
							))}
						</VStack>
					) : (
						<EmptyState
							title={'No files uploaded'}
							text={
								'You have not added any files to this tender. You can add files by clicking the Upload files button'
							}
						/>
					)}
				</Box>
			</Box>
		</>
	);
}
