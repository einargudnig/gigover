import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	HStack,
	Input,
	Table,
	Tbody,
	Td,
	Text,
	Th,
	Thead,
	Tooltip,
	Tr,
	useToast
} from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { CrossIcon } from '../../../components/icons/CrossIcon';
import { Edit } from '../../../components/icons/Edit';
import { ImportantIcon } from '../../../components/icons/ImportantIcon';
import { TrashIcon } from '../../../components/icons/TrashIcon';

// Type for possible input field values - removed boolean since inputs don't handle it
type FieldValue = string | number;

// Type for the record structure
type DataRecord = {
	[key: string]: FieldValue | undefined;
};

export interface Column<T extends DataRecord> {
	key: keyof T;
	header: string;
	tooltip?: string;
	width?: string;
	required?: boolean;
	validate?: (value: T[keyof T]) => string | undefined;
	format?: (value: T[keyof T]) => string;
	type?: 'text' | 'number';
}

interface EditableDataTableProps<T extends DataRecord> {
	items: T[];
	columns: Column<T>[];
	defaultNewItem: T;
	onAdd: (item: T) => Promise<void>;
	onUpdate: (item: T) => Promise<void>;
	onDelete: (item: T) => Promise<void>;
	isDisabled?: boolean;
	idField?: keyof T;
}

