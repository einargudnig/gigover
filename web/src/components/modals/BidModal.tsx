import React from 'react';
import { Bid } from '../../models/Tender';
import { Heading, VStack } from '@chakra-ui/react';
import { FormActions } from '../FormActions';
import { useCloseModal } from '../../hooks/useCloseModal';
// import { useQueryClient } from 'react-query';
// import { DatePicker } from '../forms/DatePicker';
import { useForm } from 'react-hook-form';
// import { useModifyTender, ProjectFormData } from '../../mutations/useModifyTender';
// import { ApiService } from '../../services/ApiService';
// import { devError } from '../../utils/ConsoleUtils';
// import { LoadingSpinner } from '../LoadingSpinner';

interface BidModalProps {
	bid?: Bid;
}

export const BidModal = ({ bid }: BidModalProps): JSX.Element => {
	console.log(bid);
	const closeModal = useCloseModal();
	// const queryClient = useQueryClient();

	// const { mutate: modify, isLoading, isError, error } = useModifyTender();
	const { register, handleSubmit } = useForm<Bid>({
		defaultValues: bid,
		mode: 'onBlur'
	});

	// For the checkbox
	// const [isChecked, setIsChecked] = useState(bid!.delivery);
	// const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
	// 	const newValue = event.target.checked ? 1 : 0;
	// 	setIsChecked(newValue);
	// };

	const onSubmit = () => {
		// console.log(data);
	};

	return (
		<div>
			<form onSubmit={onSubmit}>
				<VStack mb={-6} align={'stretch'}>
					<Heading size={'md'}>Create Bid</Heading>
					<FormActions
						cancelText={'Cancel'}
						onCancel={closeModal}
						submitText={'Create'}
						onSubmit={onSubmit}
					/>
				</VStack>
			</form>
		</div>
	);
};
