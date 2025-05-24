import {
	DataSnapshot,
	DatabaseReference,
	Query,
	child as databaseChild,
	get as databaseGet,
	limitToFirst as databaseLimitToFirst,
	onValue as databaseOnValue,
	orderByChild as databaseOrderByChild,
	query as databaseQuery,
	ref as databaseRef,
	set as databaseSet,
	getDatabase
} from 'firebase/database';
import {
	StorageReference,
	TaskState,
	UploadTaskSnapshot,
	getDownloadURL,
	getStorage,
	ref as storageRef,
	uploadBytesResumable
} from 'firebase/storage';
import { v4 as uuid } from 'uuid';
import { app } from '../firebase/firebase'; // Import the initialized Firebase app
import { FileUploadType } from '../models/FileUploadType';
import { Project } from '../models/Project';
import { FileType } from '../models/ProjectFile';
import { DocumentTypes } from '../models/ProjectImage';
import { DocumentInput } from '../mutations/useAddDocument';
import { devError } from '../utils/ConsoleUtils';

export interface FileDocument {
	created: number;
	downloadUrl: string;
	fileName: string;
	filePath: string;
	fileType: FileType;
	size: number;
	type: FileUploadType;
	fileId: string;
	projectId: number;
	externalId?: number;
	propertyId: number;
	offerId: number;
	tenderId: number;
}

export interface FolderResult {
	folders: string[];
	files: FileDocument[];
}

const db = getDatabase(app);
const storage = getStorage(app, 'gs://gigover-fileystem');

export class FileSystemService {
	private dbRootRef: DatabaseReference;
	private storageRootRef: StorageReference;

	constructor() {
		this.dbRootRef = databaseRef(db);
		this.storageRootRef = storageRef(storage);
	}

	assertProjectAccess(projects: Project[], projectId: number) {
		const foundProject = projects.find((p) => p.projectId === projectId);
		if (!foundProject) {
			throw new Error('Unauthorized access to project');
		}
	}

	getProjectStorageChild(projectId: number): StorageReference {
		return storageRef(this.storageRootRef, `${projectId}`);
	}

	getDbProjectChild(projectId: number): DatabaseReference {
		return databaseChild(this.dbRootRef, `${projectId}`);
	}

	getProjectFilesQuery(projectId: number, limit?: number): Query {
		const projectDbRef = this.getDbProjectChild(projectId);
		if (limit) {
			return databaseQuery(
				projectDbRef,
				databaseOrderByChild('created'),
				databaseLimitToFirst(limit)
			);
		}
		return databaseQuery(projectDbRef, databaseOrderByChild('created'));
	}

	getProjectFilesDb(
		projectId: number,
		callback: (snapshot: DataSnapshot) => void,
		limit?: number
	): () => void {
		// Returns an unsubscribe function
		const query = this.getProjectFilesQuery(projectId, limit);
		return databaseOnValue(query, callback);
	}

	async getProjectFile(projectId: number, fileId: string): Promise<FileDocument | null> {
		try {
			const snapshot = await databaseGet(
				databaseChild(this.getDbProjectChild(projectId), fileId)
			);
			if (snapshot.exists()) {
				return snapshot.val() as FileDocument;
			}
			return null;
		} catch (e) {
			devError(e);
			throw new Error('Could not find file');
		}
	}

	async updateDoc(
		file: File,
		propertyId: number,
		offerId: number,
		tenderId: number,
		projectId: number,
		fileId: string,
		fileName: string,
		filePath: string,
		downloadUrl: string,
		uploadType: FileUploadType,
		bytes: number,
		externalId: number | null
	): Promise<void> {
		const fileType: FileType = this.getFileTypeForFile(file);
		const docRef = databaseChild(this.getDbProjectChild(projectId), fileId);

		return databaseSet(docRef, {
			type: uploadType,
			fileId: fileId,
			projectId: projectId,
			fileName,
			filePath,
			externalId,
			propertyId,
			offerId,
			tenderId,
			downloadUrl,
			fileType: fileType,
			size: bytes,
			created: new Date().getTime()
		});
	}

	async uploadFile(
		file: File,
		propertyId: number,
		offerId: number,
		tenderId: number,
		projectId: number,
		folderId: number,
		uploadType = FileUploadType.Project,
		statusCallback: (progress: number, state: TaskState) => void,
		externalId?: number
	): Promise<DocumentInput> {
		console.log('Gigover File Upload initiated');

		const generatedFileId = uuid();
		const originalFileName = file.name;
		const extension = originalFileName.split('.').pop();
		const storageFilePath =
			`${generatedFileId}` +
			(extension && extension !== originalFileName ? `.${extension}` : '');

		const projectStorageRef = this.getProjectStorageChild(projectId);
		const fileRef = storageRef(projectStorageRef, storageFilePath);
		const uploadTask = uploadBytesResumable(fileRef, file);

		return new Promise<DocumentInput>((resolve, reject) => {
			uploadTask.on(
				'state_changed',
				(snapshot: UploadTaskSnapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					statusCallback(progress, snapshot.state);
				},
				(error) => {
					devError('File upload error', error);
					reject(error.message);
				},
				async () => {
					try {
						const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

						await this.updateDoc(
							file,
							propertyId,
							offerId,
							tenderId,
							projectId,
							generatedFileId,
							originalFileName,
							storageFilePath,
							downloadURL,
							uploadType,
							file.size,
							externalId || null
						);

						const currentFileType = this.getFileTypeForFile(file);
						const docType = this.getDocumentTypeForFileType(currentFileType);

						const documentInput: DocumentInput = {
							projectId,
							folderId,
							name: originalFileName,
							type: docType,
							url: downloadURL,
							bytes: file.size,
							taskId: externalId ?? undefined,
							propertyId: propertyId,
							offerId: offerId,
							tenderId: tenderId
						};
						console.log('File uploaded, DocumentInput:', documentInput);
						resolve(documentInput);
					} catch (error) {
						devError('Error in upload completion (updateDoc or getDownloadURL)', error);
						reject(error);
					}
				}
			);
		});
	}

	private getDocumentTypeForFileType(fileType: FileType): DocumentTypes {
		if (['document', 'pdf', 'other'].includes(fileType)) {
			return 2;
		}
		if (fileType === 'video') {
			return 1;
		}
		return 0;
	}

	private getFileTypeForFile(file: File): FileType {
		if (file.type.startsWith('text/')) {
			return 'txt';
		}
		if (file.type.startsWith('video/')) {
			return 'video';
		}
		if (file.type.startsWith('image/')) {
			return 'picture';
		}
		switch (file.type) {
			case 'application/msword':
				return 'document';
			case 'application/pdf':
				return 'pdf';
			default:
				return 'other';
		}
	}
}