export function EditableDataTable<T extends DataRecord>({
	items,
	columns,
	defaultNewItem,
	onAdd,
	onUpdate,
	onDelete,
	isDisabled = false,
	idField = 'id'
}: EditableDataTableProps<T>): JSX.Element {
	const [editingItem, setEditingItem] = useState<T | null>(null);
	const [newItem, setNewItem] = useState<T>(defaultNewItem);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [itemToDelete, setItemToDelete] = useState<T | null>(null);
	const [isLoading, setIsLoading] = useState({
		add: false,
		update: false,
		delete: false
	});
	const [validationErrors, setValidationErrors] = useState<Record<keyof T, string>>(
		{} as Record<keyof T, string>
	);

	const toast = useToast();

	const handleChange = useCallback(
		(item: T, field: keyof T, value: T[keyof T]) => {
			const updatedItem = { ...item, [field]: value };

			// Clear previous validation error for this field
			setValidationErrors((prev) => ({ ...prev, [field]: '' }));

			// Run field validation if exists
			const column = columns.find((col) => col.key === field);
			if (column?.validate) {
				const error = column.validate(value);
				if (error) {
					setValidationErrors((prev) => ({ ...prev, [field]: error }));
				}
			}

			return updatedItem;
		},
		[columns]
	);

	const handleNewItemChange = useCallback(
		(field: keyof T, value: T[keyof T]) => {
			setNewItem((prev) => handleChange(prev, field, value));
		},
		[handleChange]
	);

	const handleEditingItemChange = useCallback(
		(field: keyof T, value: T[keyof T]) => {
			setEditingItem((prev) => (prev ? handleChange(prev, field, value) : null));
		},
		[handleChange]
	);

	const validateItem = useCallback(
		(item: T): boolean => {
			const errors: Record<keyof T, string> = {} as Record<keyof T, string>;
			let hasErrors = false;

			columns.forEach((column) => {
				if (column.required && !item[column.key]) {
					errors[column.key] = 'This field is required';
					hasErrors = true;
				}
				if (column.validate) {
					const error = column.validate(item[column.key]);
					if (error) {
						errors[column.key] = error;
						hasErrors = true;
					}
				}
			});

			setValidationErrors(errors);
			return !hasErrors;
		},
		[columns]
	);

	const handleAdd = async () => {
		if (!validateItem(newItem)) {
			return;
		}

		setIsLoading((prev) => ({ ...prev, add: true }));
		try {
			await onAdd(newItem);
			setNewItem(defaultNewItem);
			toast({
				title: 'Item added successfully',
				status: 'success',
				duration: 3000
			});
		} catch (error) {
			toast({
				title: 'Failed to add item',
				description: error instanceof Error ? error.message : 'Unknown error occurred',
				status: 'error',
				duration: 5000
			});
		} finally {
			setIsLoading((prev) => ({ ...prev, add: false }));
		}
	};

	const handleUpdate = async (item: T) => {
		if (!validateItem(item)) {
			return;
		}

		setIsLoading((prev) => ({ ...prev, update: true }));
		try {
			await onUpdate(item);
			setEditingItem(null);
			toast({
				title: 'Item updated successfully',
				status: 'success',
				duration: 3000
			});
		} catch (error) {
			toast({
				title: 'Failed to update item',
				description: error instanceof Error ? error.message : 'Unknown error occurred',
				status: 'error',
				duration: 5000
			});
		} finally {
			setIsLoading((prev) => ({ ...prev, update: false }));
		}
	};

	const handleDelete = async (item: T) => {
		setIsLoading((prev) => ({ ...prev, delete: true }));
		try {
			await onDelete(item);
			setDialogOpen(false);
			setItemToDelete(null);
			toast({
				title: 'Item deleted successfully',
				status: 'success',
				duration: 3000
			});
		} catch (error) {
			toast({
				title: 'Failed to delete item',
				description: error instanceof Error ? error.message : 'Unknown error occurred',
				status: 'error',
				duration: 5000
			});
		} finally {
			setIsLoading((prev) => ({ ...prev, delete: false }));
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof T) => {
		const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
		const typedValue = value as T[keyof T];

		if (editingItem) {
			handleEditingItemChange(field, typedValue);
		} else {
			handleNewItemChange(field, typedValue);
		}
	};

	return (
		<Box>
			<Table variant="striped">
				<Thead>
					<Tr>
						{columns.map((column) => (
							<Th key={String(column.key)} width={column.width}>
								{column.tooltip ? (
									<Tooltip hasArrow label={column.tooltip}>
										<HStack>
											<Text>{column.header}</Text>
											{column.required && <ImportantIcon size={20} />}
										</HStack>
									</Tooltip>
								) : (
									<HStack>
										<Text>{column.header}</Text>
										{column.required && <ImportantIcon size={20} />}
									</HStack>
								)}
							</Th>
						))}
						<Th width="20%">Actions</Th>
					</Tr>
				</Thead>
				<Tbody>
					{items.length === 0 ? (
						<Tr>
							<Td colSpan={columns.length + 1}>
								<Text fontSize="xl" textAlign="center">
									The table is empty
								</Text>
							</Td>
						</Tr>
					) : (
						items.map((item) => (
							<Tr key={String(item[idField])}>
								{columns.map((column) => (
									<Td key={String(column.key)} width={column.width}>
										{editingItem && item[idField] === editingItem[idField] ? (
											<FormControl isInvalid={!!validationErrors[column.key]}>
												<Input
													name={String(column.key)}
													value={String(editingItem[column.key] ?? '')}
													onChange={(e) =>
														handleInputChange(e, column.key)
													}
													type={column.type || 'text'}
												/>
												{validationErrors[column.key] && (
													<FormHelperText color="red.500">
														{validationErrors[column.key]}
													</FormHelperText>
												)}
											</FormControl>
										) : column.format ? (
											column.format(item[column.key])
										) : (
											String(item[column.key])
										)}
									</Td>
								))}
								<Td width="20%">
									{editingItem && item[idField] === editingItem[idField] ? (
										<HStack>
											<Button
												variant="outline"
												colorScheme="black"
												onClick={() => handleUpdate(editingItem)}
												isLoading={isLoading.update}
											>
												Update
											</Button>
											<Button
												variant="outline"
												colorScheme="black"
												onClick={() => setEditingItem(null)}
											>
												<CrossIcon size={24} />
											</Button>
										</HStack>
									) : (
										<HStack>
											<Button
												variant="outline"
												colorScheme="black"
												onClick={() => setEditingItem(item)}
												isDisabled={isDisabled}
											>
												<Edit size={20} />
											</Button>
											<ConfirmDialog
												header="Delete item"
												setIsOpen={setDialogOpen}
												callback={async (confirmed) => {
													if (confirmed && itemToDelete) {
														await handleDelete(itemToDelete);
													}
												}}
												isOpen={dialogOpen}
											>
												<Button
													variant="outline"
													colorScheme="red"
													onClick={() => {
														setItemToDelete(item);
														setDialogOpen(true);
													}}
													isLoading={
														isLoading.delete &&
														itemToDelete?.[idField] === item[idField]
													}
													isDisabled={isDisabled}
												>
													<TrashIcon color="red" size={20} />
												</Button>
											</ConfirmDialog>
										</HStack>
									)}
								</Td>
							</Tr>
						))
					)}
					<Tr>
						{columns.map((column) => (
							<Td key={String(column.key)} width={column.width}>
								<FormControl isInvalid={!!validationErrors[column.key]}>
									<Input
										name={String(column.key)}
										value={String(newItem[column.key] ?? '')}
										onChange={(e) => handleInputChange(e, column.key)}
										type={column.type || 'text'}
										isDisabled={isDisabled}
									/>
									{validationErrors[column.key] && (
										<FormHelperText color="red.500">
											{validationErrors[column.key]}
										</FormHelperText>
									)}
								</FormControl>
							</Td>
						))}
						<Td width="20%">
							<Button
								variant="outline"
								colorScheme="black"
								onClick={handleAdd}
								isLoading={isLoading.add}
								isDisabled={isDisabled}
							>
								Add Item
							</Button>
						</Td>
					</Tr>
				</Tbody>
			</Table>
		</Box>
	);
}
