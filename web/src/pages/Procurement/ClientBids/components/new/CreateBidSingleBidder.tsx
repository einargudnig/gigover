import { Box, Checkbox, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DatePicker } from '../../../../../components/forms/DatePicker';
import { Bid } from '../../../../../models/Tender';

export function CreateBidSingleBidder() {
	const { register, control, handleSubmit } = useForm<Bid>({
		defaultValues: {
			bidId: 0,
			description: '',
			terms: '',
			address: '',
			delivery: 0,
			finishDate: 0,
			status: 0,
			clientUId: '',
			clientEmail: '',
			bidderUId: '',
			bidderName: '',
			bidderEmail: '',
			notes: '',
			items: []
		},
		mode: 'onBlur'
	});

	// For the checkbox
	const [isChecked, setIsChecked] = useState<number>(0);
	const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.checked ? 1 : 0;
		setIsChecked(newValue);
	};

	return (
		<Box>
			<FormControl id={'description'}>
				<FormLabel>Description</FormLabel>
				<Input
					required={true}
					{...register('description', {
						required: 'Bid description is required'
					})}
				/>
			</FormControl>
			<Box mb={6} />
			<FormControl id={'terms'}>
				<FormLabel>Terms</FormLabel>
				<Input
					required={true}
					{...register('terms', {
						required: 'Terms are required'
					})}
				/>
			</FormControl>
			<FormControl id={'address'}>
				<FormLabel>Address</FormLabel>
				<Input
					required={true}
					{...register('address', {
						required: 'Address is required'
					})}
				/>
			</FormControl>
			<Box mb={6} />
			<FormControl id={'delivery'}>
				<FormLabel>Delivery</FormLabel>
				<Checkbox
					name="delivery"
					isChecked={isChecked === 1}
					onChange={handleChangeCheckbox}
				/>
			</FormControl>
			<Box mb={6} />
			<FormControl id={'finishDate'}>
				<FormLabel>Bid valid through</FormLabel>
				<Controller
					name="finishDate"
					control={control}
					render={({ field: { onChange, onBlur, value } }) => (
						<DatePicker
							onChange={(date) => {
								if (date) {
									onChange((date as Date).getTime());
								} else {
									onChange(null);
								}
							}}
							selected={value ? new Date(value) : null}
							onBlur={onBlur}
							required={true}
						/>
					)}
				/>
			</FormControl>
			<FormControl>
				<FormLabel>Other - want to add something more?</FormLabel>
				<Input {...register('notes', {})} />
			</FormControl>
		</Box>
	);
}
