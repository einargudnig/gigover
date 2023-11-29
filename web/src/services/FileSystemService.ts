import firebase from 'firebase';
import { v4 as uuid } from 'uuid';
import { FileUploadType } from '../models/FileUploadType';
import { devError } from '../utils/ConsoleUtils';
import { Project } from '../models/Project';
import { FileType } from '../models/ProjectFile';
import { DocumentInput } from '../mutations/useAddDocument';

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
	offerId: number;
	tenderId: number;
}

export interface FolderResult {
	folders: string[];
	files: FileDocument[];
}

export class FileSystemService {
	private dbRef: firebase.database.Reference;
	private fileSystem: firebase.storage.Storage;
	private ref: firebase.storage.Reference;

	constructor() {
		this.fileSystem = firebase.app().storage('gs://gigover-fileystem');
		this.ref = this.fileSystem.ref();
		this.dbRef = firebase.database().ref();
	}

	assertProjectAccess(projects: Project[], projectId: number) {
		// How does this tie in to the uploading of files for tender and offers?
		const foundProject = projects.find((p) => p.projectId === projectId);

		if (!foundProject) {
			throw new Error('Unauthorized access to project');
		}
	}

	getProjectChild(projectId: number) {
		return this.ref.child(`${projectId}`);
	}

	getDbProjectChild(projectId: number) {
		return this.dbRef.child(`${projectId}`);
	}

	getProjectFilesQuery(projectId: number, limit?: number) {
		const query = this.getDbProjectChild(projectId).orderByChild('created');

		if (limit) {
			query.limitToFirst(limit);
		}

		return query;
	}

	getProjectFilesDb(
		projectId: number,
		callback: (snapshot: firebase.database.DataSnapshot) => void,
		limit?: number
	) {
		return this.getProjectFilesQuery(projectId, limit).on('value', callback);
	}

	async getProjectFile(projectId: number, fileId: string) {
		try {
			const res = await this.getDbProjectChild(projectId).child(fileId).once('value');
			return res.val() as FileDocument;
		} catch (e) {
			devError(e);
			throw new Error('Could not find file');
		}
	}

	async updateDoc(
		file: File,
		projectId: number,
		fileId: string,
		fileName: string,
		filePath: string,
		downloadUrl: string,
		uploadType: FileUploadType,
		bytes: number,
		externalId: number | null,
		offerId: number,
		tenderId: number
	) {
		const fileType: FileType = this.getFileTypeForFile(file);

		return this.getDbProjectChild(projectId).child(fileId).set({
			type: uploadType,
			fileId: fileId,
			projectId: projectId,
			fileName,
			filePath,
			externalId,
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
		offerId: number, // why null?
		tenderId: number,
		projectId: number,
		folderId: number,
		uploadType = FileUploadType.Project,
		status: (progress: number, state: firebase.storage.TaskState) => void,
		externalId?: number
	): Promise<DocumentInput> {
		// devInfo('Gigover File Upload initiated');
		console.log('Gigover File Upload initiated');
		console.log('tenderId', tenderId);
		console.log('projectId', projectId);

		const fileName = uuid();
		const originalFileName = file.name;
		const extension = originalFileName.split('.').pop();
		const filePath =
			fileName + (extension && extension !== originalFileName ? '.' + extension : '');

		return new Promise<DocumentInput>((resolve, reject) => {
			const uploadTask = this.getProjectChild(projectId).child(filePath).put(file);

			uploadTask.on(
				'state_changed',
				(snapshot) => {
					// Observe state change events such as progress, pause, and resume
					// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					status(progress, snapshot.state);
				},
				(error) => {
					devError('File upload error', error);
					reject(error.message);
				},
				async () => {
					const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();

					await this.updateDoc(
						file,
						projectId,
						fileName,
						originalFileName,
						filePath,
						downloadURL,
						uploadType,
						file.size,
						externalId || null,
						offerId,
						tenderId
					);

					const currentFileType = this.getFileTypeForFile(file);
					console.log('CurrentfileType', currentFileType);
					const fileType = this.getDocumentTypeForFileType(currentFileType);
					console.log('fileType', fileType);

					const image: DocumentInput = {
						projectId,
						folderId,
						name: originalFileName,
						type: fileType,
						url: downloadURL,
						bytes: file.size,
						taskId: externalId ?? undefined,
						offerId: offerId,
						tenderId: tenderId
					};
					console.log('image', image);

					// devInfo('File uploaded');
					console.log('File uploaded');
					resolve(image);
				}
			);
		});
	}

	private getDocumentTypeForFileType(fileType: FileType) {
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
