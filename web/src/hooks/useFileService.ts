import { useContext } from 'react';
import { FileSystemService } from '../services/FileSystemService';
import { FileSystemContext } from '../context/FileSystemContext';

interface IFileService {
	fileService: FileSystemService;
}

export const useFileService = (): IFileService => {
	const fileService = useContext(FileSystemContext);

	return {
		fileService
	};
};
